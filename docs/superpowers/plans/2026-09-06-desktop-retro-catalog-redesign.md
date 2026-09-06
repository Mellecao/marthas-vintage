# Desktop Retro-Catalog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the desktop editorial sections (everything below the hero, from "A particular point of view" through the footer) with a retro catalog/ad visual language — solid alternating section colors, thick photo frames, a rotating stamp badge per section, centered display headlines, and a regular non-overlapping grid.

**Architecture:** Two files carry the entire change: `desktop-editorial-sections.module.css` (full rewrite of the section styling) and `desktop-editorial-sections.tsx` (JSX restructured to match — flattened grids, a new `SectionStamp` wrapper around the existing `RotatingBadge`, `ScrollRoadline` removed). No other component, route, or the mobile/tablet layout is touched. `RotatingBadge` and `SlowMarquee` are reused as-is from `vintage-details.tsx`; their look is adjusted only via scoped `:global()` CSS-module overrides so mobile styling is unaffected.

**Tech Stack:** Next.js 16 (App Router), React 19, CSS Modules, no test runner configured in this repo (no Jest/Vitest/Playwright) — verification is a manual visual/computed-style pass through the dev server using the Claude Browser tool, not automated tests.

**Spec:** `docs/superpowers/specs/2026-09-06-desktop-retro-catalog-redesign-design.md`

---

## Before you start

- Dev server: `npm run dev` (runs on port 3000; if 3000 is already taken by another process, Next will pick the next free port — check the terminal output for the actual URL).
- The desktop layout only activates at `min-width: 1024px`. Always test with the browser viewport resized to at least 1440px wide.
- There is no automated test suite for this project. "Verify" steps below mean: look at it in a real browser and inspect computed styles via `javascript_tool`/browser console — not `npm test`.

---

### Task 1: Rewrite the editorial sections CSS module

**Files:**
- Modify: `src/components/desktop-editorial-sections.module.css` (full replacement)

- [ ] **Step 1: Replace the entire file contents**

Replace the full contents of `src/components/desktop-editorial-sections.module.css` with:

