import assert from "node:assert/strict";

const port = Number(process.env.CDP_PORT || 9333);
const base = process.argv[2] || "http://127.0.0.1:3017";
const safariUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15";

const target = await (
  await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(base)}`, {
    method: "PUT",
  })
).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
const runtimeErrors = [];
const badResponses = [];

socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  } else if (message.method === "Runtime.exceptionThrown") {
    runtimeErrors.push(message.params);
  } else if (
    message.method === "Network.responseReceived" &&
    message.params.response.status >= 400
  ) {
    badResponses.push({
      status: message.params.response.status,
      url: message.params.response.url,
    });
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
  if (response.result?.exceptionDetails) {
    throw new Error(response.result.exceptionDetails.text);
  }
  return response.result?.result?.value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const read = async (expression) =>
  JSON.parse(await evaluate(`JSON.stringify(${expression})`));

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [
      { name: "prefers-reduced-motion", value: "no-preference" },
    ],
  });
  await send("Emulation.setTouchEmulationEnabled", {
    enabled: false,
    maxTouchPoints: 0,
  });
  await send("Emulation.setUserAgentOverride", {
    userAgent: safariUserAgent,
    platform: "MacIntel",
  });
  await send("Page.navigate", { url: base });
  await wait(7_000);
  await evaluate("document.documentElement.style.scrollBehavior = 'auto'; true");

  const initial = await read(`(() => {
    const hero = document.querySelector('.desktop-home');
    const photo = document.querySelector('[data-desktop-photo]');
    const loader = document.querySelector('[data-logo-loader]');
    const persistent = document.querySelector('.persistent-hero-menu');
    return {
      location: window.location.href,
      title: document.title,
      bodyText: document.body?.innerText.slice(0, 240),
      userAgent: navigator.userAgent,
      maxTouchPoints: navigator.maxTouchPoints,
      bootstrapPresent: Boolean(document.getElementById('macos-safari-mode')),
      safariMode: document.documentElement.dataset.macosSafari,
      hero: hero?.getBoundingClientRect().toJSON(),
      photo: photo?.getBoundingClientRect().toJSON(),
      photoClip: photo ? getComputedStyle(photo).clipPath : null,
      heroPinned: hero?.parentElement?.classList.contains('pin-spacer') ?? false,
      loaderVisible: Boolean(loader) && getComputedStyle(loader).display !== 'none' && getComputedStyle(loader).visibility !== 'hidden',
      persistentVisible: Boolean(persistent) && !persistent.hidden && getComputedStyle(persistent).display !== 'none',
    };
  })()`);

  assert.equal(initial.safariMode, "true", "macOS Safari was not identified before rendering");
  assert.equal(initial.loaderVisible, false, "the animated loader remains visible in macOS Safari");
  assert.equal(initial.heroPinned, false, "the Safari hero still created a GSAP pin spacer");
  assert.equal(initial.persistentVisible, false, "the top menu is visible in the first section");

  await evaluate("scrollTo(0, Math.round(innerHeight * 0.55)); true");
  await wait(500);
  const middle = await read(`(() => {
    const hero = document.querySelector('.desktop-home');
    const photo = document.querySelector('[data-desktop-photo]');
    const persistent = document.querySelector('.persistent-hero-menu');
    return {
      heroTop: hero?.getBoundingClientRect().top,
      photo: photo?.getBoundingClientRect().toJSON(),
      photoClip: photo ? getComputedStyle(photo).clipPath : null,
      persistentVisible: Boolean(persistent) && !persistent.hidden && getComputedStyle(persistent).display !== 'none',
    };
  })()`);

  assert.ok(middle.heroTop < -300, "the Safari hero is still pinned instead of scrolling normally");
  assert.ok(
    Math.abs(middle.photo.width - initial.photo.width) <= 1,
    "the Safari hero photo still changes width while scrolling",
  );
  assert.equal(middle.photoClip, initial.photoClip, "the Safari hero crop still animates");
  assert.equal(middle.persistentVisible, false, "the top menu appears before the second section");

  await evaluate("document.querySelector('#desktop-marthas-eyes').scrollIntoView({block:'start'}); true");
  await wait(900);
  const secondSection = await read(`(() => {
    const persistent = document.querySelector('.persistent-hero-menu');
    return {
      persistentVisible: Boolean(persistent) && !persistent.hidden && getComputedStyle(persistent).display !== 'none',
      persistentPosition: persistent ? getComputedStyle(persistent).position : null,
    };
  })()`);
  assert.equal(secondSection.persistentVisible, true, "the top menu did not appear from the second section onward");
  assert.equal(secondSection.persistentPosition, "fixed");

  await evaluate("document.querySelector('#collection').scrollIntoView({block:'start'}); true");
  await wait(1_200);
  const chapterState = await read(`(() => {
    const roadline = [...document.querySelectorAll('#collection svg')].find((svg) =>
      [...svg.classList].some((name) => name.includes('roadline'))
    );
    return {
      images: [...document.querySelectorAll('[data-chapter-image]')].map(img => ({
        src: img.currentSrc || img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
      })),
      roadlineDisplay: roadline ? getComputedStyle(roadline).display : null,
    };
  })()`);
  const chapterImages = chapterState.images;
  assert.equal(chapterState.roadlineDisplay, "none", "the horizontal roadline remains visible in macOS Safari");
  assert.equal(chapterImages.length, 9, "the horizontal chapter must expose all nine photos");
  assert.ok(
    chapterImages.every((image) => image.complete && image.naturalWidth > 0),
    `Safari chapter photo failed to load: ${JSON.stringify(chapterImages)}`,
  );

  assert.equal(runtimeErrors.length, 0, "runtime exceptions were raised");
  assert.deepEqual(badResponses, [], "browser received HTTP error responses");

  console.log(JSON.stringify({ status: "PASS", initial, middle, secondSection, chapterState }, null, 2));
} finally {
  socket.close();
}
