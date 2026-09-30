// ------------------------------------------------
// projects/dremnik/src/components/magnificent/ticker.tsx
//
// The only market that matters. Pure CSS marquee: the list renders twice and
// slides left by half its width, so the loop never shows a seam.
// ------------------------------------------------

type Quote = { sym: string; move: string; news: string };

const QUOTES: Quote[] = [
  { sym: "$DREM", move: "▲ ∞%", news: "analysts run out of digits" },
  { sym: "$QUILL", move: "▲ 3,927★", news: "stenographers unionize in protest" },
  { sym: "$PARROT", move: "▲ 1,311★", news: "subscription economy reports minor tremor" },
  { sym: "$HRMS", move: "▲ 90.8%", news: "Claude up from 19.8%, sends thank-you note" },
  { sym: "$KERNL", move: "▲ 3.0", news: "Tony Stark requests early access" },
  { sym: "$USPS", move: "▲ 412%", news: "local man resumes writing letters" },
  { sym: "$SLACK", move: "▼ 0.1%", news: "he doesn't get how anyone uses it, built them a CLI anyway out of mercy" },
  { sym: "$AMDAHL", move: "▼ 100%", news: "law amended: clarity now scales (for one man)" },
  { sym: "$CHOPIN", move: "▲ 6★", news: "revises review from five stars to six" },
  { sym: "$H2O", move: "▲ 1", news: "Bruce Lee confirms he has become water" },
  { sym: "$AGI", move: "— 0.0%", news: "still preparing, reportedly nervous" },
  { sym: "$MEDICI", move: "▲ 1,487%", news: "bank to be renamed in his honor (pending)" },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0">
      {QUOTES.map((q) => {
        const down = q.move.startsWith("▼");
        return (
          <li key={q.sym} className="px-5 py-1.5">
            <span className="font-medium text-[#fff4c2]">{q.sym}</span>{" "}
            <span className={down ? "text-[#ff7a6b]" : "text-[#6ee08a]"}>{q.move}</span>{" "}
            <span className="text-[#e8d49a]/80">{q.news}</span>
            <span className="pl-5 text-[#c9a23f]/60" aria-hidden="true">⚜</span>
          </li>
        );
      })}
    </ul>
  );
}

export function Ticker() {
  return (
    <div
      role="marquee"
      aria-label="Magnificence market ticker"
      className="mag-ticker group overflow-hidden whitespace-nowrap border-b border-[#c9a23f]/40 bg-[#14100a] font-mono text-[8pt]"
    >
      <div className="mag-marquee inline-flex group-hover:[animation-play-state:paused]">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
