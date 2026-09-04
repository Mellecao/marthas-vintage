// Rasterises the split logo SVGs to PNGs for the web loader.
//
// The artwork is Illustrator output — the woman alone is ~446k path commands.
// Remotion's offline render can afford that, but in a browser every frame
// re-rasterises the vectors (the intro animates transforms, masks and
// clip-paths), which drops the intro to ~18fps. Bitmaps the compositor can
// cache fix both the frame rate and the 13MB payload.
//
// Needs Chrome listening on --remote-debugging-port=9222.
//   node scripts/raster-logo-parts.mjs

import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const PORT = 9222;
const SRC = "public/assets/logo/logo-partes/split";
const OUT = "public/assets/logo/logo-partes/raster";
/** Twice the widest the artwork is drawn at in the loader (1110 CSS px). */
const WIDTH = 2220;
const HEIGHT = Math.round(WIDTH / (5527.01 / 4282.68));

const open = async () => {
  const t = await (
    await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent("about:blank")}`, {
      method: "PUT",
    })
  ).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) pending.get(m.id)(m);
  };
  await new Promise((r) => (ws.onopen = r));
  return {
    ws,
    send: (method, params = {}) =>
      new Promise((res) => {
        const i = ++id;
        pending.set(i, res);
        ws.send(JSON.stringify({ id: i, method, params }));
      }),
  };
};

const { ws, send } = await open();
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: WIDTH,
  height: HEIGHT,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Emulation.setDefaultBackgroundColorOverride", {
  color: { r: 0, g: 0, b: 0, a: 0 },
});

mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC).filter((f) => f.endsWith(".svg"));
for (const file of files) {
  const url = "file:///" + resolve(SRC, file).replace(/\\/g, "/");
  await send("Page.navigate", { url });
  // The SVG is the document here, so load is the only signal that it is drawn.
  await new Promise((r) => setTimeout(r, 900));
  const shot = await send("Page.captureScreenshot", { format: "png" });
  const png = Buffer.from(shot.result.data, "base64");
  writeFileSync(`${OUT}/${file.replace(/\.svg$/, ".png")}`, png);
  console.log(`${file} -> ${(png.length / 1024).toFixed(0)}KB`);
}
ws.close();
process.exit(0);
