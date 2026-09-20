// Whole-page mobile regression audit for the current responsive composition.
// Uses a real local Chrome CDP target and fails on horizontal overflow,
// missing sections, unloaded in-view media, or internally clipped headings.
const CDP_PORT = Number(process.env.CDP_PORT || 9331);
const URL = process.env.MARTHAS_URL || "http://localhost:3015/";
const VIEWPORTS = [
  { name: "small", width: 320, height: 568 },
  { name: "mid", width: 375, height: 667 },
  { name: "common", width: 390, height: 844 },
  { name: "large", width: 430, height: 932 },
];
const SECTIONS = [
  "#mobile-home",
  "#marthas-eyes",
  "#collection",
  "#personal-style",
  "#beyond",
  "#visit",
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const auditViewport = async (viewport) => {
  const target = await (
    await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(URL)}`, {
      method: "PUT",
    })
  ).json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  let sequence = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = ++sequence;
      pending.set(id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", { expression, returnByValue: true });
    return JSON.parse(response.result?.result?.value || "null");
  };

  try {
    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await send("Page.navigate", { url: URL });
    await wait(10_000);

    const initial = await evaluate(`JSON.stringify((() => {
      const html = document.documentElement;
      const priorHtmlOverflow = html.style.overflowX;
      const priorBodyOverflow = document.body.style.overflowX;
      html.style.overflowX = 'visible';
      document.body.style.overflowX = 'visible';
      const visibleWidth = html.clientWidth;
      const naturalWidth = html.scrollWidth;
      html.style.overflowX = priorHtmlOverflow;
      document.body.style.overflowX = priorBodyOverflow;
      return {
        visibleWidth,
        naturalWidth,
        desktopVisible: getComputedStyle(document.querySelector('.desktop-home')).display !== 'none',
      };
    })())`);
    assert(!initial.desktopVisible, `${viewport.name}: desktop composition is visible`);
    assert(initial.naturalWidth <= initial.visibleWidth + 1, `${viewport.name}: horizontal overflow ${initial.naturalWidth}/${initial.visibleWidth}`);

    const sections = [];
    for (const selector of SECTIONS) {
      const exists = await evaluate(`JSON.stringify(!!document.querySelector(${JSON.stringify(selector)}))`);
      assert(exists, `${viewport.name}: missing section ${selector}`);
      await evaluate(`JSON.stringify((() => document.querySelector(${JSON.stringify(selector)}).scrollIntoView({ block: 'start' }))())`);
      await wait(350);
      const detail = await evaluate(`JSON.stringify((() => {
        const section = document.querySelector(${JSON.stringify(selector)});
        const rect = section.getBoundingClientRect();
        const images = Array.from(section.querySelectorAll('img'));
        const unloadedImages = images
          .filter((image) => {
            const imageRect = image.getBoundingClientRect();
            const isVisible =
              imageRect.width > 0 &&
              imageRect.right > 0 &&
              imageRect.left < innerWidth &&
              imageRect.bottom > 0 &&
              imageRect.top < innerHeight;
            return isVisible && (!image.complete || image.naturalWidth === 0);
          })
          .map((image) => image.currentSrc || image.getAttribute('src'));
        const clippedHeadings = Array.from(section.querySelectorAll('h1, h2, strong'))
          .filter((node) => {
            const style = getComputedStyle(node);
            return style.display !== 'none' && node.clientWidth > 0 && node.scrollWidth > node.clientWidth + 1;
          })
          .map((node) => node.textContent?.trim());
        return {
          selector: ${JSON.stringify(selector)},
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
          unloadedImages,
          clippedHeadings,
        };
      })())`);
      assert(detail.width > 0 && detail.height > 0, `${viewport.name}: collapsed section ${selector}`);
      assert(detail.left >= -1 && detail.right <= viewport.width + 1, `${viewport.name}: ${selector} crosses horizontal viewport bounds`);
      assert(!detail.unloadedImages.length, `${viewport.name}: unloaded media in ${selector}: ${detail.unloadedImages.join(', ')}`);
      assert(!detail.clippedHeadings.length, `${viewport.name}: clipped headings in ${selector}: ${detail.clippedHeadings.join(', ')}`);
      sections.push(detail);
    }
    return { viewport, initial, sections };
  } finally {
    socket.close();
  }
};

const results = [];
for (const viewport of VIEWPORTS) results.push(await auditViewport(viewport));
console.log(JSON.stringify({ status: "passed", url: URL, results }, null, 2));