```css
.journal { display: none; }
@media (min-width: 1024px) {
  .journal {
    --journal-paper: #f4e8d0;
    --journal-terracotta: #9c4420;
    --journal-olive: #5c6b3f;
    --journal-mustard: #d9a441;
    --journal-ink: #241c14;
    --journal-cream: #f7ecd9;
    position: relative;
    display: block;
    color: var(--journal-ink);
    background: var(--journal-paper);
    font: 16px/1.65 var(--font-geist-sans), Arial, sans-serif;
    isolation: isolate;
  }
  .journal h2, .journal h3, .journal p, .journal figure { margin: 0; }
  .journal h2, .journal h3 { font-weight: 400; }
  .journal em { font-weight: 400; font-style: italic; }
  .journal a { color: inherit; text-underline-offset: 6px; }
  .journal a:focus-visible { outline: 2px solid currentColor; outline-offset: 6px; }
  .journal section, .journal footer { position: relative; scroll-margin-top: 130px; }

  .pages { max-width: 1440px; margin: 0 auto; }

  .eyebrow { display: block; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; }

  /* Shared centered header, used by all three content sections */
  .sectionHeader { max-width: 720px; margin: 0 auto; padding: 96px 24px 56px; text-align: center; }
  .sectionHeader .eyebrow { margin-bottom: 18px; }
  .sectionHeading { font-family: var(--font-suravaram), Georgia, serif; font-size: clamp(48px, 5.2vw, 76px); line-height: 1.02; letter-spacing: -.03em; }
  .sectionNote { max-width: 46ch; margin: 20px auto 0; font-size: 15px; line-height: 1.6; }

  /* Regular two-column grid: equal columns, single row, no spans/overlaps */
  .sectionGrid { display: grid; grid-template-columns: repeat(2, 1fr); align-items: start; gap: 56px; padding: 0 clamp(40px, 6vw, 96px) 100px; }
  .sectionGrid + .sectionGrid { padding-top: 56px; border-top: 2px solid currentColor; }
  .gridCopy { display: flex; flex-direction: column; gap: 16px; align-self: center; font-size: 15px; line-height: 1.7; }
  .gridCopy h3 { font-family: var(--font-suravaram), Georgia, serif; font-size: clamp(30px, 3vw, 40px); line-height: 1.05; margin-bottom: 4px; }
  .dropCap:first-letter { float: left; padding: .04em .08em 0 0; font-family: var(--font-suravaram), Georgia, serif; font-size: 3.2em; line-height: .78; }
  .textLink { display: inline-flex; align-self: flex-start; align-items: center; gap: 14px; margin-top: 4px; padding-bottom: 4px; border-bottom: 1px solid currentColor; font-size: 13px; text-decoration: none; }

  /* Photo frame: thick solid border instead of a hairline */
  .photo { min-width: 0; }
  .photoFrame { position: relative; width: 100%; aspect-ratio: 4 / 5; overflow: hidden; border: 8px solid currentColor; }
  .photoFrame img { object-fit: cover; }
  .photo figcaption { margin-top: 12px; font-size: 11px; letter-spacing: .04em; text-transform: uppercase; }
  .photoSmall { max-width: 320px; margin-top: 24px; }
  .photoSmall .photoFrame { aspect-ratio: 4 / 3; border-width: 6px; }

  /* Section stamp: RotatingBadge repositioned as a corner seal */
  .stamp { position: absolute; top: 40px; z-index: 5; width: 96px; text-align: center; }
  .stamp :global(.rotating-badge) { width: 96px; height: 96px; flex: 0 0 96px; color: inherit; }
  .stampCaption { margin-top: 8px; font-size: 10px; line-height: 1.4; }
  .stampLeft { left: clamp(24px, 5vw, 80px); }
  .stampRight { right: clamp(24px, 5vw, 80px); }

  /* 01 — story */
  .story { background: var(--journal-paper); color: var(--journal-ink); }

  /* 02 — collection */
  .collection { background: var(--journal-terracotta); color: var(--journal-cream); }

  /* interlude band */
  .interlude { background: var(--journal-mustard); color: var(--journal-ink); padding: 72px 24px; text-align: center; }
  .interludePhrase { margin-top: 16px; font-family: var(--font-suravaram), Georgia, serif; font-size: clamp(36px, 4.4vw, 64px); line-height: 1; }
  .interlude :global(.rotating-badge) { width: 120px; height: 120px; flex: 0 0 120px; margin: 32px auto 0; color: inherit; }

  /* 03 — beyond */
  .beyond { background: var(--journal-olive); color: var(--journal-cream); }

  /* marquee band, restyled ink/cream to match the catalog palette */
  .marqueeBand { background: var(--journal-ink); color: var(--journal-cream); }
  .marqueeBand :global(.slow-marquee) { border-color: var(--journal-cream); color: var(--journal-cream); }

  /* footer */
  .footer { background: var(--journal-ink); color: var(--journal-cream); text-align: center; }
  .footerInner { max-width: 720px; margin: 0 auto; padding: 96px 24px 48px; }
  .visitHeading h2 { font-family: var(--font-suravaram), Georgia, serif; font-size: clamp(40px, 4.6vw, 64px); line-height: 1.02; }
  .visitDetails { margin-top: 24px; }
  .visitDetails > p:not(.eyebrow) { margin-top: 16px; font-size: 15px; }
  .visitLink {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    margin-top: 36px;
    padding: 16px 32px;
    border: 3px solid var(--journal-cream);
    font-size: 13px;
    letter-spacing: .06em;
    text-transform: uppercase;
    text-decoration: none;
  }
  .visitLink:hover { background: var(--journal-cream); color: var(--journal-ink); }
  .footerBottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 64px;
    padding-top: 32px;
    border-top: 1px solid rgba(247, 236, 233, .3);
    font-size: 11px;
  }
  .footerBottom img { width: 160px; height: auto; filter: invert(93%) sepia(13%) saturate(466%) hue-rotate(333deg) brightness(96%); }
  .footerBottom a { text-decoration: none; border-bottom: 1px solid currentColor; }
}
```

Note: `--journal-terracotta` is `#9c4420`, not the `#b8502f` written in the design spec — it was darkened to clear the WCAG AA 4.5:1 contrast ratio against `--journal-cream` body text (`#b8502f` measured ~4.25:1, `#9c4420` measures ~5.5:1). This is exactly the adjustment the spec's own accessibility section calls for.

- [ ] **Step 2: Confirm there are no CSS syntax errors**

Run:
```bash
cd "C:/Projetos/marthas-vintage" && npm run dev
```
Expected: the dev server starts without a CSS parse error in the terminal output (Next.js prints a build error overlay/stack trace if the CSS is invalid). Leave it running for the next task — you'll need it for the JSX changes and the visual verification task.

