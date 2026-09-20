import { DesktopHomeHero } from "@/components/desktop-home-hero";
import { PhoneHomeHero } from "./phone-home-hero";

const HERO = "/assets/site/textile-cargo/hero.png";
const HERO_ALT =
  "A sunlit wall displaying vintage garments, needlework, woven baskets and a styled mannequin";

export function PreservedHomeHero() {
  return (
    <div className="site-shell" data-preserved-home-hero>
      <DesktopHomeHero imageSrc={HERO} imageAlt={HERO_ALT} />

      <div className="legacy-content">
        <PhoneHomeHero imageSrc={HERO} imageAlt={HERO_ALT} />
      </div>
    </div>
  );
}
