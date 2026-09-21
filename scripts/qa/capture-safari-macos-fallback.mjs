import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const [base = "http://127.0.0.1:3018", viewport = "1440x900", output = "audit/safari-macos"] = process.argv.slice(2);
const [width, height] = viewport.split("x").map(Number);
const outputDir = resolve(output);
const port = Number(process.env.CDP_PORT || 9333);
const safariUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15";
const target = await (
  await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(base)}`, { method: "PUT" })
).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();

socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
};
await new Promise((resolveOpen, reject) => {
  socket.onopen = resolveOpen;
  socket.onerror = reject;
});
const send = (method, params = {}) =>
  new Promise((resolveMessage) => {
    const id = ++sequence;
    pending.set(id, resolveMessage);
    socket.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const wait = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));

const states = [
  { name: "hero", action: "scrollTo(0, 0)" },
  { name: "hero-middle", action: "scrollTo(0, Math.round(innerHeight * 0.55))" },
  { name: "second-section", action: "document.querySelector('#desktop-marthas-eyes').scrollIntoView({block:'start'})" },
  {
    name: "horizontal-gallery",
    action: "document.querySelector('#collection').scrollIntoView({block:'start'}); scrollBy(0, Math.round(innerHeight * 0.72))",
  },
];

try {
  await mkdir(outputDir, { recursive: true });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Emulation.setTouchEmulationEnabled", { enabled: false, maxTouchPoints: 0 });
  await send("Emulation.setUserAgentOverride", { userAgent: safariUserAgent, platform: "MacIntel" });
  await send("Page.navigate", { url: base });
  await wait(7_000);
  await evaluate("document.documentElement.style.scrollBehavior = 'auto'; true");

  const report = [];
  for (const state of states) {
    await evaluate(`${state.action}; true`);
    await wait(900);
    const metrics = JSON.parse(
      await evaluate(`JSON.stringify((() => {
        const persistent = document.querySelector('.persistent-hero-menu');
        return {
          state: '${state.name}',
          scrollY,
          safariMode: document.documentElement.dataset.macosSafari,
          hero: document.querySelector('.desktop-home')?.getBoundingClientRect().toJSON(),
          menuVisible: Boolean(persistent) && !persistent.hidden && getComputedStyle(persistent).display !== 'none',
          brokenImages: [...document.images]
            .filter((image) => image.getBoundingClientRect().width > 0 && (!image.complete || image.naturalWidth === 0))
            .map((image) => image.currentSrc || image.src),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      })())`),
    );
    const screenshot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
      fromSurface: true,
    });
    const file = join(outputDir, `${viewport}-${state.name}.png`);
    await writeFile(file, Buffer.from(screenshot.result.data, "base64"));
    report.push({ file, metrics });
  }
  console.log(JSON.stringify({ status: "PASS", viewport: { width, height }, report }, null, 2));
} finally {
  socket.close();
}
