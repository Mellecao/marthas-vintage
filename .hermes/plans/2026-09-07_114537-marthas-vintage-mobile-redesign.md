# Martha’s Vintage — Mobile + Desktop Newspaper Redesign Plan

> **For Hermes:** Use the plan skill task-by-task. This remains a planning document; its Revision 2 incorporates the user-approved desktop scope expansion and the supplied newspaper references.

**Goal:** Rebuild the phone experience (`max-width: 767px`) and redesign the desktop experience from the second section onward as a contemporary vintage newspaper/editorial system. Preserve the approved desktop hero, its upper navigation, its scroll handoff behavior and its hero animation exactly; keep the resulting experience robust on iOS Safari.

**Architecture:** Add a separately mounted mobile experience instead of reshaping the current fixed-artboard phone frames. On desktop, keep `DesktopHomeHero` untouched and replace only the post-hero editorial layer with a new responsive newspaper system built on an explicit grid, paper material, rules, modules and image plates. The existing legacy composition remains the tablet-only fallback from `768px` through `1023px` unless the user later expands that scope.

**Tech Stack:** Next.js 16 / React 19, TypeScript, CSS Modules + scoped mobile media queries, GSAP + ScrollTrigger (no mobile pinning), native CSS animation, native SVG, existing image assets, optional ComfyUI Z-Image Turbo derivatives, optional pre-rendered Remotion MP4 only when a motion asset is genuinely needed.

---

## 1. Confirmed baseline and non-negotiable scope

### Repository / rollback state

- Current branch: `feat/marthas-newspaper-redesign`.
- Current committed checkpoint: `c6017e7 checkpoint`.
- `git status --short` was empty at planning time.
- Therefore, there is a clean rollback point before this redesign. Before a future commit, changes can be discarded with `git restore`; after a future commit, the change can be reversed with a dedicated `git revert` commit. No commit, push, or deployment is part of this plan.

### Scope boundary

| Range | Planned behavior |
|---|---|
| `0–767px` | Complete visual and interaction redesign. |
| `768–1023px` | Preserve the currently committed tablet composition exactly. No new mobile component may render visibly here. |
| `>=1024px` | Preserve the approved desktop hero, upper menu and hero animation; redesign only the editorial content after the hero as a responsive newspaper system. |

### Explicitly preserved

- The optimized native-video loader at `public/assets/site/marthas-loader.mp4` remains unchanged.
- Desktop hero, its responsive GSAP logic and persistent upper menu remain unchanged; only post-hero desktop editorial sections are a redesign target.
- Existing logo, paper/grunge textures, existing photography, colors, and authored brand assets remain usable source material.
- Existing desktop prose is the first factual source; Revision 2 permits new concise editorial copy where the newspaper layout requires it, without inventing claims.

### Explicitly excluded from mobile

- Three.js / React Three Fiber.
- Horizontal page sections, horizontal storytelling, or a horizontal-scroll requirement.
- ScrollTrigger `pin`, ScrollSmoother, fixed full-screen scenes, or long dead-scroll zones.
- Runtime Remotion Player, canvas effects, particle systems, or large multilayer masks.
- Generic Lucide icons as visual ornaments. Icons will be vintage, graphic, and brand-specific.
- `background-attachment: fixed`, unbounded blur/filter layers, and animation that changes layout on scroll.

---

## 2. What the current mobile implementation tells us

The current mobile path is a collection of fixed artboard-derived frames (`.design-frame`, `.hero-frame`, `.eyes-frame`, `.collection-frame`, `.personal-frame`, `.beyond-frame`) with a large amount of absolute positioning in `cqw`. It was valuable for faithfully recreating an initial composition, but it is the wrong base for a new editorial mobile experience because:

1. Type, decoration, crop, and imagery are coupled to fixed artboard positions.
2. Long copy and short iOS visual viewports are more vulnerable to collision than normal document flow.
3. The current `@media (min-width:768px) { .site-shell { width:402px } }` is part of the tablet baseline and cannot be casually changed.
4. The existing `ScrollRoadline` uses a raw path length and direct scroll mapping. The redesign needs a rendered-length roadline that never visibly shows future route segments after resize.
5. Existing mobile carousels are horizontal scroll tracks. The new experience should use tap-controlled or vertically presented image sequences instead.

**Resulting decision:** create a new mobile-only component tree, instead of piling more overrides on `globals.css` / `vintage-details.css`.

---

## 3. Art direction: “collected Americana, not a retro template”

### Core visual statement

The phone site should feel like moving through an intensely personal, modern collector’s scrapbook: sun-faded paper, saturated flower red, cold butterfly blue, tobacco brown, painterly black, visible grain, oversized editorial type, and little evidence of the hand that made the page.

It should be **stimulating but legible**: every screen gets one dominant image/action, one typographic hierarchy, and one decorative gesture. The page earns its density through materials and rhythm—not by stacking effects over content.

### Design tags for the reference-analysis phase

`contemporary vintage` · `Americana` · `collector’s notebook` · `printed ephemera` · `fashion editorial` · `hand-inked botanical` · `storybook oddity` · `sun-faded paper` · `rust red` · `cobalt butterfly blue` · `olive interior` · `scanned textile grain` · `stamped labels` · `postage frame` · `museum inventory tag` · `maximal but composed` · `tactile` · `human` · `warmly eccentric`.

### Fixed palette roles

| Token / role | Intent |
|---|---|
| Paper `#f2e5cd` / `#fbf1de` | Main reading surface, texture always subtle. |
| Ink `#221a12` | Text, outlines, high-contrast menu state. |
| Rust `#9c4420` | Emotional chapter/quote band, rose accents. |
| Butterfly blue | Cold counterpoint to rust; use only as a sharp graphic accent. |
| Olive `#4f5c36` | Interiors / beyond-the-wardrobe chapter. |
| Marigold | Small seal, index and motion accents—not a full reading background. |

### Typography system

- **Suravaram:** oversized chapter/display lines and emotional statements.
- **Poltawski Nowy:** body copy and location lines.
- **Geist:** metadata, indexes, controls, menu labels, counters.
- **Diplomata:** rare decorative word / stamp only; never for body copy.

The plan intentionally avoids creating a new font dependency. Contrast comes from scale, material, spacing, rules, composition and motion.

---

## 4. New mobile information architecture and exact copy contract

