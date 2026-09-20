"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { STYLED_LOOKS } from "@/data/styled-by-martha";
import styles from "./authored-world.module.css";

export function StyledByMartha() {
  const [selected, setSelected] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const look = STYLED_LOOKS[selected];

  const updateMobileIndex = () => {
    const container = carousel.current;
    if (!container) return;
    const slides = Array.from(container.querySelectorAll<HTMLElement>("[data-styled-slide]"));
    const nextIndex = slides.reduce((closest, slide, index) => {
      const currentDistance = Math.abs(slides[closest].offsetLeft - container.scrollLeft);
      const nextDistance = Math.abs(slide.offsetLeft - container.scrollLeft);
      return nextDistance < currentDistance ? index : closest;
    }, 0);
    setMobileIndex(nextIndex);
  };

  const goToMobileLook = (index: number) => {
    const container = carousel.current;
    const slide = container?.querySelectorAll<HTMLElement>("[data-styled-slide]")[index];
    if (!container || !slide) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const containerRect = container.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const scrollPadding = Number.parseFloat(window.getComputedStyle(container).scrollPaddingInlineStart) || 0;

    container.scrollTo({
      left: container.scrollLeft + slideRect.left - containerRect.left - scrollPadding,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section id="styled-by-martha" className={styles.styledSection} aria-labelledby="styled-title">
      <div className={styles.styledHeading}>
        <p className={styles.styledEyebrow}>The combinations tell the story</p>
        <h2 id="styled-title">Styled by Martha</h2>
        <p className={styles.styledIntroduction}>
          Clothes, accessories and instinct—put together her way.
        </p>
      </div>

      <div className={styles.styledDesktop}>
        <div className={styles.styledStage}>
          <figure className={styles.styledPrimary} key={`primary-${look.id}`}>
            <Image
              src={look.full.src}
              alt={look.full.alt}
              fill
              sizes="(min-width: 1280px) 48vw, 54vw"
              quality={92}
              style={{
                objectPosition: look.full.position,
                objectFit: look.full.fit ?? "cover",
              }}
            />
          </figure>

          <div className={styles.styledObservation}>
            <figure className={styles.styledDetail} key={`detail-${look.id}`}>
              <Image
                src={look.detail.src}
                alt={look.detail.alt}
                fill
                sizes="(min-width: 1280px) 19vw, 23vw"
                quality={92}
                style={{ objectPosition: look.detail.position }}
              />
            </figure>
            <div aria-live="polite">
              <p>Martha noticed</p>
              <h3>{look.name}</h3>
              <blockquote>{look.observation}</blockquote>
            </div>
          </div>
        </div>

        <div className={styles.styledRail} role="group" aria-label="Choose a styled look">
          {STYLED_LOOKS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={styles.styledRailItem}
              aria-label={`Show ${item.name}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className={styles.styledRailImage}>
                <Image src={item.full.src} alt="" fill sizes="14vw" quality={75} style={{ objectPosition: item.full.position }} />
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.styledMobile}>
        <div
          ref={carousel}
          className={styles.styledCarousel}
          onScroll={updateMobileIndex}
          aria-label="Styled looks"
        >
          {STYLED_LOOKS.map((item) => (
            <article key={item.id} className={styles.styledSlide} data-styled-slide>
              <figure className={styles.styledSlidePrimary}>
                <Image
                  src={item.full.src}
                  alt={item.full.alt}
                  fill
                  sizes="86vw"
                  quality={92}
                  style={{
                    objectPosition: item.full.position,
                    objectFit: item.full.fit ?? "cover",
                  }}
                />
              </figure>
              <div className={styles.styledSlideDetailRow}>
                <figure className={styles.styledSlideDetail}>
                  <Image src={item.detail.src} alt={item.detail.alt} fill sizes="34vw" quality={92} style={{ objectPosition: item.detail.position }} />
                </figure>
                <div>
                  <p>Martha noticed</p>
                  <h3>{item.name}</h3>
                </div>
              </div>
              <p className={styles.styledSlideObservation}>{item.observation}</p>
            </article>
          ))}
        </div>

        <div className={styles.styledMobileControls}>
          <p aria-live="polite">{mobileIndex + 1} / {STYLED_LOOKS.length}</p>
          <div role="group" aria-label="Go to a styled look">
            {STYLED_LOOKS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to ${item.name}`}
                aria-current={mobileIndex === index ? "true" : undefined}
                onClick={() => goToMobileLook(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
