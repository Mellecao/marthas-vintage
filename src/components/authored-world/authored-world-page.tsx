import Image from "next/image";
import { RotatingBadge, SlowMarquee } from "@/components/vintage-details";
import { MarthaBento } from "./martha-bento";
import { ObjectGallery } from "./object-gallery";
import { PreservedHomeHero } from "./preserved-home-hero";
import { StoryChapters } from "./story-chapters";
import { TextileOutline } from "./stitch-outline";
import styles from "./textile-cargo.module.css";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.35" cy="6.65" r="1" className={styles.socialIconDot} />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.65 20v-7.1h2.38l.36-2.76h-2.74V8.38c0-.8.22-1.34 1.38-1.34h1.47V4.57c-.26-.04-1.15-.11-2.2-.11-2.18 0-3.67 1.33-3.67 3.77v1.91H8.17v2.76h2.46V20h3.02Z" />
    </svg>
  );
}

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
            <div className={styles.socialLinks}>
              <a
                className={styles.socialLink}
                href="https://www.instagram.com/marthasvintagecollection?stkn=MTVzajkzc3NtcGQ1aQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Martha's Vintage on Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                className={styles.socialLink}
                href="https://www.facebook.com/share/1HCPw9kDxe/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Martha's Vintage on Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
            <a className={styles.emailLink} href="mailto:shopmarthasvintagecollection@gmail.com">
              shopmarthasvintagecollection@gmail.com
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