Every new visible paragraph/headline comes verbatim from the desktop editorial source in `src/components/desktop-editorial-sections.tsx`. The new mobile experience may change grouping, line breaks, art direction and hierarchy—but not prose wording.

### Mobile chapter map

| ID / menu destination | Desktop source to preserve | Phone composition |
|---|---|---|
| `#mobile-home` | Hero description: “Martha’s Vintage is a personal collection…” | Full-height opening poster. |
| `#mobile-story` | **Chapter One · The story**, “Noticing beautiful and unusual things.”, lede and three prose paragraphs | Portrait + oversized story typography + handwriting/index fragments. |
| `#mobile-quote` | “Beautiful things with a past, chosen for the life they can have now.” | Rust interlude with eye icon, marquee and a short breathing pause. |
| `#mobile-collection` | **Chapter Two · The collection**, “Curated, not accumulated.” and both desktop paragraphs | Catalogue/card sequence with photo deck and rotating seal. |
| `#mobile-style` | **Chapter Three · Personal style**, “Worn now. Never as costume.” and both desktop paragraphs | Fashion montage and tap-controlled looks. |
| `#mobile-beyond` | **Chapter Four · Beyond the wardrobe**, “Everything speaks the same language.” and both desktop paragraphs | Olive interiors/art chapter and a vertical roadline milestone. |
| `#mobile-vision` | **Chapter Five · The vision**, “Joyful, a little eccentric, and very human.” plus the three existing value cards | Dark final manifesto, three visual tokens, no duplicate marketing copy. |
| `#mobile-visit` | Desktop “From these pages to real life”, “Come and see it in person.”, footer paragraph and “Find us in Bastrop” | High-intent visit card + compact footer. |

### Content protection mechanism

1. Add `src/content/marthas-mobile-copy.ts` as a literal, reviewed transcription of the desktop source.
2. Do **not** alter `desktop-editorial-sections.tsx` during the first mobile redesign pass; this deliberately prioritizes desktop isolation over a premature shared-content refactor.
3. Add a small copy-contract QA script that reads the rendered mobile sections and asserts each required desktop sentence is present exactly once, with no legacy mobile paragraphs left visible below `768px`.
4. During final QA, export a desktop text snapshot and mobile text snapshot so the user can compare source content independently of layout.

---

## 5. Screen-by-screen visual plan

### Screen 01 — Home: “a living poster”

**Objective:** Replace the current photo/card arrangement with a confident opening that harmonizes image and text without forcing body copy over the photograph.

- `min-height: 100svh` with a safe `100vh` fallback; never rely on layout-changing `100dvh` while Safari’s browser chrome expands/collapses.
- Top chrome: compact lockup at left, an actual `44×44px` menu hit target at right, plus one small vintage icon/number marker.
- Central art: portrait inside a vertical *postage/paper-window* crop—not an opaque card. The crop will keep its own `aspect-ratio` and be defined in flow.
- The exact desktop description and **Bastrop, Texas** sit on a paper ledger below/partly tucked under the image edge, with enough contrast and a clear reading width.
- A blue butterfly and one rose/vine enter as **two** bounded decorative layers; no pile of independently animated assets.
- Bottom CTA: `Discover the story ↓` lands at `#mobile-story`; it receives a subtle offset-line hover/focus/tap state instead of a generic button.
- Motion: one 6–8px butterfly wing/translate loop while idle; respects reduced motion. On entry, image, card and type reveal with 180–420ms opacity/transform only.

### Screen 02 — The Story: “the notebook opens”

- Cream paper surface with a strong Suravaram heading and a thin inventory header: `Chapter One · The story`.
- Use `martha-portrait.webp` as the primary authored portrait, framed by a torn-paper edge / double print registration effect created in CSS/SVG, not a costly raster animation.
- Desktop lede is visually dominant; the three exact body paragraphs become readable normal-flow columns/blocks—not microtype or a fixed artboard.
- A small blue eye icon, rosebud/needle-like visual token, and a stamped number create hierarchy while leaving a clean text rail.
- The roadline begins invisibly near the section’s lower edge; it has no faint completed guide path.

### Screen 03 — Quote interlude: “ink on colored stock”

- Full-width rust band, paper grain visible through color.
- Exact desktop pull quote set large in cream, with `now.` italicized as in desktop.
- One existing eye asset becomes a printed stamp; `RotatingBadge` is reused or restyled as an adjacent seal.
- One marquee may use only existing desktop phrases (e.g. `CURATED, NOT ACCUMULATED`) and is transform-only, low-speed, pausable with reduced motion.
- This is an intentional rest/transition screen, not a content dump.

### Screen 04 — Collection: “a tactile catalogue, not a swipe gallery”

- Large `Curated, not accumulated.` headline over paper, with first paragraph at comfortable 17–19px-equivalent mobile sizing.
- Replace the horizontally swiped carousel with an **image deck controlled by visible Previous / Next buttons** and native semantic buttons. The current card and its caption change with a short opacity/translate transition; no scroll-snap strip is required.
- Use 3–5 of the existing `look1_*` photos in the primary mobile sequence. The rest stay lazy and can become secondary pages only if needed.
- The deck uses a physical catalog edge, numbered slide indicator, rotating “point of view” seal and an optional small cloth-tag ornament.
- The second exact desktop paragraph follows in normal flow after the deck, so reading does not depend on interacting with it.

### Screen 05 — Personal Style: “worn now”

- Rust / muted red ink field with light paper/print texture—visually different from collection’s cream catalogue.
- Exact chapter title and body prose appear first, then an asymmetric three-image look arrangement using the existing `look2_*` / shop imagery.
- A vertical marquee or rotated strip repeats only the existing phrase `WORN NOW. NEVER AS COSTUME.`
- A vintage icon vocabulary (hanger, thimble, hand-stitched star, rosebud) appears as outlined SVG/stamp motifs; not Lucide outline icons.
- Parallax is shallow and only applies to decorative paper strips, maximum 14px, never to body text or hit targets.

### Screen 06 — Beyond the Wardrobe: “the collection becomes a world”

- Olive chapter surface with a strong framed interior image and the exact `Everything speaks the same language.` display.
- Use existing `beyondthewardrobe_*` images and `quadros.png`; one image at a time has primary visual focus.
- A custom complementary botanical/interior ornament may frame the section edges, but it must not copy the logo rose cluster exactly.
- The roadline passes through its most visible milestone here, revealing an eye/art/needlepoint icon only when the line reaches it.
- Both existing desktop paragraphs are fully visible in reading order.

