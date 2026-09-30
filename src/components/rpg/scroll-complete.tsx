"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { unlock } from "./achievements";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/scroll-complete.tsx
//
// The end of every post: a quest-complete box that pops up once you've
// actually read to the bottom, with a reward worthy of the effort.
// ------------------------------------------------

export function ScrollComplete() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (inView) unlock("scholar");
  }, [inView]);

  return (
    <div ref={ref} className="mt-16">
      <motion.div
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={inView || reduce ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="rpg-window text-center"
      >
        <p className="font-pixel text-[13px] text-[#ffd84a] md:text-[16px]">QUEST COMPLETE!</p>
        <p className="mt-3 font-vt text-[20px] leading-[1.15] text-white">
          You read a scroll of lore written by the hero himself.
        </p>
        <p className="mt-2 font-pixel text-[8px] leading-[2] text-[#9fe870]">
          +500 EXP · +1 WISDOM · +1 FOLLOWER (PROBABLY)
        </p>
      </motion.div>
    </div>
  );
}
