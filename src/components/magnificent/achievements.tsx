"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/achievements.tsx
//
// A hall of numbers that count themselves up the first time they scroll
// into view. Several of them are even real.
// ------------------------------------------------

type Stat = {
  label: string;
  to: number;
  from?: number;
  decimals?: number;
  suffix?: string;
  final?: string; // shown once the count lands, when a number won't do
};

const STATS: Stat[] = [
  { to: 3927, suffix: "★", label: "GitHub stars on quill. The Sistine Chapel has zero." },
  { to: 1_000_000_000, suffix: "×", label: "Diligence, accelerated." },
  {
    from: 19.8,
    to: 90.8,
    decimals: 1,
    suffix: "%",
    label: "Claude's benchmark score with Hermaeus. We don't talk about before.",
  },
  { to: 19_100, label: "Followers on X, each personally enlightened." },
  { from: 9999, to: 0, label: "Hallucinations. Structured facts only." },
  { to: 99_999, final: "∞", label: "Clarity, scaled. Amdahl has been notified." },
];

function format(v: number, s: Stat) {
  const digits = s.decimals ?? 0;
  const n = v.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return n + (s.suffix ?? "");
}

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [text, setText] = useState(() => format(stat.from ?? 0, stat));

  useEffect(() => {
    if (!inView) return;
    const land = () => setText(stat.final ?? format(stat.to, stat));
    if (reduce) return land();
    const controls = animate(stat.from ?? 0, stat.to, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(format(v, stat)),
      onComplete: land,
    });
    return () => controls.stop();
  }, [inView, reduce, stat]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}

export function HallOfAchievements() {
  return (
    <section className="mt-12 clear-both">
      <h2 className="font-mono text-[9.5pt] md:text-[8.5pt] uppercase tracking-[0.08em] text-muted mb-3 pb-1.5 border-b border-rule">
        Hall of achievements
      </h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {STATS.map((s) => (
          <li key={s.label} className="mag-tile">
            <div className="mag-gold-text text-[13pt] md:text-[15pt] font-medium tracking-[-0.02em] [overflow-wrap:anywhere]">
              <Counter stat={s} />
            </div>
            <p className="mt-1 text-muted text-[9.5pt] md:text-[8.5pt] leading-[1.4]">
              {s.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
