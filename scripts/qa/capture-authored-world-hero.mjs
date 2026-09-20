// Capture and inspect the authored-world hero through Chrome CDP.
// Usage: CDP_PORT=9333 node scripts/qa/capture-authored-world-hero.mjs <url> <width>x<height> <output.png> [progress=0] [reduced] [menu]
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const port = Number(process.env.CDP_PORT || 9333);
const [, , url = "http://127.0.0.1:3017/direction", viewport = "1440x900", output = "audit/authored-world.png", progressArg = "0", ...modes] = process.argv;
const [width, height] = viewport.split("x").map(Number);
const progress = Math.max(0, Math.min(1, Number(progressArg)));
const reduced = modes.includes("reduced");
const menu = modes.includes("menu");

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
  } else if (message.method === "Runtime.exceptionThrown" || message.method === "Log.entryAdded") {
    events.push(message.params);
  }
};
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});
const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++sequence;
  pending.set(id, resolve);
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return response.result?.result?.value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 768 });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
  await send("Page.navigate", { url });
  await wait(8_500);
  await evaluate(`new Promise(async resolve => { const imgs=[...document.querySelectorAll('[data-authored-world-hero] img')]; await Promise.all(imgs.map(img => img.decode?.().catch(()=>{}))); resolve(true); })`);
  if (progress > 0) {
    await evaluate(`scrollTo(0, ${Math.round(height * 0.65 * progress)}); true`);
    await wait(900);
  }
  if (menu) {
    await evaluate(`document.querySelector('[aria-controls="authored-world-mobile-menu"]')?.click(); true`);
    await wait(350);
  }

  const layout = JSON.parse((await evaluate(`JSON.stringify((() => {
    const rect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const r = node.getBoundingClientRect();
      return { x:r.x, y:r.y, width:r.width, height:r.height, top:r.top, right:r.right, bottom:r.bottom, left:r.left };
    };
    const image = document.querySelector('[data-hero-image]');
    return {
      width: innerWidth,
      height: innerHeight,
      scrollY,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hero: rect('[data-authored-world-hero]'),
      media: rect('[data-hero-media]'),
      header: rect('[data-hero-header]'),
      brand: rect('[data-hero-brand]'),
      intro: rect('[data-hero-intro]'),
      menuOpen: !!document.querySelector('#authored-world-mobile-menu'),
      image: image ? { currentSrc:image.currentSrc, naturalWidth:image.naturalWidth, naturalHeight:image.naturalHeight, objectPosition:getComputedStyle(image).objectPosition } : null,
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  })())`)) || "{}");

  const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, Buffer.from(screenshot.result.data, "base64"));
  console.log(JSON.stringify({ output, layout, runtimeEvents: events.length }, null, 2));
} finally {
  socket.close();
}
