"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AMDAHL, ANDREW, BADGE, BOTTLENECK, PixelSprite, type Sprite } from "./pixel-sprite";
import { Typewriter } from "./typewriter";
import { playHit, playSelect, playVictory, unlockAudio } from "./sound";
import { unlock } from "./achievements";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/battle.tsx
//
// A turn-based boss fight. Four commands, and every one of them wins,
// because the hero is him. Three bosses in a row, then NEW GAME+.
//
// Keyboard: arrow keys move through the menu, Enter or Space picks.
// ------------------------------------------------

type Boss = {
  name: string;
  sprite: Sprite;
  hp: number;
  intro: string;
  attacks: string[];
  loot: string;
};

const BOSSES: Boss[] = [
  {
    name: "THE BOTTLENECK",
    sprite: BOTTLENECK,
    hp: 120,
    intro: "THE BOTTLENECK blocks the path! Everything must go through it. Slowly.",
    attacks: [
      "THE BOTTLENECK narrows! ...Andrew simply routes around it. 0 damage.",
      "THE BOTTLENECK queues a request! Andrew already shipped. MISS!",
    ],
    loot: "Clarity Shard",
  },
  {
    name: "AMDAHL'S LAW",
    sprite: AMDAHL,
    hp: 150,
    intro: "AMDAHL'S LAW descends, citing its serial fraction! Speedup is capped. Allegedly.",
    attacks: [
      "AMDAHL'S LAW invokes 1/(1-p)! Andrew parallelized himself. MISS!",
      "AMDAHL'S LAW recites a proof! Andrew asks a better question. The proof reconsiders.",
    ],
    loot: "Infinite Speedup (unsanctioned)",
  },
  {
    name: "THE UNREAD BADGE",
    sprite: BADGE,
    hp: 180,
    intro: "THE UNREAD BADGE appears! 99+ notifications, all urgent, none important.",
    attacks: [
      "THE UNREAD BADGE pings! Andrew has notifications off. 0 damage.",
      "THE UNREAD BADGE opens a thread! Andrew replies with a letter. It takes a week. It's beautiful.",
    ],
    loot: "Inbox Zero (Mythic)",
  },
];

type Command = "FIGHT" | "MAGIC" | "ITEM" | "RUN";
const COMMANDS: Command[] = ["FIGHT", "MAGIC", "ITEM", "RUN"];

const MOVES: Record<Command, { text: string; dmg: [number, number] }[]> = {
  FIGHT: [
    { text: "Andrew attacks with a SHIPPED PULL REQUEST!", dmg: [34, 46] },
    { text: "Andrew strikes with the flat of a well-named function!", dmg: [30, 42] },
  ],
  MAGIC: [
    { text: "Andrew casts ASK A BETTER QUESTION. It's super effective!", dmg: [52, 64] },
    { text: "Andrew casts BAYESIAN UPDATE. The enemy's priors collapse.", dmg: [46, 58] },
    { text: "Andrew casts BE WATER. He flows around every defense.", dmg: [44, 56] },
  ],
  ITEM: [
    { text: "Andrew uses QUILL (3,927★). The enemy is transcribed into oblivion.", dmg: [40, 52] },
    { text: "Andrew uses PAPER. Nothing other than the text remains.", dmg: [38, 50] },
    { text: "Andrew uses a HANDWRITTEN LETTER. The enemy is deeply moved.", dmg: [42, 54] },
  ],
  RUN: [{ text: "Andrew does not run. The frontier runs from him. The enemy, embarrassed, takes damage.", dmg: [26, 30] }],
};

type Phase = "intro" | "menu" | "hero" | "enemy" | "victory" | "cleared";

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
const roll = ([lo, hi]: [number, number]) => lo + Math.floor(Math.random() * (hi - lo + 1));

