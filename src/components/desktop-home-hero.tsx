"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isMacOSSafari } from "@/lib/browser";

const MARTHAS_LOGO = "/assets/site/desktop-home/marthas-word.svg";
const VINTAGE_LOGO = "/assets/site/desktop-home/vintage-word.svg";
const MODEL = "/assets/site/desktop-home/hero-models.png";
const BUTTERFLY = "/assets/logo/logo-partes/butterfly-middleleft.svg";

const navItems = [
  { className: "desktop-nav-home", href: "#desktop-home", label: "Home" },
  { className: "desktop-nav-beyond", href: "#desktop-beyond", label: "Beyond the wardrobe" },
  { className: "desktop-nav-eyes", href: "#desktop-marthas-eyes", label: "The martha’s eyes" },
  { className: "desktop-nav-contact", href: "#desktop-contact", label: "Contact" },
];

type DesktopHomeHeroProps = {
  imageSrc?: string;
  imageAlt?: string;
};

export function DesktopHomeHero({
  imageSrc = MODEL,
  imageAlt = "Three women wearing distinctive vintage looks",
}: DesktopHomeHeroProps = {}) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;
    const macOSSafari = isMacOSSafari({
      userAgent: navigator.userAgent,
      maxTouchPoints: navigator.maxTouchPoints,
    });

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 1024px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (matchContext) => {
          const conditions = matchContext.conditions as {
            desktop: boolean;
            reduce: boolean;
          };
          if (!conditions.desktop) return;

          const marthas = element.querySelector<HTMLElement>("[data-brand-marthas]");
          const vintage = element.querySelector<HTMLElement>("[data-brand-vintage]");
          const description = element.querySelector<HTMLElement>("[data-desktop-description]");
          const butterfly = element.querySelector<HTMLElement>("[data-desktop-butterfly]");
          const photo = element.querySelector<HTMLElement>("[data-desktop-photo]");
          const discover = element.querySelector<HTMLElement>("[data-desktop-discover]");
          const links = Array.from(
            element.querySelectorAll<HTMLElement>("[data-desktop-nav-link]"),
          );
          const leaders = Array.from(
            element.querySelectorAll<HTMLElement>("[data-desktop-nav-leader]"),
          );

          if (!marthas || !vintage || !description || !butterfly || !photo || !discover) {
            return;
          }

          // Keep the same hero navigation and lettering after the hero leaves.
          // Nothing is duplicated or crossfaded into a different menu.
          const nav = element.querySelector<HTMLElement>(".desktop-home-nav");
          const persistent = document.createElement("div");
          persistent.className = "persistent-hero-menu";
          persistent.hidden = true;
          document.body.appendChild(persistent);
          const originals = [marthas, vintage, ...(nav ? [nav] : [])].map((node) => ({
            node,
            parent: node.parentNode!,
            next: node.nextSibling,
          }));
          let moved = false;
          let lastMenuScroll = window.scrollY;
          const setMenuCollapsed = (collapsed: boolean) => {
            persistent.classList.toggle("is-collapsed", collapsed);
            // Off-screen links must not remain keyboard/pointer targets.
            persistent.inert = collapsed;
          };
          const handoff = (active: boolean) => {
            if (active === moved) return;
            moved = active;
            if (active) {
              persistent.hidden = false;
              originals.forEach(({ node }) => persistent.appendChild(node));
            } else {
              originals
                .slice()
                .reverse()
                .forEach(({ node, parent, next }) =>
                  parent.insertBefore(node, next?.parentNode === parent ? next : null),
                );
              persistent.hidden = true;
              setMenuCollapsed(false);
            }
          };
          const updateMenu = (self: ScrollTrigger, refreshed = false) => {
            const scroll = self.scroll();
            handoff(scroll >= self.start);
            // Refresh/idle never closes a menu revealed by an upward gesture.
            if (moved && !refreshed && Math.abs(scroll - lastMenuScroll) > 1) {
              setMenuCollapsed(scroll > lastMenuScroll);
            }
            lastMenuScroll = scroll;
          };
          const disposeMenu = () => {
            handoff(false);
            persistent.remove();
          };

          const setMenuLayout = () => {
            gsap.set(marthas, {
              left: "37.109375%",
              top: "3.25%",
              width: "12.4%",
              height: "7.35%",
              objectPosition: "100% 50%",
            });
            gsap.set(vintage, {
              left: "49.859375%",
              top: "3.25%",
              width: "12.8%",
              height: "7.35%",
              objectPosition: "0% 50%",
            });
            gsap.set(links[0], { left: "6.328125%", top: "5.2%" });
            gsap.set(links[1], { left: "15.3125%", top: "5.2%" });
            gsap.set(links[2], { left: "66.171875%", top: "5.2%" });
            gsap.set(links[3], { left: "84.609375%", top: "5.2%" });
            gsap.set(leaders, { autoAlpha: 0, scaleX: 0 });
          };
          const clearMenuLayout = () => {
            gsap.set([marthas, vintage, ...links, ...leaders], { clearProps: "all" });
          };
          const finalState = () => {
            setMenuLayout();
            gsap.set(description, { autoAlpha: 0, y: 44 });
            gsap.set(butterfly, {
              autoAlpha: 0,
              x: "24vw",
              y: "-28vh",
              rotation: 28,
              scale: 0.72,
            });
            gsap.set(photo, { clipPath: "inset(0% 0% 0% 0%)" });
          };

          if (macOSSafari) {
            let frame = 0;
            const syncSafariMenu = () => {
              frame = 0;
              const pastHero = element.getBoundingClientRect().bottom <= 1;
              if (pastHero) {
                handoff(true);
                setMenuLayout();
                setMenuCollapsed(false);
              } else if (moved) {
                handoff(false);
                clearMenuLayout();
              }
            };
            const requestSync = () => {
              if (!frame) frame = window.requestAnimationFrame(syncSafariMenu);
            };

            syncSafariMenu();
            window.addEventListener("scroll", requestSync, { passive: true });
            window.addEventListener("resize", requestSync);
            return () => {
              window.removeEventListener("scroll", requestSync);
              window.removeEventListener("resize", requestSync);
              if (frame) window.cancelAnimationFrame(frame);
              handoff(false);
              clearMenuLayout();
              persistent.remove();
            };
          }

          if (conditions.reduce) {
            finalState();
            const menuTrigger = ScrollTrigger.create({
              trigger: element,
              start: "bottom top",
              end: "max",
              onUpdate: (self) => updateMenu(self),
              onRefresh: (self) => updateMenu(self, true),
            });
            return () => {
              menuTrigger.kill();
              disposeMenu();
            };
          }

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: element,
              start: "top top",
              end: () => `+=${window.innerHeight * 1.55}`,
              scrub: 0.35,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(marthas, {
              left: "37.109375%",
              top: "3.25%",
              width: "12.4%",
              height: "7.35%",
              objectPosition: "100% 50%",
              duration: 0.42,
            }, 0)
            .to(vintage, {
              left: "49.859375%",
              top: "3.25%",
              width: "12.8%",
              height: "7.35%",
              objectPosition: "0% 50%",
              duration: 0.42,
            }, 0)
            .to(links[0], { left: "6.328125%", top: "5.2%", duration: 0.42 }, 0)
            .to(links[1], { left: "15.3125%", top: "5.2%", duration: 0.42 }, 0)
            .to(links[2], { left: "66.171875%", top: "5.2%", duration: 0.42 }, 0)
            .to(links[3], { left: "84.609375%", top: "5.2%", duration: 0.42 }, 0)
            .to(leaders, { autoAlpha: 0, scaleX: 0, duration: 0.25 }, 0)
            .to(description, { autoAlpha: 0, y: 44, duration: 0.27 }, 0.03)
            .to(butterfly, {
              autoAlpha: 0,
              x: "24vw",
              y: "-28vh",
              rotation: 28,
              scale: 0.72,
              duration: 0.34,
            }, 0.03)
            // Reveal a stable full-width image with a crop instead of animating
            // left/width. This avoids layout and the 116vw photo is painted once.
            .fromTo(
              photo,
              { clipPath: "inset(0% 35.703125% 0% 34.0625%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                immediateRender: false,
                duration: 0.58,
              },
              0.42,
            )
            .to({}, { duration: 0.18 });

          const menuTrigger = ScrollTrigger.create({
            start: () => timeline.scrollTrigger!.end,
            end: "max",
            onUpdate: self => updateMenu(self),
            onRefresh: self => updateMenu(self, true),
          });
          return () => { menuTrigger.kill(); disposeMenu(); timeline.kill(); };
        },
      );

      return () => media.revert();
    }, element);

    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="desktop-home" className="desktop-home" aria-labelledby="desktop-home-title">
      <span className="desktop-paper-texture" aria-hidden="true" />
      <span className="desktop-grunge-texture" aria-hidden="true" />

      <h1 id="desktop-home-title" className="sr-only">Martha&apos;s Vintage</h1>

      <img
        data-brand-marthas
        className="desktop-brand desktop-brand-marthas"
        src={MARTHAS_LOGO}
        alt=""
        aria-hidden="true"
      />
      <img
        data-brand-vintage
        className="desktop-brand desktop-brand-vintage"
        src={VINTAGE_LOGO}
        alt=""
        aria-hidden="true"
      />

      <nav className="desktop-home-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.label}
            className={`desktop-nav-link ${item.className}`}
            data-desktop-nav-link
            href={item.href}
          >
            <span className="desktop-nav-label">{item.label}</span>
            <span className="desktop-nav-leader" data-desktop-nav-leader aria-hidden="true">
              {"• ".repeat(24)}
            </span>
          </a>
        ))}
      </nav>

      <p className="desktop-home-description" data-desktop-description>
        Martha&apos;s Vintage is a personal collection of clothing, textiles and beautiful oddities,
        each chosen for its color, craftsmanship and unmistakable personality.
      </p>

      <div className="desktop-home-photo" data-desktop-photo>
        <img src={imageSrc} alt={imageAlt} />
        <span className="desktop-photo-paper" aria-hidden="true" />
      </div>

      <span
        className="desktop-home-butterfly"
        data-desktop-butterfly
        aria-hidden="true"
      >
        <img src={BUTTERFLY} alt="" />
      </span>

      <a className="desktop-discover" data-desktop-discover href="#desktop-marthas-eyes">
        Discover the story <span className="ios-safe-arrow ios-safe-arrow-down" aria-hidden="true" />
      </a>
    </section>
  );
}