---

### Task 2: Rewrite the editorial sections JSX

**Files:**
- Modify: `src/components/desktop-editorial-sections.tsx` (full replacement)

- [ ] **Step 1: Replace the entire file contents**

Replace the full contents of `src/components/desktop-editorial-sections.tsx` with:

```tsx
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { SlowMarquee, RotatingBadge } from "./vintage-details";
import styles from "./desktop-editorial-sections.module.css";

function SectionStamp({ side, caption }: { side: "left" | "right"; caption: string }) {
  return (
    <div className={`${styles.stamp} ${side === "left" ? styles.stampLeft : styles.stampRight}`}>
      <RotatingBadge />
      <p className={styles.stampCaption}>{caption}</p>
    </div>
  );
}

function EditorialPhoto({
  src, alt, caption, className = "", sizes,
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  sizes: string;
}) {
  return (
    <figure className={`${styles.photo} ${className}`}>
      <div className={styles.photoFrame}>
        <Image src={src} alt={alt} fill sizes={sizes} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function DesktopEditorialSections() {
  return (
    <div className={styles.journal} data-desktop-editorial aria-label="The world of Martha's Vintage">
      <div className={styles.pages}>
        <section id="desktop-marthas-eyes" className={styles.story} aria-labelledby="editorial-story-title">
          <SectionStamp side="right" caption="Bastrop, Texas · A personal collection" />
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Through Martha’s eye</p>
            <h2 id="editorial-story-title" className={styles.sectionHeading}>An eye for the <em>extraordinary.</em></h2>
            <p className={styles.sectionNote}>Some things simply ask you to look a little closer.</p>
          </header>
          <div className={styles.sectionGrid}>
            <div className={styles.gridCopy}>
              <p className={styles.dropCap}>I notice color first. Then the details: an unusual shape, fine handwork, a clever repair, or a fabric with a life of its own.</p>
              <p>Martha’s Vintage brings together clothing, textiles and beautiful oddities, each chosen for its character and the way it might be worn and loved now.</p>
              <p><em>A collection with a point of view.</em> And a person behind it.</p>
            </div>
            <EditorialPhoto
              src="/assets/site/photos/store_1.jpg"
              alt="Sunlight falling over clothing racks, collected objects and a red rug in Martha’s shop"
              caption="Fig. 01 — A little world of color, texture and possibility."
              sizes="(min-width: 1600px) 600px, 42vw"
            />
          </div>
        </section>

        <section id="desktop-collection" className={styles.collection} aria-labelledby="editorial-collection-title">
          <SectionStamp side="left" caption="Clothing · Textiles · Beautiful oddities" />
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Notes on collecting</p>
            <h2 id="editorial-collection-title" className={styles.sectionHeading}>Curated,<br /><em>not accumulated.</em></h2>
            <p className={styles.sectionNote}>Beautiful things, gathered slowly. Chosen with instinct. Kept for their character.</p>
          </header>
          <div className={styles.sectionGrid}>
            <EditorialPhoto
              src="/assets/site/photos/look1_1.png"
              alt="A vintage look combining a burgundy beret, paisley top and plum skirt"
              caption="Look 01 — A little drama. A lot of personality."
              sizes="(min-width: 1600px) 500px, 35vw"
            />
            <div className={styles.gridCopy}>
              <h3>It began<br />with noticing.</h3>
              <p>Long before Martha’s Vintage was a business, I filled notebooks with photographs, fabrics, artwork and color combinations I wanted to remember.</p>
              <p>Those pages taught me to trust my eye. The collection still grows that way: one thoughtful discovery at a time.</p>
              <a className={styles.textLink} href="#desktop-beyond">There’s more to the story <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className={styles.sectionGrid}>
            <div className={styles.gridCopy}>
              <h3>No rules.<br /><em>Just instinct.</em></h3>
              <p>I never dress by decade. I mix old pieces with clothes I already love, letting each combination become my own. Vintage belongs in the present.</p>
            </div>
            <EditorialPhoto
              src="/assets/site/photos/look1_4.jpg"
              alt="A striped pink and black blazer paired with a floral skirt"
              caption="Look 02 — Stripes meet florals. An unexpected friendship."
              sizes="(min-width: 1600px) 500px, 35vw"
            />
          </div>
        </section>

        <aside className={styles.interlude} aria-label="A note on personal style">
          <p className={styles.eyebrow}>A note on personal style</p>
          <p className={styles.interludePhrase}>Old soul. <em>Entirely your own.</em></p>
          <RotatingBadge />
        </aside>

        <section id="desktop-beyond" className={styles.beyond} aria-labelledby="editorial-beyond-title">
          <SectionStamp side="right" caption="The art of living with what you love" />
          <header className={styles.sectionHeader}>
            <p className={styles.eyebrow}>At home with Martha</p>
            <h2 id="editorial-beyond-title" className={styles.sectionHeading}>A way of dressing.<br /><em>A way of seeing.</em></h2>
            <p className={styles.sectionNote}>Clothing, art and interiors belong in the same conversation.</p>
          </header>
          <div className={styles.sectionGrid}>
            <EditorialPhoto
              src="/assets/site/photos/beyondthewardrobe_3.jpg"
              alt="Patterned curtains framing a yellow room filled with artwork, rugs and vintage furniture"
              caption="Fig. 02 — Pattern upon pattern. A room with a life of its own."
              sizes="(min-width: 1600px) 560px, 42vw"
            />
            <div className={styles.gridCopy}>
              <h3>Beauty doesn’t<br />stay in one place.</h3>
              <p>A painting can suggest a color palette. A room can change the way I see a dress. A piece of embroidery can inspire an entire arrangement.</p>
              <p>This is a place for those connections, and for the beautiful things that do not fit neatly inside a wardrobe.</p>
              <EditorialPhoto
                className={styles.photoSmall}
                src="/assets/site/photos/beyondthewardrobe_6.jpg"
                alt="Two framed vintage needlepoint portraits"
                caption="Fig. 03 — Small things, lovingly made."
                sizes="(min-width: 1600px) 320px, 24vw"
              />
            </div>
          </div>
        </section>
      </div>

      <div className={styles.marqueeBand}>
        <SlowMarquee />
      </div>

      <footer id="desktop-contact" className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.visitHeading}>
            <p className={styles.eyebrow}>From these pages to real life</p>
            <h2>Come for a look.<br /><em>Stay for the stories.</em></h2>
          </div>
          <div className={styles.visitDetails}>
            <p className={styles.eyebrow}>Martha’s Vintage · Bastrop, Texas</p>
            <p>Clothing to fall for. Objects to wonder about. A personal collection with a little room for the unexpected.</p>
            <a className={styles.visitLink} href="https://www.google.com/maps/search/?api=1&query=Martha%27s%20Vintage%20Bastrop%20Texas" target="_blank" rel="noopener noreferrer">Explore Bastrop on Maps <span aria-hidden="true">↗</span></a>
          </div>
          <div className={styles.footerBottom}>
            <img src="/assets/logo/logo-somente-lettering-reto.svg" alt="Martha's Vintage" />
            <p>© {new Date().getFullYear()} Martha’s Vintage</p>
            <a href="#desktop-home">Back to the beginning <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

This removes the `ScrollRoadline` import and its two render sites (top of `.journal` and — it was never in the footer, just the one at the top), removes the now-unused `SectionLine` helper, and replaces the asymmetric `storyGrid`/`collectionGrid`/`beyondGrid` markup with the shared `.sectionGrid` pattern (one `EditorialPhoto` + one copy block per row, always as direct grid children).

- [ ] **Step 2: Verify it compiles with no console errors**

With `npm run dev` still running from Task 1:
1. Open a browser tab at `http://localhost:3000` (use the Claude Browser tool: `mcp__Claude_Browser__navigate` with `url: "http://localhost:3000"`, or your own browser).
2. Resize the viewport to at least 1440×900 (`mcp__Claude_Browser__resize_window` with `width: 1440, height: 900`, or your browser's responsive mode) — the desktop layout only shows at `min-width: 1024px`.
3. Read the browser console for errors: `mcp__Claude_Browser__read_console_messages` with `onlyErrors: true`.

Expected: no errors (no "ScrollRoadline is not defined", no CSS module hook mismatch, no React key warnings).

- [ ] **Step 3: Commit**

```bash
cd "C:/Projetos/marthas-vintage" && git add src/components/desktop-editorial-sections.module.css src/components/desktop-editorial-sections.tsx && git commit -m "$(cat <<'EOF'
feat: redesign desktop editorial sections as a retro catalog

Replaces the asymmetric magazine-style grid below the hero with a
regular, non-overlapping layout: solid alternating section colors
(paper/terracotta/mustard/olive/ink), thick photo frames, and a
rotating stamp badge marking each section. Removes the ScrollRoadline
decorative squiggle from the desktop composition.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Visual and accessibility verification pass

**Files:** none (verification only — fix-forward into the same two files from Task 1/2 if something below fails)

- [ ] **Step 1: Screenshot each section at 1440px wide**

With the dev server running and a browser tab open at `http://localhost:3000`, resized to 1440×900:

1. Scroll past the hero (the hero pins for roughly 2.5 viewport heights of scroll, so scroll well past that — e.g. jump directly with `mcp__Claude_Browser__javascript_tool` running `window.scrollTo(0, 3000)`).
2. Screenshot (`mcp__Claude_Browser__computer` with `action: "screenshot"`).
3. Continue scrolling in increments (`window.scrollTo(0, y)` for increasing `y`, or repeated scroll actions) and screenshot again until you've seen: the "particular point of view" section (paper bg), "the collection" section (terracotta bg, both grid rows), the mustard interlude band, "beyond the wardrobe" (olive bg), the ink marquee band, and the ink footer.

Expected for every screenshot: the two grid columns in each `.sectionGrid` are equal width and vertically aligned (no overlap, no column bleeding into the next section), the photo frames show a visible thick border, the stamp badge is fully visible inside its section (not clipped at the section edge), and there is no unstyled/transparent gap between sections.

If anything overlaps, clips, or shows the wrong background color, fix it in `desktop-editorial-sections.module.css` (most likely culprits: a missing `position: relative` on the section, or a stamp badge width/offset that doesn't fit at narrower widths — check at 1024px too) before moving on.

- [ ] **Step 2: Check text/background contrast programmatically**

Run this in the browser via `mcp__Claude_Browser__javascript_tool`:

```js
function luminance(hex) {
  const [r, g, b] = hex.match(/\w\w/g).map(h => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(hex1, hex2) {
  const l1 = luminance(hex1), l2 = luminance(hex2);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}
({
  terracottaOnCream: contrast('9c4420', 'f7ecd9'),
  oliveOnCream: contrast('5c6b3f', 'f7ecd9'),
  inkOnMustard: contrast('241c14', 'd9a441'),
  inkOnPaper: contrast('241c14', 'f4e8d0'),
})
```

Expected: every value is `>= 4.5` (WCAG AA for normal text). If any value is below 4.5, darken the background token (for a light-text section) or darken the text token further in `desktop-editorial-sections.module.css`, then re-run this check.

- [ ] **Step 3: Confirm the footer CTA and internal links work**

1. Scroll to the footer.
2. Click "Explore Bastrop on Maps" (`mcp__Claude_Browser__find` with `query: "Explore Bastrop on Maps"`, then `mcp__Claude_Browser__computer` with `action: "left_click"` on the returned ref) — it should open Google Maps in a new tab (`target="_blank"`).
3. Click "There's more to the story" in the collection section and confirm it scrolls to the `#desktop-beyond` section (the `<section id="desktop-beyond">` heading should land near the top of the viewport, respecting the `scroll-margin-top: 130px` already set on `.journal section`).

Expected: both links work as described. If the anchor link doesn't scroll to the right place, check that the `id="desktop-beyond"` attribute is still present on the beyond `<section>` in `desktop-editorial-sections.tsx` (Task 2, Step 1).

- [ ] **Step 4: Re-check the mobile/tablet layout is untouched**

Resize the viewport to 767px wide (`mcp__Claude_Browser__resize_window` with `preset: "mobile"` or `width: 767, height: 1200`) and reload. Expected: the mobile hero/eyes/collection/personal/beyond/footer layout looks exactly as it did before this change (this plan touched no mobile-facing files, so this is a sanity check, not expected to require any fix).

- [ ] **Step 5: Commit any fixes made during this task**

Only run this if Steps 1–4 required changes to `desktop-editorial-sections.module.css` or `.tsx`:

```bash
cd "C:/Projetos/marthas-vintage" && git add src/components/desktop-editorial-sections.module.css src/components/desktop-editorial-sections.tsx && git commit -m "$(cat <<'EOF'
fix: address visual/contrast issues found in retro catalog redesign

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

If no changes were needed, skip this step — there's nothing to commit.
