"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CREAM, MarthasLogo } from "@/remotion/MarthasLogo";
import { LAYERS } from "@/remotion/layers";

/** The intro is authored for video; on the web it reads better a bit brisker. */
const PLAYBACK_RATE = 1.75;
/** The last butterfly settles here — the video's remaining hold is dead time. */
const LAST_FRAME = 200;
const FADE_MS = 600;
/** Never leave older or memory-constrained browsers behind the cream overlay. */
const FAILSAFE_MS = 10_000;

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
  const player = useRef<PlayerRef>(null);
  const prefersReduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  // The cream overlay is server-rendered so there is no flash of the page, but
  // the Player itself only mounts in the browser.
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = ended || prefersReduced || timedOut;

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), FAILSAFE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    let live = true;
    // Every part has to be decoded before playback, or the first second of the
    // intro plays against an empty screen while the SVGs are still arriving.
    Promise.all(
      LAYERS.map(
        (layer) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => resolve();
            img.src = layer.src;
          }),
      ),
    ).then(() => {
      if (live) setReady(true);
    });
    return () => {
      live = false;
    };
  }, [prefersReduced]);

  useEffect(() => {
    const instance = player.current;
    if (!instance) return;
    const finish = () => setEnded(true);
    instance.addEventListener("ended", finish);
    return () => instance.removeEventListener("ended", finish);
  }, [ready]);

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
      {ready ? (
        <Player
          ref={player}
          component={MarthasLogo}
          durationInFrames={LAST_FRAME}
          fps={30}
          compositionWidth={1206}
          compositionHeight={2622}
          playbackRate={PLAYBACK_RATE}
          autoPlay
          loop={false}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          style={{ width: "100%", height: "100%" }}
        />
      ) : null}
    </div>
  );
}