### Screen 07 — Vision: “a dark cabinet of values”

- Ink background with cream typography, intentionally sparse but high contrast.
- Exact desktop vision statement, then the existing three desktop value headings and paragraphs as three stacked *cabinet cards*.
- Each card has one vintage visual token and a very subtle tactile reveal; card order is semantic and never requires horizontal interaction.
- The final card transitions into a narrow marquee / badge area that leads into the visit destination.

### Screen 08 — Visit / Footer: “from pages to real life”

- Strong black/ink or deep brown close, using a darkened shop image as a framed location plate.
- Preserve exact desktop visit copy and map destination (`Find us in Bastrop`); do not retain the current `href="#visit"` self-link.
- `Find us in Bastrop ↗` uses the existing desktop Google Maps URL.
- Footer retains logo, Bastrop, Texas and copyright with deliberate spacing; menu has a `Back to the beginning ↑` route.

---

## 6. Full-screen mobile menu specification

### UX contract

- Trigger opens a truly full-viewport overlay. It does not push document content.
- State machine: `closed → opening → open → closing → closed`; unmount only after the close animation completes.
- Navigation destinations: Home, The story, The collection, Personal style, Beyond the wardrobe, The vision, Visit.
- Each item is an anchor to a real unique `mobile-*` ID. No placeholder `#` routes.
- Menu uses a CSS tile cascade: 6 equal columns, `grid-auto-rows: calc(100vw / 6)`, enough tiles to cover the tallest expected phone viewport.
- Tiles form a diagonal cascade of paper/rust/blue/olive/ink printed squares. Menu text fades in only after visual coverage is sufficient; it disappears before close tiles reveal the page.
- A dark brand lockup and the exact `Find us in Bastrop ↗` action sit in the lower block without overlapping navigation or safe areas.

### Accessibility / Safari behavior

- Real `<button>` with at least `44×44px` pointer target, clear `aria-expanded`, `aria-controls`, and visual focus state.
- Overlay is `role="dialog"`, `aria-modal="true"`; focus moves to the close control on open and returns to the trigger on close.
- Escape closes it. Tapping a navigation link closes it while preserving anchor navigation.
- Lock page scrolling only while menu is open; restore the previous scroll position/overflow exactly on close/unmount.
- `prefers-reduced-motion` removes tile delay/cascade while preserving all navigation and focus behavior.
- Avoid `mix-blend-mode` in menu critical controls; colors are explicit to avoid iOS compositing surprises.

---

## 7. Motion system: high stimulation, low mobile risk

### Approved motion categories

| Interaction | Implementation | Maximum / guard |
|---|---|---|
| Menu tiles | CSS transform/opacity; state-machine class | < 520ms open, < 420ms close. |
| Marquee | One duplicated text track, `transform: translateX()` only | No layout animation; frozen in reduced motion. |
| Rotating badge | CSS `transform: rotate()` | 22–36s, no JS loop. |
| Decor parallax | One passive scroll listener + one `requestAnimationFrame` scheduler | ±14px, only decorative layers. |
| Chapter reveal | IntersectionObserver or GSAP opacity/translate | Each element animates once; no text position scrambling. |
| Roadline | SVG dash length with rendered screen-space measurement | Direct progress; no `pin`, no base line, resize-aware. |
| Optional microfilm | Pre-rendered native MP4 only | ≤4 seconds, no audio, hardware-decoded, optional—not phase-one default. |

### Roadline implementation contract

1. Create `MobileRoadline` as a decorative sibling behind the mobile content, with individual chapter waypoints.
2. Render only the progress path. At zero progress, use `opacity:0`, `visibility:hidden`, `stroke-dasharray === stroke-dashoffset`; never render a dim full route.
3. Measure path length in **rendered screen space** after `getScreenCTM()` sampling, because non-scaling stroke plus responsive transforms invalidate raw SVG units.
4. On resize/orientation refresh, recompute the rendered length and preserve current scroll progress.
5. Map actual scroll entry/exit to line progress via a single rAF update. The drawing head must remain inside the viewport at sampled progress values.
6. Milestone ornaments activate from their rendered cumulative path fractions, not guessed percentages.
7. A clipped-paper reveal may accompany a milestone using a simple `clip-path: inset()` reveal; this is secondary to the real SVG stroke and never hides content.
8. Disable animated progress under reduced motion; show a small static decorative route/waypoint instead.

### GSAP guardrails

- Only import/register GSAP from client components gated by `gsap.matchMedia("(max-width: 767px)")`.
- No global ScrollTrigger refresh loop and no body-level mutation observer that can pull against iOS scrolling.
- No `pin`, `scrub` timeline that consumes scroll distance, horizontal transform narrative, or mobile Lenis integration.
- Every listener, observer, timeline and `requestAnimationFrame` cancels in component cleanup.
- Motion may enhance but may never be required to expose information or unlock navigation.

---

## 8. Asset strategy and generation policy

### Reuse before generation

First compose with the existing brand system:

- `paper.jpg`, `paper-backdrop.webp`, `grunge.png`.
- Existing rose stems, rosebuds, butterfly parts, eye icon, corgi and logo components.
- `martha-portrait.webp`, `store_*`, `look1_*`, `look2_*`, `beyondthewardrobe_*`, `quadros.png`.

### Original complementary assets (only after reference approval)

If a section needs an ornamental layer that existing assets cannot provide, generate a **small isolated derivative**, not a new hero photo by default. Candidate roles:

1. a loose side-vine / bramble in coral-red and faded blue;
2. a pressed-flower / textile patch for section corners;
3. a small label or matchbook-style vintage icon set;
4. a needlework/curtain fragment for the Beyond chapter.

Default Z-Image Turbo prompt direction:

> isolated vintage botanical or textile ephemera, hand-inked chromolithograph, faded coral red roses and muted cobalt-blue leaves, tactile paper grain, authentic 1970s Texas collector scrapbook, clean edge isolation, no lettering, no watermark, no frame

Every generated option will be inspected for visible artifacts, unwanted text, transparent-pixel integrity, dimensions, source consistency and mobile-scale readability before it is accepted.

### Z-Image Turbo / Flux decision

