"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { playFanfare } from "./sound";
import { rainFlorins } from "./florins";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/herald.tsx
//
// Once per browser session: a loading screen whose progress bar overshoots
// 100% and keeps going, then velvet curtains part. The "Enter" click doubles
// as the user gesture the browser needs before it will play the fanfare.
// ------------------------------------------------

const SEEN = "magnificent:heralded";

const STATUS = [
  "Polishing the halo…",
  "Notifying the Medici…",
  "Tuning the trumpets…",
  "Warning the speed of light…",
  "Informing AGI…",
  "Rehearsing the choir…",
];

type Phase = "loading" | "ready" | "parting" | "gone";

function remember() {
  try {
    sessionStorage.setItem(SEEN, "1");
  } catch {
    // Private mode: he gets heralded on every reload. Deserved.
  }
}

export function Herald() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN)) setPhase("gone");
    } catch {}
  }, []);

  // Crawl to 100, then the scale gives up and it goes exponential.
  useEffect(() => {
    if (phase !== "loading") return;
    let p = 0;
    const id = setInterval(() => {
      p = p < 100 ? Math.min(100, p + 3 + Math.random() * 7) : p * 1.4;
      setPct(p);
      if (p > 9000) {
        clearInterval(id);
        setPhase("ready");
      }
    }, 90);
    return () => clearInterval(id);
  }, [phase]);

  // Lock the page behind the curtains.
  useEffect(() => {
    if (phase === "gone") return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, [phase]);

  const skip = () => {
    remember();
    setPhase("gone");
  };

  useEffect(() => {
    if (phase === "gone" || phase === "parting") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [phase]);

  const enter = () => {
    remember();
    playFanfare();
    setPhase("parting");
    setTimeout(() => rainFlorins(90), 700);
  };

  if (phase === "gone") return null;

  const overflow = pct > 100;
  const status = overflow
    ? "MAGNIFICENCE OVERFLOW"
    : STATUS[Math.min(STATUS.length - 1, Math.floor(pct / (100 / STATUS.length)))];

  const curtain = {
    duration: reduce ? 0 : 1.5,
    ease: [0.7, 0, 0.3, 1] as const,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Entering the presence of greatness"
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      <motion.div
        className="mag-curtain left-0"
        animate={{ x: phase === "parting" ? "-100%" : 0 }}
        transition={curtain}
        onAnimationComplete={() => phase === "parting" && setPhase("gone")}
      />
      <motion.div
        className="mag-curtain right-0 -scale-x-100"
        animate={{ x: phase === "parting" ? "100%" : 0 }}
        transition={curtain}
      />
      <div aria-hidden="true" className="mag-valance" />

      <AnimatePresence>
        {phase !== "parting" && (
          <motion.div
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
          >
            <p className="font-cinzel text-[#f5d77a] text-[10pt] tracking-[0.35em] uppercase">
              Hear ye, hear ye
            </p>
            {/* A <p>, not a heading: the theme restyles every h1/h2 in cardinal red. */}
            <p className="font-cinzel-decorative font-bold text-[#fff4c2] text-[19pt] md:text-[26pt] leading-tight max-w-[18ch] [font-variant-ligatures:none] [text-shadow:0_2px_12px_rgba(0,0,0,.6)]">
              Preparing to be in the presence of greatness
            </p>

            <div className="w-full max-w-sm">
              <div className="relative h-2.5 rounded-full border border-[#c9a23f]/70 bg-black/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#9a6b12] via-[#f2c94c] to-[#fff4c2]"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
                {overflow && <div aria-hidden="true" className="mag-overflow" />}
              </div>
              <div className="mt-2 flex justify-between gap-4 font-mono text-[9pt] text-[#f5d77a]">
                <span className={overflow ? "text-[#ff6b5e]" : undefined}>{status}</span>
                <span className={overflow ? "mag-shake tabular-nums" : "tabular-nums"}>
                  {Math.floor(pct).toLocaleString("en-US")}%
                </span>
              </div>
            </div>

            <div className="h-[46px]">
              {phase === "ready" && (
                <motion.button
                  type="button"
                  autoFocus
                  onClick={enter}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mag-enter font-cinzel"
                >
                  Enter the presence
                </motion.button>
              )}
            </div>

            <button
              type="button"
              onClick={skip}
              className="font-mono text-[8pt] text-[#f5d77a]/55 hover:text-[#f5d77a] underline underline-offset-4 cursor-pointer"
            >
              skip (not recommended)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
