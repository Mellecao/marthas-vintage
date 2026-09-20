import { AbsoluteFill, Img } from "remotion";
import { createContext, useContext, type CSSProperties } from "react";
import type { Layer } from "./layers";

/**
 * The raster parts are 2220px wide — right for a desktop screen and for the
 * offline render, and about six times more bytes than a phone can use. On a
 * phone the loader asks Next's image optimiser for an 828px WebP of the same
 * file instead: same artwork, a fraction of the payload, nothing new to build
 * or commit. "full" is the only option outside the browser, where there is no
 * optimiser to ask.
 */
export type LayerQuality = "full" | "compact";

export const COMPACT_WIDTH = 828;

export const compactSrc = (src: string) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${COMPACT_WIDTH}&q=75`;

export const sourceFor = (src: string, quality: LayerQuality) =>
  quality === "compact" ? compactSrc(src) : src;

export const LayerQualityContext = createContext<LayerQuality>("full");

export const LogoLayer: React.FC<{
  layer: Layer;
  style?: CSSProperties;
}> = ({ layer, style }) => {
  const quality = useContext(LayerQualityContext);
  return (
    <AbsoluteFill style={{ ...style, willChange: "transform, opacity" }}>
      <Img
        src={sourceFor(layer.src, quality)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </AbsoluteFill>
  );
};