export function BossBattle() {
  const reduce = useReducedMotion();
  const [bossIndex, setBossIndex] = useState(0);
  const [hp, setHp] = useState(BOSSES[0].hp);
  const [phase, setPhase] = useState<Phase>("intro");
  const [text, setText] = useState(BOSSES[0].intro);
  const [typed, setTyped] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [hit, setHit] = useState<{ key: number; dmg: number } | null>(null);
  const [turns, setTurns] = useState(0);
  const hits = useRef(0);
  const menu = useRef<(HTMLButtonElement | null)[]>([]);
  // The true HP, updated the instant a move lands. The HP bar trails it on a
  // delay for drama, so the turn logic must never read the bar's state.
  const hpNow = useRef(BOSSES[0].hp);
  const engaged = useRef(false);

  const boss = BOSSES[bossIndex];

  const say = (line: string, next: Phase) => {
    setTyped(false);
    setText(line);
    setPhase(next);
  };

  // Once a line finishes typing, some phases move on by themselves.
  useEffect(() => {
    if (!typed) return;
    const wait = reduce ? 500 : 900;
    if (phase === "intro") {
      const t = setTimeout(() => say("What will Andrew do?", "menu"), wait);
      return () => clearTimeout(t);
    }
    if (phase === "hero") {
      const t = setTimeout(() => {
        if (hpNow.current <= 0) {
          playVictory();
          const bonus = 1000 + turns * 999;
          say(
            `${boss.name} was defeated! Andrew gained ${bonus.toLocaleString("en-US")} EXP. Obtained: ${boss.loot}.`,
            "victory",
          );
          unlock("boss");
          if (bossIndex === BOSSES.length - 1) unlock("flawless");
        } else {
          say(pick(boss.attacks), "enemy");
        }
      }, wait);
      return () => clearTimeout(t);
    }
    if (phase === "enemy") {
      const t = setTimeout(() => say("What will Andrew do?", "menu"), wait);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, phase]);

  // Commands are disabled mid-turn, which drops keyboard focus; hand it back
  // when the menu returns, but only to someone who was already fighting.
  useEffect(() => {
    if (phase === "menu" && engaged.current) menu.current[cursor]?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const act = (cmd: Command) => {
    if (phase !== "menu") return;
    engaged.current = true;
    unlockAudio();
    playSelect();
    const move = pick(MOVES[cmd]);
    const dmg = roll(move.dmg);
    const left = Math.max(0, hpNow.current - dmg);
    hpNow.current = left;
    if (cmd === "RUN") unlock("run");
    setTimeout(() => {
      playHit();
      setHit({ key: hits.current++, dmg });
      setHp(left);
    }, reduce ? 0 : 450);
    setTurns((n) => n + 1);
    say(`${move.text} ${dmg} damage.`, "hero");
  };

  const nextBoss = () => {
    unlockAudio();
    playSelect();
    const next = bossIndex + 1;
    if (next >= BOSSES.length) {
      say("Every boss has fallen. The frontier is quiet. For now. Andrew took 0 damage.", "cleared");
      return;
    }
    setBossIndex(next);
    setHp(BOSSES[next].hp);
    hpNow.current = BOSSES[next].hp;
    setTurns(0);
    setHit(null);
    say(BOSSES[next].intro, "intro");
  };

  const newGamePlus = () => {
    unlockAudio();
    playSelect();
    setBossIndex(0);
    setHp(BOSSES[0].hp);
    hpNow.current = BOSSES[0].hp;
    setTurns(0);
    setHit(null);
    say("NEW GAME+. The bosses return, visibly less confident.", "intro");
  };

  // Arrow keys move through the 2×2 command grid.
  const onMenuKey = (e: React.KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 2, ArrowUp: -2 };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const next = (cursor + moves[e.key] + COMMANDS.length) % COMMANDS.length;
    setCursor(next);
    menu.current[next]?.focus();
  };

  const hpPct = (hp / boss.hp) * 100;

  return (
    <section className="rpg-window mt-10" aria-labelledby="battle-title">
      <h2 id="battle-title" className="rpg-window-title">
        BOSS BATTLE
      </h2>

      <div className="rpg-arena relative grid grid-cols-2 items-end gap-4 overflow-hidden rounded-sm px-4 pb-3 pt-10">
        {/* Enemy, top-right */}
        <div className="col-start-2 row-start-1 flex flex-col items-center gap-2">
          <div className="w-full max-w-[180px]">
            <div className="flex items-baseline justify-between gap-2 font-pixel text-[7px] leading-[1.5] text-white md:text-[8px]">
              <span>{boss.name}</span>
              <span className="tabular-nums text-[#c8cbff]">
                {hp}/{boss.hp}
              </span>
            </div>
            <div className="rpg-meter mt-1.5 w-full">
              <span
                className="rpg-meter-fill"
                style={{
                  width: `${hpPct}%`,
                  background: hpPct > 50 ? "#9fe870" : hpPct > 20 ? "#ffd84a" : "#ff5d5d",
                  transition: "width .6s ease, background .3s",
                }}
              />
            </div>
          </div>
          <div className="relative">
            <AnimatePresence mode="popLayout">
              {hp > 0 ? (
                <motion.div
                  key={`${bossIndex}-${hit?.key ?? "idle"}`}
                  initial={hit && !reduce ? { x: 0 } : false}
                  animate={hit && !reduce ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
                  transition={{ duration: 0.4 }}
                  className={hit ? "rpg-flash" : undefined}
                >
                  <PixelSprite sprite={boss.sprite} className="rpg-bob h-24 w-auto md:h-28" title={boss.name} />
                </motion.div>
              ) : (
                <motion.div
                  key={`defeated-${bossIndex}`}
                  initial={{ opacity: 1, scaleY: 1 }}
                  animate={{ opacity: 0, scaleY: 0.1 }}
                  transition={{ duration: reduce ? 0 : 0.8 }}
                  className="origin-bottom"
                >
                  <PixelSprite sprite={boss.sprite} className="h-24 w-auto md:h-28" />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {hit && (
                <motion.span
                  key={hit.key}
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 -translate-x-1/2 font-pixel text-[14px] text-white [text-shadow:2px_2px_0_#c0392b]"
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: -36, opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  {hit.dmg}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hero, bottom-left */}
        <div className="col-start-1 row-start-1 flex flex-col items-center gap-2 self-end">
          <PixelSprite sprite={ANDREW} className="h-20 w-auto md:h-24 [transform:scaleX(-1)]" title="Andrew" />
          <div className="w-full max-w-[160px] font-pixel text-[7px] text-white md:text-[8px]">
            <div className="flex justify-between">
              <span>ANDREW</span>
              <span className="text-[#c8cbff]">9999/9999</span>
            </div>
            <div className="rpg-meter mt-1.5 w-full">
              <span className="rpg-meter-fill" style={{ width: "100%", background: "#9fe870" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_190px]">
        <div className="rpg-inset min-h-[92px]" aria-live="polite">
          <Typewriter
            key={text}
            text={text}
            onDone={() => setTyped(true)}
            className="font-vt text-[20px] leading-[1.15] text-white"
          />
        </div>

        <div className="rpg-inset">
          {phase === "victory" ? (
            <button type="button" onClick={nextBoss} className="rpg-command w-full" autoFocus>
              ▶ {bossIndex === BOSSES.length - 1 ? "CONTINUE" : "NEXT BOSS"}
            </button>
          ) : phase === "cleared" ? (
            <button type="button" onClick={newGamePlus} className="rpg-command w-full" autoFocus>
              ▶ NEW GAME+
            </button>
          ) : (
            <div role="menu" aria-label="Battle commands" className="grid grid-cols-2 gap-1" onKeyDown={onMenuKey}>
              {COMMANDS.map((cmd, i) => (
                <button
                  key={cmd}
                  ref={(el) => {
                    menu.current[i] = el;
                  }}
                  type="button"
                  role="menuitem"
                  disabled={phase !== "menu"}
                  onClick={() => act(cmd)}
                  onFocus={() => setCursor(i)}
                  onMouseEnter={() => setCursor(i)}
                  className="rpg-command"
                  data-active={phase === "menu" && cursor === i ? true : undefined}
                >
                  <span className="rpg-cursor" aria-hidden="true">
                    ▶
                  </span>
                  {cmd}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
