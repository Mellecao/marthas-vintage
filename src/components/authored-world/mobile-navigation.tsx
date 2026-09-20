"use client";

import { useEffect, useRef, type RefObject } from "react";
import styles from "./authored-world.module.css";

export type NavigationItem = {
  href: string;
  label: string;
};

type MobileNavigationProps = {
  items: readonly NavigationItem[];
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

export function MobileNavigation({ items, open, onClose, returnFocusRef }: MobileNavigationProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const returnFocus = returnFocusRef.current;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);

    const first = focusable()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (nodes.length === 0) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      (returnFocus ?? previousFocus)?.focus();
    };
  }, [onClose, open, returnFocusRef]);

  if (!open) return null;

  return (
    <div
      ref={panel}
      id="authored-world-mobile-menu"
      className={styles.mobileMenu}
      role="dialog"
      aria-modal="true"
      aria-label="Primary navigation"
    >
      <div className={styles.mobileMenuTop}>
        <span className={styles.mobileMenuLocation}>Bastrop, Texas</span>
        <button className={styles.mobileMenuClose} type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <nav aria-label="Mobile primary navigation">
        <ul className={styles.mobileMenuList}>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={onClose}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
