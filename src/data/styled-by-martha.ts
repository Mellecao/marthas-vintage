export type StyledLook = {
  id: string;
  name: string;
  full: { src: string; alt: string; position: string; fit?: "cover" | "contain" };
  detail: { src: string; alt: string; position: string };
  observation: string;
};

const asset = (filename: string) =>
  `/assets/site/authored-world/styled/${filename}`;

export const STYLED_LOOKS: StyledLook[] = [
  {
    id: "pattern-mixing",
    name: "Pattern, given room",
    full: {
      src: asset("pattern-mixing.jpg"),
      alt: "Mannequin in a white blouse and black patchwork floral skirt with a wide hat and layered necklaces",
      position: "50% 48%",
      fit: "contain",
    },
    detail: {
      src: asset("pattern-mixing.jpg"),
      alt: "Closer view of the fringed scarf, necklaces, gathered blouse and tooled leather belt",
      position: "50% 28%",
    },
    observation:
      "A quiet white top leaves room for a patchwork floral skirt; hat, scarf and worn metal pull the patterns together.",
  },
  {
    id: "red-and-black",
    name: "Red, edged in black",
    full: {
      src: asset("red-and-black.jpg"),
      alt: "Mannequin in a vivid red patterned dress with a black embroidered scarf and black hat",
      position: "50% 48%",
    },
    detail: {
      src: asset("red-and-black.jpg"),
      alt: "Closer view of the black hat, scarf, red print and narrow studded belt",
      position: "50% 30%",
    },
    observation:
      "A black embroidered scarf sharpens the bright dress; the small belt repeats the contrast instead of softening it.",
  },
  {
    id: "rose-and-aqua",
    name: "Two florals, one current",
    full: {
      src: asset("rose-and-aqua.jpg"),
      alt: "Mannequin in a rose-print blouse and aqua illustrated skirt with a straw hat and medallion belt",
      position: "68% 48%",
    },
    detail: {
      src: asset("rose-and-aqua.jpg"),
      alt: "Closer view of rose print, stone bracelets and the wide medallion belt",
      position: "70% 38%",
    },
    observation:
      "A rose-print blouse meets an aqua illustrated skirt; stone bracelets and a wide medallion belt bridge the colors.",
  },
  {
    id: "green-plaid",
    name: "Plaid, made sculptural",
    full: {
      src: asset("green-plaid.jpg"),
      alt: "Mannequin in a green plaid shirt dress with a straw hat and oversized leather disc belt",
      position: "58% 48%",
    },
    detail: {
      src: asset("green-plaid.jpg"),
      alt: "Closer view of layered green plaid, turquoise necklace and oversized disc belt",
      position: "62% 43%",
    },
    observation:
      "Green plaid turns sculptural beside a straw hat and an oversized leather-and-metal belt.",
  },
  {
    id: "monochrome-layers",
    name: "Pattern within a palette",
    full: {
      src: asset("monochrome-layers.jpg"),
      alt: "Mannequin in a black-and-white printed dress with a floral fringed shawl, black belt and stacked hats",
      position: "55% 48%",
    },
    detail: {
      src: asset("monochrome-layers.jpg"),
      alt: "Closer view of stacked hats, layered necklaces, floral fringe and the monochrome dress print",
      position: "55% 31%",
    },
    observation:
      "Snake print, a floral-fringed shawl and a black belt share one palette, so three patterns read as one look.",
  },
  {
    id: "burgundy-handwork",
    name: "Warmth without matching",
    full: {
      src: asset("burgundy-handwork.jpg"),
      alt: "Mannequin in a richly worked burgundy top and tiny floral skirt with a leopard belt and woven bag",
      position: "50% 48%",
    },
    detail: {
      src: asset("burgundy-handwork.jpg"),
      alt: "Closer view of the embroidered top, leopard belt and floral skirt",
      position: "50% 35%",
    },
    observation:
      "A richly worked top, tiny floral skirt and leopard belt meet through warm burgundy rather than matching prints.",
  },
];
