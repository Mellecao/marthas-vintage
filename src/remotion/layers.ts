import { staticFile } from "remotion";

export const LOGO_VIEWBOX = { width: 5527.01, height: 4282.68 };

export type Bbox = { x: number; y: number; width: number; height: number };

export type Layer = {
  id: string;
  src: string;
  /** Bounding box in master viewBox units — drives transform origins and wipes. */
  bbox: Bbox;
};

/**
 * Parts are drawn from the PNGs built by `npm run logo:raster`, not the SVGs
 * they come from. The Illustrator artwork runs to ~446k path commands on the
 * woman alone, and both the site's loading screen and the Studio preview are
 * browsers: they re-rasterise those vectors on every frame the animation
 * changes a transform, mask or clip-path, which drags the intro down to ~18fps.
 * The bitmaps are 2220px wide, comfortably above the 1766px the widest
 * composition draws them at.
 */
/** Every part the composition draws, for preloading before playback. */
export const ALL_LAYERS: Layer[] = [];

const part = (name: string, bbox: Bbox): Layer => {
  const layer: Layer = {
    id: name,
    src: staticFile(`assets/logo/logo-partes/raster/${name}.png`),
    bbox,
  };
  ALL_LAYERS.push(layer);
  return layer;
};

export const SCENERY = {
  floor: part("tracos-do-chao", { x: 565.9, y: 3993.7, width: 4412.3, height: 289 }),
  corgi: part("corgi", { x: 3216.5, y: 2954.7, width: 1323.5, height: 1297.1 }),
  woman: part("mulher-azsset", { x: 1905, y: 460.7, width: 1436, height: 3782 }),
};

export const STEMS = {
  left: part("caule-e-folhas-esquerdo", { x: 140, y: 1293.7, width: 1980, height: 2824 }),
  right: part("caule-e-folhas-direito", { x: 3309, y: 1301.7, width: 2054, height: 2784.5 }),
};

/** Rose buds, in the order they should bloom. */
export const ROSES: Layer[] = [
  part("botao-de-rosa-topo-esquerdo", { x: 1229.2, y: 1291.7, width: 695.4, height: 690 }),
  part("botao-de-rosa-topo-direito", { x: 3501.3, y: 1243.7, width: 679.9, height: 698.3 }),
  part("botao-de-rosa-meio-esquerdo", { x: 355.2, y: 1950.7, width: 1047.3, height: 911.2 }),
  part("botao-de-rosa-meio-direito", { x: 4050.8, y: 1858.8, width: 1106.2, height: 996.7 }),
  part("botao-de-rosa-meio-abaixo-esquerdo", { x: 215.6, y: 2977.5, width: 485.7, height: 422.5 }),
  part("botao-de-rosa-abaixo-direito", { x: 4795.8, y: 2931, width: 490.7, height: 449 }),
  part("botao-de-rosa-abaixo-esquerda", { x: 1587.9, y: 3559.6, width: 424.2, height: 506.1 }),
];

export const BUTTERFLIES = {
  left: part("btrfly-left", { x: 0, y: 1534.7, width: 382, height: 377 }),
  midLeft: part("btrlfly2-midleleft", { x: 1560, y: 765.7, width: 422, height: 418 }),
  midRight: part("btrlfly3-middleright", { x: 3482, y: 811.7, width: 404, height: 385 }),
  right: part("btrlfly4-right", { x: 5137, y: 1518.7, width: 390, height: 368 }),
};

/**
 * Lettering split glyph by glyph, in handwriting order: "Martha's" then the V
 * swash, "intage", and finally the dot over the i.
 */
