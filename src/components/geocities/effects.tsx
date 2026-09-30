"use client";

import { useEffect, useState } from "react";
import { Y2K_EVENT } from "./hit-counter";

// ------------------------------------------------
// projects/dremnik/src/components/geocities/effects.tsx
//
// - A rainbow star trail follows the cursor.
// - Konami code → a blue screen of too much greatness.
// - Typing "andrew" → the page does a barrel roll.
// - Typing "y2k" → the hit counter rolls over, and Andrew fixes it.
// - Leaving the tab → the title announces new mail.
// - View source → a greeting in the console.
// ------------------------------------------------

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];
const AWAY_TITLE = "(1) New message from Andrew!";
const TRAIL_EVERY_MS = 30;
const TRAIL_MAX = 45;

let greeted = false;

function greet() {
  if (greeted) return;
  greeted = true;
  console.log(
    "%c~*~ Welcome 2 Andrew's Cyber Palace ~*~",
    "font: 700 18px 'Comic Sans MS', cursive; color: #ff00ff; background: #000033; padding: 4px 8px;",
  );
  console.log(
    "%cView Source is how we all learned HTML. Take whatever you like, just sign the guestbook.\n\n↑ ↑ ↓ ↓ ← → ← → B A",
    "font: 12px 'Courier New', monospace; color: #00aa00;",
  );
}

function typingInField(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}

function useStarTrail() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!matchMedia("(pointer: fine)").matches) return;
    let last = 0;
    let live = 0;
    let hue = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < TRAIL_EVERY_MS || live >= TRAIL_MAX) return;
      last = now;
      live++;
      hue = (hue + 24) % 360;
      const s = document.createElement("span");
      s.className = "geo-star";
      s.textContent = "★";
      s.setAttribute("aria-hidden", "true");
      s.style.left = `${e.clientX}px`;
      s.style.top = `${e.clientY}px`;
      s.style.color = `hsl(${hue} 100% 60%)`;
      s.addEventListener(
        "animationend",
        () => {
          s.remove();
          live--;
        },
        { once: true },
      );
      document.body.appendChild(s);
    };
    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  }, []);
}

function BlueScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    // Wait a beat so the key that summoned it doesn't also dismiss it.
    const t = setTimeout(() => {
      addEventListener("keydown", onDone, { once: true });
      addEventListener("pointerdown", onDone, { once: true });
    }, 400);
    return () => {
      clearTimeout(t);
      removeEventListener("keydown", onDone);
      removeEventListener("pointerdown", onDone);
    };
  }, [onDone]);

  return (
    <div role="alertdialog" aria-label="Fatal exception" className="geo-bsod">
      <div className="mx-auto max-w-[640px]">
        <p className="mb-6 text-center">
          <span className="bg-[#aaaaaa] px-2 text-[#0000aa]">ANDREW OS</span>
        </p>
        <p>
          A fatal exception 0xMAGNIFICENT has occurred at 0028:C0FFEE. The current visitor has been
          overwhelmed by accomplishments.
        </p>
        <p className="mt-4">* Press any key to continue being impressed.</p>
        <p>* Press CTRL+ALT+DEL to restart your career. You will lose any unsaved ambitions.</p>
        <p className="mt-6 text-center">
          Press any key to continue <span className="geo-blink">_</span>
        </p>
      </div>
    </div>
  );
}

export function Effects() {
  const [bsod, setBsod] = useState(false);

  useStarTrail();
  useEffect(greet, []);

  useEffect(() => {
    let keys: string[] = [];
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if (typingInField(e)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      keys = [...keys, key].slice(-KONAMI.length);
      if (keys.join() === KONAMI.join()) {
        keys = [];
        setBsod(true);
        return;
      }

      if (key.length !== 1) return;
      typed = (typed + key).slice(-10);
      if (typed.endsWith("andrew")) {
        typed = "";
        const main = document.querySelector("main");
        main?.classList.remove("geo-barrel-roll");
        void main?.offsetWidth; // restart the animation if it's mid-roll
        main?.classList.add("geo-barrel-roll");
      } else if (typed.endsWith("y2k")) {
        typed = "";
        dispatchEvent(new Event(Y2K_EVENT));
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

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

  return bsod ? <BlueScreen onDone={() => setBsod(false)} /> : null;
}
