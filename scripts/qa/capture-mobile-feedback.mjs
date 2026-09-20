import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [url = "http://127.0.0.1:3017/", viewport = "390x844", outputDir = "audit/mobile-feedback-baseline"] = process.argv.slice(2);
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
  } else if (["Runtime.exceptionThrown", "Log.entryAdded"].includes(message.method)) {
    events.push(message);
  }
};
await new Promise((resolveOpen, reject) => {
  socket.onopen = resolveOpen;
  socket.onerror = reject;
});

const send = (method, params = {}) => new Promise((resolveSend) => {
  const id = ++sequence;
  pending.set(id, resolveSend);
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const wait = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));

const selectors = {
  hero: "#mobile-home",
  bento: "#desktop-marthas-eyes",
  statement: "#desktop-marthas-eyes blockquote",
  instinct: "#desktop-marthas-eyes h3",
  location: "#desktop-marthas-eyes article > p:last-child",
  color: "#desktop-marthas-eyes [aria-label=\"Colors recurring through Martha's collection\"]",
  store: "#store-photo-title",
  beyond: '[aria-labelledby="object-gallery-title"]',
  seam: "#mobile-home",
};

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.navigate", { url });
  await wait(4500);
  await evaluate(`document.documentElement.style.scrollBehavior='auto'; true`);

  const documentHeight = await evaluate("document.documentElement.scrollHeight");
  for (let y = 0; y < documentHeight; y += Math.max(500, height - 100)) {
    await evaluate(`scrollTo(0, ${y}); true`);
    await wait(70);
  }
  await evaluate("scrollTo(0, 0); true");
  await wait(250);

  await mkdir(resolve(outputDir), { recursive: true });
  const metrics = {};

  for (const [name, selector] of Object.entries(selectors)) {
    const targetSelector = name === "statement" || name === "instinct" ? `${selector}` : selector;
    const data = JSON.parse(await evaluate(`JSON.stringify((() => {
      let node = document.querySelector(${JSON.stringify(targetSelector)});
      if (${JSON.stringify(name)} === 'statement' || ${JSON.stringify(name)} === 'instinct') node = node?.closest('article');
      if (${JSON.stringify(name)} === 'location') {
        node = [...document.querySelectorAll(${JSON.stringify(targetSelector)})].find((candidate) => candidate.textContent.includes('Clothing sits beside textiles'))?.closest('article');
      }
      if (${JSON.stringify(name)} === 'store') node = node?.closest('figure');
      if (!node) return null;
      const r = node.getBoundingClientRect();
      if (${JSON.stringify(name)} === 'seam') {
        return {
          x: 0,
          y: Math.max(0, r.bottom + scrollY - 150),
          width: innerWidth,
          height: 430,
          text: 'Hero to Meet Martha transition',
          overflowX: 0,
          overflowY: 0,
        };
      }
      return {
        x: r.left + scrollX,
        y: r.top + scrollY,
        width: r.width,
        height: r.height,
        text: node.textContent?.replace(/\\s+/g, ' ').trim(),
        overflowX: node.scrollWidth - node.clientWidth,
        overflowY: node.scrollHeight - node.clientHeight,
      };
    })())`));
    metrics[name] = data;
    if (!data || data.width <= 0 || data.height <= 0) continue;
    const shot = await send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { x: data.x, y: data.y, width: data.width, height: data.height, scale: 1 },
    });
    const path = resolve(outputDir, `${name}.png`);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, Buffer.from(shot.result.data, "base64"));
  }

  const page = JSON.parse(await evaluate(`JSON.stringify({
    innerWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    documentHeight: document.documentElement.scrollHeight,
    runtimeEvents: ${events.length},
    brokenImages: [...document.images].filter((img) => img.getBoundingClientRect().width > 0 && (!img.complete || img.naturalWidth === 0)).map((img) => img.currentSrc || img.src),
  })`));

  console.log(JSON.stringify({ outputDir: resolve(outputDir), page, metrics }, null, 2));
} finally {
  socket.close();
}
