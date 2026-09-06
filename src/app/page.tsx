/* eslint-disable @next/next/no-img-element */

import { DesktopHomeHero } from "@/components/desktop-home-hero";
import { DesktopEditorialSections } from "@/components/desktop-editorial-sections";
import { PhotoCarousel, RotatingBadge, ScrollRoadline, SlowMarquee } from "@/components/vintage-details";

const institutionalCopy =
  "Martha's Vintage is a personal collection of clothing, textiles, accessories and beautiful oddities, each chosen for its color, craftsmanship and unmistakable personality.";

const storyCopy =
  "I've spent most of my life noticing beautiful and unusual things, then putting them together in ways that feel personal. Long before Martha's Vintage was a business, I filled notebooks with photographs, fabrics, artwork and color combinations I wanted to remember.";

const eyesCopy =
  "I notice color first, then the details that give a piece its character: an unusual shape, fine handwork, a clever repair, or a fabric with a life of its own. I choose each piece because I can imagine how it might be worn and loved now. Clothing, textiles, art and beautiful oddities all meet here through one personal point of view. I want the collection to feel full of possibility, yet always intimate, warm and unmistakably personal and open to surprise.";

const personalIntro =
  "I've spent most of my life noticing beautiful and unusual things, then putting them together in ways that feel personal. Before Martha's Vintage was a business, I filled notebooks with photographs, fabrics, artwork and color combinations I wanted to remember. Those pages taught me to trust my eye.";

const personalCopy =
  "I never dress by decade. I mix old pieces with clothes I already love, letting each combination become my own. Surprise is part of it. Personal style is built slowly, by noticing what feels right and ignoring the rest. I love the freedom of placing an old piece beside something ordinary, elegant or a little strange. Vintage belongs in the present: not as a costume, but as color, texture and character that can become part of your own life. The best combinations still surprise me, and that is exactly why I keep looking. I hope each discovery feels less like following a rule and more like recognizing a part of yourself you had not met yet.";

function PaperTexture() {
  return (
    <>
      <span className="paper-texture" aria-hidden="true" />
      <span className="grunge-texture" aria-hidden="true" />
    </>
  );
}

function VintageImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <figure className={`vintage-image ${className}`}>
      <img src={src} alt={alt} />
      <span aria-hidden="true" />
    </figure>
  );
}

function LayeredImage({
  alt,
  className,
  layers,
}: {
  alt: string;
  className: string;
  layers: Array<{ className?: string; src: string }>;
}) {
  return (
    <figure className={`layered-image ${className}`}>
      {layers.map((layer, index) => (
        <img
          key={layer.src}
          className={layer.className}
          src={layer.src}
          alt={index === 0 ? alt : ""}
          aria-hidden={index === 0 ? undefined : true}
        />
      ))}
    </figure>
  );
}

function HeroFrame() {
  return (
    <section className="design-frame hero-frame" aria-labelledby="hero-title">
      <PaperTexture />
      <span className="hero-space hero-space-top" aria-hidden="true" />

      <div className="hero-head">
        <img
          className="hero-logo"
          src="/assets/logo/logo-marthas-fixed.svg"
          alt="Martha's Vintage"
        />
        <button className="menu-button" type="button" aria-label="Open menu">
          MENU
        </button>
      </div>

      <span className="hero-space hero-space-head" aria-hidden="true" />

      <div className="hero-stage">
        <LayeredImage
          className="hero-photo"
          alt="Woman wearing a blue vintage dress"
          layers={[
            { src: "/assets/site/hero-model.png" },
            {
              className: "blend-darken hero-photo-texture",
              src: "/assets/site/figma-current/hero-layer.png",
            },
          ]}
        />
        <img
          className="hero-butterfly"
          src="/assets/logo/logo-partes/butterfly-middleleft.svg"
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="hero-card">
        <span className="hero-card-texture" aria-hidden="true" />
        <h1 id="hero-title" className="hero-title">
          Bastrop - Texas
        </h1>
        <span className="hero-rule" aria-hidden="true" />
        <p className="hero-description">{institutionalCopy}</p>
      </div>

      <span className="hero-space hero-space-card" aria-hidden="true" />

      <a className="discover-link" href="#marthas-eyes">
        Discover the story <span aria-hidden="true">↓</span>
      </a>

      <span className="hero-space hero-space-bottom" aria-hidden="true" />
    </section>
  );
}

