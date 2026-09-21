export type BrowserIdentity = {
  userAgent: string;
  maxTouchPoints?: number;
};

/**
 * Safari on iPad can advertise a Macintosh user agent. Touch capability keeps
 * the desktop fallback limited to actual Macs, while the browser exclusions
 * avoid matching Chrome/Edge/Opera, whose user agents also end in Safari/...
 */
export function isMacOSSafari({
  userAgent,
  maxTouchPoints = 0,
}: BrowserIdentity): boolean {
  const isMac = /Macintosh|Mac OS X/i.test(userAgent) && maxTouchPoints <= 1;
  const isSafari = /Version\/\d+(?:\.\d+)*.*Safari\//i.test(userAgent);
  const isSafariShell = !/(?:Chrome|Chromium|CriOS|Edg|EdgiOS|OPR|FxiOS)\//i.test(
    userAgent,
  );

  return isMac && isSafari && isSafariShell;
}

/** Runs in <head> so Safari's loader is hidden before the first paint. */
export const MACOS_SAFARI_BOOTSTRAP = `(() => {
  const ua = navigator.userAgent;
  const isMac = /Macintosh|Mac OS X/i.test(ua) && (navigator.maxTouchPoints || 0) <= 1;
  const isSafari = /Version\\/\\d+(?:\\.\\d+)*.*Safari\\//i.test(ua);
  const isSafariShell = !/(?:Chrome|Chromium|CriOS|Edg|EdgiOS|OPR|FxiOS)\\//i.test(ua);
  if (isMac && isSafari && isSafariShell) {
    document.documentElement.dataset.macosSafari = "true";
  }
})();`;
