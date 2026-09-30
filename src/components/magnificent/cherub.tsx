"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { rainFlorins } from "./florins";
import { playCoin } from "./sound";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/cherub.tsx
//
// Every so often a cherub crosses the screen towing a banner of breaking
// news. Catch one (click it) and it pays out in florins.
// ------------------------------------------------

const BANNERS = [
  "HE SHIPPED AGAIN",
  "3,927 STARS AND COUNTING",
  "HUMAN AGENCY: WINNING",
  "ASK A BETTER QUESTION",
  "BE WATER (HE IS)",
  "A NEW LETTER APPROACHES",
  "THE FRONTIER CALLED. IT'S HIM.",
];

const FIRST_MS = 9000;
const FLIGHT_S = 11;

type Flight = { id: number; text: string; top: number; rightward: boolean };

export function CherubFlyby() {
  const reduce = useReducedMotion();
  const [flight, setFlight] = useState<Flight | null>(null);
  const count = useRef(0);

  useEffect(() => {
    if (reduce) return;
    let timer = setTimeout(function launch() {
      const id = count.current++;
      setFlight({
        id,
        text: BANNERS[id % BANNERS.length],
        top: 14 + Math.random() * 55,
        rightward: id % 2 === 0,
      });
      timer = setTimeout(launch, 28_000 + Math.random() * 15_000);
    }, FIRST_MS);
    return () => clearTimeout(timer);
  }, [reduce]);

  if (!flight) return null;

  const [from, to] = flight.rightward ? ["-45vw", "110vw"] : ["110vw", "-45vw"];

  return (
    <motion.button
      key={flight.id}
      type="button"
      aria-label={`A cherub bearing news: ${flight.text}. Catch it.`}
      onClick={() => {
        playCoin();
        rainFlorins(60);
        setFlight(null);
      }}
      className="fixed left-0 z-[80] flex cursor-pointer select-none items-center gap-1"
      style={{
        top: `${flight.top}vh`,
        // The cherub leads; the banner trails behind it.
        flexDirection: flight.rightward ? "row-reverse" : "row",
      }}
      initial={{ x: from }}
      animate={{ x: to, y: [0, -26, 10, -18, 0] }}
      transition={{
        x: { duration: FLIGHT_S, ease: "linear" },
        y: { duration: FLIGHT_S, ease: "easeInOut" },
      }}
      onAnimationComplete={() => setFlight(null)}
    >
      <span aria-hidden="true" className="mag-flap text-[28pt] leading-none">
        👼
      </span>
      <span className="mag-banner">{flight.text}</span>
    </motion.button>
  );
}
