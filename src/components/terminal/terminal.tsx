"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";
import type { SideProject } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { BuyModal } from "./buy-modal";
import { Chart } from "./chart";
import { CommandLine, type LogLine } from "./command-line";
import { COMPANY, DESCRIPTION, EXCHANGE, HELP, SUBSIDIARY_NOTES, TICKER } from "./copy";
import { Filings, type FilingTab } from "./filings";
import { money, openMarket, pauseMarket, toTheMoon, useMarket, type Market } from "./market";
import { NewsWire } from "./news-wire";
import { OpeningBell } from "./opening-bell";
import { OrderBook } from "./order-book";
import { Panel } from "./panel";
import { Quote } from "./quote";
import { playAlarm, playOpeningBell, playRegister, playReject } from "./sound";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/terminal.tsx
//
// dremnik.com, now publicly traded. Lays out the panels, owns the command
// line, and listens for the two secret ways to send $DREM to the moon:
// the Konami code, or typing "tothemoon" anywhere.
// ------------------------------------------------

export type ResearchPost = { slug: string; title: string; date: string };

export type InvestorRelations = { email: string; x: string; github: string; linkedin: string };

const RUNG = "drem:bell-rung";
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
const MOON_WORD = "tothemoon";

const STATUS: Record<Market["status"], { label: string; className: string }> = {
  pre: { label: "○ PRE-MARKET", className: "text-[#9a8a5c]" },
  open: { label: "● MARKET OPEN", className: "text-[#33d17a]" },
  halted: { label: "■ HALTED (UNDER INVESTIGATION)", className: "text-[#ff4d4d] drem-blink" },
  breaker: { label: "▲ LIMIT UP", className: "text-black bg-[#ffb000] px-1 drem-blink" },
};

function useClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function typingInField(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  });
}

function Breaker() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-[#ffb000]/10"
    >
      <Rocket className="drem-rocket absolute size-16 text-[#ffb000]" />
      <div className="drem-hazard px-6 py-4 text-center text-black">
        <p className="text-[22pt] font-bold leading-none md:text-[34pt]">LIMIT UP</p>
        <p className="mt-2 font-bold">CIRCUIT BREAKER TRIPPED · TRADING PAUSED FOR THE MARKET&apos;S OWN SAFETY</p>
      </div>
    </div>
  );
}

