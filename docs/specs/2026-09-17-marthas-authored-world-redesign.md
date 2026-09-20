# Martha’s Vintage — Authored World Redesign Specification

**Status:** Draft v1.0 — ready for design review  
**Branch:** `feat/marthas-authored-world-redesign`  
**Scope:** Complete responsive homepage redesign  
**Primary source:** Martha’s written feedback, `BRAND_GUIDE.md`, current website, and the 67 original photographs supplied by Martha  
**Implementation status:** Not started  

---

## 1. Executive summary

Martha’s Vintage will no longer be presented as a vintage fashion magazine, a period recreation, or a retro catalog. The redesign will present it as a **collector-led American vintage boutique with an alternative, colorful and highly personal point of view**.

The inventory is vintage. The interface does not need to imitate the past.

The website should feel like entering Martha’s world and gradually understanding how she sees: she notices color, handwork, unusual construction, folk influence, jewelry, textiles, art, plants, baskets, rooms and unexpected combinations. Refinement will come from selection, scale, pacing, typography and authentic photography rather than faux-aged graphics, chapter structures or decorative clutter.

### Core proposition

> **Beautiful things with a past, chosen for the life they can have now.**

### Internal creative line

> **Vintage in the collection. Alive in the present. Styled through Martha’s eye.**

The internal line guides design but is not automatically public copy.

---

## 2. Why the current direction must change

The current desktop experience encodes a publication metaphor through:

- `Chapter One`, `Chapter Two`, etc.;
- newspaper-like columns;
- editorial kickers and issue-like numbering;
- separated “Martha’s” and “Vintage” acting as opposite cover headlines;
- heavy paper/grunge treatment;
- dotted index navigation;
- repeated seals, bands and frames;
- sections reading as individual magazine articles;
- campaign-like photography treated as period imagery.

These devices can be well executed individually, but together they speak before the collection. The visitor sees “vintage publication” before seeing Martha’s point of view.

Martha’s feedback rejects the premise rather than the craft. Therefore this is not a recolor or typography pass. The site’s narrative structure and recurring visual grammar must change.

---

## 3. Positioning

### Positioning spectrum

```text
thrift / resale  ←  curated vintage boutique  ←  collector-led world / archive
                              ▲
                      Martha’s Vintage
```

Martha’s Vintage should combine:

- the accessibility, freedom and energy of an alternative US vintage shop;
- the discernment and authorship of a personal collection;
- the warmth of a real person and real domestic environment;
- enough commercial clarity to understand that pieces can be discovered, visited and eventually purchased.

It should not present itself publicly as a generic thrift store. “Alternative American thrift” is a useful energy reference, not the final market label.

### Brand definition

> **An eclectic, collector-led American vintage boutique shaped by Martha’s eye.**

### Brand tensions

Every major design decision must hold these pairs simultaneously:

| Desired | Must not become |
|---|---|
| Personal | Amateur |
| Eclectic | Chaotic |
| Colorful | Childish |
| Sophisticated | Distant or luxurious |
| Vintage | Costume-like or nostalgic |
| Commercial | Marketplace-like |
| Tactile | Artificially aged |
| Expressive | Decoratively crowded |
| Curated | Precious or inaccessible |

---

## 4. Experience goals

After the first two sections, a visitor should understand:

1. Martha is a real person with a recognizable point of view.
2. Clothing is the center of the offer, but jewelry, textiles, art and interiors explain how she sees.
3. Pieces from different decades belong together through color, texture, construction or personality—not timeline.
4. The collection is meant to be worn now, not treated as costume.
5. The brand is located in Bastrop, Texas, and feels approachable.

### Primary user feeling

> “I want to keep looking because I’m curious what Martha will put together next.”

### Primary action

Explore Martha’s collection and visual world.

### Secondary actions

- understand Martha’s point of view;
- see styled looks and details;
- discover the physical location/contact path;
- follow future events or collection updates when a real destination exists.

No e-commerce flow, event calendar or newsletter backend will be invented without a confirmed business destination.

---

## 5. Design principles

