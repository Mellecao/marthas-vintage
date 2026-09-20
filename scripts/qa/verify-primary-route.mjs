import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const primaryRoute = readFileSync(resolve(root, "src/app/page.tsx"), "utf8");
const previewRoute = readFileSync(resolve(root, "src/app/direction/page.tsx"), "utf8");

assert.match(
  primaryRoute,
  /import\s+\{\s*AuthoredWorldPage\s*\}\s+from\s+["']@\/components\/authored-world\/authored-world-page["'];/,
  "the primary route must import the authored-world experience",
);
assert.match(
  primaryRoute,
  /export\s+default\s+function\s+Home\s*\(\s*\)\s*\{[\s\S]*return\s+<AuthoredWorldPage\s*\/>;?[\s\S]*\}/,
  "the primary route must render the authored-world experience",
);
assert.doesNotMatch(
  primaryRoute,
  /DesktopHomeHero|DesktopEditorialSections|HeroFrame|EyesFrame|CollectionFrame|PersonalFrame/,
  "the previous home-page composition must be removed from the primary route",
);
assert.match(
  previewRoute,
  /return\s+<AuthoredWorldPage\s*\/>/,
  "the /direction preview must continue to render the same experience",
);

console.log("primary route contract: PASS");
