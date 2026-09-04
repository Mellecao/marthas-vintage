// Layout probe: reports rendered geometry (in cqw) of any element, plus per-line
// text metrics. The whole site is cqw-driven, so these numbers are width-invariant.
//   node scripts/measure-layout.mjs <url> <selector> [viewportWidth] [refSelector...]
const PORT = 9222;
const [, , URL = "http://localhost:3000", SELECTOR = ".eyes-copy-large", WIDTH = "402", ...REFS] =
  process.argv;

const t = await (
  await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(URL)}`, { method: "PUT" })
).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) pending.get(m.id)(m);
};
await new Promise((r) => (ws.onopen = r));
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send("Page.enable");
// WIDTH may be "402" or "402x874"
const [vw, vh = 900] = String(WIDTH).split("x").map(Number);
await send("Emulation.setDeviceMetricsOverride", {
  width: vw, height: vh, deviceScaleFactor: 1, mobile: true,
});
await send("Page.navigate", { url: URL });
await new Promise((r) => setTimeout(r, 4500));

const expr = `(() => {
  const shell = document.querySelector('.site-shell');
  const s = shell.getBoundingClientRect();
  const cq = s.width / 100;
  const box = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const f = (v) => +(v).toFixed(3);
    return { sel, left: f((r.left - s.left)/cq), top: f((r.top - s.top)/cq),
             right: f((r.right - s.left)/cq), bottom: f((r.bottom - s.top)/cq),
             w: f(r.width/cq), h: f(r.height/cq) };
  };
  const el = document.querySelector(${JSON.stringify(SELECTOR)});
  const node = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  const lines = [];
  if (node) {
    const byTop = new Map();
    const txt = node.textContent;
    for (let i = 0; i < txt.length; i++) {
      const r2 = document.createRange();
      r2.setStart(node, i); r2.setEnd(node, i + 1);
      const rc = r2.getClientRects()[0];
      if (!rc) continue;
      const key = Math.round((rc.top - s.top) / cq * 10) / 10;
      if (!byTop.has(key)) byTop.set(key, { top: key, left: +((rc.left - s.left)/cq).toFixed(2), text: '' });
      byTop.get(key).text += txt[i];
    }
    lines.push(...[...byTop.values()].sort((a,b) => a.top - b.top));
  }
  const cs = getComputedStyle(el);
  return JSON.stringify({
    shellW: s.width, cqPx: cq,
    fontSize: +(parseFloat(cs.fontSize)/cq).toFixed(4),
    lineHeight: +(parseFloat(cs.lineHeight)/cq).toFixed(4),
    target: box(${JSON.stringify(SELECTOR)}),
    refs: ${JSON.stringify(REFS)}.map(box),
    lineCount: lines.length, lines,
  }, null, 1);
})()`;

const out = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
console.log(out.result?.result?.value ?? JSON.stringify(out.result));
ws.close();
process.exit(0);
