/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import styles from "./desktop-editorial-sections.module.css";

function SectionLine({ number, title, note }: { number: string; title: string; note: string }) {
  return (
    <div className={styles.sectionLine}>
      <p><span>{number}</span> {title}</p>
      <p>{note}</p>
    </div>
  );
}

function EditorialPhoto({
  src, alt, caption, number, className = "", sizes,
}: {
  src: string;
  alt: string;
  caption: string;
  number: string;
  className?: string;
  sizes: string;
}) {
  return (
    <figure className={`${styles.photo} ${className}`}>
      <div className={styles.photoFrame}>
        <Image src={src} alt={alt} fill sizes={sizes} />
      </div>
      <figcaption><span>{number}</span>{caption}</figcaption>
    </figure>
  );
}

export function DesktopEditorialSections() {
  return (
    <div className={styles.journal} data-desktop-editorial aria-label="The world of Martha's Vintage">
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#desktop-home" aria-label="Martha's Vintage — back to top">
            <img src="/assets/logo/logo-somente-lettering-reto.svg" alt="Martha's Vintage" />
          </a>
          <nav aria-label="Explore Martha's Vintage">
            <a href="#desktop-marthas-eyes">Martha’s eye</a>
            <a href="#desktop-collection">The collection</a>
            <a href="#desktop-beyond">Beyond the wardrobe</a>
            <a href="#desktop-contact">Visit us <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </header>

      <div className={styles.pages}>
        <section id="desktop-marthas-eyes" className={styles.story} aria-labelledby="editorial-story-title">
          <SectionLine number="01" title="A particular point of view" note="Bastrop, Texas · A personal collection" />
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <p className={styles.eyebrow}>Through Martha’s eye</p>
              <h2 id="editorial-story-title" className={styles.storyTitle}>An eye for the <em>extraordinary.</em></h2>
              <p className={styles.standfirst}>Some things simply ask you to look a little closer.</p>
              <div className={styles.storyColumns}>
                <p className={styles.dropCap}>I notice color first. Then the details: an unusual shape, fine handwork, a clever repair, or a fabric with a life of its own.</p>
                <p>Martha’s Vintage brings together clothing, textiles and beautiful oddities, each chosen for its character and the way it might be worn and loved now.</p>
              </div>
              <div className={styles.signature}>
                <div><span>A collection with a point of view.</span><p>And a person behind it.</p></div>
                <img src="/assets/site/eye.svg" alt="" aria-hidden="true" />
              </div>
            </div>
            <EditorialPhoto
              className={styles.storyPhoto}
              src="/assets/site/photos/store_1.jpg"
              alt="Sunlight falling over clothing racks, collected objects and a red rug in Martha’s shop"
              number="Fig. 01"
              caption="A little world of color, texture and possibility."
              sizes="(min-width: 1600px) 650px, 47vw"
            />
          </div>
        </section>

        <section id="desktop-collection" className={styles.collection} aria-labelledby="editorial-collection-title">
          <SectionLine number="02" title="The collection" note="Clothing · Textiles · Beautiful oddities" />
          <div className={styles.collectionHeading}>
            <h2 id="editorial-collection-title">Curated,<br /><em>not accumulated.</em></h2>
            <p>Beautiful things, gathered slowly.<br />Chosen with instinct. Kept for their character.</p>
          </div>
          <div className={styles.collectionGrid}>
            <div className={styles.collectionNotes}>
              <p className={styles.eyebrow}>Notes on collecting</p>
              <h3>It began<br />with noticing.</h3>
              <p>Long before Martha’s Vintage was a business, I filled notebooks with photographs, fabrics, artwork and color combinations I wanted to remember.</p>
              <p>Those pages taught me to trust my eye. The collection still grows that way: one thoughtful discovery at a time.</p>
              <a className={styles.textLink} href="#desktop-beyond">There’s more to the story <span aria-hidden="true">↗</span></a>
              <div className={styles.collectorsNote}>
                <span className={styles.eyebrow}>The common thread</span>
                <p>Color.<br />Craftsmanship.<br /><em>Character.</em></p>
              </div>
            </div>
            <EditorialPhoto
              className={styles.collectionMain}
              src="/assets/site/photos/look1_1.jpg"
              alt="A vintage look combining a burgundy beret, paisley top and plum skirt"
              number="Look 01"
              caption="A little drama. A lot of personality."
              sizes="(min-width: 1600px) 490px, 35vw"
            />
            <div className={styles.collectionAside}>
              <EditorialPhoto
                src="/assets/site/photos/look1_4.jpg"
                alt="A striped pink and black blazer paired with a floral skirt"
                number="Look 02"
                caption="Stripes meet florals. An unexpected friendship."
                sizes="(min-width: 1600px) 370px, 26vw"
              />
              <h3>No rules.<br /><em>Just instinct.</em></h3>
              <p>I never dress by decade. I mix old pieces with clothes I already love, letting each combination become my own. Vintage belongs in the present.</p>
            </div>
          </div>
        </section>

        <aside className={styles.interlude} aria-label="A note on personal style">
          <p className={styles.eyebrow}>A note on personal style</p>
          <p>Old soul. <em>Entirely your own.</em></p>
          <img src="/assets/logo/logo-partes/butterfly-middleleft.svg" alt="" aria-hidden="true" />
        </aside>

        <section id="desktop-beyond" className={styles.beyond} aria-labelledby="editorial-beyond-title">
          <SectionLine number="03" title="Beyond the wardrobe" note="The art of living with what you love" />
          <div className={styles.beyondHeading}>
            <h2 id="editorial-beyond-title">A way of dressing.<br /><em>A way of seeing.</em></h2>
            <p>Clothing, art and interiors belong<br />in the same conversation.</p>
          </div>
          <div className={styles.beyondGrid}>
            <EditorialPhoto
              className={styles.roomPhoto}
              src="/assets/site/photos/beyondthewardrobe_3.jpg"
              alt="Patterned curtains framing a yellow room filled with artwork, rugs and vintage furniture"
              number="Fig. 02"
              caption="Pattern upon pattern. A room with a life of its own."
              sizes="(min-width: 1600px) 610px, 44vw"
            />
            <div className={styles.beyondCopy}>
              <p className={styles.eyebrow}>At home with Martha</p>
              <h3>Beauty doesn’t<br />stay in one place.</h3>
              <p>A painting can suggest a color palette. A room can change the way I see a dress. A piece of embroidery can inspire an entire arrangement.</p>
              <p>This is a place for those connections, and for the beautiful things that do not fit neatly inside a wardrobe.</p>
              <EditorialPhoto
                className={styles.detailPhoto}
                src="/assets/site/photos/beyondthewardrobe_5.jpg"
                alt="Colorful vintage embroidery displayed on a wooden ladder beside a basket of textiles"
                number="Fig. 03"
                caption="Small things, lovingly made."
                sizes="(min-width: 1600px) 440px, 32vw"
              />
            </div>
          </div>
        </section>
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
