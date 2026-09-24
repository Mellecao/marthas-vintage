import Image from "next/image";
import { StitchOutline, TextileOutline } from "./stitch-outline";
import styles from "./textile-cargo.module.css";

export function MarthaBento() {
  return (
    <section id="desktop-marthas-eyes" className={styles.bentoSection} aria-labelledby="meet-martha-title">
      <span id="marthas-eyes" className={styles.anchor} aria-hidden="true" />
      <div className={styles.bentoIntro}>
        <p className={styles.eyebrow}>The person behind the collection</p>
        <h2 id="meet-martha-title">Meet<br />Martha.</h2>
      </div>

      <div className={styles.bentoGrid}>
        <p className={styles.bentoLead}>
          She notices color first, then the handwork, the odd proportion or the detail that gives a piece a life of its own.
        </p>
        <article className={`${styles.bentoCell} ${styles.statementCell}`}>
          <StitchOutline variant="wide" />
          <p className={styles.cellLabel}>Her point of view</p>
          <blockquote>
            “I never dress by decade. I put things together until they feel personal.”
          </blockquote>
        </article>

        <figure className={`${styles.bentoCell} ${styles.portraitPrimary}`}>
          <div className={styles.textileCropA}>
            <Image
              src="/assets/site/martha-white-crochet-portrait.jpeg"
              alt="Martha smiling in a white crochet top"
              fill
              sizes="(min-width: 1024px) 25vw, 82vw"
              quality={92}
            />
          </div>
          <TextileOutline variant="a" />
          <figcaption>Martha · Bastrop, Texas</figcaption>
        </figure>

        <article className={`${styles.bentoCell} ${styles.instinctCell}`}>
          <StitchOutline />
          <p className={styles.cellLabel}>What catches her eye</p>
          <h3>Color.<br />Character.<br />The unexpected.</h3>
        </article>

        <figure className={`${styles.bentoCell} ${styles.portraitCandid}`}>
          <div className={styles.textileCropB}>
            <Image
              src="/assets/site/textile-cargo/portraits/martha-candid.jpg"
              alt="Martha seated at home wearing a wide-brimmed hat and red scarf"
              fill
              sizes="(min-width: 1024px) 19vw, 58vw"
              quality={92}
            />
          </div>
          <TextileOutline variant="b" />
          <figcaption>Personal before conventional.</figcaption>
        </figure>

        <article data-location-card className={`${styles.bentoCell} ${styles.locationCell}`}>
          <StitchOutline variant="wide" />
          <p className={styles.cellLabel}>From Bastrop, Texas</p>
          <p>
            Clothing sits beside textiles, jewelry, art and beautiful oddities because Martha sees them as one conversation.
          </p>
        </article>
      </div>
    </section>
  );
}
