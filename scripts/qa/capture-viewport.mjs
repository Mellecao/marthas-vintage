// Capture a deterministic viewport from a local Chrome CDP target.
// Usage: CDP_PORT=9331 node scripts/qa/capture-viewport.mjs <url> <width>x<height> <output.png> [menu] [reduced]
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const CDP_PORT = Number(process.env.CDP_PORT || 9331);
const [, , URL = "http://localhost:3013/", viewport = "390x844", output = "audit/viewport.png", ...modes] =
  process.argv;
const [width, height] = viewport.split("x").map(Number);
const menu = modes.includes("menu");
const reduced = modes.includes("reduced");

const target = await (
  await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(URL)}`, {
    method: "PUT",
  })
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
  const response = await send("Runtime.evaluate", { expression, returnByValue: true });
  return response.result?.result?.value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: width < 768,
  });
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }],
  });
  await send("Page.navigate", { url: URL });
  // 7s React failsafe + 600ms fade can be required when Chrome blocks muted autoplay.
  await wait(10_000);
  if (menu) {
    await evaluate(`document.querySelector('[data-mobile-menu-trigger]')?.click()`);
    await wait(600);
  }
  const layout = JSON.parse(
    (await evaluate(`JSON.stringify((() => {
      const hero = document.querySelector('[data-mobile-hero]');
      const menuElement = document.querySelector('[data-mobile-menu]');
      const rect = hero?.getBoundingClientRect();
      return {
        width: innerWidth,
        height: innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hero: rect ? { top: rect.top, bottom: rect.bottom, height: rect.height } : null,
        menuOpen: !!menuElement,
        desktopVisible: !!document.querySelector('.desktop-home') && getComputedStyle(document.querySelector('.desktop-home')).display !== 'none',
      };
    })())`)) || "{}",
  );
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
    fromSurface: true,
  });
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, Buffer.from(screenshot.result.data, "base64"));
  console.log(JSON.stringify({ output, layout }, null, 2));
} finally {
  socket.close();
}
