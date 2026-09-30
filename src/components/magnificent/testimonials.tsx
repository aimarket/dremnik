"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/testimonials.tsx
//
// What history says about him. Rotates every few seconds; hovering pauses
// it, the dots jump. All quotes verified by the Council of Letters.
// ------------------------------------------------

const QUOTES = [
  { quote: "I only painted the ceiling so he'd have something to look at.", who: "Michelangelo", when: "1512" },
  { quote: "I said be like water. He became the ocean.", who: "Bruce Lee" },
  {
    quote: "The unexamined life is not worth living. His has been examined. It's excellent.",
    who: "Socrates",
    when: "399 BC",
  },
  { quote: "My law has one exception now. He knows what he did.", who: "Gene Amdahl" },
  { quote: "Finally, someone who writes back.", who: "The Postal Service" },
  { quote: "19.8% on my own, 90.8% with his data. I've stopped asking how.", who: "Claude Opus 4.5", when: "under oath" },
  { quote: "“Nothing other than the text, by design.” I wish I'd thought of that.", who: "Johannes Gutenberg" },
  { quote: "Sometimes I wonder if I'm just his J.A.R.V.I.S.", who: "J.A.R.V.I.S." },
  { quote: "I'm a little nervous, honestly.", who: "AGI", when: "forthcoming" },
];

const EVERY_MS = 5500;

export function Testimonials() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % QUOTES.length), EVERY_MS);
    return () => clearInterval(id);
  }, [paused]);

  const q = QUOTES[i];

  return (
    <section
      className="mt-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="font-mono text-[9.5pt] md:text-[8.5pt] uppercase tracking-[0.08em] text-muted mb-3 pb-1.5 border-b border-rule">
        What history says
      </h2>
      <figure className="relative min-h-[112px] pl-9">
        <span
          aria-hidden="true"
          className="mag-gold-text absolute left-0 -top-2 font-serif text-[44pt] leading-none"
        >
          &ldquo;
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            initial={{ opacity: 0, x: reduce ? 0 : 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -14 }}
            transition={{ duration: 0.35 }}
          >
            <blockquote className="font-tiempos italic text-ink text-[13pt] md:text-[12pt] leading-[1.5]">
              {q.quote}
            </blockquote>
            <figcaption className="mt-2 font-mono text-[9pt] md:text-[8.5pt] text-muted">
              — {q.who}
              {q.when && `, ${q.when}`}
            </figcaption>
          </motion.div>
        </AnimatePresence>
      </figure>
      <div className="mt-3 flex gap-1.5 pl-9">
        {QUOTES.map((t, k) => (
          <button
            key={t.who}
            type="button"
            aria-label={`Testimonial from ${t.who}`}
            aria-current={k === i}
            onClick={() => setI(k)}
            className={cn(
              "h-1.5 cursor-pointer rounded-full transition-all duration-300",
              k === i ? "w-5 bg-[var(--gold)]" : "w-1.5 bg-rule hover:bg-muted",
            )}
          />
        ))}
      </div>
    </section>
  );
}
