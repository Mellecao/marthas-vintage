const port = Number(process.env.CDP_PORT || 9333);
const url = process.argv[2] || "http://127.0.0.1:3017/direction";
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
  } else if (["Runtime.exceptionThrown", "Runtime.consoleAPICalled", "Log.entryAdded"].includes(message.method)) {
    events.push(message);
  }
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
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url });
  await wait(9_000);
  const initial = JSON.parse(await evaluate(`JSON.stringify((() => {
    const hero=document.querySelector('.desktop-home');
    const photo=document.querySelector('[data-desktop-photo]');
    return {
      scrollY, hero:hero?.getBoundingClientRect().toJSON(), photo:photo?.getBoundingClientRect().toJSON(),
      parent:hero?.parentElement?.className, grandparent:hero?.parentElement?.parentElement?.className,
      pinSpacers:[...document.querySelectorAll('.pin-spacer')].map(x=>({class:x.className,rect:x.getBoundingClientRect().toJSON()})),
      transforms:{hero:getComputedStyle(hero).transform,photo:getComputedStyle(photo).transform},
      htmlOverflow:getComputedStyle(document.documentElement).overflow,
      bodyOverflow:getComputedStyle(document.body).overflow
    };
  })())`));
  await evaluate(`scrollTo(0, 600); true`);
  await wait(1_200);
  const after = JSON.parse(await evaluate(`JSON.stringify((() => {
    const hero=document.querySelector('.desktop-home');
    const photo=document.querySelector('[data-desktop-photo]');
    return {scrollY,hero:hero?.getBoundingClientRect().toJSON(),photo:photo?.getBoundingClientRect().toJSON(),pinSpacers:[...document.querySelectorAll('.pin-spacer')].length,transforms:{hero:getComputedStyle(hero).transform,photo:getComputedStyle(photo).transform}};
  })())`));
  console.log(JSON.stringify({ initial, after, events: events.map(event => ({ method:event.method, params:event.params })) }, null, 2));
} finally {
  socket.close();
}
