"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { COMPANY, EXCHANGE, TICKER } from "./copy";
import { IPO_PRICE, money } from "./market";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/opening-bell.tsx
//
// IPO day. The market doesn't open until someone rings the bell, and the
// click that rings it is the gesture that lets the browser play it.
// Afterwards: a ticker-tape parade.
// ------------------------------------------------

const STRIPS = 70;
const PARADE_MS = 4200;

function Parade() {
  // Fixed layout per strip, so the parade renders the same on every run.
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[75] overflow-hidden">
      {Array.from({ length: STRIPS }, (_, i) => (
        <span
          key={i}
          className="drem-strip"
          style={
            {
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 14) * 110}ms`,
              animationDuration: `${2200 + ((i * 53) % 1600)}ms`,
              background: ["#ffb000", "#33d17a", "#e8e8e8"][i % 3],
              "--spin": `${((i * 71) % 720) - 360}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function OpeningBell({ open, onRing }: { open: boolean; onRing: () => void }) {
  const [parade, setParade] = useState(false);

  useEffect(() => {
    if (!parade) return;
    const t = setTimeout(() => setParade(false), PARADE_MS);
    return () => clearTimeout(t);
  }, [parade]);

  if (open) return parade ? <Parade /> : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drem-bell-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
    >
      <div className="drem-panel w-full max-w-lg text-center">
        <p className="drem-panel-title justify-center">
          <span className="drem-code">IPO</span> {EXCHANGE} · LISTING DAY
        </p>
        <div className="space-y-3 p-5">
          <p className="text-[#9a8a5c]">PRE-MARKET · PRICED LAST NIGHT · OVERSUBSCRIBED 4,700,000×</p>
          <p id="drem-bell-title" className="text-[20pt] font-bold leading-tight text-[#ffb000]">
            {COMPANY}
          </p>
          <p className="text-[#e8e8e8]">
            {TICKER} · IPO PRICE {money(IPO_PRICE)} · SHARES OFFERED: 1 · DEMAND: YES
          </p>
          <button
            type="button"
            autoFocus
            onClick={() => {
              setParade(true);
              onRing();
            }}
            className="drem-button drem-bell-button mx-auto inline-flex items-center gap-2"
          >
            <BellRing aria-hidden="true" className="size-4" />
            RING THE OPENING BELL
          </button>
          <p className="text-[#9a8a5c]">sound on, for the full ceremony</p>
        </div>
      </div>
    </div>
  );
}