- The local `comfy` CLI exists. At planning time no Comfy server was running on `127.0.0.1:8188`.
- The live GPU probe showed an RTX 4060 with 8,188 MiB total VRAM and about 5,898 MiB free. This is suitable for cautious lightweight/local work, not a reason to assume full Flux Dev will be comfortable.
- **Default:** Z-Image Turbo or existing assets; use a batch of small candidate ornaments only after the visual-reference direction is approved.
- **Flux exception:** only if Z-Image Turbo and source material cannot produce a necessary, multi-subject / compositional asset after a bounded set of attempts. Flux is not installed and will not be downloaded/run locally by default on an 8 GB GPU. That exception requires an explicit proposal with the required model size, VRAM route, expected time and any cost before doing it.
- Do not spend generation credits or start a model download during the planning/reference stage.

### Envato / ChatGPT browser source policy

- Use the authenticated subscription only after we know the exact missing asset role.
- Record provider, original item URL/ID, stated license context, filename, dimensions and intended section in an asset manifest.
- Do not use a screenshot from an asset page as a production asset.
- Avoid the “Save image” native file-picker bottleneck: use a normal browser download, browser download list/network asset URL where permitted, then detect the completed file and copy a named optimized version into the project. If a site exposes no legitimate downloadable binary, it is reference-only and will not be used in production.
- Every accepted asset gets an optimized WebP/AVIF derivative, correct `alt`, and a source record.

### Budgets

| Asset | Budget |
|---|---|
| LCP hero photo / art crop | target ≤ 250 KB optimized at phone size |
| Ornament | target ≤ 70 KB each |
| First viewport total imagery excluding existing 159 KB loader | target ≤ 450 KB |
| Optional short MP4 | target ≤ 250 KB, no audio, faststart |
| Initial mobile JS addition | target under 35 KB gzip beyond the current app where practical |

---

## 9. Proposed implementation structure

### New files

- `src/components/mobile/mobile-experience.tsx` — semantic mobile-only section order, IDs and content use.
- `src/components/mobile/mobile-experience.module.css` — all new phone styles, base hidden behavior and `max-width:767px` rules.
- `src/components/mobile/mobile-menu.tsx` — fullscreen cascade menu, focus/scroll-lock lifecycle.
- `src/components/mobile/mobile-image-deck.tsx` — button-controlled accessible image deck; no horizontal scroll requirement.
- `src/components/mobile/mobile-roadline.tsx` — rendered-length SVG roadline and milestone state.
- `src/components/mobile/mobile-ornaments.tsx` — decorative SVG composition built from safe existing/new assets.
- `src/components/mobile/use-mobile-motion.ts` — bounded parallax/reveal utilities, media-query and cleanup helpers.
- `src/content/marthas-mobile-copy.ts` — exact approved desktop copy transcription and image metadata.
- `scripts/qa/mobile-visual-audit.mjs` — CDP audit harness for geometry/overflow/motion/menu states.
- `scripts/qa/assert-mobile-copy.mjs` — text contract checker.
- `public/assets/site/mobile/…` — only approved, named optimized assets plus `manifest.json`.

### Files likely to modify

- `src/app/page.tsx`
  - Keep `DesktopHomeHero` and `DesktopEditorialSections` mounted exactly as today.
  - Split legacy mobile/tablet content into a tablet-only wrapper.
  - Mount `MobileExperience` as a distinct mobile-only wrapper.
- `src/app/globals.css`
  - Add only narrow wrapper visibility rules: new mobile visible `<=767px`, legacy tablet visible `768–1023px`, neither affects desktop.
  - Do not use global overflow hiding as a way to mask new mobile bugs.
- `src/app/vintage-details.css`
  - Retain required current tablet/desktop styles.
  - Remove/avoid only selectors that become unreachable after the old phone composition is hidden, once tablet visual regression proves they are dead. Prefer new CSS Module rules over further global overrides.
- `package.json`
  - Add a `qa:mobile` script only if the audit harness is implemented. Avoid a broad dependency installation unless the existing CDP tooling cannot meet the proof requirements.

### No intended modification

- `src/components/desktop-home-hero.tsx`
- `src/components/desktop-editorial-sections.tsx`
- `src/components/desktop-carousel.tsx`
- `src/components/desktop-editorial-sections.module.css`
- `src/components/logo-loader.tsx`
- `src/remotion/*`

If an implementation appears to require touching one of these files, stop and isolate an integration alternative before proceeding.

---

## 10. Step-by-step implementation plan

### Task 0: Intake and reference board (blocking gate)

**Objective:** Convert the incoming references into a one-page, explicit mobile art direction before code or generation.

**Files:**
- Create: `.hermes/references/marthas-mobile-reference-board.md` (or append a dated section to this plan)
- No application files change.

**Steps:**
1. Receive all user reference images/URLs.
2. For each, label what is being borrowed: type scale, material, menu behavior, image crop, spacing, motion, color, icon vocabulary—not a literal page copy.
3. Extract 8–12 useful adjectives/tags and list anti-patterns to avoid.
4. Assemble a per-screen visual brief and confirm it against the structure in section 5.
5. Present a compact moodboard / layout map for approval before generating or sourcing assets.

**Proof:** User confirms the direction or marks the specific parts to change. No paid generation/download starts before this gate.

### Task 1: Freeze baseline and enforce breakpoint isolation

**Objective:** Guarantee that the redesign cannot silently affect tablet/desktop.

**Files:**
- Create: `scripts/qa/capture-baseline.mjs`
- Create: `audit/baseline/` (ignored scratch output, not committed unless useful)
- Modify: `.gitignore` only if audit output needs exclusion.

**Steps:**
1. Capture current production screenshots at `768×1024`, `834×1112`, `1023×900`, `1024×768`, `1280×832`, and `1440×900`.
2. Save target DOM facts: visible composition, `scrollWidth`, hero/document top, presence of desktop/mobile variants.
3. Compute source hashes for each desktop-only source file listed above.
4. During every phone iteration assert the mobile root is hidden at `768px`, `1023px`, and `1024px`; assert legacy tablet flow remains visible at `768–1023px`.

**Proof:** Exact browser screenshots and DOM geometry show no new phone subtree pushing or covering tablet/desktop content.

### Task 2: Establish exact mobile text/data contract

**Objective:** Make the desktop prose the immutable source for mobile rendering.

