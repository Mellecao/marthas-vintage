import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BUTTERFLIES,
  GLYPHS,
  LOGO_VIEWBOX,
  ROSES,
  SCENERY,
  STEMS,
  edgesOf,
  growthMask,
  mirrorTransform,
  originOf,
  unmirrorBbox,
  type Layer,
} from "./layers";
import { LayerQualityContext, LogoLayer, type LayerQuality } from "./LogoLayer";
import { GUIDES, GrowthStem, OVERSHOOT, wavefrontAcross } from "./GrowthStem";

export const CREAM = "#f6efe2";
export const DURATION = 240;

/**
 * Frame at which the scene has actually settled: the last butterfly touches
 * down at 134 + its 58-frame flight. DURATION keeps a tail past this for the
 * offline render, but the site's loading screen has no reason to hold a
 * finished logo on screen, so it plays to here and leaves. Phones get the same
 * cut — stopping earlier lands mid-word in "Vintage".
 */
export const SETTLED = 200;

const TIMING = {
  stemLeft: 0,
  stemRight: 0,
  stemGrowth: 52,
  /** Buds start opening slightly before the wavefront clears them. */
  roseLead: 3,
  /** Gap between the woman entering and the corgi following her. */
  corgiFollow: 12,
  /** Frames for a figure's spring and fade to reach roughly half. */
  figureHalf: 7,
  floorGrowth: 18,
  glyphStep: 4,
  glyphWipe: 9,
};

/** Where each cluster meets the ground, as a fraction of its bounding box. */
const ROOTS = {
  left: { x: 0.86, y: 0.99 },
  right: { x: 0.13, y: 0.99 },
};

const ease = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/**
 * Growth is close to constant speed — the guide already spaces branches by arc
 * length — but the first shoot pushes out of the ground gently before settling
 * into that pace, so the base of the plant doesn't snap into place.
 */
const SPROUT = 1.5;

const creep = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: (t) => t ** SPROUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Frames into an eased reveal at which it is `progress` of the way through. */
const frameAt = (progress: number, duration: number) =>
  (1 - Math.cbrt(1 - progress)) * duration;

/**
 * Stems are uncovered by a wavefront spreading from where they meet the ground,
 * so the branches read as growing out of the floor. The artwork itself is never
 * scaled — only the mask moves.
 */
