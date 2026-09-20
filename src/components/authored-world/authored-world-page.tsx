import Image from "next/image";
import { RotatingBadge, SlowMarquee } from "@/components/vintage-details";
import { MarthaBento } from "./martha-bento";
import { ObjectGallery } from "./object-gallery";
import { PreservedHomeHero } from "./preserved-home-hero";
import { StoryChapters } from "./story-chapters";
import { TextileOutline } from "./stitch-outline";
import styles from "./textile-cargo.module.css";

export function AuthoredWorldPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#direction-main">Skip to content</a>
      <PreservedHomeHero />

      <span
        className={styles.fixedPaperTexture}
        data-fixed-paper-texture=""
        aria-hidden="true"
      />

      <span
        className={`${styles.fixedTexture} ${styles.fixedNeedlepoint}`}
        data-fixed-texture="needlepoint"
        aria-hidden="true"
      />
      <span
        className={`${styles.fixedTexture} ${styles.fixedEmbroidery}`}
        data-fixed-texture="embroidery"
        aria-hidden="true"
      />

      <main id="direction-main">
        <MarthaBento />

        <section className={styles.storeSection} aria-labelledby="store-photo-title">
          <figure className={styles.storeFigure}>
            <div className={styles.storeCrop}>
              <Image
                src="/assets/site/textile-cargo/portraits/store-corner.jpg"
                alt="A sunlit corner of the shop with hanging dresses, a needlepoint rose and woven baskets"
                fill
                sizes="(min-width: 1024px) 84vw, 100vw"
                quality={90}
              />
            </div>
            <TextileOutline variant="a" />
            <span className={styles.storeSeal} aria-hidden="true">
              <RotatingBadge />
            </span>
            <figcaption className={styles.storeCaption}>
              <p className={styles.eyebrow}>Inside the shop</p>
              <h2 id="store-photo-title">Every corner has something to say.</h2>
            </figcaption>
          </figure>
        </section>

        <StoryChapters />

        <div className={styles.marqueeBand}>
          <SlowMarquee />
        </div>

        <section id="desktop-beyond" className={styles.materialCoda} aria-labelledby="materials-title">
          <span id="beyond" className={styles.anchor} aria-hidden="true" />
          <div>
            <p className={styles.eyebrow}>Beyond the wardrobe</p>
            <h2 id="materials-title">Everything speaks.</h2>
            <p>
              A basket, a piece of embroidery, a room or a dress can begin the same conversation. Martha
              follows the color and the handwork wherever they lead.
            </p>
          </div>
          <figure className={styles.codaImage}>
            <Image
              src="/assets/site/textile-cargo/details/embroidery-basket.jpg"
              alt="A woven basket holding framed floral embroidery and textile pieces"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={92}
            />
          </figure>
        </section>

        <ObjectGallery />

        <footer id="desktop-contact" className={styles.visitFooter}>
          <span id="visit" className={styles.anchor} aria-hidden="true" />
          <div>
            <p className={styles.eyebrow}>Bastrop, Texas</p>
            <h2>Come see what caught her eye.</h2>
          </div>
          <div>
            <p>Vintage clothing, textiles, art and beautiful oddities.</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Martha%27s%20Vintage%20Bastrop%20Texas"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find Martha’s Vintage ↗
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
