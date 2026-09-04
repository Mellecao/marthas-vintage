import fs from "node:fs";
import path from "node:path";
import { svgPathBbox } from "svg-path-bbox";

// Re-export where the right-hand rose buds are siblings of the stems group
// instead of nested inside it, so every bud can move on its own.
const MASTER = "public/assets/logo/logo-marthas-fixed.svg";
const OUT = "public/assets/logo/logo-partes/split";

// Groups extracted as standalone layers. Each keeps the master viewBox so the
// parts stack pixel-perfect when overlaid in the Remotion composition.
// Nested targets are subtracted from their parent so no path is drawn twice.
const TARGETS = [
  "traços-do-chao",
  "corgi",
  "mulher-azsset",
  "artha",
  "s",
  "intage",
  "BTRFLY-left",
  "BTRLFLY2-midleleft",
  "BTRLFLY3-middleright",
  "BTRLFLY4-right",
  "caule-e-folhas-esquerdo",
  "botao-de-rosa-topo-esquerdo",
  "botao-de-rosa-meio-esquerdo",
  "botao-de-rosa-meio-abaixo-esquerdo",
  "botão-de-rosa-abaixo-esquerda",
  "caule-e-folhas-direito",
  "botão-de-rosa-topo-direito",
  "botao-de-rosa-meio-direito",
  "botao-de-rosa-abaixo-direito",
];

const slug = (id) =>
  id
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const round = (n) => Math.round(n * 10) / 10;

const unionBbox = (body) => {
  let box = null;
  for (const [, d] of body.matchAll(/\sd="([^"]+)"/g)) {
    let b;
    try {
      b = svgPathBbox(d);
    } catch {
      continue;
    }
    box = box
      ? [Math.min(box[0], b[0]), Math.min(box[1], b[1]), Math.max(box[2], b[2]), Math.max(box[3], b[3])]
      : b;
  }
  return box;
};

const bboxOf = (body) => {
  const box = unionBbox(body);
  if (!box) return null;
  return {
    x: round(box[0]),
    y: round(box[1]),
    width: round(box[2] - box[0]),
    height: round(box[3] - box[1]),
  };
};

/** Indexes one SVG file so groups can be sliced out of it by id. */
const readSource = (file, targets) => {
  const text = fs.readFileSync(file, "utf8");
  const defsBlock = (text.match(/<defs>[\s\S]*?<\/defs>/) || [""])[0];

  const styleRules = new Map();
  for (const [, name, body] of defsBlock.matchAll(/\.(cls-\d+)\s*\{([^}]*)\}/g)) {
    styleRules.set(name, body.trim().replace(/\s+/g, " "));
  }
  const defsNodes = new Map();
  for (const [node, , id] of defsBlock.matchAll(
    /<(linearGradient|radialGradient|clipPath|mask|filter|pattern)\b[^>]*?id="([^"]+)"[\s\S]*?<\/\1>/g,
  )) {
    defsNodes.set(id, node);
  }

  const slices = new Map();
  const stack = [];
  for (const m of text.matchAll(/<(\/?)g\b([^>]*?)(\/?)>/g)) {
    const [tag, closing, attrs, selfClosing] = m;
    if (closing) {
      const open = stack.pop();
      if (open?.id && !slices.has(open.id)) {
        slices.set(open.id, { start: open.start, end: m.index + tag.length });
      }
    } else if (!selfClosing) {
      stack.push({ id: (attrs.match(/id="([^"]+)"/) || [])[1], start: m.index });
    }
  }

  const raw = (id) => {
    const s = slices.get(id);
    return s && text.slice(s.start, s.end);
  };

  const bodyOf = (id) => {
    const { start, end } = slices.get(id);
    let body = text.slice(start, end);
    for (const other of targets) {
      if (other === id || !slices.has(other)) continue;
      const o = slices.get(other);
      if (o.start > start && o.end < end) body = body.replace(text.slice(o.start, o.end), "");
    }
    return body;
  };

  const defsFor = (body) => {
    const classes = [...new Set([...body.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)))]
      .filter((c) => styleRules.has(c))
      .sort();
    const style = classes.length
      ? `<style>${classes.map((c) => `.${c}{${styleRules.get(c)}}`).join("")}</style>`
      : "";
    const wanted = new Set();
    const queue = [...body.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] ?? m[2]);
    while (queue.length) {
      const id = queue.pop();
      if (!id || wanted.has(id) || !defsNodes.has(id)) continue;
      wanted.add(id);
      for (const m of defsNodes.get(id).matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)) {
        queue.push(m[1] ?? m[2]);
      }
    }
    return `${style}${[...wanted].map((id) => defsNodes.get(id)).join("")}`;
  };

  return { text, slices, raw, bodyOf, defsFor };
};

const master = readSource(MASTER, TARGETS);
const viewBox = master.text.match(/viewBox="([^"]+)"/)[1];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const parts = [];
const emit = ({ id, body, defs }) => {
  const file = `${slug(id)}.svg`;
  const out = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${defs ? `<defs>${defs}</defs>` : ""}${body}</svg>\n`;
  fs.writeFileSync(path.join(OUT, file), out);
  parts.push({ id, file, kb: Math.round(out.length / 1024), bbox: bboxOf(body) });
};

for (const id of TARGETS) {
  if (!master.slices.has(id)) {
    console.warn("NOT FOUND in master:", id);
    continue;
  }
  const body = master.bodyOf(id);
  emit({ id, body, defs: master.defsFor(body) });
}

// The M, the apostrophe and the long swash sit loose inside LETTERING, outside
// the artha/s/intage groups, so they need to be picked up individually.
{
  let loose = master.raw("LETTERING");
  for (const id of ["artha", "s", "intage"]) loose = loose.replace(master.raw(id), "");
  const names = ["swash-lettering", "M-lettering", "apostrofo-lettering"];
  [...loose.matchAll(/<path\b[^>]*\/>/g)].forEach((m, i) => {
    emit({ id: names[i] ?? `lettering-extra-${i}`, body: m[0], defs: master.defsFor(m[0]) });
  });
}

// Lettering is also emitted glyph by glyph so the script can be revealed with a
// stagger. Each glyph is a single <path> inside the LETTERING group.
const letters = [];
for (const m of master.raw("LETTERING").matchAll(/<path\b[^>]*\/>/g)) {
  const node = m[0];
  const id = (node.match(/id="([^"]+)"/) || [])[1];
  if (!id || !/-(artha|intage)|artha_s/.test(id)) continue;
  const file = `letra-${slug(id)}.svg`;
  const defs = master.defsFor(node);
  fs.writeFileSync(
    path.join(OUT, file),
    `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${defs ? `<defs>${defs}</defs>` : ""}${node}</svg>\n`,
  );
  const [x0, y0, x1, y1] = svgPathBbox(node.match(/\sd="([^"]+)"/)[1]);
  letters.push({
    id,
    file,
    bbox: { x: round(x0), y: round(y0), width: round(x1 - x0), height: round(y1 - y0) },
  });
}
if (letters.length !== 14) throw new Error(`expected 14 glyphs, extracted ${letters.length}`);

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify({ viewBox, parts, letters }, null, 2));

console.table(
  parts.map((p) => ({ id: p.id, kb: p.kb, x: p.bbox?.x, y: p.bbox?.y, w: p.bbox?.width, h: p.bbox?.height })),
);
