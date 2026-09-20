import assert from "node:assert/strict";

const port = Number(process.env.CDP_PORT || 9333);
const base = process.argv[2] || "http://127.0.0.1:3017";
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${base}/direction`)}`, { method: "PUT" })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
const runtimeErrors = [];
const badResponses = [];
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  } else if (message.method === "Runtime.exceptionThrown") {
    runtimeErrors.push(message.params);
  } else if (message.method === "Network.responseReceived" && message.params.response.status >= 400) {
    badResponses.push({ status: message.params.response.status, url: message.params.response.url });
  }
};
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++sequence;
  pending.set(id, resolve);
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.result?.exceptionDetails) throw new Error(response.result.exceptionDetails.text);
  return response.result?.result?.value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const navigate = async ({ url = `${base}/direction`, width, height, mobile, reduced = false }) => {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile });
  await send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }],
  });
  await send("Page.navigate", { url });
  await wait(6_000);
  await evaluate(`document.documentElement.style.scrollBehavior = 'auto'; true`);
};

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });

  await navigate({ width: 1440, height: 900, mobile: false });
  const desktopInitial = JSON.parse(await evaluate(`JSON.stringify((() => {
    const hero = document.querySelector('.desktop-home');
    const photo = document.querySelector('[data-desktop-photo]');
    return {
      heroTop: hero.getBoundingClientRect().top,
      photoWidth: photo.getBoundingClientRect().width,
      pinSpacers: document.querySelectorAll('.pin-spacer').length,
      butterfly: Boolean(document.querySelector('[data-desktop-butterfly]')),
      wings: document.querySelectorAll('[data-desktop-butterfly-wing]').length,
      heroImage: photo.querySelector('img').getAttribute('src'),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  })())`));
  assert.equal(desktopInitial.pinSpacers, 1);
  assert.equal(desktopInitial.butterfly, true);
  assert.equal(desktopInitial.wings, 2);
  assert.match(desktopInitial.heroImage, /textile-cargo\/hero\.png/);
  assert.equal(desktopInitial.overflow, 0);

  await evaluate(`scrollTo(0, 650); true`);
  await wait(600);
  const desktopMotion = JSON.parse(await evaluate(`JSON.stringify((() => {
    const hero = document.querySelector('.desktop-home');
    const photo = document.querySelector('[data-desktop-photo]');
    return { heroTop: hero.getBoundingClientRect().top, photoWidth: photo.getBoundingClientRect().width, scrollY };
  })())`));
  assert.ok(Math.abs(desktopMotion.heroTop) <= 1, "desktop hero did not remain pinned");
  assert.ok(desktopMotion.photoWidth > desktopInitial.photoWidth + 90, "desktop photo did not expand");

  await evaluate(`document.querySelector('#desktop-marthas-eyes').scrollIntoView({block:'start'}); true`);
  await wait(1_000);
  const bento = JSON.parse(await evaluate(`JSON.stringify((() => ({
    portraits: [...document.querySelectorAll('#desktop-marthas-eyes img')].map(img => ({src:img.currentSrc,naturalWidth:img.naturalWidth})),
    fixedTexturePositions: [...document.querySelectorAll('[data-fixed-texture]')].map(el => getComputedStyle(el).position),
    fixedPaper: (() => {
      const style = getComputedStyle(document.querySelector('[data-fixed-paper-texture]'));
      return {
        position: style.position,
        zIndex: style.zIndex,
        backgroundImage: style.backgroundImage,
        mixBlendMode: style.mixBlendMode,
        filter: style.filter,
        pointerEvents: style.pointerEvents,
      };
    })(),
    fixedPaperRect: document.querySelector('[data-fixed-paper-texture]').getBoundingClientRect().toJSON(),
    heroLayer: (() => {
      const style = getComputedStyle(document.querySelector('[data-preserved-home-hero]'));
      return { zIndex: style.zIndex, isolation: style.isolation };
    })(),
    sectionSurfaces: {
      bento: getComputedStyle(document.querySelector('#desktop-marthas-eyes')).backgroundImage,
      gallery: getComputedStyle(document.querySelector('#collection')).backgroundColor,
      coda: getComputedStyle(document.querySelector('#desktop-beyond')).backgroundColor,
      footer: getComputedStyle(document.querySelector('#desktop-contact')).backgroundColor,
    },
    sectionBorders: ['#desktop-marthas-eyes', '#collection', '#desktop-beyond', '#desktop-contact']
      .map(selector => getComputedStyle(document.querySelector(selector)).borderTopWidth),
    duplicateIds: [...new Set([...document.querySelectorAll('[id]')].map(el => el.id).filter((id, i, all) => all.indexOf(id) !== i))],
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }))())`));
  assert.equal(bento.portraits.length, 2);
  assert.ok(bento.portraits.every((image) => image.naturalWidth > 0), "a Martha portrait did not load");
  assert.ok(bento.fixedTexturePositions.every((position) => position === "fixed"));
  assert.deepEqual(bento.fixedPaper, {
    position: "fixed",
    zIndex: "4",
    backgroundImage: 'url("http://127.0.0.1:3017/assets/site/paper.jpg")',
    mixBlendMode: "soft-light",
    filter: "grayscale(1) brightness(0.72) contrast(3.2)",
    pointerEvents: "none",
  });
  assert.deepEqual(bento.fixedPaperRect, {
    x: 0, y: 0, width: 1440, height: 900,
    top: 0, right: 1440, bottom: 900, left: 0,
  });
  assert.deepEqual(bento.heroLayer, { zIndex: "5", isolation: "isolate" });
  assert.match(bento.sectionSurfaces.bento, /radial-gradient/);
  assert.equal(bento.sectionSurfaces.gallery, "rgba(246, 239, 226, 0.95)");
  assert.equal(bento.sectionSurfaces.coda, "rgb(102, 48, 76)");
  assert.equal(bento.sectionSurfaces.footer, "rgb(197, 154, 61)");
  assert.ok(bento.sectionBorders.every((width) => width === "0px"));
  assert.deepEqual(bento.duplicateIds, []);
  assert.equal(bento.overflow, 0);

  await evaluate(`document.querySelector('#collection').scrollIntoView({block:'start'}); true`);
  await wait(800);
  await evaluate(`window.__storyLive = document.querySelector('[aria-live="polite"]'); true`);
  const storyY = await evaluate(`scrollY`);
  await evaluate(`document.querySelectorAll('[role="tab"]')[1].click(); true`);
  await wait(900);
  const gallery = JSON.parse(await evaluate(`JSON.stringify((() => ({
    selected: document.querySelectorAll('[role="tab"]')[1].getAttribute('aria-selected'),
    title: document.querySelector('[aria-live="polite"] h3').textContent.trim(),
    imageCount: document.querySelectorAll('[aria-live="polite"] img').length,
    loaded: [...document.querySelectorAll('[aria-live="polite"] img')].every(img => img.naturalWidth > 0),
    liveStable: window.__storyLive === document.querySelector('[aria-live="polite"]'),
    fixedPaperRect: document.querySelector('[data-fixed-paper-texture]').getBoundingClientRect().toJSON(),
    scrollY,
  }))())`));
  assert.equal(gallery.selected, "true");
  assert.equal(gallery.title, "Color does not need permission");
  assert.equal(gallery.imageCount, 3);
  assert.equal(gallery.loaded, true);
  assert.equal(gallery.liveStable, true);
  assert.deepEqual(gallery.fixedPaperRect, bento.fixedPaperRect, "paper texture moved with the document");
  assert.ok(Math.abs(gallery.scrollY - storyY) <= 1, "story tab shifted the page vertically");

  await navigate({ url: `${base}/`, width: 1440, height: 900, mobile: false });
  const homeImage = await evaluate(`document.querySelector('[data-desktop-photo] img')?.getAttribute('src') || ''`);
  assert.doesNotMatch(homeImage, /textile-cargo\/hero\.png/, "homepage image was replaced");

  await navigate({ width: 390, height: 844, mobile: true });
  const mobileInitial = JSON.parse(await evaluate(`JSON.stringify((() => ({
    desktopWidth: document.querySelector('.desktop-home').getBoundingClientRect().width,
    mobileWidth: document.querySelector('[data-mobile-hero]').getBoundingClientRect().width,
    image: document.querySelector('[data-mobile-hero] .hero-photo img').getAttribute('src'),
    butterflyVisible: document.querySelector('[data-mobile-hero] .hero-butterfly').getBoundingClientRect().width > 0,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }))())`));
  assert.equal(mobileInitial.desktopWidth, 0);
  assert.ok(mobileInitial.mobileWidth >= 389);
  assert.match(mobileInitial.image, /textile-cargo\/hero\.png/);
  assert.equal(mobileInitial.butterflyVisible, true);
  assert.equal(mobileInitial.overflow, 0);

  await evaluate(`document.querySelector('[data-mobile-menu-trigger]').click(); true`);
  await wait(500);
  const menuOpen = JSON.parse(await evaluate(`JSON.stringify({
    dialog: Boolean(document.querySelector('[role="dialog"]')),
    active: document.activeElement?.getAttribute('data-mobile-menu-close') !== null,
    bodyOverflow: getComputedStyle(document.body).overflow,
  })`));
  assert.equal(menuOpen.dialog, true);
  assert.equal(menuOpen.active, true);
  assert.equal(menuOpen.bodyOverflow, "hidden");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  await wait(500);
  assert.equal(await evaluate(`Boolean(document.querySelector('[role="dialog"]'))`), false);
  assert.equal(await evaluate(`document.activeElement === document.querySelector('[data-mobile-menu-trigger]')`), true);

  await evaluate(`document.querySelector('#marthas-eyes').parentElement.scrollIntoView({block:'start'}); true`);
  await wait(900);
  const mobileBento = JSON.parse(await evaluate(`JSON.stringify({
    portraitsLoaded: [...document.querySelectorAll('#desktop-marthas-eyes img')].every(img => img.naturalWidth > 0),
    fixedPaperRect: document.querySelector('[data-fixed-paper-texture]').getBoundingClientRect().toJSON(),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  })`));
  assert.equal(mobileBento.portraitsLoaded, true);
  assert.deepEqual(mobileBento.fixedPaperRect, {
    x: 0, y: 0, width: 390, height: 844,
    top: 0, right: 390, bottom: 844, left: 0,
  });
  assert.equal(mobileBento.overflow, 0);

  await evaluate(`document.querySelector('#collection').scrollIntoView({block:'start'}); true`);
  await wait(600);
  const mobileStoryY = await evaluate(`scrollY`);
  await evaluate(`document.querySelectorAll('[role="tab"]')[2].click(); true`);
  await wait(900);
  const mobileStoryImageCount = await evaluate(`document.querySelectorAll('[aria-live="polite"] img').length`);
  const mobileImageLoads = [];
  for (let index = 0; index < mobileStoryImageCount; index += 1) {
    await evaluate(`(() => {
      const rail = document.querySelector('[aria-live="polite"] [aria-label$="image group"]');
      const figure = rail.children[${index}];
      rail.scrollTo({ left: figure.offsetLeft - rail.offsetLeft, behavior: 'instant' });
      return true;
    })()`);
    await wait(700);
    mobileImageLoads.push(await evaluate(`document.querySelectorAll('[aria-live="polite"] img')[${index}].naturalWidth > 0`));
  }
  const mobileGallery = JSON.parse(await evaluate(`JSON.stringify({
    title: document.querySelector('[aria-live="polite"] h3').textContent.trim(),
    loaded: ${JSON.stringify(mobileImageLoads)}.every(Boolean),
    scrollY,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  })`));
  assert.equal(mobileGallery.title, "Texture before trend");
  assert.equal(mobileGallery.loaded, true);
  assert.ok(Math.abs(mobileGallery.scrollY - mobileStoryY) <= 1, "mobile story tab shifted the page vertically");
  assert.equal(mobileGallery.overflow, 0);

  await navigate({ width: 1440, height: 900, mobile: false, reduced: true });
  const reduced = JSON.parse(await evaluate(`JSON.stringify({
    pinSpacers: document.querySelectorAll('.pin-spacer').length,
    positions: [...document.querySelectorAll('[data-fixed-texture]')].map(el => getComputedStyle(el).position),
    paperPosition: getComputedStyle(document.querySelector('[data-fixed-paper-texture]')).position,
  })`));
  assert.equal(reduced.pinSpacers, 0, "reduced motion still pins the hero");
  assert.ok(reduced.positions.every((position) => position === "absolute"));
  assert.equal(reduced.paperPosition, "fixed");

  assert.equal(runtimeErrors.length, 0, "runtime exceptions were raised");
  assert.deepEqual(badResponses, [], "browser received HTTP error responses");

  console.log(JSON.stringify({
    status: "PASS",
    desktopInitial,
    desktopMotion,
    bento,
    gallery,
    mobileInitial,
    menuOpen,
    mobileBento,
    mobileGallery,
    reduced,
  }, null, 2));
} finally {
  socket.close();
}