export const GLYPHS: Layer[] = [
  part("m-lettering", { x: 354.1, y: 212.4, width: 1061.7, height: 1297.9 }),
  part("letra-a-artha-primeiro", { x: 1342.6, y: 526.6, width: 284.9, height: 340.6 }),
  part("letra-r-artha", { x: 1542.6, y: 388.6, width: 272.1, height: 326.7 }),
  part("letra-t-artha", { x: 1655.8, y: 217.6, width: 322, height: 444.2 }),
  part("letra-h-artha", { x: 1932.8, y: 154.6, width: 317.2, height: 449 }),
  part("letra-a-artha-ultimo", { x: 2218.9, y: 197.5, width: 323, height: 328.5 }),
  part("apostrofo-lettering", { x: 2621, y: 22.6, width: 101.9, height: 163.6 }),
  part("s", { x: 2663.9, y: 95.8, width: 277.5, height: 333.2 }),
  part("swash-lettering", { x: 3126.3, y: 0, width: 983, height: 680.1 }),
  part("letra-i-intage", { x: 3654.7, y: 422.3, width: 233.5, height: 316.9 }),
  part("letra-n-intage", { x: 3810, y: 431.6, width: 385.7, height: 357.5 }),
  part("letra-t-intage", { x: 4106.5, y: 356.6, width: 321.7, height: 482.8 }),
  part("letra-a-intage", { x: 4266.1, y: 601.9, width: 432.1, height: 336.6 }),
  part("letra-g-intage", { x: 4388.5, y: 737.6, width: 583.8, height: 573.9 }),
  part("letra-e-intage", { x: 4862.8, y: 878.8, width: 334.8, height: 299.9 }),
  part("letra-i-intage-dot", { x: 3776.8, y: 304.7, width: 85.3, height: 82 }),
];

export const LAYERS: Layer[] = [
  ...Object.values(SCENERY),
  ...Object.values(STEMS),
  ...ROSES,
  ...Object.values(BUTTERFLIES),
  ...GLYPHS,
];

/**
 * SVG matrix that flips artwork horizontally and fits it from one bounding box
 * onto another, so a guide drawn for one side can drive its mirrored twin.
 */
const mirrorFit = (from: Bbox, to: Bbox) => ({
  sx: to.width / from.width,
  sy: to.height / from.height,
  tx: to.x + (from.x + from.width) * (to.width / from.width),
  ty: to.y - from.y * (to.height / from.height),
});

export const mirrorTransform = (from: Bbox, to: Bbox) => {
  const { sx, sy, tx, ty } = mirrorFit(from, to);
  return `matrix(${-sx} 0 0 ${sy} ${tx} ${ty})`;
};

/** Takes a box in the mirrored space back to the space the guide was drawn in. */
export const unmirrorBbox = (bbox: Bbox, from: Bbox, to: Bbox): Bbox => {
  const { sx, sy, tx, ty } = mirrorFit(from, to);
  return {
    x: (tx - (bbox.x + bbox.width)) / sx,
    y: (bbox.y - ty) / sy,
    width: bbox.width / sx,
    height: bbox.height / sy,
  };
};

/** CSS transform-origin pointing at a normalised spot inside a layer's bbox. */
export const originOf = ({ bbox }: Layer, ax = 0.5, ay = 0.5) =>
  `${((bbox.x + bbox.width * ax) / LOGO_VIEWBOX.width) * 100}% ${
    ((bbox.y + bbox.height * ay) / LOGO_VIEWBOX.height) * 100
  }%`;

/** Horizontal edges of a layer as percentages of the composition width. */
export const edgesOf = ({ bbox }: Layer) => ({
  left: (bbox.x / LOGO_VIEWBOX.width) * 100,
  right: ((bbox.x + bbox.width) / LOGO_VIEWBOX.width) * 100,
});

/**
 * A mask that grows outward from a root point inside the layer, so artwork is
 * uncovered by an expanding wavefront instead of a straight edge. The ellipse
 * is taller than it is wide, which makes growth climb faster than it spreads,
 * and the soft rim makes branch tips fade in rather than pop.
 */
export const growthMask = (
  layer: Layer,
  anchor: { x: number; y: number },
  progress: number,
  feather = 22,
) => {
  const { bbox } = layer;
  const rootX = bbox.x + bbox.width * anchor.x;
  const rootY = bbox.y + bbox.height * anchor.y;
  const reachX = Math.max(rootX - bbox.x, bbox.x + bbox.width - rootX);
  const reachY = Math.max(rootY - bbox.y, bbox.y + bbox.height - rootY);
  const biasX = 0.72;
  const biasY = 1.32;
  // Radius that just covers the far corner of the bbox, plus a little margin.
  const reach = Math.hypot(reachX / biasX, reachY / biasY) * 1.05;
  const rx = Math.max(0.01, ((reach * biasX) / LOGO_VIEWBOX.width) * 100 * progress);
  const ry = Math.max(0.01, ((reach * biasY) / LOGO_VIEWBOX.height) * 100 * progress);
  const cx = (rootX / LOGO_VIEWBOX.width) * 100;
  const cy = (rootY / LOGO_VIEWBOX.height) * 100;
  return `radial-gradient(${rx}% ${ry}% at ${cx}% ${cy}%, #000 ${100 - feather}%, transparent 100%)`;
};