export function Terminal({
  posts,
  subsidiaries,
  ir,
}: {
  posts: ResearchPost[];
  subsidiaries: SideProject[];
  ir: InvestorRelations;
}) {
  const m = useMarket();
  const clock = useClock();
  const [rung, setRung] = useState(false);
  const [buying, setBuying] = useState(false);
  const [tab, setTab] = useState<FilingTab>("s1");
  const [log, setLog] = useState<LogLine[]>([
    { id: 0, text: `${COMPANY} (${TICKER}) · ${EXCHANGE}`, tone: "dim" },
    { id: 1, text: "TYPE HELP AND PRESS ENTER. OR JUST WATCH IT GO UP.", tone: "dim" },
  ]);
  const nextLine = useRef(2);
  const input = useRef<HTMLInputElement>(null);

  // Same session, same market: don't make him ring the bell twice.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(RUNG)) setRung(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!rung) return;
    openMarket();
    return pauseMarket;
  }, [rung]);

  const ring = () => {
    try {
      sessionStorage.setItem(RUNG, "1");
    } catch {}
    playOpeningBell();
    setRung(true);
  };

  const print = useCallback((lines: string | string[], tone?: LogLine["tone"]) => {
    const list = Array.isArray(lines) ? lines : [lines];
    setLog((l) => [...l, ...list.map((text) => ({ id: nextLine.current++, text, tone }))].slice(-120));
  }, []);

  const moon = useCallback(() => {
    if (toTheMoon()) print("🚀 TO THE MOON. PLEASE KEEP HANDS AND FEET INSIDE THE CHART.", "ok");
    else print("THE MOON WILL HAVE TO WAIT: TRADING IS NOT OPEN.", "err");
  }, [print]);

  const buy = useCallback(() => {
    playRegister();
    setBuying(true);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toUpperCase().replace(/\s+/g, " ");
      if (!cmd) return;
      print(`DREM> ${cmd}`, "cmd");

      if (cmd.startsWith("DREM")) {
        print("LOADING ANDREW JONES HOLDINGS… YOU'RE ALREADY HERE. THAT'S HOW GOOD IT IS.", "ok");
        return;
      }
      switch (cmd) {
        case "HELP":
        case "?":
          print(HELP);
          break;
        case "NEWS":
          scrollTo("drem-news");
          print("NEWS WIRE ↑ · ALL OF IT IS GOOD.", "ok");
          break;
        case "BUY":
          print("ROUTING ORDER… REJECTED. SEE TICKET.", "err");
          buy();
          break;
        case "SELL":
          playReject();
          print(
            ["ERROR 451: SELLING $DREM IS NOT SUPPORTED.", "NOBODY HAS EVER WANTED TO. WE ASSUMED IT WAS A TYPO."],
            "err",
          );
          break;
        case "SHORT":
          playReject();
          print("MARGIN CALL ISSUED TO YOU, PREEMPTIVELY.", "err");
          break;
        case "S1":
        case "S-1":
          setTab("s1");
          scrollTo("drem-filings");
          print("FORM S-1 OPENED. READ THE RISK FACTORS. IT WON'T TAKE LONG.", "ok");
          break;
        case "CALL":
          setTab("call");
          scrollTo("drem-filings");
          print("EARNINGS CALL TRANSCRIPT OPENED. NO DOUBTS WERE RAISED.", "ok");
          break;
        case "SUBS":
          print(
            subsidiaries.map((s) => {
              const n = SUBSIDIARY_NOTES[s.title];
              return `  ${(n?.sym ?? s.title.toUpperCase()).padEnd(6)}${s.title.padEnd(8)}STRONG BUY  ${n?.note ?? s.desc}`;
            }),
          );
          break;
        case "RESEARCH":
          scrollTo("drem-research");
          print(posts.map((p) => `  ${formatDate(p.date)}  ${p.title.toUpperCase()}  · STRONG BUY`));
          break;
        case "IR":
          print([`  EMAIL     ${ir.email}`, `  X         ${ir.x}`, `  GITHUB    ${ir.github}`, `  LINKEDIN  ${ir.linkedin}`]);
          break;
        case "CLEAR":
          setLog([]);
          break;
        case "WHOAMI":
          print("A BELIEVER. LIKE EVERYONE ELSE HERE.", "ok");
          break;
        case "SUDO BUY":
          print("EVEN ROOT CAN'T BUY. SOLD OUT.", "err");
          break;
        case "TOTHEMOON":
        case "TO THE MOON":
          moon();
          break;
        default:
          print(`UNKNOWN COMMAND: ${cmd}. DID YOU MEAN BUY?`, "err");
      }
    },
    [buy, ir, moon, posts, print, subsidiaries],
  );

  // "/" focuses the prompt; Konami or "tothemoon" anywhere sends it up.
  useEffect(() => {
    let keys: string[] = [];
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if (typingInField(e)) return;
      if (e.key === "/") {
        e.preventDefault();
        input.current?.focus();
        input.current?.scrollIntoView({ block: "nearest" });
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys = [...keys, key].slice(-KONAMI.length);
      typed = (typed + (key.length === 1 ? key : "")).slice(-MOON_WORD.length);
      if (keys.join() === KONAMI.join() || typed === MOON_WORD) {
        keys = [];
        typed = "";
        moon();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [moon]);

  // The tab title is a ticker too.
  useEffect(() => {
    if (!rung) return;
    const before = document.title;
    return () => {
      document.title = before;
    };
  }, [rung]);

  useEffect(() => {
    if (rung) document.title = `${TICKER} ${money(m.price)} ▲ · ${COMPANY}`;
  }, [rung, m.price]);

  useEffect(() => {
    if (m.status === "breaker") playAlarm();
  }, [m.status]);

  const status = STATUS[m.status];
  const keys: [string, string][] = [
    ["HELP", "HELP"],
    ["NEWS", "NEWS"],
    ["S-1", "S1"],
    ["CALL", "CALL"],
    ["SUBS", "SUBS"],
    ["BUY", "BUY"],
    ["SELL", "SELL"],
  ];

  return (
    <div className="drem-terminal relative min-h-svh overflow-x-clip bg-black font-plex text-[10pt] leading-[1.45] text-[#e8e8e8] md:text-[9pt]">
      <div aria-hidden="true" className="drem-scanlines" />

      <div className="relative mx-auto max-w-[1280px] space-y-2 p-2 md:p-3">
        <header className="drem-panel flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2.5 py-1.5">
          <p className="font-bold">
            <span className="text-[#ffb000]">▌{COMPANY}</span>{" "}
            <span className="text-[#9a8a5c]">
              {TICKER} · {EXCHANGE}
            </span>
          </p>
          <p className={cn("font-bold", status.className)}>{status.label}</p>
          <p className="text-[#9a8a5c] tabular-nums">
            <Link href="/blog" className="text-[#ffb000] hover:underline">
              RESEARCH &lt;GO&gt;
            </Link>
            {"  ·  "}
            {clock ?? "--:--:--"} ET-ish
          </p>
        </header>

        <nav aria-label="Function keys" className="flex flex-wrap gap-1.5">
          {keys.map(([label, cmd], i) => (
            <button key={cmd} type="button" onClick={() => run(cmd)} className="drem-fkey">
              <span className="text-[#9a8a5c]">F{i + 1}</span> {label}
            </button>
          ))}
          <button type="button" onClick={() => input.current?.focus()} className="drem-fkey">
            <span className="text-[#9a8a5c]">/</span> CMD
          </button>
        </nav>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-12">
          <Panel code="QUOT" title="QUOTE" className="lg:col-span-4">
            <Quote />
          </Panel>
          <Panel code="GP" title={`INTRADAY · ${TICKER} · IT GOES UP`} className="lg:col-span-8">
            <Chart />
          </Panel>

          <Panel code="NEWS" title="NEWS WIRE" id="drem-news" className="lg:col-span-5">
            <NewsWire live={rung} />
          </Panel>
          <Panel code="MBO" title="ORDER BOOK" className="lg:col-span-3">
            <OrderBook onBuy={buy} />
          </Panel>
          <div className="grid min-w-0 gap-2 lg:col-span-4">
            <Panel code="DES" title="DESCRIPTION">
              <div className="space-y-2">
                {DESCRIPTION.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Panel>
            <Panel code="IR" title="INVESTOR RELATIONS">
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                {(
                  [
                    ["EMAIL", ir.email, `mailto:${ir.email}`],
                    ["X", "@dremnik", ir.x],
                    ["GITHUB", "dremnik", ir.github],
                    ["LINKEDIN", "andrew jones", ir.linkedin],
                  ] as const
                ).map(([label, text, href]) => (
                  <div key={label} className="contents">
                    <dt className="text-[#9a8a5c]">{label}</dt>
                    <dd className="min-w-0 truncate">
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#ffb000] hover:underline">
                        {text}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>

          <Panel code="CF" title="FILINGS" id="drem-filings" className="lg:col-span-7">
            <Filings tab={tab} onTab={setTab} />
          </Panel>
          <div className="grid min-w-0 content-start gap-2 lg:col-span-5">
            <Panel code="SUBS" title="WHOLLY OWNED SUBSIDIARIES">
              <ul className="space-y-1.5">
                {subsidiaries.map((s) => {
                  const note = SUBSIDIARY_NOTES[s.title];
                  const href = s.github ?? s.url;
                  return (
                    <li key={s.title} className="grid grid-cols-[3.5rem_1fr_auto] gap-x-2">
                      <span className="font-bold text-[#ffb000]">{note?.sym ?? s.title.toUpperCase()}</span>
                      <span className="min-w-0">
                        {href ? (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {s.title}
                          </a>
                        ) : (
                          s.title
                        )}{" "}
                        <span className="text-[#9a8a5c]">— {s.desc}</span>
                        {note && <span className="block text-[#33d17a]">{note.note}</span>}
                      </span>
                      <span className="text-[#33d17a]">BUY</span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
            <Panel code="RES" title="EQUITY RESEARCH" id="drem-research">
              <ul className="space-y-1.5">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="group block">
                      <span className="text-[#9a8a5c] tabular-nums">{formatDate(p.date)}</span>{" "}
                      <span className="group-hover:underline">{p.title.toUpperCase()}</span>
                      <span className="block text-[#33d17a]">RATING: STRONG BUY · PRICE TARGET: ∞</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel code="CMD" title="COMMAND LINE" className="lg:col-span-12">
            <CommandLine log={log} onCommand={run} inputRef={input} />
          </Panel>
        </div>

        <footer className="pb-4 pt-2 text-center text-[#5c5236]">
          <p>
            DISCLOSURE: THE ANALYST OWNS 100% OF {TICKER} AND IS {TICKER}. PAST PERFORMANCE IS
            INDICATIVE OF FUTURE RESULTS. THIS IS NOT FINANCIAL ADVICE; IT IS A FRIEND BEING
            EXTREMELY PROUD OF YOU.
          </p>
        </footer>
      </div>

      <OpeningBell open={rung} onRing={ring} />
      {buying && <BuyModal onClose={() => setBuying(false)} />}
      {m.status === "breaker" && <Breaker />}
    </div>
  );
}
