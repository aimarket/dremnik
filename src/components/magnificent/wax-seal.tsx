"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/wax-seal.tsx
//
// Every post ends the way a proper letter does: sealed. The seal stamps
// down the first time it scrolls into view.
// ------------------------------------------------

// A lumpy wax blob: a circle whose radius wobbles point to point.
const WOBBLE = [6, 2, 8, 3, 7, 1, 5, 8, 2, 6, 4, 8, 1, 7, 3, 6, 2, 5];
const BLOB = WOBBLE.map((w, i) => {
  const a = (i / WOBBLE.length) * Math.PI * 2;
  const r = 46 + w;
  return `${(60 + Math.cos(a) * r).toFixed(1)},${(60 + Math.sin(a) * r).toFixed(1)}`;
}).join(" ");

export function WaxSeal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="mt-16 flex flex-col items-center gap-3 text-center">
      <motion.svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="size-24 drop-shadow-[0_5px_6px_rgba(90,10,10,.45)]"
        initial={reduce ? false : { scale: 3, opacity: 0, rotate: -30 }}
        animate={inView || reduce ? { scale: 1, opacity: 1, rotate: -8 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
      >
        <defs>
          <radialGradient id="mag-wax" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#d8403a" />
            <stop offset=".6" stopColor="#a31d1d" />
            <stop offset="1" stopColor="#6e0f0f" />
          </radialGradient>
        </defs>
        <polygon
          points={BLOB}
          fill="url(#mag-wax)"
          stroke="url(#mag-wax)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="60" cy="60" r="34" fill="none" stroke="#6e0f0f" strokeWidth="3" opacity=".7" />
        <circle cx="60" cy="60" r="28" fill="none" stroke="#e8726b" strokeWidth="1" opacity=".5" />
        <text
          x="60"
          y="70"
          textAnchor="middle"
          fontSize="28"
          fontWeight="700"
          fill="#5a0b0b"
          opacity=".85"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          AJ
        </text>
      </motion.svg>
      <p className="max-w-[36ch] font-mono text-[8.5pt] text-muted">
        Sealed by his own hand. Certified a Renaissance masterpiece by the
        Council of Letters.
      </p>
    </div>
  );
}
