"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { TEXTILE_STORIES } from "@/data/textile-cargo";
import { isMacOSSafari } from "@/lib/browser";
import { TextileOutline } from "./stitch-outline";
import styles from "./textile-cargo.module.css";

const CHAPTER_VARIANTS = ["A", "B", "C"] as const;
const ACCENT_VARS: Record<string, string> = {
  rose: "var(--tc-rose)",
  teal: "var(--tc-teal)",
  mustard: "var(--tc-mustard)",
};

const ROADLINE_PATH =
  "M0 30 C 250 5, 250 55, 500 30 C 750 5, 750 55, 1000 30";

export function ChapterTrack() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const stage = stageRef.current;
    const track = trackRef.current;
    const path = pathRef.current;
    if (!stage || !track || !path) return;

    // WebKit can leave native-lazy images inside a transformed, pinned rail in
    // a permanently broken state. These are small pre-optimized JPEGs, so only
    // macOS Safari promotes the rail to eager loading before scroll starts.
    if (
      isMacOSSafari({
        userAgent: navigator.userAgent,
        maxTouchPoints: navigator.maxTouchPoints,
      })
    ) {
      stage
        .querySelectorAll<HTMLImageElement>("img[data-chapter-image]")
        .forEach((image) => {
          image.loading = "eager";
        });
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;

        const timeline = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              path.style.strokeDashoffset = `${length * (1 - self.progress)}`;
            },
          },
        });

        return () => timeline.scrollTrigger?.kill();
      });

      return () => media.revert();
    }, stage);

    return () => context.revert();
  }, []);

  return (
    <div className={styles.chapterStage} ref={stageRef}>
      <svg className={styles.roadline} viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
        <path ref={pathRef} d={ROADLINE_PATH} vectorEffect="non-scaling-stroke" />
      </svg>

      <div className={styles.chapterTrack} ref={trackRef}>
        {TEXTILE_STORIES.map((story, index) => (
          <article
            key={story.id}
            id={story.id}
            className={[styles.chapter, styles[`chapter${CHAPTER_VARIANTS[index]}`]]
              .filter(Boolean)
              .join(" ")}
          >
            <div
              className={styles.chapterQuote}
              style={{ "--chapter-accent": ACCENT_VARS[story.accent] ?? "var(--tc-rose)" } as React.CSSProperties}
            >
              <p>{story.number} / 03</p>
              <h3>{story.title}</h3>
              <blockquote>{story.note}</blockquote>
            </div>

            <div className={styles.chapterImages} aria-label={`${story.title} image group`}>
              {story.images.map((image, imageIndex) => (
                <figure key={image.src} className={styles.chapterFigure}>
                  <Image
                    data-chapter-image=""
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 26vw, 82vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "low" : undefined}
                    unoptimized
                    style={{ objectPosition: image.position }}
                  />
                  <TextileOutline variant={imageIndex % 2 === 0 ? "a" : "b"} />
                </figure>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