### 5.1 Content speaks before the graphic system

Photography and real combinations lead. UI recedes around them.

### 5.2 Authentic material over simulated vintage

Use photographed embroidery, crochet, metal, stones, baskets, worn surfaces and domestic spaces instead of fake paper aging, digital sepia or synthetic patina.

### 5.3 Eclecticism is explained through relationships

Variety should be organized through visual connections—color, material, shape, handwork—not random collage.

### 5.4 Sophistication comes from editing

Use fewer stronger images, clear hierarchy, deliberate whitespace and controlled transitions. Sophistication is not created by ornate framing or luxury language.

### 5.5 One strong gesture per section

Each section may have one defining visual behavior. It must not combine a badge, marquee, roadline, rotating ornament, multiple frames and a complex scroll effect simultaneously.

### 5.6 Desktop and mobile share a concept, not a scaled artboard

Mobile is recomposed as a direct media-led flow. Desktop may use more spatial tension and wider relationships.

---

## 6. Explicit anti-principles

Do not use:

- chapter numbers or issue language;
- magazine/table-of-contents navigation;
- newspaper columns as a recurring system;
- sepia or orange period filters;
- AI-generated environments, props or people;
- changed garment colors, patterns or construction;
- faux handwriting or provenance marks;
- decorative stamps repeated in every section;
- large color bands merely to create section separation;
- historical decade labels as the primary organizing logic;
- Etsy-style flat lays with decorative filler;
- generic product card grids as the opening experience;
- hover-only essential content;
- scroll hijacking that makes the page difficult to leave;
- multiple competing typefaces to manufacture personality.

---

## 7. Information architecture

### Primary navigation

1. `Home`
2. `Styled by Martha`
3. `The Collection`
4. `Beyond the Wardrobe`
5. `Visit`

`What Caught Her Eye` and `Found Together` remain content modules within the flow rather than primary navigation items.

### Homepage sequence

1. **Threshold / Hero**
2. **Styled by Martha**
3. **What Caught Her Eye**
4. **Found Together**
5. **The Collection**
6. **Beyond the Wardrobe**
7. **A Note from Martha**
8. **Visit / Contact**
9. **Footer**

The old “chapter” architecture is removed entirely.

---

## 8. Global visual system

### 8.1 Color

The interface uses a restrained system derived from the brand guide and verified against the new photography.

| Token | Initial value | Role |
|---|---:|---|
| `--mv-canvas` | `#F6EFE2` | warm neutral page base |
| `--mv-surface` | `#FBF7EF` | cleaner raised/quiet surface |
| `--mv-ink` | `#17110E` | primary text and controls |
| `--mv-muted` | `#746A61` | secondary information |
| `--mv-rose` | `#B51601` | primary emotional accent |
| `--mv-teal` | `#25606E` | secondary accent |
| `--mv-forest` | `#396E50` | natural/support accent |
| `--mv-ochre` | `#AC844A` | rare large-type or graphic accent only |
| `--mv-line` | `rgba(23,17,14,.18)` | dividers and quiet outlines |

Rules:

- neutral canvas dominates;
- only one UI accent leads a section;
- photography supplies most of the color;
- accent-on-accent text is prohibited unless contrast is measured;
- black and pure white are avoided unless an asset requires them;
- final values must be re-sampled from the approved image set and pass WCAG AA.

### 8.2 Typography

The redesign reduces the number of text voices.

- **Brand display:** official Martha’s Vintage SVG lettering only.
- **Interface/display:** Geist, using scale, weight and spacing rather than faux-retro type.
- **Narrative/body:** Poltawski Nowy for Martha’s voice and longer passages.
- **No recurring use:** Diplomata and Suravaram in the new design unless a later proof demonstrates a unique required role.

Type behavior:

- headings may be large but should remain clean and contemporary;
- body measure: approximately 55–72 characters on desktop;
- labels use sentence case or restrained uppercase; avoid excessive tracking;
- no more than two font families plus brand lettering in one viewport;
- use italics rarely and semantically, not as the default editorial accent.

