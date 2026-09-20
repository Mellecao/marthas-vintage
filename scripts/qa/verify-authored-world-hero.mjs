import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const paths = {
  route: "src/app/direction/page.tsx",
  page: "src/components/authored-world/authored-world-page.tsx",
  hero: "src/components/authored-world/threshold-hero.tsx",
  header: "src/components/authored-world/site-header.tsx",
  mobileNav: "src/components/authored-world/mobile-navigation.tsx",
  styles: "src/components/authored-world/authored-world.module.css",
  media: "src/data/marthas-media.ts",
  manifest: "public/assets/site/authored-world/asset-manifest.json",
  image: "public/assets/site/authored-world/hero/store-wall-original.jpg",
};

for (const [label, path] of Object.entries(paths)) {
  assert.ok(existsSync(resolve(root, path)), `${label} is missing: ${path}`);
}

const sourceFiles = [paths.route, paths.page, paths.hero, paths.header, paths.mobileNav, paths.styles, paths.media]
  .map((path) => readFileSync(resolve(root, path), "utf8"))
  .join("\n");

assert.match(sourceFiles, /logo-somente-lettering-reto\.svg/, "hero must use the unified logo lockup");
assert.doesNotMatch(sourceFiles, /marthas-word\.svg|vintage-word\.svg/, "split logo assets are forbidden");
assert.doesNotMatch(sourceFiles, /Chapter|issue|desktop-home-butterfly|desktop-nav-leader/i, "legacy magazine devices are forbidden");

for (const label of ["Home", "Styled by Martha", "The Collection", "Beyond the Wardrobe", "Visit"]) {
  assert.ok(sourceFiles.includes(label), `navigation label missing: ${label}`);
}

for (const target of ["#home", "#styled-by-martha", "#collection", "#beyond-the-wardrobe", "#visit"]) {
  assert.ok(sourceFiles.includes(target), `navigation target missing: ${target}`);
}

assert.match(sourceFiles, /Bastrop, Texas/, "location is missing");
assert.match(sourceFiles, /Enter Martha(?:&apos;|’|'|&#39;)s world/, "CTA is missing");
assert.match(sourceFiles, /prefers-reduced-motion:\s*reduce/, "reduced-motion CSS is missing");
assert.match(sourceFiles, /gsap\.matchMedia\(\)/, "responsive GSAP lifecycle is missing");
assert.match(sourceFiles, /data-authored-world-hero/, "stable hero QA hook is missing");
assert.match(sourceFiles, /data-hero-media/, "stable media QA hook is missing");
assert.match(sourceFiles, /data-hero-header/, "stable header QA hook is missing");

const manifest = JSON.parse(readFileSync(resolve(root, paths.manifest), "utf8"));
assert.equal(manifest.assets[0].sourceFilename, "1000014872.jpg");
assert.equal(manifest.assets[0].sourceDimensions.width, 1536);
assert.equal(manifest.assets[0].sourceDimensions.height, 1307);
assert.equal(manifest.assets[0].authenticity, "original-supplied-by-martha");
assert.match(manifest.assets[0].sourceArchive, /^Martha supplied originals\//);
assert.doesNotMatch(JSON.stringify(manifest), /[A-Z]:[\\/]|Users[\\/]/i, "public manifest must not expose local filesystem paths");

console.log("authored-world hero contract: PASS");
