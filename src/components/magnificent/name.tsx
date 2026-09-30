"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { playCoin } from "./sound";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/name.tsx
//
// The h1, in gold, under a halo. One name was never going to be enough:
// every click reveals another of his titles, with a burst of sparkles.
// ------------------------------------------------

const TITLES = [
  "Andrew Jones, the Magnificent",
  "Andrew the Clear-Sighted",
  "Lorenzo de' Jones",
  "Andrew I, Duke of Diligence",
  "Artful Hacker, Breaker of Bottlenecks",
  "He Who Asks the Right Question",
  "Defender of Human Agency",
  "Il Magnifico",
];

const RAYS = 12;

function Burst({ onDone }: { onDone: () => void }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
      {Array.from({ length: RAYS }, (_, k) => {
        const angle = (k / RAYS) * Math.PI * 2;
        return (
          <motion.span
            key={k}
            className="absolute -translate-1/2 text-[var(--gold)] text-[11pt]"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * 110,
              y: Math.sin(angle) * 45,
              opacity: 0,
              scale: 1.3,
              rotate: 200,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            onAnimationComplete={k === 0 ? onDone : undefined}
          >
            ✦
          </motion.span>
        );
      })}
    </span>
  );
}

export function MagnificentName() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [bursts, setBursts] = useState<number[]>([]);
  const nextBurst = useRef(0);

  const promote = () => {
    setI((n) => (n + 1) % TITLES.length);
    playCoin();
    if (!reduce) setBursts((b) => [...b, nextBurst.current++]);
  };

  return (
    <h1 className="text-[22pt] md:text-[20pt] font-medium tracking-[-0.035em] text-ink leading-tight pt-3">
      <button
        type="button"
        onClick={promote}
        title="He has other titles. Click."
        className="relative cursor-pointer text-left"
      >
        <span aria-hidden="true" className="mag-halo" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            className="mag-gold-text inline-block"
            initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(8px)", y: -6 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
          >
            {TITLES[i]}
          </motion.span>
        </AnimatePresence>
        {bursts.map((id) => (
          <Burst key={id} onDone={() => setBursts((b) => b.filter((x) => x !== id))} />
        ))}
      </button>
    </h1>
  );
}
