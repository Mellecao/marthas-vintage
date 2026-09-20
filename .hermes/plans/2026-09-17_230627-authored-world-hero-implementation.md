# Authored World Hero Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build the new Martha’s Vintage hero at `/direction`, using an authentic wide store photograph, a unified logo, full desktop navigation, minimal copy, and a short scroll-driven expansion from an inset image to full viewport.

**Architecture:** Build the new hero in parallel with the current homepage under the existing `feat/marthas-authored-world-redesign` branch. Use a dedicated `authored-world` component boundary and scoped CSS Module. Reuse GSAP + ScrollTrigger for one short desktop pin; mobile uses normal document flow with a short non-pinned expansion. Keep the current homepage and its hero untouched until final approval.

**Tech Stack:** Next.js 16.3.3, React 19.2.8, TypeScript, CSS Modules, `next/image`, GSAP 3.15 + ScrollTrigger, Lenis compatibility, real browser visual QA.

---

## 1. Locked design decisions

These choices were made by the user and are not implementation hypotheses:

1. **Hero subject:** an authentic, broad photograph of the physical shop.
2. **Image treatment:** almost full-screen and immersive; logo/text are placed only over visually calm regions.
3. **Scroll behavior:** short expansion. The image begins with small margins and reaches full viewport after a brief scroll.
4. **Copy density:** minimal—unified logo, `Bastrop, Texas`, and one short CTA.
5. **Desktop navigation:** complete navigation visible from the first frame; logo left, discreet links right.
6. **Logo behavior:** “Martha’s” and “Vintage” remain together as a single visual lockup from frame one. They never occupy opposite ends of the screen.
7. **Conceptual requirement:** the first impression is entry into Martha’s real world, not a magazine cover, period campaign, or retro catalog.

---

## 2. Critical asset decision before coding

### Current candidate audit

| Asset | Dimensions | Assessment |
|---|---:|---|
| `public/assets/site/photos/store_1.jpg` | 1200×1600 | Authentic-looking broad view with clear depth; strong portrait/mobile candidate, but insufficiently wide as the only desktop master. |
| `public/assets/site/photos/store_2.jpg` | 3470×2838 | Best broad desktop composition and enough resolution, but the source visibly contains a `generated content` mark near the bottom-left. It must not be used automatically. |
| `public/assets/site/photos/store_3.jpg` | 3000×4000 | Strong objects/details, but too close and visually dense for the requested broad establishing view. |
| `public/assets/site/store-landscape.png` | 347×284 | Too low-resolution for hero use and visibly processed; reference only. |
| `public/assets/site/store-portrait.png` | 216×456 | Too low-resolution for hero use; reference only. |

### Gate A — authenticity and source resolution

Before implementing the visual layer:

1. Search the 67 original Martha files by image similarity/dimensions for an unmarked original of `store_2.jpg`.
2. Compare candidate pixels and metadata; do not infer authenticity from filename.
3. If an unmarked original exists, use it as the desktop and responsive master.
4. If no unmarked source exists, do **not** clone, erase, or generatively remove the mark.
5. In that case, use `store_1.jpg` temporarily for composition validation and request/locate a wider original before final hero approval.
6. Record the selected source path, dimensions, hash and crop intent in the asset manifest.

**Acceptance:** the hero source is traceable to a real supplied photograph and contains no generated scenery, AI extension, synthetic object, or unexplained watermark.

---

## 3. Target visual composition

## 3.1 Desktop initial state

Viewport target: `100svh`, minimum safe height `620px`.

