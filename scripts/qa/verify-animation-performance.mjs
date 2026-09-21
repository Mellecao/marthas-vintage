import assert from "node:assert/strict";

const port = Number(process.env.CDP_PORT || 9333);
const base = process.argv[2] || "http://127.0.0.1:3017";
const target = await (
  await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(base)}`, {
    method: "PUT",
  })
).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
const layerRequests = [];
const runtimeErrors = [];

socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  } else if (message.method === "Network.requestWillBeSent") {
    const url = message.params.request.url;
    if (url.includes("/logo/logo-partes/raster/") || url.includes("logo-partes%2Fraster")) {
      layerRequests.push(url);
    }
  } else if (message.method === "Runtime.exceptionThrown") {
    runtimeErrors.push(message.params);
  }
};

await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++sequence;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (response.result?.exceptionDetails) throw new Error(response.result.exceptionDetails.text);
  return response.result?.result?.value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const read = async (expression) => JSON.parse(await evaluate(`JSON.stringify(${expression})`));

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await send("Page.navigate", { url: base });
  await wait(3_000);

  const loader = await read(`(() => {
    const root = document.querySelector('[data-logo-loader]');
    const video = root?.querySelector('video');
    const videoRect = video?.getBoundingClientRect();
    return {
      location: window.location.href,
      title: document.title,
      userAgent: navigator.userAgent,
      safariMode: document.documentElement.dataset.macosSafari,
      viewport: { width: innerWidth, height: innerHeight },
      present: Boolean(root),
      videoPresent: Boolean(video),
      videoRect: videoRect
        ? {
            x: videoRect.x,
            y: videoRect.y,
            width: videoRect.width,
            height: videoRect.height,
          }
        : null,
      videoSrc: video?.currentSrc || video?.getAttribute('src') || '',
      remotionImages: root?.querySelectorAll('img').length ?? 0,
    };
  })()`);

  assert.equal(loader.present, true, "the regular-browser loading screen disappeared unexpectedly");
  assert.equal(loader.videoPresent, true, "the loading animation is not using a pre-rendered video");
  assert.match(loader.videoSrc, /marthas-loader-desktop\.mp4/);
  assert.ok(loader.videoRect, "the desktop loader video has no layout box");
  assert.ok(
    Math.abs(loader.videoRect.x) <= 1 && Math.abs(loader.videoRect.y) <= 1,
    "the desktop loader video is not anchored to the viewport origin",
  );
  assert.ok(
    Math.abs(loader.videoRect.width - loader.viewport.width) <= 1 &&
      Math.abs(loader.videoRect.height - loader.viewport.height) <= 1,
    "the desktop loader video overflows the viewport and shifts the artwork off-center",
  );
  assert.equal(loader.remotionImages, 0, "the runtime loader still renders layered logo bitmaps");
  assert.equal(layerRequests.length, 0, "the loader still downloads the 36 Remotion layer images");

  await wait(5_800);
  await evaluate("document.documentElement.style.scrollBehavior = 'auto'; true");
  const initial = await read(`(() => {
    const photo = document.querySelector('[data-desktop-photo]');
    const butterfly = document.querySelector('[data-desktop-butterfly]');
    return {
      rect: photo?.getBoundingClientRect().toJSON(),
      clipPath: photo ? getComputedStyle(photo).clipPath : null,
      butterflyTransform: butterfly ? getComputedStyle(butterfly).transform : null,
      butterflyWingCount: document.querySelectorAll('[data-desktop-butterfly-wing]').length,
    };
  })()`);

  await evaluate("scrollTo(0, Math.round(innerHeight * 0.7)); true");
  await wait(600);
  const middle = await read(`(() => {
    const photo = document.querySelector('[data-desktop-photo]');
    const butterfly = document.querySelector('[data-desktop-butterfly]');
    return {
      rect: photo?.getBoundingClientRect().toJSON(),
      clipPath: photo ? getComputedStyle(photo).clipPath : null,
      butterflyTransform: butterfly ? getComputedStyle(butterfly).transform : null,
    };
  })()`);

  assert.ok(initial.rect.width >= 1439, "the hero photo does not use a stable full-width layer");
  assert.ok(Math.abs(middle.rect.width - initial.rect.width) <= 1, "the hero animation still changes layout width");
  assert.notEqual(middle.clipPath, initial.clipPath, "the optimized hero crop did not animate");
  assert.equal(initial.butterflyWingCount, 0, "the hero still duplicates and flaps butterfly wings");
  assert.notEqual(
    middle.butterflyTransform,
    initial.butterflyTransform,
    "the simplified butterfly no longer slides with the hero",
  );
  assert.equal(runtimeErrors.length, 0, "runtime exceptions were raised");

  console.log(JSON.stringify({ status: "PASS", loader, initial, middle, layerRequests: layerRequests.length }, null, 2));
} finally {
  socket.close();
}
