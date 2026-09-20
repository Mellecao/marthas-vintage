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
  } else if (message.method === "Runtime.exceptionThrown") runtimeErrors.push(message.params);
};
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++sequence; pending.set(id, resolve); socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return response.result?.result?.value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const navigate = async (width, height, mobile) => {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile });
  await send("Page.navigate", { url });
  await wait(8_500);
};

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await navigate(1440, 900, false);

  const buttonCount = await evaluate(`document.querySelectorAll('[aria-label="Choose a styled look"] button').length`);
  assert.equal(buttonCount, 6);
  await evaluate(`window.__styledLiveRegion = document.querySelector('[aria-live="polite"]'); true`);
  await evaluate(`document.querySelectorAll('[aria-label="Choose a styled look"] button')[1].click(); true`);
  await wait(700);
  const desktop = JSON.parse(await evaluate(`JSON.stringify({
    selected: document.querySelectorAll('[aria-label="Choose a styled look"] button')[1].getAttribute('aria-pressed'),
    image: document.querySelector('[aria-label="Choose a styled look"]').previousElementSibling.querySelector('figure img').getAttribute('src') ?? '',
    heading: document.querySelector('[aria-live="polite"] h3')?.textContent ?? '',
    liveRegionStable: window.__styledLiveRegion === document.querySelector('[aria-live="polite"]')
  })`));
  assert.equal(desktop.selected, "true");
  assert.match(desktop.image, /red-and-black\.jpg/);
  assert.equal(desktop.heading, "Red, edged in black");
  assert.equal(desktop.liveRegionStable, true, "desktop live region was remounted");

  await navigate(390, 844, true);
  await evaluate(`document.querySelector('#styled-by-martha').scrollIntoView(); true`);
  await wait(500);
  const initial = JSON.parse(await evaluate(`JSON.stringify((() => {
    const carousel = document.querySelector('[aria-label="Styled looks"]');
    const slide = carousel.querySelector('[data-styled-slide]');
    return { scrollLeft: carousel.scrollLeft, scrollY: window.scrollY, clientWidth: carousel.clientWidth, slideWidth: slide.getBoundingClientRect().width, count: carousel.children.length, documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  })())`));
  assert.equal(initial.count, 6);
  assert.ok(initial.slideWidth < initial.clientWidth, "next-slide affordance is not visible");
  assert.equal(initial.documentOverflow, 0);
  await wait(1_100);
  const afterWait = await evaluate(`document.querySelector('[aria-label="Styled looks"]').scrollLeft`);
  assert.equal(afterWait, initial.scrollLeft, "carousel auto-advanced");

  await evaluate(`document.querySelectorAll('[aria-label="Go to a styled look"] button')[4].click(); true`);
  await wait(1_000);
  const mobile = JSON.parse(await evaluate(`JSON.stringify({
    countText: [...document.querySelectorAll('[aria-live="polite"]')].map(x => x.textContent.trim()).find(x => x.includes('/')) ?? '',
    scrollY: window.scrollY,
    scrollLeft: document.querySelector('[aria-label="Styled looks"]').scrollLeft,
    current: document.querySelectorAll('[aria-label="Go to a styled look"] button')[4].getAttribute('aria-current')
  })`));
  assert.equal(mobile.countText, "5 / 6");
  assert.equal(mobile.current, "true");
  assert.ok(mobile.scrollLeft > initial.slideWidth * 3);
  assert.ok(Math.abs(mobile.scrollY - initial.scrollY) <= 1, "carousel control moved the page vertically");
  assert.equal(runtimeErrors.length, 0);

  console.log(JSON.stringify({ status: "PASS", desktop, initial, mobile, runtimeErrors: 0 }, null, 2));
} finally {
  socket.close();
}
