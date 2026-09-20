"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_MEDIA } from "@/data/marthas-media";
import styles from "./authored-world.module.css";

export function ThresholdHero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    const header = document.querySelector<HTMLElement>("[data-hero-header]");
    const headerInner = document.querySelector<HTMLElement>("[data-hero-header-inner]");
    if (!element || !header || !headerInner) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      const frame = element.querySelector<HTMLElement>("[data-hero-media]");
      const image = element.querySelector<HTMLElement>("[data-hero-image]");
      const intro = element.querySelector<HTMLElement>("[data-hero-intro]");
      const brand = header.querySelector<HTMLElement>("[data-hero-brand]") ?? header.querySelector<HTMLElement>("a");

      if (!frame || !image || !intro || !brand) return;

      media.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (matchContext) => {
          const conditions = matchContext.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduce: boolean;
          };

          if (conditions.reduce) {
            gsap.set(frame, { inset: 0, borderRadius: 0 });
            gsap.set(header, { "--header-inset": "0px", backgroundColor: "rgba(246,239,226,.88)" });
            gsap.set(headerInner, { minHeight: 82 });
            return;
          }

          if (conditions.desktop) {
            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: element,
                start: "top top",
                end: () => `+=${window.innerHeight * 0.65}`,
                scrub: 0.32,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            timeline
              .to(frame, { inset: 0, borderRadius: 0, duration: 0.58 }, 0.15)
              .to(image, { scale: 1.022, duration: 0.58 }, 0.15)
              .to(header, { "--header-inset": "0px", backgroundColor: "rgba(246,239,226,.88)", duration: 0.32 }, 0.5)
              .to(headerInner, { minHeight: 82, duration: 0.32 }, 0.5)
              .to(brand, { scale: 0.9, transformOrigin: "left top", duration: 0.26 }, 0.5)
              .to(intro, { autoAlpha: 0, y: -12, duration: 0.24 }, 0.62)
              .to({}, { duration: 0.1 });

            return () => timeline.kill();
          }

          if (conditions.mobile) {
            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: element,
                start: "top top",
                end: () => `+=${Math.max(window.innerHeight * 0.32, 220)}`,
                scrub: 0.25,
                invalidateOnRefresh: true,
              },
            });

            timeline
              .to(frame, { inset: 0, borderRadius: 0, duration: 1 }, 0)
              .to(image, { scale: 1.012, duration: 1 }, 0)
              .to(header, { "--header-inset": "0px", backgroundColor: "rgba(246,239,226,.88)", duration: 0.4 }, 0.6)
              .to(headerInner, { minHeight: 72, duration: 0.4 }, 0.6);

            return () => timeline.kill();
          }
        },
      );

      return () => media.revert();
    }, element);

    const refresh = () => ScrollTrigger.refresh();
    const image = element.querySelector<HTMLImageElement>("img[data-hero-image]");
    if (image?.complete) refresh();
    else image?.addEventListener("load", refresh, { once: true });

    return () => {
      image?.removeEventListener("load", refresh);
      context.revert();
    };
  }, []);

  return (
    <section ref={root} id="home" className={styles.hero} data-authored-world-hero aria-labelledby="authored-world-title">
      <h1 id="authored-world-title" className={styles.srOnly}>Martha&apos;s Vintage</h1>

      <div className={styles.heroMedia} data-hero-media>
        <Image
          data-hero-image
          className={styles.heroImage}
          src={HERO_MEDIA.src}
          alt={HERO_MEDIA.alt}
          fill
          priority
          fetchPriority="high"
          quality={92}
          sizes="100vw"
          style={{
            "--desktop-position": HERO_MEDIA.desktopPosition,
            "--mobile-position": HERO_MEDIA.mobilePosition,
          } as React.CSSProperties}
        />
        <span className={styles.heroTopWash} aria-hidden="true" />
        <span className={styles.heroLowerWash} aria-hidden="true" />
      </div>

      <div className={styles.heroIntro} data-hero-intro>
        <p>Bastrop, Texas</p>
        <a href="#styled-by-martha">Enter Martha&apos;s world <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