### 8.3 Grid

Desktop (`>=1024px`):

- 12-column fluid grid;
- maximum content width: `1600px`;
- side gutters: `clamp(24px, 4.5vw, 80px)`;
- section vertical space: `clamp(88px, 10vw, 180px)`;
- image alignments may break the content grid intentionally, but text stays anchored.

Tablet (`768–1023px`):

- 8-column grid;
- no pinned horizontal narratives;
- preserve image scale and sequence without mimicking desktop overlaps.

Mobile (`<768px`):

- 4-column grid;
- side padding: `clamp(18px, 5vw, 26px)`;
- strong vertical sequence;
- no miniature newspaper columns;
- full-bleed images are allowed only when crop remains honest.

### 8.4 Shape and framing

- square or lightly softened corners (`0–8px`), not generic large rounded cards;
- borders are used as structure, not vintage decoration;
- image frames are quiet and thin when needed;
- avoid postage-stamp, ticket or torn-paper metaphors;
- native image edges may remain exposed.

### 8.5 Texture

- global texture opacity target: 0–8%;
- texture must not alter garment colors;
- no independent grunge texture on each image;
- authentic photographed surfaces can become section backgrounds when legibility allows;
- any blend mode must be verified against original pixels.

---

## 9. Photography system

### 9.1 Source of truth

Use original files from the 67-photo library:

- `email-2026-08-30/`
- `latest-2026-09-09-to-11/`
- `drive-links/`

Approved originals are copied into a curated project directory with nondestructive optimized derivatives. Originals are never overwritten.

### 9.2 Image roles

Every selected image receives one role:

- `threshold`: first impression/hero;
- `founder`: Martha as person and author;
- `look`: styled mannequin or worn outfit;
- `detail`: jewelry, embroidery, crochet, closure, material;
- `relationship`: multiple objects connected by color/material;
- `environment`: real room or shop context;
- `transition`: plant, basket, textile or quiet visual pause.

### 9.3 Authenticity policy

Allowed by default:

- exposure and white-balance correction;
- restrained color correction;
- crop and straighten;
- sharpening/noise cleanup;
- removal of temporary dust or tiny accidental distractions.

Requires explicit approval:

- background replacement;
- object removal/addition;
- body, face or room alteration;
- garment shape, print or color alteration;
- generated scene extension;
- synthetic shadows or lighting direction;
- compositing different objects as if photographed together.

### 9.4 Crop policy

- preserve the defining garment silhouette and material detail;
- do not crop hands, jewelry or belts if they explain the styling;
- use `object-position` per image, never one global center rule;
- verify mobile and desktop crops separately;
- no upscaling beyond a visually validated limit;
- retain EXIF orientation correctly in optimized derivatives.

---

## 10. Component specification by section

## 10.1 Global loader

### Purpose

A brief brand entrance, never a barrier.

### Behavior

- show only on first visit in the session;
- target duration: 1.2–2.2 seconds;
- hard failsafe: 4 seconds maximum;
- reduced motion: static logo, short fade;
- preserve Safari-compatible delivery;
- never leave an empty cream viewport after hydration failure;
- loader completion must restore scroll and focus predictably.

### Visual

Use official logo animation or a restrained lettering reveal. Do not preview the old magazine direction through grunge or faux print effects.

---

## 10.2 Header and navigation

### Desktop

- same header nodes begin inside the hero and become persistent after hero release;
- unified Martha’s Vintage lettering appears as one lockup from the first frame;
- initial placement: upper left;
- navigation occupies the upper right in one line when space permits;
- header hides on meaningful downward scroll and returns immediately on upward scroll;
- no dotted leaders;
- no duplicate navigation after the hero;
- background starts transparent/quiet and gains a soft canvas surface after handoff.

### Mobile

- compact unified logo left;
- explicit `Menu` control right;
- fullscreen or near-fullscreen menu may remain, but adopts the new visual system;
- links use plain hierarchy, no chapter numbers;
- opening traps focus; Escape closes; close restores focus;
- body scroll locks only while open.

