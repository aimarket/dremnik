"use client";

import { useEffect, useRef, useState } from "react";
import { HEADLINES } from "./copy";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/news-wire.tsx
//
// The wire. The first few stories are stamped at the open; once trading
// starts, a new one lands every few seconds, newest on top, blinking.
// ------------------------------------------------

const VISIBLE = 9;
const EVERY_MS = 6500;
const AT_THE_OPEN = 6;

type Story = { id: number; time: string; text: string; fresh: boolean };

const OPENING: Story[] = HEADLINES.slice(0, AT_THE_OPEN)
  .map((text, i) => ({ id: i, time: `09:30:${String(i * 7).padStart(2, "0")}`, text, fresh: false }))
  .reverse();

export function NewsWire({ live }: { live: boolean }) {
  const [stories, setStories] = useState(OPENING);
  const next = useRef(AT_THE_OPEN);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      const n = next.current++;
      const story: Story = {
        id: n,
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        text: HEADLINES[n % HEADLINES.length],
        fresh: true,
      };
      setStories((list) => [story, ...list.map((s) => ({ ...s, fresh: false }))].slice(0, VISIBLE));
    }, EVERY_MS);
    return () => clearInterval(id);
  }, [live]);

  return (
    <ol className="space-y-1.5">
      {stories.map((s) => (
        <li key={s.id} className={s.fresh ? "drem-slide-in" : undefined}>
          <span className="text-[#9a8a5c] tabular-nums">{s.time}</span>{" "}
          {s.fresh && <span className="drem-blink bg-[#ffb000] px-1 font-bold text-black">NEW</span>}{" "}
          <span className="text-[#e8e8e8]">{s.text}</span>
        </li>
      ))}
    </ol>
  );
}
