"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { playFanfare, unlockAudio } from "./sound";
import { ANDREW, PixelSprite } from "./pixel-sprite";
import { unlock } from "./achievements";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/title-screen.tsx
//
// Once per browser session: the title screen. PRESS START is also the user
// gesture that wakes the sound chip, so the fanfare can play.
// ------------------------------------------------

const SEEN = "rpg:title-seen";

function remember() {
  try {
    sessionStorage.setItem(SEEN, "1");
  } catch {}
}

export function TitleScreen() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN)) setOpen(false);
    } catch {}
  }, []);

  // No scrolling the world behind the title screen.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // A focused button handles its own Enter/Space; don't start twice.
      if ((e.target as HTMLElement | null)?.tagName === "BUTTON") return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        start();
      } else if (e.key === "Escape") {
        remember();
        setOpen(false);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
    // start only reads stable setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function start() {
    if (flash) return;
    remember();
    unlockAudio();
    playFanfare();
    setFlash(true);
    setTimeout(
      () => {
        setOpen(false);
        unlock("start");
      },
      reduce ? 0 : 650,
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Andrew Quest title screen"
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.5 }}
          className="rpg-title fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 overflow-hidden px-6 text-center"
        >
          <div aria-hidden="true" className="rpg-title-stars" />

          <motion.div
            initial={reduce ? false : { y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="relative"
          >
            <p className="font-pixel text-[9px] tracking-[0.3em] text-[#9fa6ff]">
              THE LEGEND OF THE ARTFUL HACKER
            </p>
            <p className="rpg-logo mt-4 font-pixel text-[30px] leading-[1.25] md:text-[56px]">
              ANDREW
              <br />
              QUEST
            </p>
          </motion.div>

          <PixelSprite sprite={ANDREW} className="rpg-bob relative h-24 w-auto md:h-28" />

          <button
            type="button"
            onClick={start}
            autoFocus
            className="relative cursor-pointer font-pixel text-[13px] text-white md:text-[16px]"
          >
            <span className={flash ? "rpg-blink-fast" : "rpg-blink"}>▶ PRESS START</span>
          </button>

          <div className="relative space-y-2 font-pixel text-[8px] leading-[1.8] text-[#7f86d6]">
            <p>
              <button
                type="button"
                onClick={() => {
                  remember();
                  setOpen(false);
                }}
                className="cursor-pointer underline underline-offset-4 hover:text-white"
              >
                CONTINUE WITHOUT SOUND
              </button>
            </p>
            <p>© 1487–∞ ANDREW JONES. NO LICENSE REQUIRED.</p>
          </div>

          {flash && <div aria-hidden="true" className="rpg-screen-flash" />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