---

## 10.3 Threshold / Hero

### Purpose

Establish Martha as the author and clothing as the entry point while signaling color, intimacy and present-day relevance.

### Desktop composition

- one viewport sticky stage;
- unified logo in the upper left, never split across opposite corners;
- concise context and approved brand line in the lower left;
- authentic image stage occupying the right 55–65% of the viewport;
- image stage begins as a focused portrait/look and expands during scroll;
- expansion reveals a wider sequence containing Martha, a styled look and one detail, using real images only;
- navigation remains legible outside the image’s highest-detail area;
- CTA: `Explore the collection` if destination exists, otherwise `See how Martha styles it` to the next section;
- “Bastrop, Texas” remains visible but secondary.

### Scroll behavior

- pin length target: 100–140vh beyond the initial viewport, adjusted after real gesture testing;
- progress 0–35%: copy and focused image remain readable;
- progress 35–75%: image stage expands/reveals adjacent authentic material;
- progress 65–90%: logo/header compacts into persistent state;
- progress 90–100%: transition settles before the next section enters;
- no flying decorative butterfly as the main action;
- movement must be reversible and stable through resize/refresh;
- reduced motion renders the complete final composition without pinning.

### Mobile composition

- no long pinned scrub;
- hero occupies at least one safe visual viewport;
- unified logo/header at top;
- one vertical authentic photo dominates;
- context, headline and CTA remain concise;
- image may scale subtly on scroll, but the visitor exits in one normal gesture;
- no brown text card;
- no `01/06` unless a real gallery control is present;
- no long paragraph over the image.

### Content source

Preferred approved copy hierarchy:

- eyebrow: `Bastrop, Texas`;
- main brand line: `Beautiful things with a past, chosen for the life they can have now.`;
- short descriptor: adapted from the approved brand definition;
- CTA depends on a real anchor.

No new public tagline is final without approval.

---

## 10.4 Styled by Martha

### Purpose

Immediately prove the brand’s alternative, contemporary styling point of view.

### Content

- 5–8 complete looks selected from the new mannequin/worn images;
- combinations across floral, crochet, tailoring, scarves, belts, bags and jewelry;
- each look receives a short observation grounded in visible details;
- language describes choice and combination, not decade.

### Desktop

- one dominant look plus a horizontal sequence of secondary looks;
- image ratios remain consistent within each row;
- switching looks updates one short “Martha noticed…” line;
- controls remain visible and keyboard accessible;
- no issue numbering.

### Mobile

- swipeable carousel with scroll-snap;
- visible next-slide affordance and dots or count;
- no auto-advance;
- caption remains visible without hover.

### Motion gesture

One transition only: the selected look enlarges or shifts into the primary frame. No rotating badge or decorative roadline.

---

## 10.5 What Caught Her Eye

### Purpose

Reveal the criteria behind the collection.

### Content categories

- color;
- handwork;
- construction;
- texture;
- repair/patina where visible;
- unusual combination.

### Desktop

A calm detail field: 4–6 close-up images at varied but disciplined scales, connected by concise notes. The layout may be asymmetric but must preserve clear reading order.

### Mobile

A direct sequence of image → note → image → note. No floating textboxes or microcopy requiring zoom.

### Interaction

Selecting a detail may reveal one additional sentence. Essential meaning is always visible.

---

## 10.6 Found Together

### Purpose

Become the signature module that demonstrates “Martha’s world” rather than explaining it abstractly.

### Composition

Each group combines two or three real subjects connected by one relationship:

- floral skirt + needlework;
- jewelry + belt hardware;
- basket + woven bag;
- room palette + garment;
- flower/plant color + embroidery.

### Rules

- relationships must be visually defensible;
- no compositing that implies objects were physically together unless they were;
- images can sit adjacent rather than inside fake scenes;
- one short note explains the connection;
- use up to four groups on the homepage.

### Desktop

Alternating two-up and three-up relationships with generous whitespace.

### Mobile

One relationship per viewport rhythm; avoid dense collage.

### Motion