function EyesFrame() {
  return (
    <section
      id="marthas-eyes"
      className="design-frame eyes-frame"
      aria-labelledby="eyes-title"
    >
      <PaperTexture />
      <p className="section-kicker eyes-kicker">The Martha’s</p>
      <h2 id="eyes-title" className="display-word eyes-word">
        eyes
      </h2>
      <img className="eye-icon eye-one" src="/assets/site/eye.svg" alt="" />
      <img className="eye-icon eye-two" src="/assets/site/eye.svg" alt="" />
      <span className="eyes-rule eyes-rule-one" aria-hidden="true" />
      <span className="eyes-rule eyes-rule-two" aria-hidden="true" />

      <p className="eyes-copy-large">{eyesCopy}</p>
      <PhotoCarousel group="store" className="mobile-store-carousel" />

      <LayeredImage
        className="store-portrait"
        alt="A curated corner filled with vintage clothing, textiles and objects"
        layers={[
          { src: "/assets/site/store-portrait.png" },
          {
            className: "blend-darken",
            src: "/assets/site/figma-current/store-portrait-paper.png",
          },
          {
            className: "store-tone store-tone-portrait",
            src: "/assets/site/figma-current/store-portrait-tone.png",
          },
        ]}
      />
      <LayeredImage
        className="store-landscape"
        alt="Vintage collection arranged inside Martha's shop"
        layers={[
          { src: "/assets/site/store-landscape.png" },
          {
            className: "blend-darken",
            src: "/assets/site/figma-current/store-landscape-paper.png",
          },
          {
            className: "store-tone store-tone-landscape",
            src: "/assets/site/figma-current/store-landscape-tone.png",
          },
        ]}
      />

      <p className="section-kicker collection-kicker">The</p>
      <h2 className="display-word collection-word">collection</h2>
    </section>
  );
}

function CollectionFrame() {
  return (
    <section className="design-frame collection-frame" aria-label="The collection">
      <PaperTexture />
      <PhotoCarousel group="collection" className="mobile-collection-carousel" />
      <figure
        className="collection-photo"
        aria-label="Two mannequins displaying vintage eveningwear"
      >
        <img
          className="collection-layer collection-layer-one"
          src="/assets/site/figma-current/collection-layer-1.png"
          alt=""
        />
        <img
          className="collection-layer collection-layer-two"
          src="/assets/site/figma-current/collection-layer-2.png"
          alt=""
        />
        <img
          className="collection-layer collection-layer-three"
          src="/assets/site/figma-current/collection-layer-3.png"
          alt=""
        />
        <img
          className="collection-layer collection-layer-four"
          src="/assets/site/figma-current/collection-layer-4.png"
          alt=""
        />
        <span className="collection-base-layer">
          <img src="/assets/site/collection-mannequins.png" alt="" />
          <img
            className="collection-lighten"
            src="/assets/site/grunge.png"
            alt=""
          />
        </span>
      </figure>
      <h2 className="editorial-heading collection-heading">
        It began with noticing.
      </h2>
      <p className="collection-copy">{storyCopy}</p>

      <div className="marquee"><SlowMarquee /></div>

      <h2 className="personal-lockup">
        <img src="/assets/site/personalstyle2.svg" alt="Personal style" />
      </h2>
    </section>
  );
}