**Files:**
- Create: `src/content/marthas-mobile-copy.ts`
- Create: `scripts/qa/assert-mobile-copy.mjs`

**Steps:**
1. Transcribe every required desktop title, lede, paragraph, quote, value heading, visit statement and map URL exactly.
2. Associate existing images with their current desktop alt/caption where possible.
3. Write the copy checker first: it must fail if any required paragraph is absent, duplicated, altered or if a legacy mobile-only phrase remains visible below `768px`.
4. Run the checker before rendering the final visual work.

**Proof:** Browser-rendered mobile text passes exact phrase/count checks; desktop source files remain unmodified.

### Task 3: Mount a mobile-only document without altering tablet/desktop

**Objective:** Introduce the new semantic structure safely.

**Files:**
- Create: `src/components/mobile/mobile-experience.tsx`
- Create: `src/components/mobile/mobile-experience.module.css`
- Modify: `src/app/page.tsx`, `src/app/globals.css`

**Steps:**
1. Add mobile section IDs and heading hierarchy in normal document flow.
2. Wrap the existing current legacy content so it renders only from `768px` to `1023px`.
3. Render `MobileExperience` only under `768px`; default it to hidden before the mobile media query so it cannot leak at larger sizes.
4. Add static placeholder surfaces using final content and no motion first.
5. Run breakpoint isolation probes before styling individual sections.

**Proof:** `mobile root` is the only visible phone experience at 320/390/430px; zero new vertical offset or duplicate content appears at 768/1024px.

### Task 4: Build the menu as an accessible state machine

**Objective:** Implement the full-screen stylized menu before the main visuals so every new destination is testable.

**Files:**
- Create: `src/components/mobile/mobile-menu.tsx`
- Modify: `mobile-experience.tsx`, `mobile-experience.module.css`

**Steps:**
1. Write menu phase/reducer tests or deterministic browser assertions first (`closed/opening/open/closing/closed`).
2. Add real route anchors and exact labels derived from desktop chapters.
3. Implement focus trap, Escape close, link close, safe scroll lock restoration and reduced-motion behavior.
4. Add the six-column tile cascade with enough rows for the largest test viewport.
5. Add lower logo/action block and measure it against nav/close/safe-area bounds.

**Proof:** Capture early, middle, open and close animation states; menu link clicks update hash and land on the correct target; no body scroll while open; all controls stay in viewport and are at least 44px.

### Task 5: Build the hero composition in normal flow

**Objective:** Give phone users a high-impact but readable first screen.

**Files:**
- Modify: `mobile-experience.tsx`, `mobile-experience.module.css`
- Optional asset additions only after task 0 approval.

**Steps:**
1. Implement the hierarchy: chrome → artwork window → location/description paper rail → CTA.
2. Use a responsive image crop with explicit `object-position`, `sizes`, and a bounded image container; do not position body copy absolutely over it.
3. Add only two decorative layers initially; check their rectangles on all phone widths before adding any third.
4. Implement static first, then entrance/butterfly enhancement behind motion preferences.
5. Validate `100svh`/short-viewport safe layout with no overlap or hero escape.

**Proof:** At 320×480, 360×518, 390×844 and 430×932: no clipped title, no text/photo overlap, centered hero groups, CTA visible or reachable with one normal scroll, and no horizontal overflow.

### Task 6: Implement chapter shells, image deck and tactile system

**Objective:** Deliver all editorial sections with distinct rhythm, exact desktop copy and usable imagery.

**Files:**
- Modify: `mobile-experience.tsx`, `mobile-experience.module.css`
- Create: `src/components/mobile/mobile-image-deck.tsx`, `mobile-ornaments.tsx`

**Steps:**
1. Build Story and Quote first; validate long-text typography in flow.
2. Build Collection’s button-driven image deck; ensure all content remains readable without pressing controls.
3. Build Personal Style’s rust montage and controlled decorative strips.
4. Build Beyond’s olive visual world and Vision’s dark cabinet cards.
5. Build Visit/Footer using the real desktop map URL.
6. Only then place badges, stamps, paper edges and decorative iconography; one dominant image per screen.

**Proof:** Each section has one primary heading, readable contrast, logical reading order, no generic icon set, no horizontal swipe/scroll dependency, and no media crop that hides the subject on short phones.

### Task 7: Add roadline, marquee, badge and parallax progressively

**Objective:** Create the desired movement without risking Safari scroll behavior.

**Files:**
- Create: `mobile-roadline.tsx`, `use-mobile-motion.ts`
- Modify: `mobile-experience.tsx`, `mobile-experience.module.css`

**Steps:**
1. Ship a static decorative roadline baseline first.
2. Add rendered-length measurement and direct rAF progress reveal; test at zero, quarter, half, three-quarter and end states.
3. Add milestone ornament activation only after roadline proof passes.
4. Add CSS marquee and badge rotation, then bounded parallax one feature at a time.
5. Add complete `prefers-reduced-motion` parity immediately after each motion feature—not as a final cleanup.

**Proof:** No future road segment is visible at any sampled progress; reverse scroll and orientation change preserve state; mobile has no pinning/jitter; reduced motion keeps all content/controls available and static.

### Task 8: Generate/source and optimize only the approved missing assets

**Objective:** Add original personality without bloating or licensing ambiguity.

**Files:**
- Create: `public/assets/site/mobile/manifest.json`
- Create: approved asset files under `public/assets/site/mobile/`
- Optional: an asset optimization script under `scripts/`

**Steps:**
1. Make a missing-role list after a first browser screenshot pass; do not generate decorative assets just because generation is available.
2. Use Z-Image Turbo only for approved roles; create bounded candidate sets and inspect them visually.
3. If subscription assets are needed, capture license/source metadata before copying into the project.
4. Remove background or crop assets deterministically where required; verify alpha/non-empty pixel data.
5. Resize and encode each accepted asset for mobile, then update the manifest.
6. Re-run LCP/resource budget audit after every asset batch.

**Proof:** Every new asset has a source/prompt record, intended role, dimensions, final weight, no visual artifact at DPR 3, and no unused raw file committed.

### Task 9: Optional Remotion micro-motion decision

**Objective:** Use Remotion only if native motion cannot deliver a small but meaningful editorial moment.

**Files:**
- Optional: `src/remotion/Mobile…tsx`, `public/assets/site/mobile/*.mp4`