A restrained crossfade, clip reveal or synchronized vertical entrance. No parallax on every item.

---

## 10.7 The Collection

### Purpose

Translate world-building into clear categories without becoming a generic marketplace.

### Categories

1. `Vintage clothing`
2. `Textiles & needlework`
3. `Jewelry & accessories`
4. `Art & beautiful things`

### Desktop

- category rail or four large media panels;
- each panel uses one authentic image and one sentence;
- hover may add movement but cannot contain essential text;
- if no live catalog exists, CTA language must not imply online inventory.

### Mobile

- stacked panels or horizontal category rail;
- category names and descriptions always visible;
- clear destination or honest non-clickable state.

### Copy source

Use approved category descriptions from `BRAND_GUIDE.md`; do not invent availability, rarity, provenance or pricing.

---

## 10.8 Beyond the Wardrobe

### Purpose

Show that clothing, art, interiors and handwork share the same visual language.

### Visual direction

- real house images lead;
- alternate wide environmental photographs with close details;
- preserve plants, frames, baskets, lamps, sofas, needlework and artwork as evidence of Martha’s eye;
- avoid presenting the house as a luxury interiors feature.

### Desktop

- wide environmental image followed by a measured mosaic of details;
- copy appears as one authored note, not a chapter introduction;
- one full-width color/material transition may be used if derived from an image.

### Mobile

- environment → detail → object → short note;
- maintain actual image proportions when practical;
- no tiny multi-column collage.

---

## 10.9 A Note from Martha

### Purpose

Give the founder a human voice without turning the site into a long editorial essay.

### Content

One approved first-person passage about noticing, collecting and imagining how pieces live now. Target length: 70–130 words.

### Visual

- portrait or candid image of Martha;
- quiet neutral area after visually dense sections;
- no handwriting simulation;
- optional real signature only if supplied by Martha.

### CTA

`Read Martha’s story` only if a real Story page is built. Otherwise no dead CTA.

---

## 10.10 Visit / Contact

### Purpose

Convert interest into a real next step.

### Required content

- Bastrop, Texas;
- verified address or Google Maps destination when available;
- verified email/contact method;
- visit policy or appointment language only if confirmed;
- social link only when supplied and active.

### Visual

Use a real shop/environment image. Contact information is conventional and easy to scan. This section should not hide practical details inside poetic copy.

### CTA rules

- no `#visit` placeholder at release;
- no “Schedule a visit” without a real mechanism;
- external links expose their destination and open safely.

---

## 10.11 Footer

### Content

- official horizontal lettering;
- Bastrop, Texas;
- concise brand definition;
- verified contact/social links;
- current year;
- back-to-top action.

### Visual

A clean dark-ink or deep-teal close. No newspaper footer, issue metadata or ornamental ticket.

---

## 11. Motion system

### Motion qualities

- observant;
- warm;
- tactile;
- slightly surprising;
- never frantic.

### Timing

- UI transitions: 180–320ms;
- media reveals: 500–900ms;
- hero scrub follows scroll rather than autoplay;
- marquee, if retained anywhere, must be slow, optional and limited to one occurrence;
- avoid simultaneous perpetual animations.

### Allowed patterns

- crop expansion;
- clip reveal;
- gentle image scale (`1` to maximum `1.04`);
- short text fade/translate;
- horizontal media progression controlled by explicit input;
- subtle logo/header compaction.

### Prohibited patterns

- decorative objects flying across content;
- constant rotation of seals;
- motion on every heading;
- scroll sections that trap multiple gestures after the visual state is complete;
- transforms that change image identity or distort garments.

### Reduced motion

- no pins dependent on animation progress;
- all content visible in final composition;
- no auto-scrolling carousel;
- transitions become immediate or short opacity changes.

---

## 12. Responsive specification

### Breakpoints

- mobile: `<768px`;
- tablet: `768–1023px`;
- desktop/notebook: `>=1024px`;
- wide desktop adaptations: `>=1600px` without creating a separate visual language.

### Required test matrix

Mobile:

