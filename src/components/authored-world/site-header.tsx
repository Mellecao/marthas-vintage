"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MobileNavigation, type NavigationItem } from "./mobile-navigation";
import styles from "./authored-world.module.css";

const NAVIGATION: readonly NavigationItem[] = [
  { href: "#home", label: "Home" },
  { href: "#styled-by-martha", label: "Styled by Martha" },
  { href: "#collection", label: "The Collection" },
  { href: "#beyond-the-wardrobe", label: "Beyond the Wardrobe" },
  { href: "#visit", label: "Visit" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [close]);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      const currentY = window.scrollY;
      const section = document.getElementById("styled-by-martha");
      const pastHero = section ? currentY > section.offsetTop + 120 : false;

      if (open || !pastHero) {
        setScrollHidden(false);
      } else if (currentY > lastY + 8) {
        setScrollHidden(true);
      } else if (currentY < lastY - 3) {
        setScrollHidden(false);
      }

      lastY = currentY;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [open]);

  return (
    <>
      <header className={styles.header} data-hero-header data-scroll-hidden={scrollHidden ? "true" : undefined}>
        <div className={styles.headerInner} data-hero-header-inner>
          <a className={styles.brand} href="#home" aria-label="Martha's Vintage — home" data-hero-brand>
            <Image
              src="/assets/logo/logo-somente-lettering-reto.svg"
              alt="Martha's Vintage"
              width={336}
              height={63}
              priority
            />
          </a>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            <ul>
              {NAVIGATION.map((item) => (
                <li key={item.href}><a href={item.href}>{item.label}</a></li>
              ))}
            </ul>
          </nav>

          <button
            ref={menuTrigger}
            className={styles.mobileMenuButton}
            type="button"
            aria-expanded={open}
            aria-controls="authored-world-mobile-menu"
            onClick={() => {
              setScrollHidden(false);
              setOpen(true);
            }}
          >
            Menu
          </button>
        </div>
      </header>
      <MobileNavigation items={NAVIGATION} open={open} onClose={close} returnFocusRef={menuTrigger} />
    </>
  );
}