function PersonalFrame() {
  return (
    <section className="design-frame personal-frame" aria-labelledby="personal-title">
      <PaperTexture />
      <span className="personal-frame-border" aria-hidden="true" />
      <p className="personal-caption personal-caption-left">
        martha’s vintage culture
      </p>
      <p className="personal-caption personal-caption-right">
        Bastrop / Texas - 1997
      </p>
      <p className="personal-copy-left">{personalIntro}</p>
      <PhotoCarousel group="personal" className="mobile-personal-carousel" />
      <VintageImage
        className="personal-main"
        src="/assets/site/personal-main.png"
        alt="Woman styling a checked vintage suit"
      />

      <h2 id="personal-title" className="editorial-heading personal-heading">
        It began with noticing.
      </h2>

      <VintageImage
        className="personal-hat"
        src="/assets/site/personal-hat.png"
        alt="Woman wearing a hat and patterned vintage outfit"
      />
      <VintageImage
        className="personal-silver"
        src="/assets/site/personal-silver.png"
        alt="Woman wearing a silver vintage evening dress"
      />

      <p className="personal-copy-flow">
        <span className="personal-flow-gap-left" aria-hidden="true" />
        <span className="personal-flow-gap-right" aria-hidden="true" />
        {personalCopy}
      </p>

      <img
        className="wardrobe-composite"
        src="/assets/SVG/wardrobe.svg"
        alt="Beyond the wardrobe"
      />
    </section>
  );
}

function BeyondFrame() {
  return (
    <section id="beyond" className="design-frame beyond-frame" aria-labelledby="beyond-title">
      <PaperTexture />
      <PhotoCarousel group="beyond" className="mobile-beyond-carousel" />
      <VintageImage
        className="beyond-room"
        src="/assets/site/beyond-room.jpeg"
        alt="Vintage bedroom with needlework, textiles and framed art"
      />
      <span className="beyond-room-frame" aria-hidden="true" />
      <h2 id="beyond-title" className="beyond-heading">
        Clothing, art and interiors belong
        <br />
        in the same conversation.
      </h2>
      <p className="beyond-copy">
        To me, a piece of clothing never exists on its own. A painting can suggest
        a color palette. A room can change the way I see a dress. A piece of
        embroidery can inspire an entire arrangement. Martha&apos;s Vintage is a
        place for those connections, and for the beautiful things that do not fit
        neatly inside a wardrobe.
      </p>
      <VintageImage
        className="beyond-art"
        src="/assets/site/beyond-art.jpeg"
        alt="Two framed vintage needlepoint portraits"
      />
    </section>
  );
}

function VisitFooter() {
  return (
    <footer id="visit" className="visit-footer">
      <div className="visit-image" aria-hidden="true">
        <img src="/assets/site/store-landscape.png" alt="" />
        <span className="visit-image-wash" />
      </div>

      <div className="visit-invitation">
        <p className="visit-eyebrow">Bastrop, Texas</p>
        <h2 className="visit-title">
          Want to meet us
          <br />
          in person?
        </h2>
        <a className="visit-link" href="#visit">
          Schedule a visit <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="footer-bottom">
        <img
          className="footer-logo"
          src="/assets/logo/logo-somente-lettering-reto.svg"
          alt="Martha's Vintage"
        />
        <p className="footer-location">Bastrop, Texas</p>
        <p className="footer-note">Vintage clothing, textiles, art &amp; beautiful oddities.</p>
        <p className="footer-copyright">© {new Date().getFullYear()} Martha&apos;s Vintage</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <DesktopHomeHero />
      <DesktopEditorialSections />
      <div className="legacy-content">
        <HeroFrame />
        <div className="legacy-below-hero">
        <ScrollRoadline />
        <EyesFrame />
        <CollectionFrame />
        <PersonalFrame />
        <BeyondFrame />
        <div className="mobile-badge"><RotatingBadge /></div>
        <VisitFooter />
        </div>
      </div>
    </main>
  );
}
