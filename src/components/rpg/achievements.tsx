"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Trophy } from "lucide-react";
import { playAchievement } from "./sound";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/achievements.tsx
//
// Achievements, unlocked from anywhere with unlock("id"). Each one pops once
// per session as a toast; a slow trickle of gold points for doing things
// like "scrolling" and "being in his presence".
// ------------------------------------------------

const EVENT = "rpg:achievement";
const STORE = "rpg:achievements";
const SHOW_MS = 4200;

export const ACHIEVEMENTS = {
  start: { title: "Press Start", desc: "The legend begins. Again. It never really stopped.", points: 10 },
  scroll: { title: "Adventurer", desc: "You scrolled. Bold.", points: 10 },
  sprite: { title: "An Audience with the Hero", desc: "He spoke to you. Cherish it.", points: 25 },
  run: { title: "Tactical Non-Retreat", desc: "Tried to run. He does not run.", points: 15 },
  boss: { title: "Bottleneck Breaker", desc: "Defeated your first boss. He had help: none.", points: 50 },
  flawless: { title: "Flawless", desc: "Defeated every boss without taking a single point of damage.", points: 100 },
  levelup: { title: "Level Cap Removed", desc: "Passed level 99. Nobody told him there was a cap.", points: 50 },
  konami: { title: "30 Extra Lives", desc: "He didn't need them. He took them anyway, for you.", points: 30 },
  appraiser: { title: "Appraiser", desc: "Inspected a legendary item.", points: 10 },
  scholar: { title: "Scholar", desc: "Finished a scroll of lore, all the way to the end.", points: 25 },
  pause: { title: "Game Paused", desc: "You left the game. It kept leveling without you.", points: 5 },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

export function unlock(id: AchievementId) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
}

function loadSeen(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(STORE) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveSeen(seen: Set<string>) {
  try {
    sessionStorage.setItem(STORE, JSON.stringify([...seen]));
  } catch {
    // Private mode: achievements repeat. He'd say that's fine; greatness bears repeating.
  }
}

type Toast = { key: number; id: AchievementId };

export function AchievementToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const seen = loadSeen();
    let key = 0;
    const onUnlock = (e: Event) => {
      const id = (e as CustomEvent<AchievementId>).detail;
      if (!(id in ACHIEVEMENTS) || seen.has(id)) return;
      seen.add(id);
      saveSeen(seen);
      playAchievement();
      const toast = { key: key++, id };
      setToasts((t) => [...t, toast]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.key !== toast.key)), SHOW_MS);
    };
    addEventListener(EVENT, onUnlock);
    return () => removeEventListener(EVENT, onUnlock);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-3 z-[95] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map(({ key, id }) => {
          const a = ACHIEVEMENTS[id];
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              className="rpg-toast"
            >
              <span className="rpg-toast-medal" aria-hidden="true">
                <Trophy className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-pixel text-[8px] tracking-[0.12em] text-[#ffd84a]">
                  ACHIEVEMENT UNLOCKED
                </span>
                <span className="block truncate text-[13px] font-medium text-white">
                  {a.title} <span className="font-pixel text-[9px] text-[#9fe870]">+{a.points}G</span>
                </span>
                <span className="block text-[11px] leading-snug text-[#c8cbff]">{a.desc}</span>
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
