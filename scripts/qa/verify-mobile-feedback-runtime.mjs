import assert from "node:assert/strict";

const port = Number(process.env.CDP_PORT || 9333);
const url = process.argv[2] || "http://127.0.0.1:3017/";
const viewport = process.argv[3] || "390x844";
const [viewportWidth, viewportHeight] = viewport.split("x").map(Number);
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
const runtimeErrors = [];

socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  } else if (message.method === "Runtime.exceptionThrown") {
    runtimeErrors.push(message.params);
  }
};
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

const send = (method, params = {}) => new Promise((resolve) => {
  const id = ++sequence;
  pending.set(id, resolve);
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: viewportWidth, height: viewportHeight, deviceScaleFactor: 1, mobile: true });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.navigate", { url });
  await wait(5000);

  const result = JSON.parse(await evaluate(`JSON.stringify((() => {
    const rect = (node) => node?.getBoundingClientRect?.().toJSON?.() ?? null;
    const visible = (node) => !!node && getComputedStyle(node).display !== 'none' && rect(node)?.width > 0 && rect(node)?.height > 0;
    const title = document.querySelector('#meet-martha-title');
    const lead = document.querySelector('#desktop-marthas-eyes > div:last-child > p');
    const phoneHero = document.querySelector('#mobile-home');
    const phonePaper = phoneHero?.children[0];
    const phoneGrunge = phoneHero?.children[1];
    const bentoSection = document.querySelector('#desktop-marthas-eyes');
    const statementText = [...document.querySelectorAll('#desktop-marthas-eyes blockquote')].find((node) => node.textContent.includes('I never dress by decade'));
    const statement = statementText?.closest('article');
    const statementLabel = statement?.querySelector('p');
    const instinctText = [...document.querySelectorAll('#desktop-marthas-eyes h3')].find((node) => node.textContent.includes('Color.'));
    const instinct = instinctText?.closest('article');
    const instinctLabel = instinct?.querySelector('p');
    const locationText = [...document.querySelectorAll('#desktop-marthas-eyes article > p:last-child')].find((node) => node.textContent.includes('Clothing sits beside textiles'));
    const location = locationText?.closest('article');
    const locationLabel = location?.querySelector('p:first-of-type');
    const colorCard = document.querySelector('[aria-label="Colors recurring through Martha\\'s collection"]');
    const fixedLogo = document.querySelector('[data-phone-fixed-logo]');
    const badge = document.querySelector('.rotating-badge');
    const badgeShell = badge?.parentElement;
    const storeSection = document.querySelector('#store-photo-title')?.closest('section');
    const gallery = document.querySelector('[aria-labelledby="object-gallery-title"]');
    const track = gallery?.querySelector(':scope > div');
    const firstSlide = track?.firstElementChild;
    const titleRect = rect(title);
    const leadRect = rect(lead);
    const phoneHeroRect = rect(phoneHero);
    const bentoSectionRect = rect(bentoSection);
    const heroFadeStyle = getComputedStyle(phoneHero, '::after');
    const statementRect = rect(statement);
    const statementTextRect = rect(statementText);
    const instinctRect = rect(instinct);
    const instinctTextRect = rect(instinctText);
    const locationRect = rect(location);
    const locationTextRect = rect(locationText);
    const logoRect = rect(fixedLogo);
    const badgeShellRect = rect(badgeShell);
    const storeSectionRect = rect(storeSection);
    const trackStyle = track ? getComputedStyle(track) : null;
    return {
      width: innerWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      logo: {
        visible: visible(fixedLogo),
        src: fixedLogo?.getAttribute('src') ?? '',
        rect: logoRect,
        centerDelta: logoRect ? Math.abs((logoRect.left + logoRect.width / 2) - innerWidth / 2) : null,
      },
      oldMarthasVisible: visible(document.querySelector('img[src*="marthas-word.svg"]')),
      oldVintageVisible: visible(document.querySelector('img[src*="vintage-word.svg"]')),
      title: {
        fontSize: parseFloat(getComputedStyle(title).fontSize),
        gapToLead: leadRect.top - titleRect.bottom,
      },
      heroCrossfade: {
        paperMask: getComputedStyle(phonePaper).maskImage || getComputedStyle(phonePaper).webkitMaskImage,
        grungeMask: getComputedStyle(phoneGrunge).maskImage || getComputedStyle(phoneGrunge).webkitMaskImage,
        fadeContent: heroFadeStyle.content,
        fadeHeight: parseFloat(heroFadeStyle.height),
        fadeBackground: heroFadeStyle.backgroundImage,
        bentoBackground: getComputedStyle(bentoSection).backgroundImage,
        seamGap: bentoSectionRect.top - phoneHeroRect.bottom,
        borderTopWidth: getComputedStyle(bentoSection).borderTopWidth,
      },
      statement: {
        labelDisplay: getComputedStyle(statementLabel).display,
        fontSize: parseFloat(getComputedStyle(statementText).fontSize),
        textAlign: getComputedStyle(statementText).textAlign,
        centerDeltaX: Math.abs((statementTextRect.left + statementTextRect.width / 2) - (statementRect.left + statementRect.width / 2)),
        centerDeltaY: Math.abs((statementTextRect.top + statementTextRect.height / 2) - (statementRect.top + statementRect.height / 2)),
        safeInsets: {
          left: statementTextRect.left - statementRect.left,
          right: statementRect.right - statementTextRect.right,
          top: statementTextRect.top - statementRect.top,
          bottom: statementRect.bottom - statementTextRect.bottom,
        },
      },
      instinct: {
        labelDisplay: getComputedStyle(instinctLabel).display,
        fontSize: parseFloat(getComputedStyle(instinctText).fontSize),
        textAlign: getComputedStyle(instinctText).textAlign,
        centerDeltaX: Math.abs((instinctTextRect.left + instinctTextRect.width / 2) - (instinctRect.left + instinctRect.width / 2)),
        centerDeltaY: Math.abs((instinctTextRect.top + instinctTextRect.height / 2) - (instinctRect.top + instinctRect.height / 2)),
        safeInsets: {
          left: instinctTextRect.left - instinctRect.left,
          right: instinctRect.right - instinctTextRect.right,
          top: instinctTextRect.top - instinctRect.top,
          bottom: instinctRect.bottom - instinctTextRect.bottom,
        },
      },
      location: {
        labelDisplay: getComputedStyle(locationLabel).display,
        fontSize: parseFloat(getComputedStyle(locationText).fontSize),
        textAlign: getComputedStyle(locationText).textAlign,
        centerDeltaX: Math.abs((locationTextRect.left + locationTextRect.width / 2) - (locationRect.left + locationRect.width / 2)),
        centerDeltaY: Math.abs((locationTextRect.top + locationTextRect.height / 2) - (locationRect.top + locationRect.height / 2)),
        safeInsets: {
          left: locationTextRect.left - locationRect.left,
          right: locationRect.right - locationTextRect.right,
          top: locationTextRect.top - locationRect.top,
          bottom: locationRect.bottom - locationTextRect.bottom,
        },
      },
      colorCardDisplay: getComputedStyle(colorCard).display,
      badge: {
        width: rect(badge).width,
        left: badgeShellRect.left,
        right: badgeShellRect.right,
        topInset: badgeShellRect.top - storeSectionRect.top,
      },
      gallery: {
        display: trackStyle?.display,
        overflowX: trackStyle?.overflowX,
        firstSlideWidth: rect(firstSlide).width,
        clientWidth: track?.clientWidth,
        scrollWidth: track?.scrollWidth,
        scrollSnapType: trackStyle?.scrollSnapType,
      },
      runtimeErrors: ${runtimeErrors.length},
    };
  })())`));

  assert.equal(result.width, viewportWidth);
  assert.equal(result.logo.visible, true, "the fixed full logo is not visible in the phone hero");
  assert.match(result.logo.src, /logo-marthas-fixed\.svg$/);
  assert.ok(result.logo.centerDelta <= 2, `the fixed logo is not horizontally centered: ${result.logo.centerDelta}px`);
  assert.ok(result.logo.rect.top <= 28, `the fixed logo is too far from the top: ${result.logo.rect.top}px`);
  assert.equal(result.oldMarthasVisible, false, "the separate Martha's wordmark is still visible");
  assert.equal(result.oldVintageVisible, false, "the separate Vintage wordmark is still visible");

  assert.ok(result.title.fontSize >= 76, `Meet Martha title is still too small: ${result.title.fontSize}px`);
  assert.ok(result.title.gapToLead >= 18 && result.title.gapToLead <= 48, `Meet Martha title/subtitle gap is ${result.title.gapToLead}px`);

  assert.match(result.heroCrossfade.paperMask, /linear-gradient/);
  assert.match(result.heroCrossfade.grungeMask, /linear-gradient/);
  assert.notEqual(result.heroCrossfade.fadeContent, "none", "mobile hero crossfade layer is missing");
  assert.ok(result.heroCrossfade.fadeHeight >= 90, `mobile hero crossfade is too short: ${result.heroCrossfade.fadeHeight}px`);
  assert.match(result.heroCrossfade.fadeBackground, /linear-gradient/);
  assert.match(result.heroCrossfade.bentoBackground, /linear-gradient/);
  assert.ok(Math.abs(result.heroCrossfade.seamGap) <= 1, `hero and Meet Martha have a physical gap: ${result.heroCrossfade.seamGap}px`);
  assert.equal(result.heroCrossfade.borderTopWidth, "0px");

  assert.equal(result.statement.labelDisplay, "none");
  assert.ok(result.statement.fontSize >= 29, `statement quote is still too small: ${result.statement.fontSize}px`);
  assert.equal(result.statement.textAlign, "center");
  assert.ok(result.statement.centerDeltaX <= 2, `statement is not centered horizontally: ${result.statement.centerDeltaX}px`);
  assert.ok(result.statement.centerDeltaY <= 14, `statement is not centered vertically: ${result.statement.centerDeltaY}px`);
  assert.ok(Math.min(...Object.values(result.statement.safeInsets)) >= 28, `statement crossed its stitched safe zone: ${JSON.stringify(result.statement.safeInsets)}`);

  assert.equal(result.instinct.labelDisplay, "none");
  assert.ok(result.instinct.fontSize >= 36, `instinct heading is still too small: ${result.instinct.fontSize}px`);
  assert.equal(result.instinct.textAlign, "center");
  assert.ok(result.instinct.centerDeltaX <= 2, `instinct heading is not centered horizontally: ${result.instinct.centerDeltaX}px`);
  assert.ok(result.instinct.centerDeltaY <= 14, `instinct heading is not centered vertically: ${result.instinct.centerDeltaY}px`);
  assert.ok(Math.min(...Object.values(result.instinct.safeInsets)) >= 28, `instinct heading crossed its stitched safe zone: ${JSON.stringify(result.instinct.safeInsets)}`);

  assert.notEqual(result.location.labelDisplay, "none", "the From Bastrop label should remain visible");
  assert.ok(result.location.fontSize >= 26, `From Bastrop copy is still too small: ${result.location.fontSize}px`);
  assert.equal(result.location.textAlign, "center");
  assert.ok(result.location.centerDeltaX <= 2, `From Bastrop copy is not centered horizontally: ${result.location.centerDeltaX}px`);
  assert.ok(result.location.centerDeltaY <= 14, `From Bastrop copy is not centered vertically: ${result.location.centerDeltaY}px`);
  assert.ok(Math.min(...Object.values(result.location.safeInsets)) >= 28, `From Bastrop copy crossed its stitched safe zone: ${JSON.stringify(result.location.safeInsets)}`);

  assert.equal(result.colorCardDisplay, "none", "the Chosen by instinct card still renders on mobile");
  assert.ok(result.badge.width >= 150, `rotating tag did not reach 200% scale: ${result.badge.width}px`);
  assert.ok(result.badge.left >= 0 && result.badge.right <= result.clientWidth, `rotating tag crossed the viewport: ${JSON.stringify(result.badge)}`);
  assert.ok(result.badge.topInset >= 0, `rotating tag was clipped above its section: ${result.badge.topInset}px`);

  assert.equal(result.gallery.display, "flex");
  assert.match(result.gallery.overflowX, /auto|scroll/);
  assert.ok(result.gallery.firstSlideWidth >= result.clientWidth * 0.8, `Beyond slide is not large enough: ${result.gallery.firstSlideWidth}px`);
  assert.ok(result.gallery.scrollWidth > result.gallery.clientWidth * 2, "Beyond track is not horizontally scrollable");
  assert.match(result.gallery.scrollSnapType, /^x/);

  await evaluate(`(() => {
    const track = document.querySelector('[data-beyond-slider]');
    const second = track?.children[1];
    if (!track || !second) return false;
    track.scrollIntoView({ block: 'center', behavior: 'instant' });
    return true;
  })()`);
  await wait(700);
  await evaluate(`(() => {
    const track = document.querySelector('[data-beyond-slider]');
    const second = track?.children[1];
    if (!track || !second) return false;
    track.scrollTo({ left: second.offsetLeft - track.offsetLeft, behavior: 'instant' });
    return true;
  })()`);
  await wait(1400);
  const secondSlide = JSON.parse(await evaluate(`JSON.stringify((() => {
    const track = document.querySelector('[data-beyond-slider]');
    const second = track?.children[1];
    const image = second?.querySelector('img');
    const trackRect = track?.getBoundingClientRect();
    const slideRect = second?.getBoundingClientRect();
    return {
      loaded: !!image && image.complete && image.naturalWidth > 0,
      visibleWidth: Math.max(0, Math.min(trackRect.right, slideRect.right) - Math.max(trackRect.left, slideRect.left)),
      slideWidth: slideRect.width,
    };
  })())`));
  assert.equal(secondSlide.loaded, true, "the second Beyond slide did not load after a horizontal swipe");
  assert.ok(secondSlide.visibleWidth >= secondSlide.slideWidth * 0.9, `the second Beyond slide did not snap into view: ${JSON.stringify(secondSlide)}`);

  assert.equal(result.scrollWidth, result.clientWidth, "the page has horizontal document overflow");
  assert.equal(result.runtimeErrors, 0, `runtime exceptions: ${result.runtimeErrors}`);

  console.log(JSON.stringify(result, null, 2));
  console.log("mobile feedback runtime contract: PASS");
} finally {
  socket.close();
}