- 360×740
- 375×812
- 390×844
- 402×874
- 430×932

Tablet:

- 768×1024
- 820×1180

Desktop:

- 1024×768
- 1280×720
- 1280×832
- 1366×768
- 1440×900
- 1920×1080

### Responsive rules

- exactly one hero variant visible at each breakpoint;
- no duplicate visible IDs;
- no global horizontal clipping used to hide broken layout;
- headings must not clip internally;
- image crops are authored per breakpoint;
- mobile touch targets minimum 44×44 CSS pixels;
- overlays never cover garment-defining details;
- full-bleed media must not cause document overflow;
- desktop transforms must recompute on resize.

---

## 13. Accessibility

Target: WCAG 2.2 AA.

Requirements:

- semantic heading order;
- descriptive alt text based on visible content, not marketing language;
- decorative images use empty alt;
- keyboard-operable navigation and carousels;
- visible focus treatment;
- no essential hover-only content;
- color contrast measured for final palette;
- motion respects `prefers-reduced-motion`;
- menu focus trap and restoration;
- skip link to main content;
- landmarks for header, navigation, main and footer;
- carousel announcements must not become noisy live regions;
- controls must describe their action and current state.

---

## 14. Performance

Targets for production homepage:

- LCP image optimized and preloaded only when truly used above the fold;
- responsive `sizes` reflects cover geometry;
- no original multi-megabyte photos served directly when a derivative is sufficient;
- hero image quality must remain visually acceptable at DPR 2;
- lazy load below-fold media;
- cap animations to transform/opacity where possible;
- avoid layout thrashing in scroll handlers;
- remove unused legacy CSS and assets only after final approval;
- loader must not delay LCP indefinitely;
- no WebGL/Three.js introduced without a demonstrated concept need;
- target no new console errors or failed asset requests.

Suggested budgets to validate, not blindly enforce:

- initial transferred image bytes under approximately 1.5 MB on desktop and 900 KB on mobile;
- below-fold gallery images delivered on demand;
- CLS below 0.1;
- no long main-thread task introduced by scroll animation.

---

## 15. Content governance

### Authoritative sources

1. Martha’s emails and explicit feedback;
2. `BRAND_GUIDE.md` source-backed statements;
3. original story/vision PDF;
4. user-approved copy changes.

### Copy rules

- English American;
- Martha may speak in first person where clearly authored;
- specific visible details over generic adjectives;
- no fabricated provenance;
- no unsupported sustainability claims;
- no false scarcity;
- no invented events, services, opening hours or inventory state;
- `vintage` is context, not a repeated decorative adjective;
- headings should sound like observations, not magazine article titles.

---

## 16. Proposed implementation architecture

The new homepage should be built in parallel, not by repeatedly mutating legacy sections.

### New component boundary

```text
src/
  components/
    authored-world/
      authored-world-page.tsx
      site-header.tsx
      threshold-hero.tsx
      styled-by-martha.tsx
      caught-her-eye.tsx
      found-together.tsx
      collection-paths.tsx
      beyond-wardrobe.tsx
      martha-note.tsx
      visit-section.tsx
      site-footer.tsx
      media-carousel.tsx
      authored-world.module.css
  data/
    marthas-content.ts
    marthas-media.ts
```

### Preview route

Build and review first at a dedicated preview route, for example:

```text
/direction
```

The current homepage remains available during implementation. After full approval and regression testing, switch `/` to the new composition. Remove legacy code only in a separate cleanup step.

### Asset boundary

```text
public/assets/site/authored-world/
  hero/
  looks/
  details/
  relationships/
  interiors/
  martha/
```

Every derivative should map back to its original source in an asset manifest containing:

- source filename;
- source hash;
- derivative filename;
- dimensions;
- crop intent;
- compression quality;
- section role;
- alt-text draft;
- approval state.

### Styling

- use a scoped CSS Module for the new experience;
- expose global tokens in one deliberate location;
- do not append a third generation of broad overrides to `globals.css`;
- isolate legacy CSS until swap;
- no Tailwind migration is required for this redesign.

