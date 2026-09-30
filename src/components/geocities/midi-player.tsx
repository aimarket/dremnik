"use client";

import { useEffect, useRef, useState } from "react";
import { playFurElise } from "./sound";

// ------------------------------------------------
// projects/dremnik/src/components/geocities/midi-player.tsx
//
// Every homepage needed background music. This one waits for a click,
// because browsers now insist, and because Andrew is considerate.
// ------------------------------------------------

const BARS = 7;

export function MidiPlayer() {
  const [playing, setPlaying] = useState(false);
  const stop = useRef<(() => void) | null>(null);

  useEffect(() => () => stop.current?.(), []);

  const toggle = () => {
    if (playing) {
      stop.current?.();
      stop.current = null;
    } else {
      stop.current = playFurElise();
    }
    setPlaying(!playing);
  };

  return (
    <div className="geo-player">
      <p className="text-[8pt] tracking-wide text-[#00ff00]">NOW PLAYING:</p>
      <p className="truncate text-[9pt] text-[#ffff66]">♫ fur_elise.mid</p>
      <div aria-hidden="true" className="my-1.5 flex h-5 items-end gap-[3px]">
        {Array.from({ length: BARS }, (_, i) => (
          <span
            key={i}
            className={playing ? "geo-eq geo-eq-on" : "geo-eq"}
            style={{ animationDelay: `${-i * 0.17}s` }}
          />
        ))}
      </div>
      <button type="button" className="geo-btn w-full" onClick={toggle} aria-pressed={playing}>
        {playing ? "■ Stop" : "▶ Play"}
      </button>
      <p className="mt-1 text-[7.5pt] opacity-70">Arranged by Beethoven. Performed by Andrew&rsquo;s sound card.</p>
    </div>
  );
}