**Decision criteria:**
- An existing still/asset cannot express the intended idea using CSS/SVG/GSAP.
- The resulting motion is less than four seconds, nonessential to navigation and can be pre-rendered.
- It can be encoded H.264, muted/no audio, faststart, mobile scale and within the stated asset budget.

**Proof:** Render/encode comparison, `ffprobe`, native mobile video playback probe, error/failsafe behavior, and a decision record. If this gate is not met, do not add Remotion to the mobile page.

### Task 10: Conduct the full visual, accessibility and Safari-risk audit

**Objective:** Prove the redesign on actual responsive geometry—not just an attractive 390px screenshot.

**Files:**
- Create/modify: `scripts/qa/mobile-visual-audit.mjs`
- Create: `audit/mobile-final/` (ignored local evidence)

**Steps:**
1. Run all geometry assertions listed in section 11.
2. Capture full-page and viewport screenshots at every canonical device size.
3. Test menu state lifecycle, deck buttons, every anchor, roadline checkpoints, reduced motion, image failures and loader completion.
4. Run lint, typecheck, production build and `next start` validation on a clean server.
5. Ask the user to do the final physical Safari pass on their phone; collect any screenshot/video mismatch as a concrete follow-up rather than guessing.

**Proof:** Audit JSON has zero blocking failures, visual review has no collision/crop/overflow defects, and production build passes.

---

## 11. Required validation matrix

### Device / viewport matrix

| Class | Viewports |
|---|---|
| Small / short phone | `320×480`, `320×568`, `360×518` |
| Common phone | `375×667`, `390×844`, `393×852` |
| Large phone | `402×874`, `430×932`, `480×854` |
| Landscape iOS stress | `844×390` |
| Tablet regression | `768×1024`, `834×1112`, `1023×900` |
| Desktop regression | `1024×768`, `1280×832`, `1440×900` |

### Every mobile viewport must prove

1. `document.documentElement.scrollWidth === clientWidth`.
2. The same check after temporarily setting root `overflow-x` to visible in browser runtime, so global clipping cannot hide an overflow bug.
3. No key element crosses left/right viewport boundaries unless its parent deliberately clips a marquee/ornament.
4. All headings: `scrollWidth <= clientWidth`; no clipped word/ellipsis caused by containment.
5. Signed vertical gaps between hero groups, section heading/body/image, cards, controls and footer are non-negative unless an overlap is deliberate and pixel-reviewed.
6. Images load, have non-zero pixel content, correct crop and useful alt text.
7. Touch targets are at least 44 CSS pixels in both dimensions.
8. Menu: open/close, Escape, focus restoration, scroll lock and every destination link work.
9. Image deck: next/previous, disabled edge state, counter, focus and screen-reader label work.
10. Roadline: zero line at start, monotonic reveal, no future segment, milestone timing, reverse scroll and rotation work.
11. `prefers-reduced-motion`: no autoplaying decorative movement, no blocked menu state, no missing roadline information.
12. Loader: video reaches end, overlay disappears, page scroll restores; broken-video and JS-disabled CSS failsafes remain intact.

### Performance / browser validation

- Test normal and throttled resource conditions.
- Inspect `performance` resource entries for initial image/video weight and unexpected third-party media.
- Ensure only hero media is priority/eager; below-fold images are lazy.
- Verify no `@remotion/player`, canvas or Three.js element is present in the mobile DOM.
- Verify no mobile `ScrollTrigger` is pinned and no active scroll callback writes layout properties.
- Run `npm run lint`, `npx tsc --noEmit`, `npm run build`, then restart one clean server and repeat a production browser capture.

---

## 12. Risks, decisions and mitigation

| Risk | Prevention / decision |
|---|---|
| Desktop accidentally changes | New mobile root defaults to hidden; preserve desktop files; screenshot/DOM guard at >=1024. |
| Tablet becomes blank or redesigned | Keep legacy tree in a dedicated `768–1023px` wrapper and visual-diff those dimensions. |
| Safari iOS scroll jitter | No pinning, horizontal narration, Three.js, fixed `background-attachment`, or unbounded refresh observer. |
| Decorative density hurts reading | Content stays normal flow; visual review requires one dominant image and a reading-width check per screen. |
| Text drifts from desktop | Exact mobile copy module + rendered text contract. |
| Roadline looks fully visible initially | Render only the progress path; screen-space dash measurement and checkpoint screenshots. |
| Generated assets feel off-brand | Reference gate, bounded candidate batch, per-asset visual/weight approval, reuse source material first. |
| Flux runs out of memory / requires installation | Do not use it by default; explicit exception proposal only. |
| Browser asset download lacks file-picker access | Prefer legitimate direct browser downloads / source URLs and download detection; never use a screenshot as a production asset. |
| Build/server shows stale output | Stop stale project server, build, start one clean server, verify exact port before visual claims. |

---

## 13. Delivery and checkpoint strategy

1. **Do not start implementation before the references arrive and are converted into the reference board.**
2. Work in visually reviewable stages: mobile shell/menu → hero → chapter layout → motion → assets → QA.
3. At every stage, keep the work tree reviewable and show actual mobile screenshots before moving to the next visual layer.
4. Use small local commits only after a stage is fully tested and only if the user separately asks for them; no push or deployment is implied.
5. Final handoff includes: changed-file list, asset manifest, screenshot matrix, audit JSON summary, lint/typecheck/build outputs, known Safari limitation notes, and rollback commit(s) if requested.

---

## 14. Decisions needed from the incoming references

The references will determine—not merely decorate—these pending choices:

1. Is the visual tension closer to **paper collage / scrapbook**, **boutique fashion editorial**, **Americana folk archive**, or a controlled blend?
2. How saturated should rust/blue/olive become relative to the current desktop?
3. Does the full-screen menu read more like a **tile print cascade**, a **catalogue drawer**, or a **poster wall**?
4. Which sections deserve original generated ornaments rather than existing brand fragments?
5. Should an optional pre-rendered editorial microfilm exist at all, or should the page remain entirely image/CSS/SVG-driven?

Until those answers are derived from the provided references, the safest design path is the structural plan above—not speculative generation.

---

## 15. Revision 2 — Newspaper system, desktop scope and received references

> **Precedence:** This revision supersedes any earlier line in this document that says the desktop editorial area, the desktop text, or the phone hero must remain unchanged. The original constraints remain in force wherever there is no explicit conflict.

