import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const paths = {
  page: "src/components/authored-world/authored-world-page.tsx",
  hero: "src/components/authored-world/preserved-home-hero.tsx",
  desktopHero: "src/components/desktop-home-hero.tsx",
  bento: "src/components/authored-world/martha-bento.tsx",
  gallery: "src/components/authored-world/narrative-gallery.tsx",
  styles: "src/components/authored-world/textile-cargo.module.css",
  data: "src/data/textile-cargo.ts",
  manifest: "public/assets/site/textile-cargo/asset-manifest.json",
  config: "next.config.ts",
};

for (const [name, path] of Object.entries(paths)) {
  assert.ok(existsSync(resolve(root, path)), `${name} is missing: ${path}`);
}

const source = Object.fromEntries(
  Object.entries(paths).map(([name, path]) => [name, readFileSync(resolve(root, path), "utf8")]),
);
const manifest = JSON.parse(source.manifest);
const cssRules = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = [...source.styles.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "gs"))];
  assert.ok(matches.length > 0, `${selector} rule is missing`);
  return matches.map((match) => match[1]);
};
const cssRule = (selector) => cssRules(selector)[0];

assert.match(source.config, /allowedDevOrigins/);
assert.match(source.config, /127\.0\.0\.1/);

assert.match(source.page, /<PreservedHomeHero\s*\/>/, "preview must use the preserved hero");
assert.match(source.page, /<MarthaBento\s*\/>/, "Martha bento must follow the hero");
assert.match(source.page, /<NarrativeGallery\s*\/>/, "narrative gallery must follow the bento");
assert.match(source.page, /data-fixed-paper-texture=""/, "one fixed paper layer must sit behind post-hero sections");
assert.doesNotMatch(source.page + source.bento + source.gallery, /Chapter\s+(One|Two|Three|Four|Five)/i);

assert.match(source.desktopHero, /imageSrc/, "desktop hero must accept a nondestructive media override");
assert.match(source.desktopHero, /data-desktop-butterfly/);
assert.match(source.desktopHero, /data-desktop-butterfly-wing/);
assert.match(source.desktopHero, /pin:\s*true/);
assert.match(source.desktopHero, /persistent-hero-menu/);
assert.match(source.hero, /hero-frame/);
assert.match(source.hero, /hero-butterfly/);
assert.match(source.hero, /MobileMenu/);
assert.match(source.hero, /textile-cargo\/hero\.png/);

assert.match(source.bento, /id="desktop-marthas-eyes"/);
assert.match(source.bento, /id="marthas-eyes"/);
assert.match(source.bento, /martha-frontal\.webp/);
assert.match(source.bento, /martha-candid\.jpg/);
assert.match(source.bento, /<svg/);
assert.match(source.bento, /path/);
assert.match(source.styles, /clip-path:/);
assert.match(source.styles, /stroke-dasharray/);

const stories = [...source.data.matchAll(/id:\s*"story-/g)];
assert.ok(stories.length >= 3, "at least three narrative groups are required");
assert.match(source.gallery, /aria-label="Martha’s styling stories"/);
assert.match(source.gallery, /aria-live="polite"/);
assert.doesNotMatch(source.gallery, /setInterval|autoPlay/i);

assert.match(source.page, /data-fixed-texture/);
assert.match(source.styles, /position:\s*fixed/);
const fixedPaper = cssRule(".fixedPaperTexture");
assert.match(fixedPaper, /position:\s*fixed/);
assert.match(fixedPaper, /z-index:\s*4/);
assert.match(fixedPaper, /paper\.jpg/);
assert.match(fixedPaper, /background-repeat:\s*no-repeat/);
assert.match(fixedPaper, /filter:[^;]*grayscale\(1\)[^;]*brightness\(0\.72\)[^;]*contrast\(3\.2\)/);
assert.match(fixedPaper, /mix-blend-mode:\s*soft-light/);
assert.doesNotMatch(fixedPaper, /mix-blend-mode:\s*(multiply|darken|color-burn)/);

assert.ok(cssRules(".bentoSection").some((rule) => /radial-gradient/.test(rule)));
assert.ok(cssRules(".gallerySection").some((rule) => /background:\s*rgba\(246,\s*239,\s*226,\s*0\.95\)/.test(rule)));
assert.ok(cssRules(".materialCoda").some((rule) => /background:\s*var\(--tc-plum\)/.test(rule)));
assert.ok(cssRules(".visitFooter").some((rule) => /background:\s*var\(--tc-mustard\)/.test(rule)));
for (const selector of [".bentoSection", ".gallerySection", ".materialCoda", ".visitFooter"]) {
  assert.doesNotMatch(cssRules(selector).join("\n"), /border-top/, `${selector} must not expose a section divider`);
}
assert.match(source.styles, /prefers-reduced-motion:\s*reduce/);
assert.match(source.styles, /scroll-snap-type/);

assert.equal(manifest.version, 1);
assert.ok(manifest.assets.length >= 11, "hero, portraits, looks and material details must be manifested");
for (const asset of manifest.assets) {
  assert.ok(!/[A-Z]:[\\/]|Users[\\/]/i.test(JSON.stringify(asset)), "manifest leaked a private local path");
  const path = resolve(root, `public${asset.publicPath}`);
  assert.ok(existsSync(path), `public asset missing: ${asset.publicPath}`);
  const bytes = readFileSync(path);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, `hash mismatch: ${asset.publicPath}`);
}

console.log("textile-cargo revision contract: PASS");
