import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const port = Number(process.env.CDP_PORT || 9333);
const url = process.argv[2] || "http://127.0.0.1:3017/";
const viewport = process.argv[3] || "1440x900";
const output = process.argv[4] || `audit/desktop-menu-hover-${viewport}.png`;
const [width, height] = viewport.split("x").map(Number);
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
const runtimeErrors = [];

socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  } else if (message.method === "Runtime.exceptionThrown") {
    runtimeErrors.push(message.params);
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
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await send("Page.navigate", { url });
  await wait(1000);
  await evaluate("document.querySelector('[data-logo-loader]')?.remove()");
  await evaluate(`window.scrollTo({ top: ${Math.ceil(height * 2.2)}, behavior: 'instant' })`);
  await wait(900);
  await evaluate(`window.scrollTo({ top: ${Math.ceil(height * 2.05)}, behavior: 'instant' })`);
  await wait(500);

  const before = JSON.parse(await evaluate(`JSON.stringify((() => {
    const menu = document.querySelector('.persistent-hero-menu');
    const links = [...(menu?.querySelectorAll('.desktop-nav-link') || [])];
    const target = links.find((link) => link.textContent.includes('Beyond the wardrobe'));
    const label = target?.querySelector('.desktop-nav-label');
    const rects = links.map((link) => link.getBoundingClientRect().toJSON());
    const overlap = rects.some((a, index) => rects.slice(index + 1).some((b) =>
      Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) > 0 &&
      Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) > 0
    ));
    return {
      menuVisible: !!menu && !menu.hidden && !menu.classList.contains('is-collapsed'),
      pointerFine: matchMedia('(hover:hover) and (pointer:fine)').matches,
      linkCount: links.length,
      overlap,
      rects,
      targetRect: target?.getBoundingClientRect().toJSON(),
      href: target?.getAttribute('href'),
      labelTransform: label ? getComputedStyle(label).transform : null,
      underlineTransform: label ? getComputedStyle(label, '::after').transform : null,
      color: target ? getComputedStyle(target).color : null,
    };
  })())`));

  assert.equal(before.menuVisible, true, "persistent desktop menu did not reveal after upward scroll");
  assert.equal(before.pointerFine, true, "desktop hover media query is not active");
  assert.equal(before.linkCount, 4);
  assert.equal(before.overlap, false, "top navigation hit areas overlap");
  assert.equal(before.href, "#desktop-beyond");
  assert.ok(before.targetRect?.width > 100 && before.targetRect?.height >= 42);

  await send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: before.targetRect.x + before.targetRect.width / 2,
    y: before.targetRect.y + before.targetRect.height / 2,
  });
  await wait(450);

  const after = JSON.parse(await evaluate(`JSON.stringify((() => {
    const target = [...document.querySelectorAll('.persistent-hero-menu .desktop-nav-link')]
      .find((link) => link.textContent.includes('Beyond the wardrobe'));
    const label = target?.querySelector('.desktop-nav-label');
    return {
      hovered: target?.matches(':hover') || false,
      labelTransform: label ? getComputedStyle(label).transform : null,
      underlineTransform: label ? getComputedStyle(label, '::after').transform : null,
      underlineColor: label ? getComputedStyle(label, '::after').backgroundColor : null,
      color: target ? getComputedStyle(target).color : null,
      runtimeErrors: ${JSON.stringify(runtimeErrors.length)},
    };
  })())`));

  assert.equal(after.hovered, true, "real pointer hover did not reach the intended menu link");
  assert.match(after.labelTransform, /matrix\(1, 0, 0, 1, 0, -3\)/);
  assert.match(after.underlineTransform, /matrix\(1, 0, 0, 1, 0, 0\)/);
  assert.equal(after.underlineColor, "rgb(120, 75, 66)");
  assert.equal(after.color, "rgb(120, 75, 66)");
  assert.equal(runtimeErrors.length, 0, `runtime exceptions: ${runtimeErrors.length}`);

  const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
  const absoluteOutput = path.resolve(output);
  await mkdir(path.dirname(absoluteOutput), { recursive: true });
  await writeFile(absoluteOutput, Buffer.from(screenshot.result.data, "base64"));
  console.log(JSON.stringify({ viewport: { width, height }, before, after, screenshot: absoluteOutput }, null, 2));
  console.log("desktop menu hover contract: PASS");
} finally {
  socket.close();
}