### 15.1 Scope now locked

| Range | Final planned behavior |
|---|---|
| `0–767px` | Full new phone experience, **including a new mobile hero**, fullscreen menu and all editorial chapters. |
| `768–1023px` | Keep the committed legacy tablet composition unchanged for this pass; do not let either new composition leak into it. |
| `>=1024px`, hero | Lock `DesktopHomeHero`, its visual layout, upper menu, original DOM handoff, responsive GSAP behavior, butterfly and photo animation. No redesign and no duplicate navigation. |
| `>=1024px`, below hero | Replace the current `DesktopEditorialSections` presentation with a new newspaper/editorial layout inspired by the supplied references. |

The work is now isolated on `feat/marthas-newspaper-redesign`, created from the committed checkpoint `c6017e7`. No commit, push, deployment, source download or image-generation call has occurred as part of this revision.

### 15.2 What the three supplied references actually establish

The references are **not** a request to clone the brand, assets or copy of Retro Reflections. They establish an editorial grammar that will be translated into Martha’s own visual world:

1. **One continuous warm-paper newspaper sheet** — an off-white tactile surface, thin ink rules, subtle scan grain and almost no floating-card UI.
2. **A strict print grid** — wide horizontal rules define stories; vertical rules divide article columns; text and imagery sit in a visible system rather than in free collage alone.
3. **Large condensed/high-contrast serif headlines** — one headline owns each spread; body copy remains modest, dark and column-width limited.
4. **Editorial image plates** — saturated vintage photography is cropped decisively and treated as a printed plate. Small image/caption modules make the layout feel published rather than like a generic gallery.
5. **Asymmetric page modules** — a primary 2/3 image gets a smaller side story; wider editorial spreads alternate with dense three-column product/subject blocks.
6. **Ribbon / stamped CTA vocabulary** — warm rust/marigold ribbons, underlined links, section indexes, counters and hairline rules replace rounded SaaS buttons.
7. **Breathing room through rules, not empty minimalist space** — density is controlled by rhythm: horizontal divider → headline → image/copy grid → divider.

### 15.3 Translation into Martha’s identity (rather than imitation)

- The reference’s generic vintage-fashion content becomes **Martha’s personal collection, Texas location, roses, blue butterfly, eye motif, textiles, interior objects and personal point of view**.
- Cream paper stays, but Martha’s coral-red, muted cobalt, olive and tobacco brown become the periodic printed-ink colors.
- The existing rose/corgi/butterfly elements become occasional editorial stamps or margin illustrations—not repeated clip art in every module.
- Existing local photography remains the primary imagery. No fake celebrity / archive imagery will be generated to imitate the reference.
- Typography uses the existing project font families; the newspaper character comes from scale, rule structure, captions, line length and layout rather than importing a near-copy font.
- The original hero and persistent upper menu remain the site’s distinctive entry point. The reference’s top bar will **not** be added again below the hero.

### 15.4 Desktop newspaper layout system

Create a new `DesktopNewspaperSections` composition with a shared paper sheet and a grid that is responsive rather than screenshot-fixed:

```text
Desktop canvas >= 1440: 12 columns + 11 gutters, outer margin clamp(32px, 4vw, 72px)
Desktop canvas 1024–1439: same semantic 12-column grid, compacted spans/gutters
Rules: 1px ink at low opacity, never thick borders around every module
Image plates: square/portrait/landscape ratios owned by each story, object-position specified
Reading measure: 32–54ch, body never becomes a full-width paragraph
```

Every section begins and ends with a horizontal rule. Vertical separators exist only where they clarify article columns, so the page reads as an editorial sheet rather than a dashboard.

#### Desktop spread sequence after the preserved hero

1. **Spread 01 — `The Story / Noticing beautiful and unusual things.`**
   - Full-width chapter strap/rule at the top.
   - 4-column lead text, 5-column Martha portrait plate, 3-column “field note” side rail.
   - Include a small blue eye/rose stamp and a micro-caption (`Martha, in her own vintage · Bastrop, Texas`).
   - This is the desktop’s first clear transition from hero to newspaper.

2. **Spread 02 — pull quote / editorial ribbon**
   - Rust printed-ink band with the existing quote and one motif—not a full dark section.
   - A restrained marquee may run along one rule only; no second navigation or distracting full-width animation.

3. **Spread 03 — `Curated, not accumulated.`**
   - Newspaper lead headline across a large span.
   - Two readable body columns against a large featured collection plate.
   - Under it: three smaller catalog plates with captions/numbering in a controlled grid.
   - Existing rotating badge becomes a seal intruding from a corner with enough contrast and no body-copy collision.

4. **Spread 04 — `Worn now. Never as costume.`**
   - A high-contrast rust/cream print spread, still governed by the same grid/rules.
   - Primary vertical fashion plate plus two secondary articles/looks.
   - A “Cuttings from the rack” rail can use new concise captions, if needed, in Martha’s established voice.

5. **Spread 05 — `Everything speaks the same language.`**
   - Olive-to-paper printed-ink section for art, interiors, textiles and objects.
   - One wide interior plate with a narrow article column, then a lower asymmetric two-plate continuation.
   - This is the desktop home for the roadline milestone / botanical side ornament, kept out of text columns.

6. **Spread 06 — `Joyful, a little eccentric, and very human.`**
   - Newspaper “editorial principles” spread: three value modules, each with a small icon/stamp, a short displayed title and the supporting paragraph.
   - All modules remain readable at a 1024px desktop width; no microtext-for-style tradeoff.

7. **Spread 07 — visit / masthead close**
   - Strong final paper-to-ink transition, shop plate, accurate map CTA and small masthead/footer information.
   - The existing persistent hero menu remains the global desktop navigation; footer only provides `Back to the beginning` and contact action.

### 15.5 Text policy after the user’s new permission

The desktop no longer has to be text-identical to the old `DesktopEditorialSections`.

- Preserve the existing brand facts, location, overall editorial voice and useful approved paragraphs where they fit.
- New editorial headlines, caption lines, chapter straps, short calls-to-action and connective prose are allowed when a spread needs a better reading rhythm.
- Do not invent false dates, collection availability, prices, historical provenance, services or commercial claims.
- New text will be written in English, concise, warm, observant and specific to Martha’s point of view—not generic “timeless glamour” ecommerce language.
- The mobile copy can share the revised content system where it improves cohesion; it is no longer restricted to the prior desktop strings, though core brand facts still must remain accurate.

