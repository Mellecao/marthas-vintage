import { Composition } from "remotion";
import { DURATION, MarthasLogo } from "./MarthasLogo";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MarthasLogo"
      component={MarthasLogo}
      durationInFrames={DURATION}
      fps={30}
      width={1920}
      height={1488}
    />
    {/* iPhone 17 screen, the reference frame for the site's loading screen. */}
    <Composition
      id="MarthasLogoMobile"
      component={MarthasLogo}
      durationInFrames={DURATION}
      fps={30}
      width={1206}
      height={2622}
    />
  </>
);
