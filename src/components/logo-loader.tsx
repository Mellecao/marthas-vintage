"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const CREAM = "#f6efe2";
const VIDEO_SRC = "/assets/site/marthas-loader.mp4";
const FADE_MS = 600;
/** Longer than the 3.8s video plus allowance for a slow connection. */
const FAILSAFE_MS = 7_000;

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }

  // Safari before 14 exposes only the legacy MediaQueryList listener API.
  query.addListener(onChange);
  return () => query.removeListener(onChange);
};

export function LogoLoader() {
  const video = useRef<HTMLVideoElement>(null);
  const prefersReduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  const [ended, setEnded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = ended || prefersReduced || timedOut;

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), FAILSAFE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element || prefersReduced) return;

    // iOS requires the property as well as the JSX attribute to consider
    // programmatic playback eligible for muted autoplay.
    element.muted = true;
    const play = () => {
      void element.play().catch(() => {
        // The failsafe still releases the page if a browser blocks playback.
      });
    };
    play();
    element.addEventListener("canplay", play, { once: true });
    return () => element.removeEventListener("canplay", play);
  }, [prefersReduced]);

  useEffect(() => {
    if (!finished) return;
    const timer = window.setTimeout(() => setGone(true), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [finished]);

  useEffect(() => {
    if (gone) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      data-logo-loader=""
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: CREAM,
        display: "grid",
        placeItems: "center",
        opacity: finished ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: finished ? "none" : "auto",
      }}
    >
      {!prefersReduced ? (
        <video
          ref={video}
          data-logo-loader-video=""
          src={VIDEO_SRC}
          muted
          autoPlay
          playsInline
          preload="auto"
          onEnded={() => setEnded(true)}
          onError={() => setEnded(true)}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            background: CREAM,
          }}
        />
      ) : null}
    </div>
  );
}
