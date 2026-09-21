"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { isMacOSSafari } from "@/lib/browser";

const LOADER_BG = "#fffff5";
const INK = "#1f1715";
const DESKTOP_VIDEO = "/assets/site/marthas-loader-desktop.mp4";
const MOBILE_VIDEO = "/assets/site/marthas-loader-mobile.mp4";
const FADE_MS = 600;
const HOLD_REVEAL_MS = 500;
const FAILSAFE_MS = 9_000;

const REDUCED = "(prefers-reduced-motion: reduce)";
const DESKTOP_QUERY = "(min-width: 1024px)";

const subscribeMedia = (query: string, onChange: () => void) => {
  const media = window.matchMedia(query);
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }

  // Safari before 14 exposes only the legacy MediaQueryList listener API.
  media.addListener(onChange);
  return () => media.removeListener(onChange);
};

const subscribeMotion = (onChange: () => void) =>
  subscribeMedia(REDUCED, onChange);
const subscribeViewport = (onChange: () => void) =>
  subscribeMedia(DESKTOP_QUERY, onChange);
const subscribeBrowserIdentity = () => () => undefined;

export function LogoLoader() {
  const prefersReduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  const desktop = useSyncExternalStore<boolean | null>(
    subscribeViewport,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => null,
  );
  const macOSSafari = useSyncExternalStore(
    subscribeBrowserIdentity,
    () =>
      isMacOSSafari({
        userAgent: navigator.userAgent,
        maxTouchPoints: navigator.maxTouchPoints,
      }),
    () => false,
  );
  const [ready, setReady] = useState(false);
  const [showHold, setShowHold] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [gone, setGone] = useState(false);

  const skipAnimation = macOSSafari || prefersReduced;
  const finished = skipAnimation || ended || timedOut;
  const source = desktop === null ? null : desktop ? DESKTOP_VIDEO : MOBILE_VIDEO;

  useEffect(() => {
    if (skipAnimation) return;

    const reveal = window.setTimeout(() => setShowHold(true), HOLD_REVEAL_MS);
    const failsafe = window.setTimeout(() => setTimedOut(true), FAILSAFE_MS);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(failsafe);
    };
  }, [skipAnimation]);

  useEffect(() => {
    if (!finished || skipAnimation) return;
    const timer = window.setTimeout(() => setGone(true), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [finished, skipAnimation]);

  useEffect(() => {
    if (gone || skipAnimation) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [gone, skipAnimation]);

  if (gone || skipAnimation) return null;

  return (
    <div
      aria-hidden="true"
      data-logo-loader=""
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: LOADER_BG,
        display: "grid",
        placeItems: "center",
        opacity: finished ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: finished ? "none" : "auto",
      }}
    >
      {!skipAnimation && source ? (
        <video
          key={source}
          src={source}
          autoPlay
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          onEnded={() => setEnded(true)}
          onError={() => setTimedOut(true)}
          style={{
            display: "block",
            width: "46%",
            height: "46%",
            objectFit: "contain",
            objectPosition: "center",
            background: LOADER_BG,
          }}
        />
      ) : null}

      {!skipAnimation && !ready ? (
        <span
          style={{
            position: "absolute",
            display: "block",
            width: "112px",
            height: "1px",
            overflow: "hidden",
            background: "rgba(31, 23, 21, 0.18)",
            opacity: showHold ? 1 : 0,
            transition: "opacity 400ms ease",
          }}
        >
          <span
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              background: INK,
              transformOrigin: "left center",
              animation: "logo-loader-hold 900ms ease-in-out infinite alternate",
            }}
          />
        </span>
      ) : null}
    </div>
  );
}
