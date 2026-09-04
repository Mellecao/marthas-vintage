// Screenshots the region around a selector (plus padding), at a given viewport width.
//   node scripts/shoot-region.mjs <url> <selector> <width> <outFile>
const PORT = 9222;
const [, , URL = "http://localhost:3000", SELECTOR = ".eyes-copy-large", WIDTH = "402", OUT = "audit/region.png"] =
  process.argv;

const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(URL)}`, { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) pending.get(m.id)(m); };
await new Promise((r) => (ws.onopen = r));
const send = (m, p = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p })); });

await send("Page.enable");
const [vw, vh = 900] = String(WIDTH).split("x").map(Number);
await send("Emulation.setDeviceMetricsOverride", { width: vw, height: vh, deviceScaleFactor: 2, mobile: true });
await send("Page.navigate", { url: URL });
await new Promise((r) => setTimeout(r, 4500));

const res = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const r = document.querySelector(${JSON.stringify(SELECTOR)}).getBoundingClientRect();
    const pad = innerWidth * 0.05;
    return JSON.stringify({ x: 0, y: r.top + scrollY - pad, width: innerWidth, height: r.height + pad * 2 });
  })()`,
});
const clip = JSON.parse(res.result.result.value);
const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...clip, scale: 2 } });
const { writeFileSync } = await import("node:fs");
writeFileSync(OUT, Buffer.from(shot.result.data, "base64"));
console.log("wrote", OUT, JSON.stringify(clip));
ws.close(); process.exit(0);
