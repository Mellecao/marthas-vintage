import { AbsoluteFill, Img } from "remotion";
import type { CSSProperties } from "react";
import type { Layer } from "./layers";

export const LogoLayer: React.FC<{
  layer: Layer;
  style?: CSSProperties;
}> = ({ layer, style }) => (
  <AbsoluteFill style={{ ...style, willChange: "transform, opacity" }}>
    <Img
      src={layer.src}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  </AbsoluteFill>
);
