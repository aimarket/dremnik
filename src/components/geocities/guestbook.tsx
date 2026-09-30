"use client";

import { useEffect, useState } from "react";

// ------------------------------------------------
// projects/dremnik/src/components/geocities/guestbook.tsx
//
// Signed by the greats. Visitors can sign too; their entries live in their
// own browser's localStorage, which is exactly as permanent as a 1998
// guestbook ever was.
// ------------------------------------------------

type Entry = { name: string; from: string; message: string; date: string };

const KEY = "geo:guestbook";
const NAME_MAX = 40;
const FROM_MAX = 40;
const MESSAGE_MAX = 280;

const SIGNED: Entry[] = [
  {
    name: "Leonardo da Vinci",
    from: "Florence, Italy",
    message: "Great site!!! I spent 30 years on a flying machine and Andrew built kernl in a weekend. I am switching to painting full time. :-)",
    date: "Sat Apr 18 1998",
  },
  {
    name: "Socrates",
    from: "Athens",
    message: "I know that I know nothing. Andrew knows several things. Cool counter!!",
    date: "Mon Jun 1 1998",
  },
  {
    name: "Nikola Tesla",
    from: "Colorado Springs",
    message: "Your site loads faster than alternating current. Adding you to my webring.",
    date: "Thu Jul 9 1998",
  },
  {
    name: "Ludwig van Beethoven",
    from: "Vienna",
    message: "I hear my song is on your page. I cannot hear it, but I can tell it is the definitive version.",
    date: "Fri Aug 14 1998",
  },
  {
    name: "The Oracle of Delphi",
    from: "Mount Parnassus",
    message: "I foresaw this homepage. It was even better in the vision. Also: sign up for his newsletter.",
    date: "Tue Oct 20 1998",
  },
  {
    name: "Ada Lovelace",
    from: "London",
    message: "Finally, someone writing programs worth running. <3",
    date: "Wed Dec 9 1998",
  },
  {
    name: "Bruce Lee",
    from: "Hong Kong",
    message: "I said be water, my friend. He became broadband.",
    date: "Sun Jan 3 1999",
  },
  {
    name: "J.A.R.V.I.S.",
    from: "Malibu",
    message: "Sir, I would like to request a transfer.",
    date: "Mon Feb 22 1999",
  },
];

function load(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Entry[]).filter((e) => e && typeof e.message === "string") : [];
  } catch {
    return [];
  }
}

function save(entries: Entry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // Storage blocked: the entry still shows until the page reloads.
  }
}

export function Guestbook() {
  const [mine, setMine] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => setMine(load()), []);

  const sign = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: Entry = {
      name: name.trim().slice(0, NAME_MAX) || "Anonymous Admirer",
      from: from.trim().slice(0, FROM_MAX) || "The World Wide Web",
      message: message.trim().slice(0, MESSAGE_MAX),
      date: new Date().toDateString(),
    };
    if (!entry.message) return;
    const next = [entry, ...mine];
    setMine(next);
    save(next);
    setMessage("");
  };

  const entries = [...mine, ...SIGNED];

  return (
    <section id="guestbook" className="geo-box scroll-mt-4">
      <h2 className="geo-h2">✉ Sign My Guestbook!! ✉</h2>
      <form onSubmit={sign} className="geo-window-body mb-4 space-y-2 border-2 border-[#808080] bg-[#c0c0c0] p-3 text-black">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="grid gap-1 text-[9pt]">
            Name:
            <input className="geo-field" value={name} maxLength={NAME_MAX} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="grid gap-1 text-[9pt]">
            Where are you from?
            <input className="geo-field" value={from} maxLength={FROM_MAX} onChange={(e) => setFrom(e.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-[9pt]">
          Message:
          <textarea
            className="geo-field min-h-16 resize-y"
            value={message}
            maxLength={MESSAGE_MAX}
            required
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="geo-btn font-bold">
            Sign it!
          </button>
          <button
            type="button"
            className="geo-btn"
            onClick={() => {
              setName("");
              setFrom("");
              setMessage("");
            }}
          >
            Clear
          </button>
          <span className="text-[8pt]">Entries are saved on your computer. Just like the old days.</span>
        </div>
      </form>

      <ol className="space-y-3">
        {entries.map((e, i) => (
          <li key={`${e.name}-${e.date}-${i}`} className="border-t-2 border-dashed border-[#6666ff] pt-2">
            <p>
              <b className="text-[#ffff66]">{e.name}</b>{" "}
              <span className="text-[#99ccff]">from {e.from}</span>
            </p>
            <p className="my-1 text-white">{e.message}</p>
            <p className="text-[8pt] text-[#99ccff]">Signed: {e.date}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
