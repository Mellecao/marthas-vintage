"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./desktop-carousel.module.css";

export type CarouselPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export function DesktopCarousel({
  photos,
  label,
  tone = "ink",
}: {
  photos: CarouselPhoto[];
  label: string;
  tone?: "ink" | "cream";
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    if (!slide) return;
    const step = slide.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    setActive(Math.min(photos.length - 1, Math.round(el.scrollLeft / step)));
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 8);
  }, [photos.length]);

  useEffect(() => {
    sync();
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  function go(direction: number) {
    const el = track.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    if (!slide) return;
    const step = slide.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    // No behavior option: 'auto' defers to the track's CSS scroll-behavior, so
    // the reduced-motion preference is honoured in one place, in the stylesheet.
    el.scrollTo({ left: el.scrollLeft + step * direction });
  }

  return (
    <div className={`${styles.carousel} ${tone === "cream" ? styles.cream : ""}`}>
      <div
        className={styles.track}
        ref={track}
        onScroll={sync}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
      >
        {photos.map((photo, index) => (
          <figure key={photo.src} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${photos.length}`}>
            <div className={styles.frame}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1600px) 440px, 30vw"
                loading={index < 3 ? "eager" : "lazy"}
              />
            </div>
            <figcaption>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.controls}>
        <p className={styles.counter} aria-live="polite">
          <strong>{String(active + 1).padStart(2, "0")}</strong>
          <span aria-hidden="true"> / </span>
          {String(photos.length).padStart(2, "0")}
        </p>
        <div className={styles.buttons}>
          <button type="button" aria-label="Previous photograph" disabled={atStart} onClick={() => go(-1)}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" aria-label="Next photograph" disabled={atEnd} onClick={() => go(1)}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