---

## 17. Migration phases and approval gates

### Phase 0 — Baseline and asset manifest

- capture current desktop/mobile behavior;
- preserve dirty-tree state;
- catalog 67 originals;
- identify unrelated/untrusted files in the current photos directory;
- create approved curated asset manifest.

**Gate:** asset shortlist and baseline accepted.

### Phase 1 — Direction board and hero

- palette proof;
- typography proof;
- desktop/mobile static hero;
- motion prototype;
- multiviewport audit.

**Gate:** user approves hero, header and motion.

### Phase 2 — Signature modules

Implement:

- Styled by Martha;
- What Caught Her Eye;
- Found Together.

**Gate:** visitor can describe Martha’s point of view after these modules.

### Phase 3 — Collection and Beyond the Wardrobe

- category navigation;
- collection clarity;
- authentic interior sequence;
- honest CTA destinations.

**Gate:** atmosphere and commercial clarity coexist.

### Phase 4 — Founder, Visit and Footer

- Martha note;
- practical contact layer;
- footer and navigation anchors;
- content verification.

**Gate:** no invented business facts or dead CTAs.

### Phase 5 — Full responsive QA

- viewport matrix;
- interaction tests;
- accessibility;
- performance;
- reduced motion;
- Safari/mobile compatibility;
- visual review.

**Gate:** final user approval before homepage switch.

### Phase 6 — Homepage swap and cleanup

- switch `/` to new experience;
- keep rollback path;
- remove legacy modules only after confirmation;
- rerun complete build and visual audit.

No commit, push or deployment without explicit user approval.

---

## 18. Validation and acceptance criteria

### Concept acceptance

The redesign passes only if:

- first impression is Martha’s authored world, not a vintage magazine;
- clothing remains a clear business focus;
- authentic images carry the atmosphere;
- multiple decades feel connected through styling rather than chronology;
- Martha is recognizable as the curator;
- the result feels alternative and American without becoming generic thrift branding;
- the collection feels approachable but edited.

### Visual acceptance

- unified logo from the first hero frame;
- no split opposite-corner “Martha’s / Vintage” composition;
- no chapter labels;
- no heavy global sepia/grunge;
- no accidental white gaps or mismatched photo boxes;
- consistent image quality and authored crops;
- no decorative gesture competes with primary content;
- mobile is intentionally composed, not shrunk desktop.

### Functional acceptance

- all nav links target real sections;
- no dead CTA;
- menu works with keyboard/touch;
- carousels return correctly and announce state accessibly;
- no horizontal overflow in required viewports;
- hero animation survives resize and reverse scroll;
- reduced motion works;
- loader cannot block access;
- no console errors;
- images load and decode;
- production build passes.

### Image-authenticity acceptance

- source-to-derivative map exists;
- no generative expansion or background substitution without explicit approval;
- colors of garments remain faithful;
- comparison against original is available for every edited hero asset.

---

## 19. Open decisions requiring user or Martha confirmation

1. Confirm which portraits depict Martha and which depict models/family.
2. Confirm publication permission for every identifiable person.
3. Select the primary hero image set.
4. Confirm whether the current logo loader stays, shortens or becomes first-session only.
5. Confirm which current copy blocks have already been explicitly approved by Martha.
6. Provide verified visit/contact destination, address and social links.
7. Confirm whether the collection is currently view-only, inquiry-based or purchasable.
8. Confirm whether future event/newsletter CTAs should be omitted or shown as honest coming-soon states.
9. Decide whether the butterfly remains as a minor brand symbol after the hero proof.

---

## 20. Definition of done

The redesign is complete when:

- the full new homepage exists on the dedicated branch;
- all sections follow this spec or document an approved deviation;
- user has approved each phase gate;
- photography is authentic and traceable;
- responsive matrix passes visually and functionally;
- accessibility and reduced-motion checks pass;
- lint and production build pass;
- the current homepage can be restored until final swap;
- no unrelated dirty-tree files were deleted or absorbed accidentally;
- no commit, push or deployment happened without explicit authorization.