```text
┌──────────────────────────────────────────────────────────────┐
│  [Martha’s Vintage]          Home  Styled  Collection  ...  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │            AUTHENTIC WIDE SHOP PHOTOGRAPH              │  │
│  │                                                        │  │
│  │                                                        │  │
│  │ Bastrop, Texas                                         │  │
│  │ Enter the collection ↓                                 │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

Specifications:

- outer image inset: `clamp(10px, 1.25vw, 22px)`;
- maximum corner radius: 6px, animated to 0 during expansion;
- image fills the frame with an authored `object-position`;
- logo sits top-left within a safe zone over a light, quiet wall/window region;
- full nav sits top-right and remains one line at standard desktop widths;
- only localized top and lower-left readability gradients are allowed;
- no opaque card behind the logo or copy;
- no paper texture, grunge, badge, chapter number or butterfly in this hero;
- no paragraph or slogan in the first frame;
- the logo asset is `public/assets/logo/logo-somente-lettering-reto.svg`, preserving original shape and color;
- visible `h1` is not duplicated; the SVG image has an accessible brand label or is paired with a screen-reader heading.

### Recommended copy

- location: `Bastrop, Texas`
- CTA draft: `Enter Martha’s world` or `Explore the collection`

The plan uses `Enter Martha’s world` as the implementation placeholder because it matches the first section’s purpose. Before production, confirm the wording against the final next-section anchor.

## 3.2 Desktop expanded state

- image frame reaches viewport edges;
- border radius reaches 0;
- image scale changes no more than `1 → 1.025` to avoid artificial camera movement;
- logo and nav compact slightly but remain visible and stable;
- location and CTA fade/translate by a small amount as the next section approaches;
- a subtle canvas-backed header state may appear only after the hero releases;
- the expanded frame must not crop a different semantic subject than the initial frame.

## 3.3 Mobile initial state

- standard flow, no long pin;
- compact unified logo left and `Menu` right;
- broad store image is art-directed for a portrait crop;
- location + CTA sit within a calm lower-left region or immediately below the image if contrast cannot be guaranteed;
- image begins inset by 10–14px;
- no brown card;
- no body paragraph;
- no full desktop nav squeezed into mobile.

## 3.4 Mobile expansion

- normal page scroll remains available;
- as the first 25–35vh are scrolled, the image inset reaches zero and radius reaches zero;
- optional scale capped at `1.015`;
- no pin longer than one natural gesture;
- reduced-motion version renders the expanded state immediately.

---

## 4. Scroll timeline specification

### Desktop

ScrollTrigger:

- trigger: hero root;
- start: `top top`;
- end: approximately `+=65vh` after initial viewport, tuned by gesture testing;
- `pin: true`;
- `scrub: 0.25–0.4`;
- `anticipatePin: 1`;
- `invalidateOnRefresh: true`.

Timeline:

| Progress | State |
|---:|---|
| 0–0.15 | Initial composition held long enough to read logo, location and CTA. |
| 0.15–0.72 | Image inset and corner radius interpolate to zero; optional scale reaches max 1.025. |
| 0.45–0.78 | Logo and nav compact subtly into persistent header dimensions. |
| 0.60–0.86 | Location and CTA reduce opacity and move 10–16px, never abruptly disappearing. |
| 0.86–1.00 | Final state settles; no blank dwell after animation completion. |

Implementation rules:

- use one GSAP context rooted in the hero;
- use `gsap.matchMedia()` for desktop, mobile and reduced motion;
- avoid DOM reparenting used by the current hero; the new header stays fixed in one DOM location;
- do not create a second copy of logo or navigation for handoff;
- store state in DOM/CSS, not React state on every scroll frame;
- clean up ScrollTrigger, media context and inline GSAP styles on unmount;
- verify reverse scroll returns to exact initial geometry;
- refresh correctly after resize, font load and image decode.

### Mobile

- no pin by default;
- use a small ScrollTrigger scrub against the hero root or a CSS scroll timeline only if browser support/fallback is verified;
- animation affects inset/radius/scale only;
- content flow must work when JS is disabled or fails.

### Reduced motion

- no pin;
- no scrub;
- render image edge-to-edge or near-final state;
- logo, nav, location and CTA all remain present and usable;
- focus order is unchanged.

---

## 5. Header behavior

### Desktop links

Use the new information architecture and real preview anchors:

```ts
[
  { label: "Home", href: "#home" },
  { label: "Styled by Martha", href: "#styled-by-martha" },
  { label: "The Collection", href: "#collection" },
  { label: "Beyond the Wardrobe", href: "#beyond-the-wardrobe" },
  { label: "Visit", href: "#visit" },
]
```

For the hero-only phase, placeholder sections with the real IDs may exist below the fold solely to make navigation targets honest. They should not pretend the rest of the redesign is complete.

Behavior:

- header is one semantic `<header>` with one `<nav>`;
- fixed above hero imagery with safe-area padding;
- dark ink on light image zone for initial candidate;
- if visual QA proves the image cannot sustain contrast, use a localized top gradient—not a full opaque bar;
- after hero release, header receives a subtle `--mv-canvas` background with blur only if performance and text clarity benefit;
- links use a simple underline/offset hover and clear focus ring;
- no dotted leaders;
- no hide-on-scroll logic during the hero phase; implement that only after the next section exists and the transition can be tested in context.

### Mobile menu

The hero implementation includes only the entry control and accessible menu shell necessary for navigation testing:

- unified logo left;
- `Menu` button right, at least 44×44 CSS pixels;
- correct `aria-expanded` and `aria-controls`;
- Escape closes;
- focus returns to trigger;
- body locks only while open;
- content uses the same five links.

Do not import the old magazine-style mobile menu unchanged.

---

## 6. File architecture

### Create

- `src/app/direction/page.tsx`
- `src/components/authored-world/authored-world-page.tsx`
- `src/components/authored-world/site-header.tsx`
- `src/components/authored-world/threshold-hero.tsx`
- `src/components/authored-world/mobile-navigation.tsx`
- `src/components/authored-world/authored-world.module.css`
- `src/data/marthas-media.ts`
- `public/assets/site/authored-world/hero/` derivatives after source approval
- `public/assets/site/authored-world/asset-manifest.json`
- `scripts/qa/verify-authored-world-hero.mjs`

### Modify only if required

- `src/app/layout.tsx` only if a truly global accessibility or font requirement cannot stay scoped;
- `src/app/globals.css` only for approved global tokens, never for broad hero overrides.

### Explicitly do not modify during hero phase

- `src/app/page.tsx`
- `src/components/desktop-home-hero.tsx`
- `src/components/desktop-editorial-sections.tsx`
- current homepage hero CSS selectors
- existing original image files
- loader behavior, unless a loader defect blocks `/direction` review.

---

## 7. Task-by-task implementation

### Task 1: Establish the hero asset source

**Objective:** Select a traceable, authentic high-resolution shop image before styling against it.

**Files:**

- Create: `public/assets/site/authored-world/asset-manifest.json`
- Create: approved optimized derivatives under `public/assets/site/authored-world/hero/`
- Read only: all 67 supplied originals and current store assets

**Steps:**

1. Hash `store_1.jpg`, `store_2.jpg`, `store_3.jpg` and visually similar originals.
2. Search for an unmarked source of `store_2.jpg` using dimensions, perceptual hash and contact-sheet inspection.
3. Confirm whether `generated content` is part of the source and whether the image contains edited/extended content.
4. Select the approved master or use `store_1.jpg` as a temporary proof-only fallback.
5. Create desktop and mobile AVIF/WebP derivatives without overwriting the original.
6. Record source hash, dimensions, crop and approval state in the manifest.
7. Compare derivatives against source for garment/object/color fidelity.

**Verification:**

- original hash remains unchanged;
- derivatives decode successfully;
- no unexplained watermark or generated area appears;
- crop preserves an ample view of the shop;
- desktop width is sufficient for DPR 2 at target viewport.

**Checkpoint:** Stop for user approval if no clean broad original exists.

---

### Task 2: Add structural QA assertions first

**Objective:** Define automated source-level acceptance before writing the new hero components.

**Files:**

- Create: `scripts/qa/verify-authored-world-hero.mjs`

**Assertions:**

- `/direction` route exists;
- hero has one `h1`/brand label;
- five navigation destinations are present;
- unified logo asset is used;
- old split assets `marthas-word.svg` and `vintage-word.svg` are absent from authored-world files;
- no `Chapter`, `issue`, `desktop-home-butterfly`, or dotted leader string appears;
- selected hero asset exists and is referenced by media data;
- reduced-motion media query exists in the scoped stylesheet/component;
- hero component exposes stable data hooks for browser QA.

**Step 1:** Write assertions against not-yet-created files.

**Step 2:** Run:

```bash
node scripts/qa/verify-authored-world-hero.mjs
```

Expected: FAIL with missing route/components.

---

### Task 3: Create the preview route and semantic shell

**Objective:** Render an accessible static hero at `/direction` before animation.

**Files:**

- Create: `src/app/direction/page.tsx`
- Create: `src/components/authored-world/authored-world-page.tsx`
- Create: `src/components/authored-world/threshold-hero.tsx`
- Create: `src/components/authored-world/site-header.tsx`
- Create: `src/data/marthas-media.ts`

**Steps:**

1. Define typed media metadata with source, alt, width, height and object-position values.
2. Create semantic route shell: header, main, hero section and temporary honest target anchors.
3. Render official unified lettering once.
4. Render location and CTA only—no paragraph.
5. Add full desktop nav with the five approved labels.
6. Use `next/image` with explicit `fill`, correct `sizes`, priority and no duplicated preload.
7. Keep all essential content visible without JavaScript animation.
8. Run the structural QA script; expected failures should now be limited to styling/motion assertions.

---

### Task 4: Implement static desktop composition

**Objective:** Make the initial hero frame visually correct before adding scroll behavior.

**Files:**

- Create: `src/components/authored-world/authored-world.module.css`
- Modify: authored-world hero/header components only

**Steps:**

1. Create scoped tokens for canvas, ink, line, gutter and safe-area spacing.
2. Build a `100svh` hero with small outer inset.
3. Apply authored object-position for 1024, 1280, 1440 and 1920 widths.
4. Place logo top-left in the verified quiet zone.
5. Place nav top-right; preserve one-line layout at >=1280 and controlled spacing at 1024.
6. Add localized readability gradients only where measured contrast needs them.
7. Place `Bastrop, Texas` and CTA lower-left.
8. Add hover/focus styles.
9. Do not add decorative overlays.

**Visual verification:**

- screenshot 1024×768, 1280×720, 1366×768, 1440×900 and 1920×1080;
- compare real gaps from all viewport edges;
- inspect whether logo/nav obscure meaningful shop objects;
- calculate contrast over the actual image areas;
- confirm logo reads as one unit.

**Gate B:** User approves static desktop first frame before motion.

---

### Task 5: Implement static mobile composition and menu

**Objective:** Create an intentional mobile hero rather than a scaled desktop layout.

**Files:**

- Create: `src/components/authored-world/mobile-navigation.tsx`
- Modify: `site-header.tsx`, `threshold-hero.tsx`, scoped CSS

**Steps:**

1. Add mobile logo + Menu arrangement.
2. Implement accessible menu open/close state.
3. Trap focus and restore focus on close.
4. Lock body scroll only while open.
5. Choose a mobile crop from the same approved source; use a separate derivative only for art direction, not content replacement.
6. Place location and CTA over a verified calm region or directly after the image if contrast fails.
7. Ensure all touch targets are >=44×44.
8. Verify without hover.

**Visual verification:**

- screenshot 360×740, 375×812, 390×844, 402×874 and 430×932;
- verify crop preserves store breadth rather than becoming a random product close-up;
- check safe-area insets;
- test menu at 200% text scaling.

**Gate C:** User approves static mobile frame and menu.

---

### Task 6: Add short desktop expansion

**Objective:** Animate the approved frame from inset to full viewport using one short reversible scroll.

**Files:**

- Modify: `src/components/authored-world/threshold-hero.tsx`
- Modify: scoped CSS

**Steps:**

1. Add GSAP context and `matchMedia()`.
2. Query stable data hooks inside the hero root.
3. Create desktop ScrollTrigger with `end: +=65vh` as the initial value.
4. Animate inset/radius to zero and image scale to <=1.025.
5. Compact logo/nav subtly without changing their identity.
6. Fade/translate location and CTA late in the timeline.
7. Add settle time only if it improves the handoff; no blank dwell.
8. Add cleanup and refresh behavior.
9. Confirm reverse scroll reproduces initial frame exactly.
10. Test a resize at 0%, 50% and 100% progress.

**Verification states:** screenshots at 0%, 25%, 50%, 75% and 100% for 1024, 1440 and 1920 widths.

**Gate D:** User approves animation duration, crop evolution and final header state.

---

### Task 7: Add mobile expansion and reduced motion

**Objective:** Preserve the selected expansion concept on mobile without trapping scroll.

**Files:**

- Modify: hero component and scoped CSS

**Steps:**

1. Implement non-pinned mobile inset/radius transition over 25–35vh.
2. Cap scale at 1.015.
3. Ensure one normal swipe advances beyond the hero.
4. Add reduced-motion branch with no pin/scrub.
5. Ensure menu and CTA stay functional in all branches.
6. Refresh calculations on orientation change.

**Verification:**

- one-swipe exit on 360×740 and 390×844;
- landscape mobile does not clip nav or image;
- reduced-motion screenshots show complete content;
- focus order is unchanged.

---

### Task 8: Integrate header handoff and honest next-section target

**Objective:** Make the hero release into the preview page cleanly without pretending later sections are finished.

**Files:**

- Modify: `authored-world-page.tsx`
- Modify: `site-header.tsx`
- Modify: scoped CSS

**Steps:**

1. Add a neutral preview boundary below the hero with the real `#styled-by-martha` anchor.
2. Ensure CTA scrolls to that target.
3. Transition header background only after the hero release.
4. Keep the same header DOM nodes throughout.
5. Confirm skip-link and anchor offsets.
6. Do not implement hide-on-scroll until the next section is real enough to validate it.

