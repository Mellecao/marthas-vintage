/* eslint-disable @next/next/no-img-element */

import { MobileMenu } from "@/components/mobile-menu";
import styles from "./textile-cargo.module.css";

const MARTHAS = "/assets/site/desktop-home/marthas-word.svg";
const VINTAGE = "/assets/site/desktop-home/vintage-word.svg";
const FIXED_LOGO = "/assets/logo/logo-marthas-fixed.svg";
const BUTTERFLY = "/assets/logo/logo-partes/butterfly-middleleft.svg";

/** The desktop's four, for the tablet band where they fit without a panel. */
const TABLET_NAV = [
  { href: "#mobile-home", label: "Home" },
  { href: "#desktop-beyond", label: "Beyond the wardrobe" },
  { href: "#marthas-eyes", label: "The martha’s eyes" },
  { href: "#desktop-contact", label: "Contact" },
];

type PhoneHomeHeroProps = {
  imageSrc: string;
  imageAlt: string;
};

/**
 * The phone's opening screen, built from the desktop hero rather than beside
 * it: the same split wordmark, the same photo, the same paper crust and the
 * same closing line. What it drops is the choreography — the desktop pins the
 * hero and flies the lettering up into a menu bar, which is a scroll budget a
 * phone should not spend. Here the parts simply stack in reading order.
 */
export function PhoneHomeHero({ imageSrc, imageAlt }: PhoneHomeHeroProps) {
  return (
    <section
      id="mobile-home"
      className={styles.phoneHero}
      aria-labelledby="phone-hero-title"
    >
      <span className={styles.phonePaper} aria-hidden="true" />
      <span className={styles.phoneGrunge} aria-hidden="true" />

      <h1 id="phone-hero-title" className="sr-only">
        Martha&apos;s Vintage
      </h1>

      <div className={styles.phoneHeroHead}>
        <img
          className={styles.phoneMarthas}
          src={MARTHAS}
          alt=""
          aria-hidden="true"
        />
        <img
          className={styles.phoneFixedLogo}
          data-phone-fixed-logo=""
          src={FIXED_LOGO}
          alt=""
          aria-hidden="true"
        />
        <MobileMenu />
      </div>

      {/* Under 768px the menu is the panel behind the MENU button; from there
          to the desktop breakpoint there is room to simply show the links,
          which is also closer to the desktop's own standing nav. */}
      <nav className={styles.phoneNav} aria-label="Primary navigation">
        {TABLET_NAV.map((item) => (
          <a key={item.href} href={item.href}>
            <span>{item.label}</span>
            <span className={styles.phoneNavLeader} aria-hidden="true">
              {"· ".repeat(18)}
            </span>
          </a>
        ))}
      </nav>

      <figure className={styles.phoneHeroStage}>
        <img className={styles.phoneHeroPhoto} src={imageSrc} alt={imageAlt} />
        <img
          className={styles.phoneButterfly}
          src={BUTTERFLY}
          alt=""
          aria-hidden="true"
        />
      </figure>

      <img
        className={styles.phoneVintage}
        src={VINTAGE}
        alt=""
        aria-hidden="true"
      />

      <p className={styles.phoneLead}>
        Martha&apos;s Vintage is a personal collection of clothing, textiles and
        beautiful oddities, each chosen for its color, craftsmanship and
        unmistakable personality.
      </p>

      <span className={styles.phoneRule} aria-hidden="true" />

      <a className={styles.phoneDiscover} href="#marthas-eyes">
        Discover the story <span className="ios-safe-arrow ios-safe-arrow-down" aria-hidden="true" />
      </a>
    </section>
  );
}
