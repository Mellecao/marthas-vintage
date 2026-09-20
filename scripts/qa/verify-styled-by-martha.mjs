import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const paths = {
  component: "src/components/authored-world/styled-by-martha.tsx",
  data: "src/data/styled-by-martha.ts",
  page: "src/components/authored-world/authored-world-page.tsx",
  styles: "src/components/authored-world/authored-world.module.css",
  manifest: "public/assets/site/authored-world/asset-manifest.json",
};

for (const [label, path] of Object.entries(paths)) {
  assert.ok(existsSync(resolve(root, path)), `${label} is missing: ${path}`);
}

const component = readFileSync(resolve(root, paths.component), "utf8");
const data = readFileSync(resolve(root, paths.data), "utf8");
const page = readFileSync(resolve(root, paths.page), "utf8");
const styles = readFileSync(resolve(root, paths.styles), "utf8");
const manifest = JSON.parse(readFileSync(resolve(root, paths.manifest), "utf8"));
const source = [component, data, page, styles].join("\n");

function jpegDimensions(bytes) {
  let offset = 2;
  const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  while (offset < bytes.length - 8) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    const marker = bytes[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = bytes.readUInt16BE(offset);
    if (frameMarkers.has(marker)) {
      return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  throw new Error("Could not read JPEG dimensions");
}

assert.match(page, /<StyledByMartha\s*\/>/, "real section must replace the preview placeholder");
assert.match(source, /id="styled-by-martha"/, "section anchor is missing");
assert.match(source, /Styled by Martha/, "section title is missing");
assert.match(source, /Martha noticed/, "observation label is missing");
assert.match(source, /scroll-snap-type/, "mobile scroll-snap behavior is missing");
assert.match(source, /aria-live="polite"/, "selected look announcement is missing");
assert.match(source, /aria-pressed/, "desktop look controls must expose selected state");
assert.doesNotMatch(source, /autoPlay|setInterval|Chapter|issue/i, "auto-advance and editorial devices are forbidden");

const ids = [...data.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, 6, "Styled by Martha must begin with six curated looks");
assert.equal(new Set(ids).size, 6, "look ids must be unique");

const styledAssets = manifest.assets.filter((asset) => asset.role === "styled-look-and-detail");
const legacyStyledAssets = manifest.assets.filter(
  (asset) => asset.section === "styled-by-martha" || /^styled-/.test(asset.id ?? ""),
);
assert.equal(legacyStyledAssets.length, 0, "blocked legacy styled records must be removed");
assert.equal(styledAssets.length, 6, "six unique look sources must be traceable");
assert.equal(new Set(styledAssets.map((asset) => asset.sha256)).size, 6, "look sources must be unique");
const dataPublicPaths = [...new Set(
  [...data.matchAll(/asset\("([^"]+)"\)/g)]
    .map((match) => `/assets/site/authored-world/styled/${match[1]}`),
)].sort();
assert.deepEqual(
  dataPublicPaths,
  styledAssets.map((asset) => asset.publicPath).sort(),
  "React data sources and manifested public paths must match",
);
assert.ok(styledAssets.every((asset) => asset.provenance === "supplied-by-martha"));
assert.ok(styledAssets.every((asset) => asset.visibleGeneratedContentLabel === false));
assert.ok(styledAssets.every((asset) => /full-frame visual review/.test(asset.reviewMethod)));
assert.ok(
  styledAssets.every((asset) => existsSync(resolve(root, `public${asset.publicPath}`))),
  "every manifested look must exist at its public path",
);
assert.ok(
  styledAssets.every((asset) => {
    const bytes = readFileSync(resolve(root, `public${asset.publicPath}`));
    const dimensions = jpegDimensions(bytes);
    return createHash("sha256").update(bytes).digest("hex") === asset.sha256
      && dimensions.width === asset.width
      && dimensions.height === asset.height;
  }),
  "every styled asset must match its manifested SHA-256 and dimensions",
);

const suppliedRoot = process.env.MARTHA_ORIGINALS_ROOT;
if (suppliedRoot) {
  assert.ok(styledAssets.every((asset) => {
    const relativeSource = asset.sourceArchive.replace(/^Martha supplied originals[\\/]/, "");
    const sourcePath = resolve(suppliedRoot, relativeSource);
    if (!existsSync(sourcePath)) return false;
    const bytes = readFileSync(sourcePath);
    return createHash("sha256").update(bytes).digest("hex") === asset.sha256;
  }), "external supplied originals must exist and match the manifested SHA-256");
}
assert.doesNotMatch(
  JSON.stringify(styledAssets),
  /latest-2026-09-09-to-11|[A-Z]:[\\/]|Users[\\/]/i,
  "styled assets must exclude blocked sources and private local paths",
);

console.log("styled-by-martha contract: PASS");