---

### Task 9: Final quality gates

**Objective:** Verify correctness before requesting approval to continue to `Styled by Martha`.

**Commands:**

```bash
node scripts/qa/verify-authored-world-hero.mjs
npm run lint
npm run build
```

Expected:

- structural QA passes;
- ESLint exits 0;
- production build exits 0;
- `/direction` is included in build output;
- no hydration, asset, image-size or ScrollTrigger console errors.

**Browser checks:**

- all required desktop/mobile/tablet viewports;
- initial, midpoint and expanded states;
- reverse scroll;
- reload at mid-page;
- resize/orientation change;
- keyboard navigation;
- open/close mobile menu;
- reduced motion;
- slow network/image decode;
- loader interaction if loader appears on `/direction`;
- no horizontal overflow;
- no text or logo over critical merchandise;
- color fidelity against source.

**Final gate:** present screenshots and implementation URL to the user. Do not commit, push, deploy, replace `/`, or remove the old hero without explicit approval.

---

## 8. Acceptance criteria

The hero is accepted only when all are true:

### Concept

- it feels like entering the real shop;
- the photo is broad enough to establish a world, not a product detail;
- the experience does not resemble a magazine cover;
- the logo reads as one brand lockup;
- navigation feels contemporary and discreet;
- minimal copy leaves the photograph dominant.

