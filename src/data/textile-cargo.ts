export type TextileStoryImage = {
  src: string;
  alt: string;
  position?: string;
};

export type TextileStory = {
  id: `story-${string}`;
  number: string;
  title: string;
  accent: string;
  note: string;
  images: TextileStoryImage[];
};

const gallery = (name: string) =>
  `/assets/site/textile-cargo/gallery/optimized/${name}`;
const detail = (name: string) =>
  `/assets/site/textile-cargo/details/optimized/${name}`;

export const TEXTILE_STORIES: TextileStory[] = [
  {
    id: "story-pattern",
    number: "01",
    title: "Pattern holds the conversation",
    accent: "rose",
    note: "Martha lets one pattern establish the rhythm, then brings in another piece that answers it through scale, color or attitude—not perfect matching.",
    images: [
      {
        src: gallery("pattern-mixing.jpg"),
        alt: "A layered vintage look combining several floral and geometric patterns",
        position: "50% 34%",
      },
      {
        src: gallery("rose-and-aqua.jpg"),
        alt: "A rose and aqua vintage combination styled with jewelry and a belt",
        position: "50% 28%",
      },
      {
        src: gallery("monochrome-layers.jpg"),
        alt: "A monochrome layered outfit with contrasting textures and accessories",
        position: "50% 30%",
      },
    ],
  },
  {
    id: "story-color",
    number: "02",
    title: "Color does not need permission",
    accent: "teal",
    note: "Red, green, burgundy and black can live together when one tone grounds the others. The point is not safety—it is a balance that feels intentional.",
    images: [
      {
        src: gallery("red-and-black.jpg"),
        alt: "A red vintage dress edged with black accessories",
        position: "50% 32%",
      },
      {
        src: gallery("green-plaid.jpg"),
        alt: "A green vintage outfit mixing plaid, jewelry and a textured belt",
        position: "50% 34%",
      },
      {
        src: gallery("burgundy-handwork.jpg"),
        alt: "A burgundy vintage look with visible handwork and tactile details",
        position: "50% 30%",
      },
    ],
  },
  {
    id: "story-handwork",
    number: "03",
    title: "Texture before trend",
    accent: "mustard",
    note: "Before a label or a decade, Martha notices the hand: needlepoint, woven cane, embroidery, metal and the evidence that somebody took time to make something well.",
    images: [
      {
        src: detail("needlepoint-baskets.jpg"),
        alt: "Needlepoint textiles and bags gathered in woven baskets",
        position: "50% 52%",
      },
      {
        src: detail("embroidery-basket.jpg"),
        alt: "A woven basket filled with framed floral embroidery and textile work",
        position: "50% 55%",
      },
      {
        src: detail("jewelry-drawer.jpg"),
        alt: "A wooden drawer filled with colorful vintage jewelry",
        position: "50% 48%",
      },
    ],
  },
];

export type BeyondObject = {
  src: string;
  alt: string;
  position?: string;
  /** Placement in the 12-column bento. Ignored below 1024px. */
  column: string;
  row: string;
};

const photo = (name: string) => `/assets/site/photos/${name}`;

// Everything in the photo library that is not a garment-only shot. The three
// `details/` close-ups and `portraits/store-corner.jpg` belong to this group too
// but already appear earlier on the page (story 03, the coda image and the shop
// section), so they are left out here rather than repeated.
//
// The bento is a 12 x 14 unit grid, laid out so every cell matches the shape of
// the photo that sits in it and nothing is left over: a wide pair across the
// top, then four staggered columns. The library also holds two pairs of
// near-identical frames (the two linen-rack shots, and the two
// needlepoint-portrait shots); both are kept, placed at opposite ends so they
// never sit side by side.
export const BEYOND_OBJECTS: BeyondObject[] = [
  {
    src: photo("beyondthewardrobe_6.jpg"),
    alt: "Two needlepoint portraits in gilt frames leaning against a pink wall",
    position: "50% 45%",
    column: "1 / span 6",
    row: "1 / span 5",
  },
  {
    src: photo("store_2.jpg"),
    alt: "Baskets, upholstered chairs and a table of small objects in the middle of the shop",
    position: "50% 55%",
    column: "7 / span 6",
    row: "1 / span 5",
  },
  {
    src: photo("beyondthewardrobe_2.jpg"),
    alt: "Embroidered linens and floral table cloths hung over a wooden rack",
    position: "50% 42%",
    column: "1 / span 3",
    row: "6 / span 6",
  },
  {
    src: photo("store_3.jpg"),
    alt: "Straw hats, woven bags, ceramic masks and needlepoint purses filling a corner of the shop",
    position: "50% 45%",
    column: "4 / span 3",
    row: "6 / span 4",
  },
  {
    src: photo("beyondthewardrobe_4.jpg"),
    alt: "A bed dressed in crochet and appliqué linens beside a painted canvas and a lamp",
    position: "50% 52%",
    column: "7 / span 3",
    row: "6 / span 5",
  },
  {
    src: photo("quadros.png"),
    alt: "A pair of needlepoint portraits framed in gold and pink",
    position: "50% 45%",
    column: "10 / span 3",
    row: "6 / span 3",
  },
  {
    src: photo("beyondthewardrobe_5.jpg"),
    alt: "Hand-embroidered cloths and a basket of textiles against a white wall",
    position: "50% 42%",
    column: "10 / span 3",
    row: "9 / span 6",
  },
  {
    src: photo("beyondthewardrobe_3.jpg"),
    alt: "A curtained corner with a patterned rug, a small table and a framed painting",
    position: "50% 50%",
    column: "4 / span 3",
    row: "10 / span 5",
  },
  {
    src: photo("store_1.jpg"),
    alt: "The shop floor, with racks of clothing around a table of glassware and stacked frames",
    position: "50% 55%",
    column: "7 / span 3",
    row: "11 / span 4",
  },
  {
    src: photo("beyondthewardrobe_1.jpg"),
    alt: "A wall of framed needlework above baskets and stacked picture frames",
    position: "50% 45%",
    column: "1 / span 3",
    row: "12 / span 3",
  },
];
