# Desktop retro-catalog redesign — design spec

## Context

The desktop experience (>=1024px) has two parts:
- `DesktopHomeHero` (`src/components/desktop-home-hero.tsx`) — the pinned GSAP scroll animation that reveals the logo/nav/photo. Approved, out of scope.
- `DesktopEditorialSections` (`src/components/desktop-editorial-sections.tsx` + `desktop-editorial-sections.module.css`) — everything from "A particular point of view" down through the footer. This is what users see as "broken" and "trying too hard": asymmetric grid spans (`1.08fr 1fr`, `grid-row: 1 / span 2`), negative-margin overlaps, and a decorative `ScrollRoadline` SVG squiggle drawn behind the content.

The mobile/tablet experience (`.legacy-content`, `<1024px`) is untouched by this work — it already reads well per the user.

## Goal

Replace `DesktopEditorialSections`'s visual language with a **retro catalog/ad** aesthetic: solid alternating section backgrounds, thick photo frames, a rotating circular stamp badge marking each section, large centered display headlines, and a regular (non-overlapping) grid. This should read as more "standard" (predictable, non-fragile grid) while being visually bolder than the current quiet editorial treatment.

## Out of scope

- `DesktopHomeHero` and its GSAP pin/scroll timeline — unchanged.
- Mobile/tablet layout (`legacy-content`, `page.tsx`'s `HeroFrame`/`EyesFrame`/etc.) — unchanged.
- Copy content — headings and body text stay the same as today; only presentation changes.

## Palette (new CSS custom properties, scoped to the desktop journal)

| Token | Value | Usage |
|---|---|---|
| `--journal-paper` | `#f4e8d0` | Section 01 background |
| `--journal-terracotta` | `#b8502f` | Section 02 background, cream text |
| `--journal-olive` | `#5c6b3f` | Section 03 background, cream text |
| `--journal-mustard` | `#d9a441` | Interlude band background |
| `--journal-ink` | `#241c14` | Footer background (reuses existing `--brown` tone), frame/stamp ink |
| `--journal-cream` | `#f7ecd9` | Text on dark backgrounds |

## Layout rules (applies to all 3 content sections)

1. **Header block**: centered, full-width. Eyebrow label + large serif display headline (existing `--font-suravaram`), centered text-align, max-width constrained for line length. No more left-aligned two-column heading/paragraph split.
2. **Content grid**: `display: grid; grid-template-columns: repeat(2, 1fr); gap: <fixed value>;` — always equal columns, always same row (no `grid-row: span`, no asymmetric fr values, no negative margins). One column holds body copy, the other holds a photo (or vice versa, alternating per section for visual rhythm).
3. **Photo frame**: thick solid border (6–8px) in the section's accent ink/cream tone (whichever contrasts), replacing the current 1px-implied hairline frame. Caption stays below in small uppercase label style.
4. **Section stamp**: the current plain text section number ("01", "02"...) is replaced by the existing `RotatingBadge` component (circular rotating text + eye icon), restyled per section (color swapped via CSS to match section accent), positioned absolutely in a corner of the section as a decorative seal. Replaces `SectionLine`'s number; the `SectionLine` note text (e.g. "Bastrop, Texas · A personal collection") stays as a small caption near the stamp.

## Section-by-section

**01 — A particular point of view** (`--journal-paper` background, ink text)
- Centered header: eyebrow "Through Martha's eye", headline "An eye for the *extraordinary.*", standfirst line.
- Stamp badge top-right corner.
- Grid: copy (drop cap paragraph + supporting paragraph + signature line) | photo (`store_1.jpg`, thick ink-bordered frame).

**02 — The collection** (`--journal-terracotta` background, cream text)
- Centered header: headline "Curated, *not accumulated.*", supporting line.
- Stamp badge top-left corner (alternate side from section 01).
- Grid: photo (`look1_1.png`, cream-bordered frame) | copy ("Notes on collecting" + "No rules" text, "There's more to the story" link restyled as a cream underline link).
- Second photo (`look1_4.jpg`) and its copy currently in `.collectionAside` fold into a second grid row below the first (same `repeat(2,1fr)` pattern, photo/copy swapped left-right vs. row above) rather than a spanning aside column.

**Interlude** (`--journal-mustard` band, full-width, ink text)
- Full-bleed color band, centered content: eyebrow, large italic phrase ("Old soul. *Entirely your own.*"), `RotatingBadge` centered below/beside it at larger scale as the band's visual anchor.

**03 — Beyond the wardrobe** (`--journal-olive` background, cream text)
- Centered header: headline "A way of dressing. *A way of seeing.*", supporting line.
- Stamp badge top-right corner.
- Grid: photo (`beyondthewardrobe_3.jpg`, cream-bordered frame) | copy ("At home with Martha" text + second smaller photo `beyondthewardrobe_6.jpg` inline below the copy, same thick-frame treatment at smaller size).

**Footer** (`--journal-ink` background, cream text — this already matches `--brown`/`--cream-ink` tokens used elsewhere, just centered now)
- Centered layout (was 2-column grid): headline "Come for a look. *Stay for the stories.*", address/description paragraph, then a "ticket" style CTA button (thick cream border, square corners, padding) linking to Google Maps, replacing the current underline link row.
- Below: centered logo, copyright, "Back to the beginning" link — same content, centered instead of the current 3-column `footerBottom` row.

## Removed

- `ScrollRoadline` is no longer rendered inside `DesktopEditorialSections`. Section separation instead comes from the hard color changes between sections (no divider line needed) plus a solid `border-top` on the footer (already present).
- The `SlowMarquee` strip between section 03 and the footer stays (it's a simple horizontal marquee, fits the catalog aesthetic as a printed banner strip) — restyle its background/text color to `--journal-ink`/`--journal-cream` for contrast instead of its current muted `--marquee` tan.

## Components touched

- `src/components/desktop-editorial-sections.tsx` — restructure JSX: drop `SectionLine`'s number prop in favor of a `SectionStamp` wrapper around `RotatingBadge`; flatten the two-column asymmetric grids into the regular grid described above; remove `ScrollRoadline` usage.
- `src/components/desktop-editorial-sections.module.css` — full rewrite of section rules per above (palette, grid, frame, stamp positioning). `RotatingBadge`'s own CSS (in `vintage-details.css` or wherever it's styled) needs a way to accept a color override per placement — check current styling and add a CSS custom property hook (e.g. `--badge-ink`) rather than duplicating the component.
- No changes to `vintage-details.tsx` component logic — only how its output is styled/positioned where reused.

## Accessibility / responsiveness

- This only affects `min-width: 1024px` (the existing `.journal` media query gate) — no change to that breakpoint boundary.
- Maintain existing heading hierarchy (`h2`/`h3`) and alt text on images — content and semantics unchanged, only visual layout.
- Ensure text/background contrast meets WCAG AA for cream-on-terracotta, cream-on-olive, cream-on-ink combinations (verify computed contrast ratios when picking final hex values during implementation; adjust shade if any pairing falls short).

## Testing / verification

- Run the dev server, view the page at >=1024px width, scroll through all sections, confirm: no visual overlap/clipping, grid stays regular at 1024px/1440px/1920px widths, stamp badges render legibly on their background colors, footer CTA is clickable and correctly links to the existing Google Maps URL.
