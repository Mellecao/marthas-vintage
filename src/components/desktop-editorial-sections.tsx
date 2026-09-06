/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { SlowMarquee, RotatingBadge } from "./vintage-details";
import { DesktopCarousel, type CarouselPhoto } from "./desktop-carousel";
import styles from "./desktop-editorial-sections.module.css";

const LOOKS: CarouselPhoto[] = [
  { src: "/assets/site/photos/look1_1.png", alt: "A burgundy beret worn with a paisley top and plum skirt", caption: "Beret, paisley, plum. A little drama." },
  { src: "/assets/site/photos/look1_2.jpg", alt: "A red patterned vintage dress", caption: "Red, patterned, impossible to ignore." },
  { src: "/assets/site/photos/look1_3.jpg", alt: "A white top and long patterned skirt worn with a hat", caption: "A hat changes the whole sentence." },
  { src: "/assets/site/photos/look1_4.jpg", alt: "A striped pink and black blazer paired with a floral skirt", caption: "Stripes meet florals. An unexpected friendship." },
  { src: "/assets/site/photos/look1_5.jpg", alt: "A dark jacket layered over a floral skirt", caption: "Tailoring layered over something softer." },
  { src: "/assets/site/photos/look1_6.jpg", alt: "A white shirt, floral skirt and straw hat", caption: "Plain shirt, extraordinary skirt." },
  { src: "/assets/site/photos/look1_7.jpg", alt: "A bright floral top worn with a patterned skirt", caption: "Pattern on pattern, on purpose." },
  { src: "/assets/site/photos/look1_8.jpg", alt: "A black tailored jacket with a floral skirt", caption: "Sharp shoulders, generous hem." },
  { src: "/assets/site/photos/look1_9.jpg", alt: "A long dark patterned vintage dress", caption: "One piece that does all the talking." },
  { src: "/assets/site/photos/look2_1.jpg", alt: "A hat, layered jewelry and a colorful patterned skirt", caption: "Layered jewelry, collected slowly." },
  { src: "/assets/site/photos/look2_2.jpg", alt: "A pale draped vintage evening dress", caption: "Draped, pale, quietly theatrical." },
  { src: "/assets/site/photos/look2_3.jpg", alt: "Floral clothing styled with a scarf and jewelry", caption: "A scarf is never just a scarf." },
  { src: "/assets/site/photos/look2_4.jpg", alt: "The embroidered back of a vintage garment", caption: "Handwork, hidden at the back." },
];

const BEYOND: CarouselPhoto[] = [
  { src: "/assets/site/photos/beyondthewardrobe_3.jpg", alt: "Patterned curtains framing a yellow room filled with artwork and rugs", caption: "Pattern upon pattern. A room with its own life." },
  { src: "/assets/site/photos/beyondthewardrobe_1.jpg", alt: "Framed artwork arranged above a table of collected objects", caption: "Artwork arranged the way a wardrobe is." },
  { src: "/assets/site/photos/beyondthewardrobe_2.jpg", alt: "Colorful embroidery and textiles beside a bright window", caption: "Embroidery that suggests a palette." },
  { src: "/assets/site/photos/beyondthewardrobe_4.jpg", alt: "Vintage furniture, artwork and layered rugs", caption: "Furniture, rugs and a great deal of color." },
  { src: "/assets/site/photos/beyondthewardrobe_5.jpg", alt: "Handworked textiles arranged beside a window", caption: "Textiles worth keeping where you can see them." },
  { src: "/assets/site/photos/beyondthewardrobe_6.jpg", alt: "Two framed vintage needlepoint portraits", caption: "Small things, lovingly made." },
  { src: "/assets/site/photos/quadros.png", alt: "A pair of gilt-framed needlepoint portraits shown side by side", caption: "A pair, in their original gilt frames." },
];

const SHOP = [
  { src: "/assets/site/photos/store_1.jpg", alt: "Clothing racks, collected objects and a red rug in Martha's sunlit shop", caption: "The rack, arranged like a life." },
  { src: "/assets/site/photos/store_2.jpg", alt: "Clothing racks beside a table of vintage objects", caption: "Clothing and objects, kept together." },
  { src: "/assets/site/photos/store_3.jpg", alt: "Hats, handbags and beautiful oddities gathered in the shop", caption: "Hats, bags and beautiful oddities." },
];

