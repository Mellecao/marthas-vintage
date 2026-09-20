import assert from "node:assert/strict";

const port = Number(process.env.CDP_PORT || 9333);
const url = process.argv[2] || "http://127.0.0.1:3017/direction";
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
const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return response.result?.result?.value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const metrics = (width, height, mobile = width < 768) => send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile });
const navigate = async () => {
  await send("Page.navigate", { url });
  await wait(8_500);
};

try {
  await send("Page.enable");
  await send("Runtime.enable");

  await metrics(390, 844, true);
  await navigate();

  const initial = JSON.parse(await evaluate(`JSON.stringify({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    trigger: !!document.querySelector('[aria-controls="authored-world-mobile-menu"]'),
    menu: !!document.querySelector('#authored-world-mobile-menu')
  })`));
  assert.equal(initial.width, 390);
  assert.equal(initial.scrollWidth, 390);
  assert.equal(initial.trigger, true);
  assert.equal(initial.menu, false);

  await evaluate(`document.querySelector('[aria-controls="authored-world-mobile-menu"]').click(); true`);
  await wait(200);
  const opened = JSON.parse(await evaluate(`JSON.stringify({
    menu: !!document.querySelector('#authored-world-mobile-menu'),
    overflow: document.body.style.overflow,
    activeText: document.activeElement?.textContent?.trim()
  })`));
  assert.equal(opened.menu, true);
  assert.equal(opened.overflow, "hidden");
  assert.equal(opened.activeText, "Close");

  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await wait(200);
  const closed = JSON.parse(await evaluate(`JSON.stringify({
    menu: !!document.querySelector('#authored-world-mobile-menu'),
    overflow: document.body.style.overflow,
    activeControls: document.activeElement?.getAttribute?.('aria-controls')
  })`));
  assert.equal(closed.menu, false);
  assert.notEqual(closed.overflow, "hidden");
  assert.equal(closed.activeControls, "authored-world-mobile-menu");

  await evaluate(`document.querySelector('[aria-controls="authored-world-mobile-menu"]').click(); true`);
  await wait(150);
  await metrics(1024, 768, false);
  await wait(300);
  const orientationChange = JSON.parse(await evaluate(`JSON.stringify({
    menu: !!document.querySelector('#authored-world-mobile-menu'),
    overflow: document.body.style.overflow
  })`));
  assert.equal(orientationChange.menu, false, "menu remained open after switching to desktop");
  assert.notEqual(orientationChange.overflow, "hidden");

  await metrics(390, 844, true);
  await navigate();
  await evaluate(`scrollTo(0, 740); true`);
  await wait(500);
  const mobileExit = JSON.parse(await evaluate(`JSON.stringify({
    styledTop: document.querySelector('#styled-by-martha').getBoundingClientRect().top,
    scrollY,
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth
  })`));
  assert.ok(mobileExit.styledTop < 200, `mobile did not leave hero in one gesture: ${mobileExit.styledTop}`);
  assert.equal(mobileExit.width, mobileExit.scrollWidth);

  await metrics(1440, 900, false);
  await navigate();
  await evaluate(`scrollTo(0, 585); true`);
  await wait(700);
  const expanded = JSON.parse(await evaluate(`JSON.stringify((() => {
    const media = document.querySelector('[data-hero-media]').getBoundingClientRect();
    const header = document.querySelector('[data-hero-header]').getBoundingClientRect();
    const intro = getComputedStyle(document.querySelector('[data-hero-intro]'));
    return { mediaLeft: media.left, mediaTop: media.top, mediaRight: media.right, headerHeight: header.height, introOpacity: Number(intro.opacity), scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth };
  })())`));
  assert.ok(Math.abs(expanded.mediaLeft) < 1 && Math.abs(expanded.mediaTop) < 1, "desktop media did not reach viewport edges");
  assert.ok(expanded.headerHeight <= 82.1, `header did not compact: ${expanded.headerHeight}`);
  assert.ok(expanded.introOpacity < 0.05, `intro remained visible: ${expanded.introOpacity}`);
  assert.equal(expanded.scrollWidth, expanded.clientWidth);

  await evaluate(`scrollTo(0, 293); true`);
  await wait(350);
  await metrics(1024, 768, false);
  await wait(700);
  const resized = JSON.parse(await evaluate(`JSON.stringify((() => {
    const media = document.querySelector('[data-hero-media]').getBoundingClientRect();
    return { left:media.left, right:media.right, top:media.top, width:innerWidth, scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth };
  })())`));
  assert.ok(resized.left >= -1 && resized.right <= resized.clientWidth + 1, "media detached after resize");
  assert.equal(resized.scrollWidth, resized.clientWidth);
  assert.equal(runtimeErrors.length, 0, `runtime exceptions: ${runtimeErrors.length}`);

  console.log(JSON.stringify({ status: "PASS", mobileMenu: opened, mobileExit, expanded, resized, runtimeErrors: runtimeErrors.length }, null, 2));
} finally {
  socket.close();
}
