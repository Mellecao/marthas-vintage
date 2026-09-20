import assert from "node:assert/strict";

const port = Number(process.env.CDP_PORT || 9333);
const url = process.argv[2] || "http://127.0.0.1:3017/direction";
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
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
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await send("Page.navigate", { url });
  await wait(8_500);

  const sectionTop = await evaluate(`document.querySelector('#styled-by-martha').offsetTop`);
  await evaluate(`scrollTo(0, ${sectionTop + 420}); true`);
  await wait(500);
  const hidden = await evaluate(`document.querySelector('[data-hero-header]').getBoundingClientRect().bottom`);
  assert.ok(hidden <= 4, `header should hide after meaningful downward scroll, bottom=${hidden}`);

  await evaluate(`document.querySelector('[data-hero-header] nav a').focus(); true`);
  await wait(350);
  const focused = JSON.parse(await evaluate(`(() => {
    const rect = document.querySelector('[data-hero-header]').getBoundingClientRect();
    return JSON.stringify({ top: rect.top, bottom: rect.bottom, active: document.activeElement?.textContent });
  })()`));
  assert.ok(focused.top >= -1, `focused header remained offscreen: top=${focused.top}`);
  assert.equal(focused.active, "Home");

  await evaluate(`scrollTo(0, ${sectionTop + 300}); true`);
  await wait(350);
  const returned = await evaluate(`document.querySelector('[data-hero-header]').getBoundingClientRect().top`);
  assert.ok(Math.abs(returned) <= 1, `header should return on upward scroll, top=${returned}`);

  console.log(JSON.stringify({ status: "PASS", hiddenBottom: hidden, focused, returnedTop: returned }, null, 2));
} finally {
  socket.close();
}
