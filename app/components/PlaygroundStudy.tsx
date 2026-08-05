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
    }, 2_200);
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
      <div className="playground-study__chrome" aria-hidden="true">
        <span>MOTION STUDY / 001</span>
        <span>2.2 SEC · CUBIC OUT</span>
      </div>
      <div className="playground-study__visual" key={playback} aria-hidden="true">
        <p className="playground-study__question">How should the last 10% feel?</p>
        <div className="kinetic-type"><span>MOVE</span><span>THEN</span><span>SETTLE.</span></div>
        <div className="playground-study__track">
          <small>Linear</small>
          <div className="playground-playhead"><i /><b /><b /><b /></div>
          <small>Cubic out</small>
        </div>
      </div>
      <div className="playground-study__footer" aria-hidden="true"><span>INPUT / TIMING</span><span>DECISION / EASING</span><span>OUTPUT / HIERARCHY</span></div>
      <button className="playground-replay" type="button" onClick={play} disabled={playing}>
        {playing ? "Playing 00:02" : "Replay study"}
      </button>
    </div>
  );
}
