import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const [url, viewport, output, state = "top", selected = "0"] = process.argv.slice(2);
if (!url || !viewport || !output) throw new Error("Usage: node capture-styled-by-martha.mjs <url> <WxH> <output> [top|stage|rail] [selected]");
const [width, height] = viewport.split("x").map(Number);
const port = Number(process.env.CDP_PORT || 9333);
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
const events = [];
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
  else if (["Runtime.exceptionThrown", "Log.entryAdded"].includes(message.method)) events.push(message);
};
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++sequence; pending.set(id, resolve); socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: width < 768 });
  await send("Page.navigate", { url }); await wait(8_500);
  if (width >= 1024 && Number(selected) > 0) {
    await evaluate(`document.querySelectorAll('[aria-label="Choose a styled look"] button')[${Number(selected)}].click(); true`);
    await wait(750);
  }
  const y = await evaluate(`(() => {
    const section = document.querySelector('#styled-by-martha');
    if ('${state}' === 'stage') {
      const stage = ${width} < 1024 ? section.querySelector('[aria-label="Styled looks"]') : section.querySelector('[aria-label="Choose a styled look"]')?.previousElementSibling;
      return stage ? stage.getBoundingClientRect().top + scrollY - 90 : section.offsetTop;
    }
    if ('${state}' === 'rail') return section.querySelector('[aria-label="Choose a styled look"]')?.getBoundingClientRect().top + scrollY - innerHeight + 220 || section.offsetTop;
    return section.offsetTop;
  })()`);
  await evaluate(`scrollTo(0, ${Math.max(0, Number(y))}); true`); await wait(800);
  const metrics = await evaluate(`JSON.stringify({ scrollY, scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth, section:document.querySelector('#styled-by-martha').getBoundingClientRect().toJSON(), images:[...document.querySelectorAll('#styled-by-martha img')].filter(x=>x.getBoundingClientRect().width>0).map(x=>({complete:x.complete,naturalWidth:x.naturalWidth,alt:x.alt})), events:${events.length} })`);
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
  await mkdir(dirname(output), { recursive: true }); await writeFile(output, Buffer.from(shot.result.data, "base64"));
  console.log(JSON.stringify({ output, metrics: JSON.parse(metrics) }, null, 2));
} finally { socket.close(); }
