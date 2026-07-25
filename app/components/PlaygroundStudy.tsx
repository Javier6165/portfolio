"use client";

import { useEffect, useRef, useState } from "react";

export function PlaygroundStudy() {
  const [playback, setPlayback] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  function play() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setPlayback((value) => value + 1);
    setPlaying(true);
    timerRef.current = window.setTimeout(() => {
      setPlaying(false);
      timerRef.current = null;
    }, 1_450);
  }

  useEffect(() => {
    function playWithScene(event: Event) {
      if (event instanceof CustomEvent && event.detail?.id === "playground-experiment") play();
    }

    window.addEventListener("portfolio-live-scene-play", playWithScene);
    return () => {
      window.removeEventListener("portfolio-live-scene-play", playWithScene);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="playground-preview__canvas js-reveal" data-study-state={playing ? "playing" : "paused"}>
      <div className="playground-study__visual" key={playback} aria-hidden="true">
        <div className="kinetic-type"><span>MAKE</span><span>IT</span><span>REAL</span></div>
        <div className="cursor-orbit"><i /><i /><i /></div>
        <div className="playground-playhead"><i /><span>00:02</span></div>
        <div className="lab-tag">LAB / 001—003</div>
      </div>
      <button className="playground-replay" type="button" onClick={play} disabled={playing}>
        {playing ? "Playing 00:02" : "Replay study"}
      </button>
    </div>
  );
}
