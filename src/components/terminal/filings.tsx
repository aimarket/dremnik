"use client";

import { cn } from "@/lib/utils";
import { EARNINGS_CALL, S1 } from "./copy";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/filings.tsx
//
// Two documents every investor should read: the prospectus, and the
// transcript of the most one-sided earnings call on record.
// ------------------------------------------------

export type FilingTab = "s1" | "call";

const TABS: [FilingTab, string][] = [
  ["s1", "FORM S-1 (EXCERPT)"],
  ["call", "Q3 EARNINGS CALL"],
];

function Prospectus() {
  return (
    <dl className="space-y-2.5">
      {S1.map(([heading, body]) => (
        <div key={heading}>
          <dt className="font-bold text-[#ffb000]">{heading}</dt>
          <dd className="text-[#e8e8e8]">{body}</dd>
        </div>
      ))}
    </dl>
  );
}

function Transcript() {
  return (
    <ol className="space-y-2.5">
      {EARNINGS_CALL.map((line, i) => (
        <li key={i}>
          <p>
            <span className={line.who === "ANDREW JONES" ? "font-bold text-[#33d17a]" : "font-bold text-[#ffb000]"}>
              {line.who}
            </span>
            {line.role && <span className="text-[#9a8a5c]"> — {line.role}</span>}
          </p>
          <p className="text-[#e8e8e8]">{line.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function Filings({ tab, onTab }: { tab: FilingTab; onTab: (t: FilingTab) => void }) {
  return (
    <div>
      <div role="tablist" aria-label="Filings" className="mb-2.5 flex flex-wrap gap-1.5">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTab(id)}
            className={cn(
              "cursor-pointer border px-2 py-0.5",
              tab === id
                ? "border-[#ffb000] bg-[#ffb000] text-black"
                : "border-[#3a2f10] text-[#9a8a5c] hover:text-[#ffb000]",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="max-h-[340px] overflow-y-auto pr-1">
        {tab === "s1" ? <Prospectus /> : <Transcript />}
      </div>
    </div>
  );
}
