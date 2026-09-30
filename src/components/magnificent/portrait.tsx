"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/portrait.tsx
//
// The Florentine portrait in a gilded frame. It tilts toward the cursor with
// a sheen across the varnish, sprouts a halo on hover, and speaks when
// clicked. The museum placard is non-negotiable.
// ------------------------------------------------

const QUIPS = [
  "Ciao.",
  "I've been expecting you.",
  "Have you tried asking a better question?",
  "Write me a letter sometime.",
  "The frontier? I live there.",
  "Be water.",
  "idk how anyone uses Slack honestly.",
  "This frame is worth more than your AUM.",
  "Yes, the halo is real.",
];

const SPRING = { stiffness: 160, damping: 14 };

export function Portrait() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const next = useRef(0);
  const [quip, setQuip] = useState<string | null>(null);

  // Pointer position over the frame, 0–1 on each axis.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-14, 14]), SPRING);
  const rotateX = useSpring(useTransform(py, [0, 1], [12, -12]), SPRING);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,244,194,.45), transparent 55%)`;

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const speak = () => setQuip(QUIPS[next.current++ % QUIPS.length]);

  useEffect(() => {
    if (!quip) return;
    const t = setTimeout(() => setQuip(null), 2800);
    return () => clearTimeout(t);
  }, [quip]);

  return (
    <figure className="mx-auto mb-8 w-44 md:float-right md:ml-8 md:mb-3 md:mt-1 [perspective:800px]">
      <motion.button
        ref={ref}
        type="button"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={speak}
        aria-label="Portrait of the Magnificent. Click and he speaks."
        style={{ rotateX, rotateY }}
        className="mag-frame group relative block w-full cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/florentine_andrew.jpeg"
          alt=""
          className="block aspect-square w-full object-cover"
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[10px]"
          style={{ background: glare }}
        />
        <span
          aria-hidden="true"
          className="mag-halo mag-halo-portrait opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <AnimatePresence>
          {quip && (
            <motion.span
              key={quip}
              role="status"
              className="mag-speech"
              initial={{ opacity: 0, y: 8, x: "-50%", scale: 0.9 }}
              animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
              exit={{ opacity: 0, y: -4, x: "-50%" }}
            >
              {quip}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <figcaption className="mag-placard">
        <span className="block font-medium tracking-[0.06em] uppercase">
          Ritratto del Magnifico
        </span>
        Oil on canvas, c. 1487. Uffizi Gallery, on loan to dremnik.com. Insured
        for more than the Medici bank.
      </figcaption>
    </figure>
  );
}
