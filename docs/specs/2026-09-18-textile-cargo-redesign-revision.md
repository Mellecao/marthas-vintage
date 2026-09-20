# Martha’s Vintage — Textile Cargo Revision

**Date:** 2026-09-18  
**Branch:** `feat/marthas-authored-world-redesign`  
**Preview route:** `/direction`  
**Precedence:** This document supersedes the hero and first-content-section decisions in `2026-09-17-marthas-authored-world-redesign.md`. All authenticity, accessibility and no-publication-without-approval rules from the earlier specification remain active.

## 1. Locked decisions

1. Preserve the established desktop hero composition and behavior:
   - separated Martha’s/Vintage lettering;
   - central photographic window expanding to full width on scroll;
   - dotted navigation and its identity-preserving handoff;
   - butterfly with animated wings and exit path;
   - existing discovery link, texture stack and timing;
   - reduced-motion behavior.
2. Preserve the established mobile hero composition:
   - centered logo;
   - mobile menu;
   - framed photographic stage;
   - butterfly placement;
   - brown introductory card and discovery link;
   - change the hero image only.
3. Use the user-supplied horizontal image attached on 2026-09-18 as the new hero source. Copy it nondestructively into the project; never overwrite the downloaded source.
4. Immediately after the hero, introduce Martha through an irregular Cargo.site-inspired bento.
5. Use both real portraits of Martha discreetly in separate bento cells:
   - frontal smiling portrait in a white crochet top;
   - candid seated portrait with hat and red scarf.
6. Place a narrative gallery after the Martha bento.
7. Photo cells use irregular textile-cut SVG masks/borders. Text cells use SVG stitching/pesponto outlines.
8. Continue work only in `/direction` until explicit approval. Do not replace `/`, commit, push or deploy.

## 2. Diagnosis

The current `/` page remains materially similar to the pre-email design because it still uses chapter labels, newspaper-like text blocks, paper/grunge as a dominant system, rust/olive editorial bands and repeated publication devices.

The current `/direction` route corrected the premise but replaced the distinctive existing hero with a minimal threshold hero. It therefore lost the butterfly, split lettering, dotted navigation, richer composition and longer expansion motion.

The revision keeps the strongest authored mechanic—the original hero—and rebuilds everything below it so the site no longer reads as a vintage magazine.

## 3. Experience sequence

1. **Preserved hero — new photograph**
2. **Meet Martha — irregular bento**
3. **Martha’s Eye in Practice — narrative look gallery**
4. **Materials in Conversation — detail/material interlude**
5. **Beyond the Wardrobe — interiors, art and objects**
6. **Visit / contact**

Only sections 1–3 are in the first implementation gate. Later sections may be represented by clean semantic placeholders but must not reintroduce the old chapter system.

## 4. Hero contract

### Desktop

The source behavior of `DesktopHomeHero` is protected. The new implementation may add a media-source prop and route-specific anchor data, but it must not rewrite timing, geometry, persistent-menu behavior, butterfly choreography or reduced-motion behavior.

The new image is horizontal and should remain spatially coherent while the photo window grows from the center to full width. Crop rules:

- initial inset state: center the black dress / rose artwork / rust dress, while retaining enough mannequin and fringe to read the larger arrangement;
- expanded state: reveal the full wall composition;
- avoid cropping the mannequin’s beret and the lower baskets simultaneously;
- no generated extension, content-aware replacement or object removal.

### Mobile

Preserve the existing mobile structure and use a responsive crop of the same source image. Prioritize:

- mannequin and rust dress;
- one hanging garment;
- baskets/materials at the lower edge;
- enough wall for breathing room behind the logo and butterfly.

## 5. Meet Martha bento

### Purpose

Introduce a person and a point of view before presenting a collection. Martha must feel present but not posed as a fashion campaign protagonist.

### Desktop composition

An asymmetric 12-column field with deliberately unequal cells:

- **Title cell (wide):** very large contemporary sans title, e.g. `Meet Martha.` or approved final copy;
- **Serif note cell:** a concise first-person introduction, 2–4 lines;
- **Portrait A (small/vertical):** frontal smiling portrait;
- **Portrait B (small/square):** candid seated portrait with hat;
- **Material cell:** close crop of crochet/handwork connected to Portrait A;
- **Color-instinct cell:** short statement or sampled color chips derived from actual garments;
- **Location cell:** `Bastrop, Texas` plus one practical line.

The bento must not become a dashboard. Cells can overlap by a few pixels, vary in height, and leave intentional voids.

### Border language

- photo cells: irregular textile-cut outlines built as reusable SVG masks or border paths;
- text cells: thin stitched/pesponto SVG paths with slight rhythm irregularity;
- no generic rounded-card grid;
- no fake tape, stamps, torn notebook paper or scrapbook devices;
- maximum of two border gestures visible in one viewport.

### Typography

- large titles: established Geist sans, bold but not ultra-black;
- descriptive copy: established Poltawski/serif;
- labels: Geist sans, compact and restrained;
- no chapter labels, issue numbers or magazine kickers.

