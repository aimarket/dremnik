"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ANDREW, PixelSprite } from "./pixel-sprite";
import { Typewriter } from "./typewriter";
import { playSelect } from "./sound";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/npc-dialog.tsx
//
// The classic bottom-of-the-screen text box, portrait on the left. Click,
// Enter or Space advances; Escape closes. His lines, in his words where
// we have them.
// ------------------------------------------------

export const LINES = [
  "Oh. A traveler. Welcome to the frontier. I live here.",
  "A question is its answer with noise.",
  "AI will happily give you answers. It won't tell you you're asking the wrong question. I will.",
  "idk how anyone uses slack honestly.",
  "Be water, my friend. I read that somewhere. Then I became it.",
  "Write me a letter sometime. A real one.",
  "You can't scale clarity. I've tried. It scaled a little.",
];

export function NpcDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    button.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const advance = () => {
    playSelect();
    setTyped(false);
    if (line + 1 >= LINES.length) {
      setLine(0);
      onClose();
    } else {
      setLine(line + 1);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Andrew speaks"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="fixed inset-x-3 bottom-3 z-[85] mx-auto max-w-[640px]"
        >
          <button
            ref={button}
            type="button"
            onClick={advance}
            aria-label={line + 1 >= LINES.length ? "Close" : "Next line"}
            className="rpg-window flex w-full cursor-pointer items-start gap-4 text-left"
          >
            <span className="shrink-0 border-2 border-white/80 bg-[#0b1147] p-1.5">
              <PixelSprite sprite={ANDREW} className="h-14 w-auto" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-pixel text-[9px] text-[#ffd84a]">ANDREW</span>
              <Typewriter
                key={line}
                text={LINES[line]}
                onDone={() => setTyped(true)}
                className="mt-2 block font-vt text-[21px] leading-[1.15] text-white"
              />
            </span>
            <span
              aria-hidden="true"
              className={`self-end font-pixel text-[10px] text-white ${typed ? "rpg-blink" : "opacity-0"}`}
            >
              ▼
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
