import fs from "node:fs";
import { svgPathProperties } from "svg-path-properties";

/**
 * Turns the hand-drawn guide strokes into a growth tree.
 *
 * The guide is a set of open paths traced down the middle of each branch. This
 * script works out which branch sprouts from which, and where along the parent
 * it attaches, so every branch can start growing at the moment the parent's
 * wavefront reaches its base. Growth speed is kept constant across the whole
 * plant, so a long branch simply takes longer than a short one.
 */
const GUIDE = "public/assets/logo/SVG/teste.svg";
const OUT = "src/remotion/growth-guide.json";
const SAMPLES = 60;

const svg = fs.readFileSync(GUIDE, "utf8");

const groupBody = (id) => {
  const open = svg.indexOf(`<g id="${id}"`);
  if (open < 0) return null;
  let depth = 0;
  const re = /<(\/?)g\b[^>]*?(\/?)>/g;
  re.lastIndex = open;
  let m;
  while ((m = re.exec(svg))) {
    if (m[2]) continue;
    depth += m[1] ? -1 : 1;
    if (depth === 0) return svg.slice(open, m.index + m[0].length);
  }
  return null;
};

const strokesOf = (body) => {
  const out = [];
  for (const m of body.matchAll(/<path\b[^>]*\/>/g)) {
    const d = m[0].match(/\sd="([^"]+)"/);
    if (d) out.push(d[1]);
  }
  for (const m of body.matchAll(/<line\b[^>]*\/>/g)) {
    const at = (k) => Number(m[0].match(new RegExp(`\\s${k}="([^"]+)"`))[1]);
    out.push(`M${at("x1")},${at("y1")}L${at("x2")},${at("y2")}`);
  }
  return out;
};

const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

const measure = (d) => {
  const props = new svgPathProperties(d);
  const length = props.getTotalLength();
  const points = Array.from({ length: SAMPLES + 1 }, (_, i) =>
    props.getPointAtLength((length * i) / SAMPLES),
  );
  return { d, length, points };
};

/** Reverses a branch so it always grows away from its parent. */
const flip = (branch) => ({
  ...branch,
  reversed: !branch.reversed,
  points: [...branch.points].reverse(),
});

const buildTree = (strokes) => {
  const branches = strokes.map((d) => ({ ...measure(d), reversed: false }));

  // The trunk is whichever stroke reaches furthest down into the ground.
  let root = 0;
  let lowest = -Infinity;
  branches.forEach((b, i) => {
    for (const p of b.points) {
      if (p.y > lowest) {
        lowest = p.y;
        root = i;
      }
    }
  });
  // Trunks grow upward, so the trunk starts at its lowest end.
  if (branches[root].points[0].y < branches[root].points.at(-1).y) {
    branches[root] = flip(branches[root]);
  }

  const attached = [{ index: root, parent: null, at: 0 }];
  const pending = new Set(branches.map((_, i) => i));
  pending.delete(root);

  while (pending.size) {
    let best = null;
    for (const i of pending) {
      for (const endIsStart of [true, false]) {
        const end = endIsStart ? branches[i].points[0] : branches[i].points.at(-1);
        for (const node of attached) {
          const parent = branches[node.index];
          parent.points.forEach((p, k) => {
            const gap = dist2(end, p);
            if (!best || gap < best.gap) {
              best = { gap, child: i, parent: node.index, at: k / SAMPLES, endIsStart };
            }
          });
        }
      }
    }
    if (!best.endIsStart) branches[best.child] = flip(branches[best.child]);
    attached.push({ index: best.child, parent: best.parent, at: best.at });
    pending.delete(best.child);
  }

  // A branch starts growing when the parent's wavefront passes its base.
  const start = new Map();
  const result = [];
  for (const node of attached) {
    const branch = branches[node.index];
    const parentStart = node.parent === null ? 0 : start.get(node.parent);
    const parentLength = node.parent === null ? 0 : branches[node.parent].length;
    const begin = parentStart + node.at * parentLength;
    start.set(node.index, begin);
    result.push({
      d: branch.d,
      reversed: branch.reversed,
      begin,
      length: branch.length,
      points: branch.points,
    });
  }
  return result;
};

const guides = {};
for (const [side, id] of [
  ["left", "guia-esquerdo"],
  ["right", "guia-direito"],
]) {
  const body = groupBody(id);
  if (!body) {
    console.warn(`grupo ${id} não encontrado — lado ${side} sem guia`);
    continue;
  }
  const strokes = strokesOf(body);
  const branches = buildTree(strokes);

  /**
   * Total artwork uncovered by the time the wavefront has travelled `u`. Timing
   * branches purely by arc length leaves stretches where only one branch is
   * growing and others where four fire at once, which reads as a stutter.
   * Re-timing against this curve keeps the amount appearing per second steady:
   * time runs faster through the lulls and slower through the bursts.
   */
  const revealed = (u) =>
    branches.reduce(
      (sum, b) => sum + Math.min(Math.max(u - b.begin, 0), b.length),
      0,
    );
  const total = revealed(Infinity);
  const paced = (u) => Number((revealed(u) / total).toFixed(4));

  // Points stay in growth order so the composition can ask "when does the
  // wavefront pass this spot?" and time the buds to the branch they sit on.
  guides[side] = branches.map((b) => ({
    d: b.d,
    reversed: b.reversed,
    begin: paced(b.begin),
    end: paced(b.begin + b.length),
    points: b.points.map((p) => [Math.round(p.x), Math.round(p.y)]),
  }));
  console.log(
    `${side}: ${branches.length} galhos`,
    guides[side].map((b) => `${b.begin.toFixed(2)}→${b.end.toFixed(2)}`).join("  "),
  );
}

fs.writeFileSync(OUT, JSON.stringify(guides, null, 2));
