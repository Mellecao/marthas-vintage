import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const [url, viewport, output, state = "hero"] = process.argv.slice(2);
if (!url || !viewport || !output) {
  throw new Error("Usage: node capture-textile-cargo.mjs <url> <WxH> <output> [hero|hero-mid|bento|gallery|coda]");
}
const [width, height] = viewport.split("x").map(Number);
const port = Number(process.env.CDP_PORT || 9333);
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
const events = [];
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  } else if (["Runtime.exceptionThrown", "Log.entryAdded"].includes(message.method)) events.push(message);
};
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++sequence;
  pending.set(id, resolve);
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 768 });
  await send("Page.navigate", { url });
  await wait(8_500);
  await evaluate(`document.documentElement.style.scrollBehavior='auto'; true`);

  if (state === "hero-mid" && width >= 1024) {
    await evaluate(`scrollTo(0, innerHeight * 0.78); true`);
  } else if (state !== "hero") {
    const selector = state === "bento" ? "#desktop-marthas-eyes" : state === "gallery" ? "#collection" : "#desktop-beyond";
    await evaluate(`document.querySelector('${selector}').scrollIntoView({block:'start'}); true`);
  }
  await wait(900);

  if (process.env.HIDE_FIXED_PAPER === "1") {
    await evaluate(`document.querySelector('[data-fixed-paper-texture]')?.style.setProperty('display', 'none', 'important'); true`);
    await wait(100);
  }

  const metrics = JSON.parse(await evaluate(`JSON.stringify({
    state: '${state}',
    innerWidth,
    innerHeight,
    scrollY,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    desktopHero: document.querySelector('.desktop-home')?.getBoundingClientRect().toJSON(),
    mobileHero: document.querySelector('[data-mobile-hero]')?.getBoundingClientRect().toJSON(),
    bento: document.querySelector('#desktop-marthas-eyes')?.getBoundingClientRect().toJSON(),
    gallery: document.querySelector('#collection')?.getBoundingClientRect().toJSON(),
    brokenImages: [...document.images].filter(img => img.getBoundingClientRect().width > 0 && (!img.complete || img.naturalWidth === 0)).map(img => img.src),
    events: ${events.length}
  })`));
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, Buffer.from(shot.result.data, "base64"));
  console.log(JSON.stringify({ output, metrics }, null, 2));
} finally {
  socket.close();
}