### Authenticity

- selected photo is source-traceable;
- no AI-generated environment or extension is used without explicit approval;
- no watermark is removed to disguise source history;
- garment/object colors remain faithful;
- mobile and desktop crops preserve identifiable store context.

### Layout

- initial image has small deliberate margins;
- expanded image reaches viewport edges without white gaps;
- logo/nav occupy quiet zones;
- CTA and location remain readable;
- no clipping at required viewports;
- no brown card, chapter number, dotted leader, stamp or flying butterfly.

### Motion

- expansion completes in a short scroll;
- no long post-animation pin;
- reverse scroll is exact;
- resize does not detach elements;
- mobile exits in one normal gesture;
- reduced motion has no pin or scrub.

### Engineering

- current homepage remains untouched;
- `/direction` is independently reviewable;
- one semantic header/nav exists;
- image optimization is correct;
- build/lint/QA pass;
- no new console errors;
- no unrelated dirty-tree files are changed.

---

## 9. Risks and mitigations

### Risk: no clean broad store original

**Mitigation:** stop after asset audit; use `store_1.jpg` only as a temporary composition proof; request or locate the original rather than fabricating width.

### Risk: navigation loses contrast over a visually dense shop

**Mitigation:** authored crop + localized top gradient + tested ink color. Do not add a generic opaque header prematurely.

### Risk: expansion crops away the sense of place

**Mitigation:** define start/end object-position explicitly and compare visible geometry at every required aspect ratio.

### Risk: current loader delays every review

**Mitigation:** test route interaction first; alter loader only under a separate approved task if it blocks inspection.

### Risk: old global CSS leaks into the new route

**Mitigation:** scoped CSS Module, specific authored-world root, no reuse of broad `.desktop-home-*` classes.

### Risk: GSAP pin conflicts with Lenis or resize

**Mitigation:** one trigger, `invalidateOnRefresh`, image decode refresh, context cleanup, reverse/resize tests at intermediate progress.

---

## 10. Open item before implementation

The design decisions are sufficiently resolved to start. The only blocking item is **which clean, authentic broad shop original will be the final source**. Implementation can begin with the verified fallback for geometry, but the hero cannot receive final approval until that source is resolved.

No commit, push, deployment or homepage swap is included in this plan.
