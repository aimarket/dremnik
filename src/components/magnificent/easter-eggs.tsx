"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { playChoir, playFanfare } from "./sound";
import { rainFlorins } from "./florins";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/easter-eggs.tsx
//
// - Konami code → the Ascension: light from above, a choir, a lot of gold.
// - Typing "medici", "magnificent" or "andrew" anywhere → fanfare + florins.
// - Leaving the tab → the title begs you to come back.
// - Opening devtools → a proclamation.
// ------------------------------------------------

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
const WORDS = ["medici", "magnificent", "andrew"];
const ASCENSION_MS = 7000;
const AWAY_TITLE = "👑 Come back. Greatness awaits.";

let proclaimed = false;

function proclaim() {
  if (proclaimed) return;
  proclaimed = true;
  console.log(
    "%c⚜ HEAR YE, HEAR YE ⚜",
    "font: 700 22px serif; color: #c9a23f; text-shadow: 0 1px 0 #7a5410;",
  );
  console.log(
    "%cYou are inspecting the source code of the Magnificent.\nKindly remove your shoes.\n\n↑ ↑ ↓ ↓ ← → ← → B A",
    "font: 13px serif; color: #8a1c1c; line-height: 1.5;",
  );
}

function typingInField(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}

export function EasterEggs() {
  const [ascending, setAscending] = useState(false);

  useEffect(proclaim, []);

  useEffect(() => {
    let keys: string[] = [];
    let typed = "";

    const onKey = (e: KeyboardEvent) => {
      if (typingInField(e)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      keys = [...keys, key].slice(-KONAMI.length);
      if (keys.join() === KONAMI.join()) {
        keys = [];
        setAscending(true);
        playChoir(6);
        rainFlorins(220);
        return;
      }

      if (key.length !== 1) return;
      typed = (typed + key).slice(-12);
      if (WORDS.some((w) => typed.endsWith(w))) {
        typed = "";
        playFanfare();
        rainFlorins(150);
      }
    };

    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!ascending) return;
    const html = document.documentElement;
    html.classList.add("mag-ascend");
    const t = setTimeout(() => setAscending(false), ASCENSION_MS);
    return () => {
      clearTimeout(t);
      html.classList.remove("mag-ascend");
    };
  }, [ascending]);

  useEffect(() => {
    let title = document.title;
    const onVisibility = () => {
      if (document.hidden) {
        title = document.title;
        document.title = AWAY_TITLE;
      } else if (document.title === AWAY_TITLE) {
        document.title = title;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <AnimatePresence>
      {ascending && (
        <motion.div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 z-[85] flex items-start justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div aria-hidden="true" className="mag-rays" />
          <motion.div
            className="relative mt-[18vh] px-6 text-center"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.4, ease: "easeOut" }}
          >
            <p className="font-cinzel-decorative font-bold text-[30pt] md:text-[44pt] leading-none text-[#8a5d0e] [text-shadow:0_0_2px_#fff8dc,0_0_18px_#fff8dc,0_0_40px_#f2c94c]">
              Ascension
            </p>
            <p className="mt-4 font-cinzel font-bold text-[10pt] tracking-[0.2em] uppercase text-[#5c3d08] [text-shadow:0_0_10px_#fff8dc]">
              You found the code. He knew you would.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
