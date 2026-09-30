"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, playExtraLives, playLevelUp, setMuted, unlockAudio } from "./sound";
import { unlock } from "./achievements";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/hud.tsx
//
// The heads-up display in the corner. EXP fills as you scroll, and every
// quarter of the page is a level. He starts at 99, the usual cap, and
// passes it anyway. Also hosts the Konami code and the mute switch.
// ------------------------------------------------

const BASE_LEVEL = 99;
const LEVELS_PER_PAGE = 4;

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

function scrollProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
}

export function Hud() {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState<{ from: number; to: number } | null>(null);
  const [lives, setLives] = useState(false);
  const [muted, setMutedState] = useState(false);
  const best = useRef(BASE_LEVEL);
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const level = BASE_LEVEL + Math.floor(progress * LEVELS_PER_PAGE + 1e-6);

  useEffect(() => {
    const onScroll = () => {
      const p = scrollProgress();
      setProgress(p);
      if (scrollY > 40) unlock("scroll");
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  // A new personal best is a level up. Scrolling back up never costs levels
  // you've already earned; he doesn't lose progress, and neither do you.
  useEffect(() => {
    if (level <= best.current) return;
    setFlash({ from: best.current, to: level });
    best.current = level;
    playLevelUp();
    unlock("levelup");
    // The timer lives outside the effect: scrolling back up re-runs this
    // effect, and that must not cancel a flash already on screen.
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1400);
  }, [level]);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  useEffect(() => {
    let keys: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys = [...keys, key].slice(-KONAMI.length);
      if (keys.join() !== KONAMI.join()) return;
      keys = [];
      unlockAudio();
      playExtraLives();
      setLives(true);
      unlock("konami");
      setTimeout(() => setLives(false), 3200);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const shownLevel = Math.max(level, best.current);

  return (
    <>
      <div className="rpg-hud fixed bottom-3 left-3 z-[70] font-pixel text-[8px] leading-none text-white">
        <div className="flex items-center justify-between gap-3">
          <span>
            LV <span className="text-[#ffd84a]">{shownLevel}</span>
          </span>
          <button
            type="button"
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            onClick={() => {
              unlockAudio();
              setMuted(!isMuted());
              setMutedState(isMuted());
            }}
            className="cursor-pointer text-[#c8cbff] hover:text-white"
          >
            {muted ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
          </button>
        </div>
        <div className="rpg-hud-hp mt-2 flex items-center gap-2">
          <span className="w-5 text-[#ff8a8a]">HP</span>
          <span className="rpg-meter">
            <span className="rpg-meter-fill bg-[#ff5d5d]" style={{ width: "100%" }} />
          </span>
          <span className="text-[#c8cbff]">∞</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="w-5 text-[#8ad7ff]">EXP</span>
          <span className="rpg-meter" role="progressbar" aria-label="Experience" aria-valuenow={Math.round(progress * 100)}>
            <span
              className="rpg-meter-fill bg-[#9fe870]"
              style={{ width: `${((progress * LEVELS_PER_PAGE) % 1 || (progress === 1 ? 1 : 0)) * 100}%` }}
            />
          </span>
          <span className="text-[#c8cbff] tabular-nums">{Math.round(progress * 100)}%</span>
        </div>
      </div>

      <AnimatePresence>
        {flash !== null && (
          <motion.div
            key={flash.to}
            aria-live="polite"
            className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rounded-md bg-[#05061a]/80 px-8 py-6 text-center shadow-[0_0_40px_20px_rgba(5,6,26,0.6)]"
              initial={reduce ? false : { scale: 0.4, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
            >
              <p className="rpg-levelup font-pixel text-[26px] md:text-[40px]">LEVEL UP!</p>
              <p className="mt-3 font-pixel text-[10px] text-white [text-shadow:2px_2px_0_#000]">
                LV {flash.from} → LV {flash.to}
              </p>
              <p className="mt-2 font-pixel text-[8px] text-[#ffd84a] [text-shadow:2px_2px_0_#000]">
                {flash.from === BASE_LEVEL ? "THE CAP WAS MORE OF A SUGGESTION" : "INT +99 · WIS +99 · CLARITY +∞"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lives && (
          <motion.div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 z-[92] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!reduce &&
              Array.from({ length: 30 }, (_, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="absolute font-pixel text-[11px] text-[#9fe870] [text-shadow:2px_2px_0_#000]"
                  style={{ left: `${(i * 37) % 100}%`, top: "100%" }}
                  animate={{ top: "-10%" }}
                  transition={{ duration: 2.4, delay: (i % 10) * 0.08, ease: "easeOut" }}
                >
                  1UP
                </motion.span>
              ))}
            <div className="rpg-window relative text-center">
              <p className="font-pixel text-[16px] text-[#9fe870] md:text-[22px]">30 EXTRA LIVES</p>
              <p className="mt-3 font-vt text-[20px] text-[#c8cbff]">He didn&rsquo;t need them.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