### Mobile

Recompose into a linear sequence rather than shrinking the grid:

1. large title;
2. serif introduction;
3. portrait A with textile mask;
4. short point-of-view statement;
5. portrait B as a smaller offset cell;
6. location/transition into the gallery.

## 6. Narrative gallery

### Principle

Do not organize images by decade or product type. Organize them by why Martha sees them as belonging together.

### Story groups for the first implementation

#### A. Pattern holds the conversation

Use the floral-skirt series with different tops/jackets to show one piece changing character through contrast:

- floral skirt + bright floral top;
- floral skirt + striped pink/black blazer;
- floral skirt + dark tailored jacket;
- floral skirt + neutral vest or white top.

Narrative: repetition is not redundancy; one strong pattern can become a base for multiple personalities.

#### B. One warm interruption

Use the deep teal/blue embroidered dress with a mustard waist tie plus a close detail.

Narrative: one warm gesture can interrupt a cooler palette and make the construction legible.

#### C. Texture before trend

Use crochet, embroidery, fringe, woven baskets and jewelry details.

Narrative: Martha notices handwork and surface before labels or dates.

#### D. Color does not need permission

Use the green embroidered coat with zebra bag, the red-and-black combination, and the rose/aqua look.

Narrative: colors harmonize through intensity, repetition and one grounding neutral—not through safe matching.

### Interaction

- desktop: horizontal or sticky story sequence with one consistent transition language;
- mobile: native horizontal scroll-snap with no auto-advance;
- every group contains a reason, not only a caption;
- selected state and current story are keyboard/screen-reader accessible;
- reduced motion removes scrubbed/parallax transforms.

## 7. Color

Keep warm neutrals as connective tissue but introduce color from the source photographs.

Base:

- canvas `#F6EFE2`;
- quiet surface `#FBF7EF`;
- ink `#17110E`;
- muted `#6F655D`.

Section accents sampled/refined from the supplied images:

- rose/red `#B8323C`;
- woven rust `#B65B2A`;
- teal `#2C6663`;
- mustard `#C59A3D`;
- plum `#66304C`;
- leaf green `#55704A`.

Rules:

- one dominant accent per story group;
- maintain WCAG contrast for text;
- do not tint every photo to one uniform palette;
- harmonization means white-balance/exposure consistency, not erasing each image’s character.

## 8. Texture and parallax

### Source hierarchy

1. Prefer real textures already present in Martha’s photographs: crochet, fringe, embroidery, baskets, satin, denim and woven bags.
2. External licensed textures may be downloaded only when a needed material is missing, with source/license recorded.
3. Do not use AI-generated textile textures when authentic photographed material is available.

### Behavior

- use isolated fixed-position texture planes behind or through section masks;
- movement is created by the document scrolling over fixed planes or by very small transform deltas;
- textures must never reduce text contrast;
- maximum opacity generally 6–18%, depending on blend mode;
- no full-page noisy overlay;
- each texture belongs to a specific story/material, not random decoration;
- on `prefers-reduced-motion`, fixed/parallax behavior becomes static;
- on mobile, cap or remove fixed backgrounds when they cause paint or Safari issues.

## 9. Photography treatment policy

Allowed by default:

- exposure and white-balance correction;
- restrained cinematic color grading;
- crop and straighten;
- gentle noise cleanup/sharpening;
- nondestructive derivatives.

Requires explicit approval:

- adding/removing permanent objects;
- changing a garment’s color, print, construction or shape;
- changing a person or room;
- inventing light direction or replacing backgrounds;
- generative fill/extensions.

Only enhance a photograph when the untreated original is materially inconsistent with the section. Good originals remain untreated except for crop/delivery optimization. Every derivative must retain a source reference in the asset manifest.

## 10. Acceptance gates

### Gate A — protected hero

- old desktop and mobile DOM/visual structure preserved;
- attached image is the only substantive visual replacement;
- butterfly appears and animates as before;
- desktop photo expansion and menu handoff match the existing behavior;
- no horizontal overflow at 1024, 1280, 1440 and 1920 desktop widths;
- mobile verified at 360×740, 390×844 and 430×932.

### Gate B — Martha bento

- both real portraits appear discreetly;
- no generic card-dashboard appearance;
- irregular textile photo borders and stitched text borders are real SVG paths/masks;
- title and serif note preserve hierarchy at all viewports;
- keyboard order follows reading order;
- no private local paths in public manifests.

### Gate C — narrative gallery

- at least three coherent story groups;
- each group explains Martha’s curatorial logic;
- only full-frame-reviewed photos are used;
- no visible generated-content label in an approved production crop;
- no auto-advance;
- mobile scroll controls preserve page `scrollY`;
- reduced motion and overflow tests pass.

## 11. Version-control and release boundary

- No commit without explicit user approval.
- No push or deployment without separate explicit approval.
- Do not modify or replace `/` during preview implementation.
- Preserve unrelated dirty-tree changes.
- Implement and validate on `/direction` first.
