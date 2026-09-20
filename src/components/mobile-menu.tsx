"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CLOSE_MS = 420;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const menuLinks = [
  { href: "#mobile-home", label: "Home", index: "01" },
  { href: "#marthas-eyes", label: "The Martha’s eyes", index: "02" },
  { href: "#collection", label: "The collection", index: "03" },
  { href: "#personal-style", label: "Personal style", index: "04" },
  { href: "#beyond", label: "Beyond the wardrobe", index: "05" },
  { href: "#visit", label: "Visit Martha’s", index: "06" },
];

type MenuPhase = "closed" | "open" | "closing";

export function MobileMenu() {
  const [phase, setPhase] = useState<MenuPhase>("closed");
  const phaseRef = useRef<MenuPhase>("closed");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const restoreFocus = useRef(true);
  const menuId = useId();
  const isActive = phase !== "closed";

  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const close = useCallback((shouldRestoreFocus = true) => {
    if (phaseRef.current !== "open") return;
    phaseRef.current = "closing";
    restoreFocus.current = shouldRestoreFocus;
    setPhase("closing");
    const duration = window.matchMedia(REDUCED_MOTION).matches ? 0 : CLOSE_MS;
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      phaseRef.current = "closed";
      setPhase("closed");
      if (restoreFocus.current) triggerRef.current?.focus();
    }, duration);
  }, []);

  const open = () => {
    if (phaseRef.current !== "closed") return;
    phaseRef.current = "open";
    setPhase("open");
  };

  useEffect(() => {
    if (!isActive) return;

    const previousOverflow = document.body.style.overflow;
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 24);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const menu = document.getElementById(menuId);
      const focusable = menu
        ? Array.from(menu.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'))
        : [];
      if (!focusable.length) return;

      event.preventDefault();
      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
      const offset = event.shiftKey ? -1 : 1;
      const nextIndex =
        currentIndex < 0
          ? event.shiftKey
            ? focusable.length - 1
            : 0
          : (currentIndex + offset + focusable.length) % focusable.length;
      focusable[nextIndex]?.focus();
    };

    document.body.style.overflow = "hidden";
    document.documentElement.dataset.mobileMenuOpen = "true";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      delete document.documentElement.dataset.mobileMenuOpen;
    };
  }, [close, isActive, menuId]);

  return (
    <>
      <button
        ref={triggerRef}
        className="mobile-menu-trigger"
        data-mobile-menu-trigger=""
        type="button"
        aria-label="Open the site menu"
        aria-controls={menuId}
        aria-expanded={phase === "open"}
        onClick={open}
      >
        <span aria-hidden="true">MENU</span>
        <span className="mobile-menu-trigger-mark" aria-hidden="true" />
      </button>

      {isActive && typeof document !== "undefined"
        ? createPortal(
            <aside
              id={menuId}
              className={`mobile-menu-overlay mobile-menu-overlay--${phase}`}
              data-mobile-menu=""
              role="dialog"
              aria-modal="true"
              aria-label="Martha’s Vintage menu"
            >
              <span className="mobile-menu-paper" aria-hidden="true" />
              <div className="mobile-menu-topline">
                <p>MARTHA’S VINTAGE</p>
                <button
                  ref={closeButtonRef}
                  className="mobile-menu-close"
                  data-mobile-menu-close=""
                  type="button"
                  aria-label="Close the site menu"
                  onClick={() => close()}
                >
                  <span aria-hidden="true">CLOSE</span>
                  <span className="mobile-menu-close-mark" aria-hidden="true">×</span>
                </button>
              </div>

              <nav className="mobile-menu-links" aria-label="Site sections">
                {menuLinks.map(({ href, index, label }) => (
                  <a key={href} href={href} onClick={() => close(false)}>
                    <span aria-hidden="true">{index}</span>
                    <strong>{label}</strong>
                    <i aria-hidden="true">↘</i>
                  </a>
                ))}
              </nav>

              <div className="mobile-menu-footer" aria-hidden="true">
                <span>Bastrop, Texas</span>
                <img src="/assets/logo/logo-partes/butterfly-middleleft.svg" alt="" />
                <span>Clothing · textiles · beautiful oddities</span>
              </div>
            </aside>,
            document.body,
          )
        : null}
    </>
  );
}