const Stem: React.FC<{
  layer: Layer;
  delay: number;
  phase: number;
  root: { x: number; y: number };
  side: "left" | "right";
}> = ({ layer, delay, phase, root, side }) => {
  const frame = useCurrentFrame();
  const grow = creep(frame, delay, TIMING.stemGrowth);
  const sway = Math.sin((frame + phase) * 0.035) * 0.35 * grow;
  // Only the left side was traced by hand; the right cluster is its mirror.
  const branches = GUIDES[side] ?? GUIDES.left;
  if (branches) {
    return (
      <GrowthStem
        layer={layer}
        branches={branches}
        progress={grow}
        maskId={`growth-${side}`}
        sway={sway}
        transform={
          GUIDES[side]
            ? undefined
            : mirrorTransform(STEMS.left.bbox, layer.bbox)
        }
      />
    );
  }
  const mask = growthMask(layer, root, grow);
  return (
    <LogoLayer
      layer={layer}
      style={{
        transformOrigin: originOf(layer, 0.5, 1),
        transform: `rotate(${sway}deg)`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
};

/**
 * Frame at which the stem wavefront reaches a layer, so buds open in the order
 * the branches actually reach them — lowest first, climbing to the tips. The
 * growth easing has to be undone to turn a progress value back into a frame.
 */
const growthArrival = (layer: Layer) => {
  const side =
    layer.bbox.x + layer.bbox.width / 2 < LOGO_VIEWBOX.width / 2
      ? "left"
      : "right";
  const branches = GUIDES[side] ?? GUIDES.left ?? [];
  const box = GUIDES[side]
    ? layer.bbox
    : unmirrorBbox(layer.bbox, STEMS.left.bbox, STEMS[side].bbox);
  // The mask runs its wavefront past the end of the guide, so undo that too.
  const reached = Math.min(wavefrontAcross(box, branches) / OVERSHOOT, 0.999);
  const delay = TIMING[side === "left" ? "stemLeft" : "stemRight"];
  return Math.max(
    0,
    delay + reached ** (1 / SPROUT) * TIMING.stemGrowth - TIMING.roseLead,
  );
};

/**
 * The woman walks in as the topmost buds start opening, so the figures and the
 * plants finish together instead of the scene stalling between them.
 */
const WOMAN = Math.min(growthArrival(ROSES[0]), growthArrival(ROSES[1]));
const CORGI = WOMAN + TIMING.corgiFollow;
/** The ground draws itself in once the pair standing on it is half there. */
const FLOOR = CORGI + TIMING.figureHalf;
/** Lettering starts while the ground is still finishing. */
const LETTERING = FLOOR + frameAt(0.7, TIMING.floorGrowth);

/** Buds pop open with a spring, unwinding a slight rotation as they go. */
const Rose: React.FC<{ layer: Layer; delay: number }> = ({ layer, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bloom = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.7 },
  });
  const breathe = 1 + Math.sin((frame - delay) * 0.045) * 0.008 * bloom;
  return (
    <LogoLayer
      layer={layer}
      style={{
        opacity: interpolate(frame, [delay, delay + 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transformOrigin: originOf(layer),
        transform: `rotate(${(1 - bloom) * -14}deg) scale(${bloom * breathe})`,
      }}
    />
  );
};

/**
 * Each glyph is revealed by a left-to-right wipe across its own bounding box,
 * so the script reads as if it were being written by hand.
 */
const Glyph: React.FC<{ layer: Layer; delay: number }> = ({ layer, delay }) => {
  const frame = useCurrentFrame();
  const { left, right } = edgesOf(layer);
  const drawn = ease(frame, delay, TIMING.glyphWipe);
  const edge = left + (right - left) * drawn;
  return (
    <LogoLayer
      layer={layer}
      style={{
        opacity: frame < delay ? 0 : 1,
        clipPath: `inset(0 ${100 - edge}% 0 0)`,
      }}
    />
  );
};

type Flight = {
  layer: Layer;
  delay: number;
  from: [number, number];
  arc: number;
  tilt: number;
  phase: number;
};

/** Butterflies swing in along an arc, then hover with a wing flutter. */
const Butterfly: React.FC<Flight> = ({ layer, delay, from, arc, tilt, phase }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 58], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = from[0] * (1 - p);
  const y = from[1] * (1 - p) + Math.sin(p * Math.PI) * arc;
  const hover = Math.sin((frame + phase) * 0.07) * 0.45 * p;
  // Wings beat by squashing the sprite horizontally around its own centre.
  const flutter = 1 - 0.4 * (0.5 - 0.5 * Math.cos((frame + phase) * 1.05));
  return (
    <LogoLayer
      layer={layer}
      style={{
        opacity: interpolate(frame, [delay, delay + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transformOrigin: originOf(layer),
        transform: `translate(${x}%, ${y + hover}%) rotate(${(1 - p) * tilt}deg) scaleX(${flutter})`,
      }}
    />
  );
};

const FLIGHTS: Flight[] = [
  { layer: BUTTERFLIES.midLeft, delay: 96, from: [-13, 9], arc: -6, tilt: -18, phase: 0 },
  { layer: BUTTERFLIES.midRight, delay: 108, from: [13, 11], arc: -7, tilt: 16, phase: 7 },
  { layer: BUTTERFLIES.left, delay: 121, from: [-15, 6], arc: -4, tilt: -12, phase: 3 },
  { layer: BUTTERFLIES.right, delay: 134, from: [15, 7], arc: -5, tilt: 14, phase: 11 },
];

const Figure: React.FC<{ layer: Layer; delay: number; rise: number }> = ({
  layer,
  delay,
  rise,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const settle = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 70, mass: 1 },
  });
  return (
    <LogoLayer
      layer={layer}
      style={{
        opacity: interpolate(frame, [delay, delay + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transformOrigin: originOf(layer, 0.5, 1),
        transform: `translateY(${(1 - settle) * rise}%) scale(${0.97 + settle * 0.03})`,
      }}
    />
  );
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const floor = ease(frame, FLOOR, TIMING.floorGrowth);
  const { left, right } = edgesOf(SCENERY.floor);
  const mid = (left + right) / 2;
  return (
    <AbsoluteFill>
      <LogoLayer
        layer={SCENERY.floor}
        style={{
          clipPath: `inset(0 ${100 - (mid + (right - mid) * floor)}% 0 ${mid - (mid - left) * floor}%)`,
        }}
      />
      <Stem layer={STEMS.left} delay={TIMING.stemLeft} phase={0} root={ROOTS.left} side="left" />
      <Stem layer={STEMS.right} delay={TIMING.stemRight} phase={40} root={ROOTS.right} side="right" />
      {ROSES.map((rose) => (
        <Rose key={rose.id} layer={rose} delay={growthArrival(rose)} />
      ))}
      <Figure layer={SCENERY.woman} delay={WOMAN} rise={3.5} />
      <Figure layer={SCENERY.corgi} delay={CORGI} rise={2.5} />
      {GLYPHS.map((glyph, i) => (
        <Glyph key={glyph.id} layer={glyph} delay={LETTERING + i * TIMING.glyphStep} />
      ))}
      {FLIGHTS.map((flight) => (
        <Butterfly key={flight.layer.id} {...flight} />
      ))}
    </AbsoluteFill>
  );
};

export const MarthasLogo: React.FC<{
  quality?: LayerQuality;
  artworkWidth?: string;
}> = ({
  quality = "full",
  artworkWidth = "92%",
}) => (
  <LayerQualityContext.Provider value={quality}>
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <AbsoluteFill
        style={{
          aspectRatio: `${LOGO_VIEWBOX.width} / ${LOGO_VIEWBOX.height}`,
          margin: "auto",
          inset: 0,
          width: artworkWidth,
          height: "auto",
        }}
      >
        <Scene />
      </AbsoluteFill>
    </AbsoluteFill>
  </LayerQualityContext.Provider>
);