export function DesktopEditorialSections() {
  return (
    <div className={styles.journal} data-desktop-editorial aria-label="The world of Martha's Vintage">
      <section id="desktop-marthas-eyes" className={styles.story} aria-labelledby="journal-story-title">
        <div className={styles.shell}>
          <p className={styles.kicker}>Chapter One · The story</p>
          <h2 id="journal-story-title" className={styles.display}>
            Noticing beautiful and<br />
            <em>unusual things.</em>
          </h2>

          <div className={styles.storyGrid}>
            <div>
              <p className={styles.lede}>
                Martha&apos;s Vintage grew out of something I&apos;ve done most of my life: noticing beautiful
                and unusual things, then putting them together in ways that feel personal.
              </p>
              <div className={`${styles.storyColumns} ${styles.prose}`}>
                <p>
                  I&apos;ve always been drawn to color, textiles, art, clothing and interiors — and especially
                  to things that carry some history, craftsmanship or personality.
                </p>
                <p>
                  Long before I thought of any of this as a business, I collected images from magazines,
                  artwork, photographs, fabrics and color combinations that inspired me. I kept notebooks
                  full of them, and used them as inspiration for the things I made and the way I dressed
                  and decorated.
                </p>
                <p>
                  Eventually Pinterest replaced the notebooks, but the instinct has never changed. I can see
                  a painting, a room, a photograph or an unexpected combination of colors, and immediately
                  begin imagining clothing and objects around it.
                </p>
              </div>
            </div>

            <figure className={styles.portrait}>
              <div className={`${styles.frame} ${styles.portraitFrame}`}>
                <Image
                  src="/assets/site/martha-portrait.webp"
                  alt="Martha, wearing a white crochet and lace top, standing against a painted brick wall"
                  fill
                  sizes="(min-width: 1600px) 560px, 36vw"
                  priority
                />
              </div>
              <span className={`${styles.seal} ${styles.paperSheet} ${styles.sealLeft}`} aria-hidden="true">
                <RotatingBadge />
              </span>
              <figcaption className={`${styles.portraitCaption} ${styles.caption}`}>
                <span>Martha, in her own vintage</span>
                <span>Bastrop, Texas</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <aside className={`${styles.quote} ${styles.bandRust}`} aria-label="Martha's Vintage in one line">
        <div className={styles.shell}>
          <div className={styles.quoteInner}>
            <img src="/assets/site/eye.svg" alt="" aria-hidden="true" />
            <blockquote className={styles.quoteText}>
              Beautiful things with a past, chosen for the life they can have <em>now.</em>
            </blockquote>
          </div>
        </div>
      </aside>

      <section id="desktop-collection" className={styles.collection} aria-labelledby="journal-collection-title">
        <div className={styles.shell}>
          <p className={styles.kicker}>Chapter Two · The collection</p>
          <h2 id="journal-collection-title" className={styles.display}>
            Curated, <em>not accumulated.</em>
          </h2>
          <div className={styles.introProse}>
            <p>
              I&apos;m not interested in vintage simply because something is old, or because a certain label
              makes it valuable. I&apos;m interested in the pieces that make me stop and look — beautiful
              color, unusual shape, embroidery, crochet, appliqué, wonderful construction, folk influences,
              handmade details, or just something with an indefinable personality.
            </p>
            <p>
              There may be pieces from many different decades and styles, but they belong together because
              they have a point of view. I love the idea of a rack of clothing looking almost like
              somebody&apos;s fascinating life, rather than merchandise arranged in a store.
            </p>
          </div>
        </div>

        <div className={styles.carouselWrap}>
          <span className={`${styles.seal} ${styles.paperSheet}`} aria-hidden="true">
            <RotatingBadge />
          </span>
          <DesktopCarousel photos={LOOKS} label="Pieces from the collection" />
        </div>
      </section>

      <section id="desktop-style" className={`${styles.style} ${styles.bandRust}`} aria-labelledby="journal-style-title">
        <div className={styles.shell}>
          <p className={styles.kicker}>Chapter Three · Personal style</p>
          <h2 id="journal-style-title" className={styles.display}>
            Worn now. <em>Never as costume.</em>
          </h2>
          <div className={styles.introProse}>
            <p>
              I especially like vintage that can be worn in a modern, individual way. The best pieces
              don&apos;t ask you to recreate the decade they came from — they can be mixed with what you
              already own and become part of your own style.
            </p>
            <p>
              I&apos;m much more interested in personal style than fashion, and in people wearing things
              because they genuinely love them, rather than because someone told them they were fashionable.
            </p>
          </div>

          <div className={styles.styleRow}>
            {SHOP.map((photo) => (
              <figure key={photo.src} className={styles.styleFigure}>
                <div className={styles.frame}>
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1600px) 470px, 31vw" />
                </div>
                <figcaption className={styles.caption}>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="desktop-beyond" className={`${styles.beyond} ${styles.bandOlive}`} aria-labelledby="journal-beyond-title">
        <div className={styles.shell}>
          <p className={styles.kicker}>Chapter Four · Beyond the wardrobe</p>
          <h2 id="journal-beyond-title" className={styles.display}>
            Everything speaks the <em>same language.</em>
          </h2>
          <div className={styles.introProse}>
            <p>
              Martha&apos;s Vintage is about more than clothing. Art, textiles, objects, interiors and
              clothing all speak the same visual language to me. A painting can suggest a palette, a room
              can change the way I see a dress, a piece of embroidery can set off an entire arrangement.
            </p>
            <p>
              I&apos;d love for this website and for future events to reflect that — vintage pieces shown
              alongside art, interesting objects and unexpected sources of color and inspiration.
            </p>
          </div>
        </div>

        <div className={styles.carouselWrap}>
          <DesktopCarousel photos={BEYOND} label="Art, objects and interiors" tone="cream" />
        </div>
      </section>

      <section id="desktop-vision" className={`${styles.vision} ${styles.bandInk}`} aria-labelledby="journal-vision-title">
        <div className={styles.shell}>
          <p className={styles.kicker}>Chapter Five · The vision</p>
          <h2 id="journal-vision-title" className={styles.visionStatement}>
            Joyful, a little eccentric, and <em>very human.</em>
          </h2>

          <div className={`${styles.visionColumns} ${styles.prose}`}>
            <div>
              <h3 className={styles.displaySmall}>Personal, not conventional</h3>
              <p>
                I don&apos;t want Martha&apos;s Vintage to become a big conventional retail business. I want
                it to stay personal, creative and manageable — something that gives me room to collect,
                curate, style and share beautiful things.
              </p>
            </div>
            <div>
              <h3 className={styles.displaySmall}>Made with others</h3>
              <p>
                Working alongside other creative people matters to me. Collaborations, pop-ups and small
                events feel like a natural extension of the same idea, and they keep the collection moving.
              </p>
            </div>
            <div>
              <h3 className={styles.displaySmall}>A second look</h3>
              <p>
                More than anything, I want people to discover something they wouldn&apos;t necessarily have
                thought to look for, put it on, and suddenly see themselves differently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.marqueeBand}>
        <SlowMarquee />
      </div>

      <footer id="desktop-contact" className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerTop}>
            <div>
              <p className={styles.kicker}>From these pages to real life</p>
              <h2>
                Come and see it<br />
                <em>in person.</em>
              </h2>
            </div>
            <div className={styles.prose}>
              <p>
                Martha&apos;s Vintage is a personal collection of clothing, textiles and beautiful oddities
                in Bastrop, Texas — gathered slowly, chosen with instinct, and kept for their character.
              </p>
              <a
                className={styles.visitLink}
                href="https://www.google.com/maps/search/?api=1&query=Martha%27s%20Vintage%20Bastrop%20Texas"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find us in Bastrop <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <img src="/assets/logo/logo-somente-lettering-reto.svg" alt="Martha's Vintage" />
            <p>© {new Date().getFullYear()} Martha&apos;s Vintage · Bastrop, Texas</p>
            <a href="#desktop-home">Back to the beginning <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
