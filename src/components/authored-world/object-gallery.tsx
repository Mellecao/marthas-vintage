"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { BEYOND_OBJECTS } from "@/data/textile-cargo";
import styles from "./textile-cargo.module.css";

export function ObjectGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // showModal() is what gives the lightbox its focus trap, its Escape key and
  // its ::backdrop; React only owns which photo is in it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (openIndex === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
  }, [openIndex]);

  const active = openIndex === null ? null : BEYOND_OBJECTS[openIndex];

  return (
    <section className={styles.objectGallery} aria-labelledby="object-gallery-title">
      <h2 id="object-gallery-title" className="sr-only">
        Objects, textiles and rooms from the collection
      </h2>

      <div
        className={styles.objectGrid}
        data-beyond-slider=""
        role="region"
        aria-roledescription="carousel"
        aria-label="Beyond the wardrobe photographs"
        tabIndex={0}
      >
        {BEYOND_OBJECTS.map((item, index) => (
          <button
            key={item.src}
            type="button"
            className={styles.objectCell}
            data-beyond-slide=""
            aria-label={`Open photograph ${index + 1} of ${BEYOND_OBJECTS.length}: ${item.alt}`}
            style={{ "--cell-column": item.column, "--cell-row": item.row } as CSSProperties}
            onClick={() => setOpenIndex(index)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 50vw"
              quality={92}
              style={{ objectPosition: item.position }}
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        // Escape and the close button both land here, so state follows the
        // element rather than the other way round.
        onClose={() => setOpenIndex(null)}
        // A click that lands on the dialog itself came from the backdrop:
        // the image and the button are children and stop it earlier.
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpenIndex(null);
        }}
      >
        {active ? (
          <>
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setOpenIndex(null)}
              aria-label="Close photo"
              autoFocus
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5 L19 19 M19 5 L5 19" />
              </svg>
            </button>

            <div className={styles.lightboxFrame}>
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                quality={92}
                style={{ objectFit: "contain" }}
              />
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
