/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { SlowMarquee, RotatingBadge } from "./vintage-details";
import styles from "./desktop-editorial-sections.module.css";

function SectionStamp({ side, caption }: { side: "left" | "right"; caption: string }) {
  return (
    <div className={`${styles.stamp} ${side === "left" ? styles.stampLeft : styles.stampRight}`}>
      <RotatingBadge />
      <p className={styles.stampCaption}>{caption}</p>
    </div>
  );
}

function EditorialPhoto({
  src, alt, caption, className = "", sizes,
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  sizes: string;
}) {
  return (
    <figure className={`${styles.photo} ${className}`}>
      <div className={styles.photoFrame}>
        <Image src={src} alt={alt} fill sizes={sizes} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function DesktopEditorialSections() {
  return (
    <div className={styles.journal} data-desktop-editorial aria-label="The world of Martha's Vintage">
      <div className={styles.pages}>
        <section id="desktop-marthas-eyes" className={styles.story} aria-labelledby="editorial-story-title">
          <SectionStamp side="right" caption="Bastrop, Texas · A personal collection" />
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Through Martha’s eye</p>
            <h2 id="editorial-story-title" className={styles.sectionHeading}>An eye for the <em>extraordinary.</em></h2>
            <p className={styles.sectionNote}>Some things simply ask you to look a little closer.</p>
          </header>
          <div className={styles.sectionGrid}>
            <div className={styles.gridCopy}>
              <p className={styles.dropCap}>I notice color first. Then the details: an unusual shape, fine handwork, a clever repair, or a fabric with a life of its own.</p>
              <p>Martha’s Vintage brings together clothing, textiles and beautiful oddities, each chosen for its character and the way it might be worn and loved now.</p>
              <p><em>A collection with a point of view.</em> And a person behind it.</p>
            </div>
            <EditorialPhoto
              src="/assets/site/photos/store_1.jpg"
              alt="Sunlight falling over clothing racks, collected objects and a red rug in Martha’s shop"
              caption="Fig. 01 — A little world of color, texture and possibility."
              sizes="(min-width: 1600px) 600px, 42vw"
            />
          </div>
        </section>

        <section id="desktop-collection" className={styles.collection} aria-labelledby="editorial-collection-title">
          <SectionStamp side="left" caption="Clothing · Textiles · Beautiful oddities" />
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Notes on collecting</p>
            <h2 id="editorial-collection-title" className={styles.sectionHeading}>Curated,<br /><em>not accumulated.</em></h2>
            <p className={styles.sectionNote}>Beautiful things, gathered slowly. Chosen with instinct. Kept for their character.</p>
          </header>
          <div className={styles.sectionGrid}>
            <EditorialPhoto
              src="/assets/site/photos/look1_1.png"
              alt="A vintage look combining a burgundy beret, paisley top and plum skirt"
              caption="Look 01 — A little drama. A lot of personality."
              sizes="(min-width: 1600px) 500px, 35vw"
            />
            <div className={styles.gridCopy}>
              <h3>It began<br />with noticing.</h3>
              <p>Long before Martha’s Vintage was a business, I filled notebooks with photographs, fabrics, artwork and color combinations I wanted to remember.</p>
              <p>Those pages taught me to trust my eye. The collection still grows that way: one thoughtful discovery at a time.</p>
              <a className={styles.textLink} href="#desktop-beyond">There’s more to the story <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className={styles.sectionGrid}>
            <div className={styles.gridCopy}>
              <h3>No rules.<br /><em>Just instinct.</em></h3>
              <p>I never dress by decade. I mix old pieces with clothes I already love, letting each combination become my own. Vintage belongs in the present.</p>
            </div>
            <EditorialPhoto
              src="/assets/site/photos/look1_4.jpg"
              alt="A striped pink and black blazer paired with a floral skirt"
              caption="Look 02 — Stripes meet florals. An unexpected friendship."
              sizes="(min-width: 1600px) 500px, 35vw"
            />
          </div>
        </section>

        <aside className={styles.interlude} aria-label="A note on personal style">
          <p className={styles.eyebrow}>A note on personal style</p>
          <p className={styles.interludePhrase}>Old soul. <em>Entirely your own.</em></p>
          <RotatingBadge />
        </aside>

        <section id="desktop-beyond" className={styles.beyond} aria-labelledby="editorial-beyond-title">
          <SectionStamp side="right" caption="The art of living with what you love" />
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>At home with Martha</p>
            <h2 id="editorial-beyond-title" className={styles.sectionHeading}>A way of dressing.<br /><em>A way of seeing.</em></h2>
            <p className={styles.sectionNote}>Clothing, art and interiors belong in the same conversation.</p>
          </header>
          <div className={styles.sectionGrid}>
            <EditorialPhoto
              src="/assets/site/photos/beyondthewardrobe_3.jpg"
              alt="Patterned curtains framing a yellow room filled with artwork, rugs and vintage furniture"
              caption="Fig. 02 — Pattern upon pattern. A room with a life of its own."
              sizes="(min-width: 1600px) 560px, 42vw"
            />
            <div className={styles.gridCopy}>
              <h3>Beauty doesn’t<br />stay in one place.</h3>
              <p>A painting can suggest a color palette. A room can change the way I see a dress. A piece of embroidery can inspire an entire arrangement.</p>
              <p>This is a place for those connections, and for the beautiful things that do not fit neatly inside a wardrobe.</p>
              <EditorialPhoto
                className={styles.photoSmall}
                src="/assets/site/photos/beyondthewardrobe_6.jpg"
                alt="Two framed vintage needlepoint portraits"
                caption="Fig. 03 — Small things, lovingly made."
                sizes="(min-width: 1600px) 320px, 24vw"
              />
            </div>
          </div>
        </section>
      </div>

      <div className={styles.marqueeBand}>
        <SlowMarquee />
      </div>

      <footer id="desktop-contact" className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.visitHeading}>
            <p className={styles.eyebrow}>From these pages to real life</p>
            <h2>Come for a look.<br /><em>Stay for the stories.</em></h2>
          </div>
          <div className={styles.visitDetails}>
            <p className={styles.eyebrow}>Martha’s Vintage · Bastrop, Texas</p>
            <p>Clothing to fall for. Objects to wonder about. A personal collection with a little room for the unexpected.</p>
            <a className={styles.visitLink} href="https://www.google.com/maps/search/?api=1&query=Martha%27s%20Vintage%20Bastrop%20Texas" target="_blank" rel="noopener noreferrer">Explore Bastrop on Maps <span aria-hidden="true">↗</span></a>
          </div>
          <div className={styles.footerBottom}>
            <img src="/assets/logo/logo-somente-lettering-reto.svg" alt="Martha's Vintage" />
            <p>© {new Date().getFullYear()} Martha’s Vintage</p>
            <a href="#desktop-home">Back to the beginning <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
