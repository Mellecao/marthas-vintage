// Mobile hero contract: run against a local Chrome CDP target.
// Expected to fail until the enhanced mobile hero/menu is implemented.
const CDP_PORT = Number(process.env.CDP_PORT || 9331);
const URL = process.env.MARTHAS_URL || "http://localhost:3012/";
const CASES = [
  { name: "short", width: 320, height: 568 },
  { name: "common", width: 390, height: 844 },
  { name: "large", width: 430, height: 932 },
];

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
  const value = response.result?.result?.value;
  return typeof value === "string" ? JSON.parse(value) : value;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

try {
  await send("Page.enable");
  const results = [];

  for (const viewport of CASES) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await send("Page.navigate", { url: URL });
    await wait(5_000);

    const initial = await evaluate(`(() => {
      const hero = document.querySelector('[data-mobile-hero]');
      const trigger = document.querySelector('[data-mobile-menu-trigger]');
      const box = (node) => node ? (() => {
        const r = node.getBoundingClientRect();
        return { left:r.left, top:r.top, right:r.right, bottom:r.bottom, width:r.width, height:r.height };
      })() : null;
      return JSON.stringify({
        width: innerWidth,
        height: innerHeight,
        documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        desktopVisible: getComputedStyle(document.querySelector('.desktop-home')).display !== 'none',
        hero: box(hero),
        trigger: box(trigger),
        expanded: trigger?.getAttribute('aria-expanded'),
      });
    })()`);

    assert(initial.hero, `${viewport.name}: enhanced mobile hero is missing`);
    assert(initial.trigger, `${viewport.name}: mobile menu trigger is missing`);
    assert(!initial.desktopVisible, `${viewport.name}: desktop composition leaked into mobile`);
    assert(!initial.documentOverflow, `${viewport.name}: horizontal document overflow`);
    assert(initial.trigger.width >= 44 && initial.trigger.height >= 44, `${viewport.name}: menu hit target is smaller than 44px`);
    assert(initial.expanded === "false", `${viewport.name}: menu must begin closed`);

    await evaluate(`(() => document.querySelector('[data-mobile-menu-trigger]').click())()`);
    await wait(650);
    const opened = await evaluate(`(() => {
      const trigger = document.querySelector('[data-mobile-menu-trigger]');
      const menu = document.querySelector('[data-mobile-menu]');
      return JSON.stringify({
        expanded: trigger?.getAttribute('aria-expanded'),
        menuVisible: !!menu && getComputedStyle(menu).visibility !== 'hidden',
        bodyOverflow: getComputedStyle(document.body).overflow,
      });
    })()`);
    assert(opened.expanded === "true", `${viewport.name}: menu did not open`);
    assert(opened.menuVisible, `${viewport.name}: open menu is not visible`);
    assert(opened.bodyOverflow === "hidden", `${viewport.name}: background scroll is not locked`);

    await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))`);
    const focusAfterTab = await evaluate(`JSON.stringify({
      onFirstMenuLink: document.activeElement?.getAttribute('href') === '#mobile-home',
      stillInsideMenu: !!document.activeElement?.closest('[data-mobile-menu]'),
    })`);
    assert(focusAfterTab.onFirstMenuLink && focusAfterTab.stillInsideMenu, `${viewport.name}: Tab must advance inside the modal menu`);

    await evaluate(`(() => document.querySelector('[data-mobile-menu-close]').click())()`);
    await wait(650);
    const closed = await evaluate(`(() => {
      const trigger = document.querySelector('[data-mobile-menu-trigger]');
      return JSON.stringify({
        expanded: trigger?.getAttribute('aria-expanded'),
        menuPresent: !!document.querySelector('[data-mobile-menu]'),
      });
    })()`);
    assert(closed.expanded === "false", `${viewport.name}: menu did not close`);
    assert(!closed.menuPresent, `${viewport.name}: menu remained mounted after close`);

    results.push({ viewport, status: "passed" });
  }

  console.log(JSON.stringify({ status: "passed", results }, null, 2));
} finally {
  socket.close();
}
