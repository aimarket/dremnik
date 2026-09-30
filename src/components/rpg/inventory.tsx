"use client";

import { useState } from "react";
import { Bird, Feather, Hammer, Lock, ScrollText, SquareTerminal } from "lucide-react";
import { playSelect, unlockAudio } from "./sound";
import { unlock } from "./achievements";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/inventory.tsx
//
// His side projects, as loot. Hover, focus or tap a slot to read the item
// card. The card sits below the grid rather than floating, so it never
// runs off the edge of a phone.
// ------------------------------------------------

type Rarity = "legendary" | "epic" | "rare" | "unique" | "locked";

const RARITY: Record<Rarity, { label: string; color: string }> = {
  legendary: { label: "LEGENDARY", color: "#ff9d2e" },
  epic: { label: "EPIC", color: "#c77dff" },
  rare: { label: "RARE", color: "#5db8ff" },
  unique: { label: "UNIQUE", color: "#e8c547" },
  locked: { label: "???", color: "#6b6f9e" },
};

type Item = {
  name: string;
  rarity: Rarity;
  icon: typeof Feather;
  type: string;
  stats: string[];
  flavor: string;
  href?: string;
};

const ITEMS: Item[] = [
  {
    name: "quill",
    rarity: "legendary",
    icon: Feather,
    type: "Ultra-minimalist macOS recording + transcription",
    stats: ["+3,927 ★", "+283 forks", "Stenographer morale −100%"],
    flavor: "Forged in the fires of macOS. Transcribes even the unspoken.",
    href: "https://github.com/digimata/quill",
  },
  {
    name: "parrot",
    rarity: "legendary",
    icon: Bird,
    type: "Ultra-minimalist macOS dictation",
    stats: ["+1,311 ★", "Frees subscribers on equip", "Real parrots: jealous"],
    flavor: "Repeats you perfectly. Charges you nothing. A rare combination.",
    href: "https://github.com/digimata/parrot",
  },
  {
    name: "paper",
    rarity: "epic",
    icon: ScrollText,
    type: "A quiet, native markdown editor for macOS",
    stats: ["Focus +∞", "Distractions −∞", "Nothing other than the text"],
    flavor: "So quiet you can hear yourself think. Most people have never heard that.",
    href: "https://papel.sh",
  },
  {
    name: "kdb",
    rarity: "rare",
    icon: SquareTerminal,
    type: "A CLI for knowledge and work",
    stats: ["INT +20", "Knowledge: indexed", "Mouse: optional"],
    flavor: "The Library of Alexandria, but it runs in a terminal and it's fireproof.",
    href: "https://github.com/digimata/kdb",
  },
  {
    name: "Build Editor",
    rarity: "unique",
    icon: Hammer,
    type: "From esonut, his game build planner",
    stats: ["Min-max any build", "Mostly used on himself", "Result: see STATUS"],
    flavor: "He designed a tool for optimizing builds. Then he became one.",
  },
  {
    name: "EMPTY SLOT",
    rarity: "locked",
    icon: Lock,
    type: "Reserved",
    stats: ["Reserved for AGI"],
    flavor: "It knows. It's getting ready.",
  },
];

export function Inventory() {
  const [selected, setSelected] = useState(0);
  const item = ITEMS[selected];
  const r = RARITY[item.rarity];

  const choose = (i: number) => {
    if (i === selected) return;
    setSelected(i);
    playSelect();
    if (ITEMS[i].rarity === "legendary") unlock("appraiser");
  };

  return (
    <section className="rpg-window mt-10" aria-labelledby="inventory-title">
      <h2 id="inventory-title" className="rpg-window-title">
        INVENTORY
      </h2>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {ITEMS.map((it, i) => {
          const Icon = it.icon;
          const color = RARITY[it.rarity].color;
          return (
            <li key={it.name}>
              <button
                type="button"
                onMouseEnter={() => choose(i)}
                onFocus={() => choose(i)}
                onClick={() => {
                  unlockAudio();
                  choose(i);
                }}
                aria-pressed={i === selected}
                aria-label={`${it.name}, ${RARITY[it.rarity].label}`}
                className="rpg-slot"
                style={{ "--rarity": color } as React.CSSProperties}
                data-selected={i === selected || undefined}
              >
                <Icon className="size-6" style={{ color }} />
                <span className="mt-1.5 block truncate font-pixel text-[7px] text-white">{it.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="rpg-item-card mt-4" style={{ "--rarity": r.color } as React.CSSProperties} aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="font-pixel text-[11px]" style={{ color: r.color }}>
            {item.name}
          </p>
          <p className="font-pixel text-[8px]" style={{ color: r.color }}>
            {r.label}
          </p>
        </div>
        <p className="mt-1 font-vt text-[18px] leading-[1.1] text-[#c8cbff]">{item.type}</p>
        <ul className="mt-2 font-vt text-[18px] leading-[1.15] text-[#9fe870]">
          {item.stats.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 font-vt text-[17px] italic leading-[1.15] text-[#ffd84a]">&ldquo;{item.flavor}&rdquo;</p>
        {item.href && (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-pixel text-[8px] text-white underline underline-offset-4 hover:text-[#ffd84a]"
          >
            EQUIP ({item.href.replace(/^https?:\/\//, "")}) →
          </a>
        )}
      </div>
    </section>
  );
}