### 15.6 Revised application architecture and exact file boundary

**Create:**

- `src/components/desktop-newspaper-sections.tsx` — new post-hero desktop semantic section sequence.
- `src/components/desktop-newspaper-sections.module.css` — grid, rules, typography, responsive desktop spans and print-material system; all rules gated at `min-width:1024px`.
- `src/content/marthas-editorial.ts` — shared, reviewed brand facts/copy/captions used by new desktop and phone compositions.
- `src/components/mobile/...` files already listed in section 9.
- `src/components/editorial/printed-ribbon.tsx` and `src/components/editorial/editorial-plate.tsx` only if they demonstrably reduce repeated markup without hiding layout intent.
- `scripts/qa/newspaper-desktop-audit.mjs` — desktop grid, rule/collision/hero-preservation audit.

**Modify:**

- `src/app/page.tsx` — replace only the `DesktopEditorialSections` mount with `DesktopNewspaperSections`; leave `<DesktopHomeHero />` exactly in place.
- `src/app/globals.css` — add narrowly scoped wrapper/default-hidden rules only if required; do not alter the desktop hero selectors.
- `src/content/marthas-mobile-copy.ts` will be superseded by the shared editorial content module if that avoids drift without changing the locked hero.

**Deliberately leave untouched:**

- `src/components/desktop-home-hero.tsx`
- Existing desktop hero CSS in `src/app/globals.css` through the end of the `@media (min-width:1024px)` hero block
- `src/components/logo-loader.tsx`
- `src/remotion/*`

Keep the old `desktop-editorial-sections.tsx` and its CSS module in the repository untouched in the first implementation pass. They become an easy rollback reference and will not be mounted on desktop once the new section component is live.

### 15.7 Revised task order

1. **Freeze only the protected desktop hero/menu.** Capture its visual states at `1024×768`, `1280×832`, `1440×900`, wide/short ratios, first load, mid-scroll handoff and menu hide/show. Hash `desktop-home-hero.tsx` and hero CSS scope. The old post-hero content is a redesign target, not a baseline to preserve.
2. **Create the shared editorial content/data module.** Write copy assertions for brand facts and section IDs; introduce new copy only through a reviewed data object.
3. **Build static desktop newspaper spreads before adding movement.** Prove grid, imagery, headline line breaks, rules and CTA hierarchy across all desktop widths.
4. **Run a separate desktop visual audit.** Measure image/text collision, `scrollWidth`, rule alignment, heading internal clipping, readable line length, and absence of a second desktop nav.
5. **Build the phone experience and mobile hero as described in the original plan, translated through the same newspaper grammar.** The phone hero is free to change; the desktop hero is not.
6. **Add motion progressively.** Newspaper animation is quieter on desktop: printed strips, seals, short marquee/ribbon movement and roadline detail. The hero’s existing GSAP is never edited.
7. **Generate/source only final missing decorative assets after the grid/static screenshots prove the need.**
8. **Perform combined desktop/mobile production audit, then present screenshots for approval before any optional commit.**

### 15.8 Revised desktop validation contract

At `1024×768`, `1180×820`, `1280×832`, `1440×900`, `1728×1117` and a short-wide desktop viewport, assert:

1. The hero initial/mid/final states match pre-redesign screenshots; its same brand and nav DOM nodes hand off into the persistent menu.
2. The upper desktop menu still collapses on downward scroll and reopens on upward scroll exactly as it does now.
3. Newspaper starts immediately after the hero release; no duplicate header/nav appears in its first spread.
4. Each section’s paper grid has a single intended outer gutter, rules land on pixel-clean boundaries, and vertical dividers never cross image/caption content.
5. Every headline/CTA/body column has no internal clipping, overlap or unreadably narrow measure.
6. All images have intentional crops at each viewport; source `currentSrc`, rendered size and asset weight are checked.
7. At 1024px, the layout may change spans but retains article hierarchy; it must not become a broken scaled-down 1440px screenshot.
8. Phone/mobile root stays hidden above 767px and tablet legacy tree remains isolated at `768–1023px`.
9. Lint, TypeScript, build and exact production-port screenshot tests pass.

### 15.9 Reference outcome / next implementation gate

The reference direction is now sufficiently clear to design the structural desktop newspaper system without waiting for more reference images. Any future references will refine page-specific details, asset choices and color intensity—not reverse the locked hero/menu boundary.

The next implementation action, when authorized, is the **protected-hero baseline capture plus static desktop newspaper wireframe**. No Comfy, Envato, Flux or Remotion use is necessary for that first pass.

---

## 16. Revision 3 — Current execution boundary (mobile phase one)

> **Latest user direction supersedes Revision 2 for now:** work only on mobile. Do not alter desktop at all. The desktop newspaper redesign is deferred, not cancelled.

### Implemented mobile-only first pass

- The original mobile content sequence remains in place; no lower editorial chapter has been structurally redesigned.
- The phone hero is refined rather than replaced: same logo, portrait, butterfly, place name, description and discovery action; upgraded paper plate, offset print rule, small editorial index and clearer text hierarchy.
- The previously non-functional `MENU` label is now an accessible, full-screen phone menu with actual anchors, `Escape` support, focus containment/restoration, scroll lock, motion-reduction behavior and 44px controls.
- No image-generation, external download, Comfy, Flux, Envato, Remotion or GSAP addition was needed for phase one.

### Desktop / tablet safeguard

- `DesktopHomeHero`, `DesktopEditorialSections`, their desktop styles and desktop menu behavior are untouched.
- All new visual CSS is gated at `max-width:767px`; new hero/menu elements are `display:none` outside that range.
- The legacy tablet composition remains untouched at `768–1023px`.

### Required proof recorded for this phase

- Mobile interaction contract passes at `320×568`, `390×844` and `430×932`.
- Whole-page mobile audit passes at `320×568`, `375×667`, `390×844` and `430×932`: no horizontal overflow, no collapsed sections, no clipped headings and no failed in-view media.
- Production visual captures show the final mobile hero/menu at `390×844` and an intact desktop hero/menu at `1440×900`.
- `npm run lint`, `npx tsc --noEmit`, `git diff --check` and `npm run build` are required gates before any later commit.
