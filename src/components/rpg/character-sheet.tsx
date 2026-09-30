"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { ANDREW, PixelSprite } from "./pixel-sprite";
import { NpcDialog } from "./npc-dialog";
import { playSelect, unlockAudio } from "./sound";
import { unlock } from "./achievements";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/character-sheet.tsx
//
// The status screen. Stats count up the first time they scroll into view,
// the way a save file loads. Click the sprite and he talks.
// ------------------------------------------------

type Stat = { name: string; value: number; final?: string; note?: string };

const STATS: Stat[] = [
  { name: "INT", value: 99 },
  { name: "WIS", value: 99 },
  { name: "CHA", value: 99, note: "doublet bonus" },
  { name: "DEX", value: 99, note: "ships fast" },
  { name: "CLARITY", value: 9999, final: "∞" },
  { name: "LUCK", value: 0, final: "not needed" },
];

const EQUIPMENT = [
  ["HEAD", "Round Glasses of Foresight"],
  ["BODY", "Florentine Doublet (+99 CHA)"],
  ["WEAPON", "The Right Question"],
  ["OFFHAND", "A Bayesian Prior (updates live)"],
  ["ACCESSORY", "A Handwritten Letter"],
] as const;

const SKILLS = [
  ["Piano", 99],
  ["Philosophy", 99],
  ["Art", 99],
  ["History", 99],
  ["Biology", 99],
] as const;

function StatValue({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [text, setText] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const land = () => setText(stat.final ?? String(stat.value));
    if (reduce) return land();
    const controls = animate(0, stat.value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setText(String(Math.round(v))),
      onComplete: land,
    });
    return () => controls.stop();
  }, [inView, reduce, stat]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}

function Meter({ label, color, value, max }: { label: string; color: string; value: string; max: string }) {
  return (
    <div className="flex items-center gap-2 font-pixel text-[8px]">
      <span className="w-6 text-[#c8cbff]">{label}</span>
      <span className="rpg-meter flex-1">
        <span className="rpg-meter-fill rpg-meter-shine" style={{ width: "100%", background: color }} />
      </span>
      <span className="w-[88px] text-right text-white tabular-nums">
        {value}/{max}
      </span>
    </div>
  );
}

export function CharacterSheet() {
  const [talking, setTalking] = useState(false);
  const close = useCallback(() => setTalking(false), []);

  return (
    <section className="rpg-window mt-8" aria-labelledby="status-title">
      <h2 id="status-title" className="rpg-window-title">
        STATUS
      </h2>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:w-[132px] sm:shrink-0">
          <button
            type="button"
            onClick={() => {
              unlockAudio();
              playSelect();
              setTalking(true);
              unlock("sprite");
            }}
            aria-label="Talk to Andrew"
            className="group cursor-pointer border-2 border-white/80 bg-[#0b1147] p-3 hover:border-[#ffd84a]"
          >
            <PixelSprite sprite={ANDREW} className="rpg-bob h-28 w-auto" />
          </button>
          <span className="font-pixel text-[7px] leading-[1.6] text-[#9fa6ff] text-center">
            CLICK TO TALK
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-pixel text-[13px] text-white">ANDREW</p>
            <p className="font-pixel text-[9px] text-[#ffd84a]">LV 99</p>
          </div>
          <p className="font-vt text-[19px] leading-[1.15] text-[#c8cbff]">
            Class: <span className="text-white">Artful Hacker</span> · Title:{" "}
            <span className="text-white">Defender of Human Agency</span>
          </p>

          <div className="space-y-2">
            <Meter label="HP" color="#ff5d5d" value="9999" max="9999" />
            <Meter label="MP" color="#5db8ff" value="∞" max="∞" />
            <Meter label="EXP" color="#9fe870" value="MAX" max="MAX" />
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.name} className="flex items-baseline justify-between gap-2 border-b border-white/15 pb-1">
                <dt className="font-pixel text-[8px] text-[#9fa6ff]">{s.name}</dt>
                <dd
                  className={`font-pixel text-white ${s.final && s.final !== "∞" ? "text-[7px] text-right" : "text-[10px]"}`}
                >
                  <StatValue stat={s} />
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-pixel text-[8px] text-[#ffd84a]">EQUIPMENT</p>
              <ul className="mt-2 space-y-1 font-vt text-[18px] leading-[1.1]">
                {EQUIPMENT.map(([slot, item]) => (
                  <li key={slot} className="flex gap-2">
                    <span className="w-[74px] shrink-0 text-[#9fa6ff]">{slot}</span>
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-pixel text-[8px] text-[#ffd84a]">SKILLS</p>
              <ul className="mt-2 space-y-1 font-vt text-[18px] leading-[1.1]">
                {SKILLS.map(([skill, lv]) => (
                  <li key={skill} className="flex items-baseline justify-between gap-2">
                    <span className="text-white">{skill}</span>
                    <span className="text-[#9fe870]">
                      ★★★★★ <span className="text-[#c8cbff]">Lv {lv}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <NpcDialog open={talking} onClose={close} />
    </section>
  );
}
