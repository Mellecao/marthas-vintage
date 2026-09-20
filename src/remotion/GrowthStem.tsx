import { useContext, useEffect } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
} from "remotion";
import { LOGO_VIEWBOX, originOf, type Bbox, type Layer } from "./layers";
import guide from "./growth-guide.json";
import { LayerQualityContext, sourceFor } from "./LogoLayer";

export type Branch = {
  d: string;
  reversed: boolean;
  begin: number;
  end: number;
  /** Samples along the branch, in growth order. */
  points: number[][];
};

export const GUIDES = guide as Record<string, Branch[] | undefined>;

/**
 * Progress at which growth finishes crossing a region — the last moment a
 * wavefront passes through it. Measuring the whole box rather than its centre
 * matters for the large buds, whose centre can sit closer to a branch below
 * them than to the one they actually sprout from.
 */
export const wavefrontAcross = (bbox: Bbox, branches: Branch[]) => {
  let crossed = -1;
  let closest = 1;
  let nearest = Infinity;
  const cx = bbox.x + bbox.width / 2;
  const cy = bbox.y + bbox.height / 2;
  for (const branch of branches) {
    branch.points.forEach(([x, y], i) => {
      const at =
        branch.begin +
        (branch.end - branch.begin) * (i / (branch.points.length - 1));
      const within =
        x >= bbox.x &&
        x <= bbox.x + bbox.width &&
        y >= bbox.y &&
        y <= bbox.y + bbox.height;
      if (within) {
        crossed = Math.max(crossed, at);
        return;
      }
      const gap = (x - cx) ** 2 + (y - cy) ** 2;
      if (gap >= nearest) return;
      nearest = gap;
      closest = at;
    });
  }
  return crossed >= 0 ? crossed : closest;
};

/**
 * Reveal passes along each branch, narrowest and fastest first. The leading tip
 * is a thin wavefront so growth reads as a shoot pushing forward; each wider
 * pass lags further behind (as a fraction of the branch's own duration) and
 * uncovers leaves and shading sitting progressively further off the centreline.
 */
const PASSES = [
  { width: 1600, lag: 0.62 },
  { width: 900, lag: 0.4 },
  { width: 480, lag: 0.2 },
  { width: 200, lag: 0 },
];

/**
 * The lagging passes finish after the branch's own window, so the wavefront is
 * run slightly past the end to guarantee the widest pass completes everywhere.
 */
export const OVERSHOOT = 1.12;

const along = (branch: Branch, progress: number, lag: number) => {
  const span = branch.end - branch.begin || 1;
  return interpolate(
    progress * OVERSHOOT,
    [branch.begin + span * lag, branch.end + span * lag],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
};

/** How far into its travel a pass takes to reach full width. */
const THICKEN = 0.15;

const Stroke: React.FC<{ branch: Branch; grown: number; width: number }> = ({
  branch,
  grown,
  width,
}) => (
  <path
    d={branch.d}
    pathLength={1}
    fill="none"
    stroke="#fff"
    // Round caps at full width would pop a disc the size of the pass into
    // existence the instant a branch starts, so the width eases in with it.
    strokeWidth={width * Math.min(1, grown / THICKEN)}
    strokeLinecap="round"
    strokeDasharray="1 1"
    strokeDashoffset={branch.reversed ? grown - 1 : 1 - grown}
  />
);

/**
 * Reveals stem artwork along hand-drawn guide strokes, so each branch only
 * appears once the wavefront travelling up its parent reaches its base. The
 * artwork is never transformed — only the mask moves.
 */
export const GrowthStem: React.FC<{
  layer: Layer;
  branches: Branch[];
  progress: number;
  maskId: string;
  sway: number;
  /** Optional SVG matrix applied to the guides, used to mirror one side onto the other. */
  transform?: string;
}> = ({ layer, branches, progress, maskId, sway, transform }) => {
  // This draws the artwork through a raw <image href>, so it has to resolve the
  // source the way LogoLayer does instead of inheriting it.
  const quality = useContext(LayerQualityContext);
  const src = sourceFor(layer.src, quality);

  // <image> inside SVG isn't tracked by Remotion, so hold the render until it loads.
  useEffect(() => {
    const handle = delayRender(`loading ${layer.id}`);
    const img = new Image();
    img.onload = img.onerror = () => continueRender(handle);
    img.src = src;
    return () => continueRender(handle);
  }, [layer.id, src]);

  return (
    <AbsoluteFill style={{ willChange: "transform" }}>
      <svg
        viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: originOf(layer, 0.5, 1),
          transform: `rotate(${sway}deg)`,
        }}
      >
        <defs>
          <filter
            id={`${maskId}-soft`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="34" />
          </filter>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <g filter={`url(#${maskId}-soft)`} transform={transform}>
              {PASSES.map((pass) =>
                branches.map((branch, i) => (
                  <Stroke
                    key={`${pass.width}-${i}`}
                    branch={branch}
                    grown={along(branch, progress, pass.lag)}
                    width={pass.width}
                  />
                )),
              )}
            </g>
          </mask>
        </defs>
        <image
          href={src}
          x={0}
          y={0}
          width={LOGO_VIEWBOX.width}
          height={LOGO_VIEWBOX.height}
          mask={`url(#${maskId})`}
        />
      </svg>
    </AbsoluteFill>
  );
};
