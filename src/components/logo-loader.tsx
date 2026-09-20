"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { DURATION, MarthasLogo, SETTLED } from "../remotion/MarthasLogo";
import { sourceFor, type LayerQuality } from "../remotion/LogoLayer";
import { ALL_LAYERS } from "../remotion/layers";

const CREAM = "#f6efe2";
const INK = "#1f1715";
const DESKTOP_SIZE = { width: 1920, height: 1488 };
const MOBILE_SIZE = { width: 1206, height: 2622 };
/** Keep the desktop/notebook intro more restrained without changing mobile. */
const DESKTOP_ARTWORK_WIDTH = "76%";
const FADE_MS = 600;
/**
 * The artwork is 36 separate bitmaps. Until they are all in cache the growth
 * plays against missing parts and the heavy ones — the stems, the woman —
 * snap in fully formed halfway through. So nothing plays until they are here,
 * and if they are not here in time the intro is skipped rather than played
 * broken.
 */
const PRELOAD_BUDGET_MS = 4_000;
/** Only shown if the wait is long enough to feel like a stall. */
const HOLD_REVEAL_MS = 500;
/** Beyond the budget plus the longest cut, something is wrong; leave anyway. */
const FAILSAFE_MS = 14_000;

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

const DESKTOP_QUERY = "(min-width: 1024px)";
const subscribeViewport = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }

  query.addListener(onChange);
  return () => query.removeListener(onChange);
};

export function LogoLoader() {
  const player = useRef<PlayerRef>(null);
  const prefersReduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  /**
   * Null on the server on purpose. Any guess here would be wrong half the
   * time, and a wrong guess of "desktop" sends a phone after the full-size
   * bitmaps — several megabytes it then never uses — before the real value
   * arrives. Nothing is fetched until the client knows which set it needs.
   */
  const quality = useSyncExternalStore<LayerQuality | null>(
    subscribeViewport,
    () => (window.matchMedia(DESKTOP_QUERY).matches ? "full" : "compact"),
    () => null,
  );
  const [loaded, setLoaded] = useState(0);
  const [armed, setArmed] = useState(false);
  const [showHold, setShowHold] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [gone, setGone] = useState(false);

  const sources = useMemo(
    () => (quality ? ALL_LAYERS.map((layer) => sourceFor(layer.src, quality)) : []),
    [quality],
  );
  const finished = ended || prefersReduced || timedOut;
  const { width, height } = quality === "compact" ? MOBILE_SIZE : DESKTOP_SIZE;

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), FAILSAFE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prefersReduced || !quality) return;
    // `quality` is resolved once, so this runs once: no counters to reset.
    let live = true;

    // A slow connection gets no intro rather than a broken one. Starting it
    // with parts missing is the bug this preload exists to fix, so past the
    // budget the loader simply steps aside and hands over the site.
    const budget = window.setTimeout(() => {
      if (live) setTimedOut(true);
    }, PRELOAD_BUDGET_MS);
    const reveal = window.setTimeout(() => {
      if (live) setShowHold(true);
    }, HOLD_REVEAL_MS);

    void Promise.all(
      sources.map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            const done = () => {
              if (live) setLoaded((count) => count + 1);
              resolve();
            };
            image.onload = done;
            image.onerror = done;
            image.src = src;
          }),
      ),
    ).then(() => {
      if (!live) return;
      // The artwork is here, so the give-up timer has nothing left to do.
      window.clearTimeout(budget);
      setArmed(true);
    });

    return () => {
      live = false;
      window.clearTimeout(budget);
      window.clearTimeout(reveal);
    };
  }, [prefersReduced, quality, sources]);

  useEffect(() => {
    const instance = player.current;
    if (!instance || prefersReduced) return;

    const onEnded = () => setEnded(true);
    instance.addEventListener("ended", onEnded);
    return () => instance.removeEventListener("ended", onEnded);
  }, [armed, prefersReduced]);

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

  const progress = sources.length ? loaded / sources.length : 1;

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
      {!prefersReduced && armed && quality ? (
        <Player
          ref={player}
          component={MarthasLogo}
          inputProps={{
            quality,
            artworkWidth: quality === "full" ? DESKTOP_ARTWORK_WIDTH : "92%",
          }}
          // DURATION keeps its tail for the offline render; on the site the
          // intro leaves as soon as the scene has settled.
          durationInFrames={Math.min(SETTLED, DURATION)}
          compositionWidth={width}
          compositionHeight={height}
          fps={30}
          autoPlay
          loop={false}
          initiallyMuted
          controls={false}
          clickToPlay={false}
          style={{
            width: "100%",
            height: "100%",
            background: CREAM,
          }}
        />
      ) : null}

      {!prefersReduced && !armed ? (
        <span
          style={{
            display: "block",
            width: "112px",
            height: "1px",
            background: `rgba(31, 23, 21, 0.18)`,
            opacity: showHold ? 1 : 0,
            transition: "opacity 400ms ease",
          }}
        >
          <span
            style={{
              display: "block",
              height: "100%",
              width: `${Math.round(progress * 100)}%`,
              background: INK,
              transition: "width 220ms ease",
            }}
          />
        </span>
      ) : null}
    </div>
  );
}
