"use client";

import { cn } from "@/lib/utils";
import { COMPANY, EXCHANGE, STATS, TICKER } from "./copy";
import { IPO_PRICE, money, pct, useMarket } from "./market";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/quote.tsx
//
// The big number. Every tick flashes: green when it rises, amber when it
// "consolidates". The arrow only points one way on this exchange.
// ------------------------------------------------

export function Quote() {
  const m = useMarket();
  const up = m.price >= m.prev;
  const change = m.price - IPO_PRICE;

  return (
    <div className="space-y-2">
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-bold text-[#ffb000]">{TICKER}</span>
        <span className="text-[#e8e8e8]">{COMPANY}</span>
        <span className="text-[#9a8a5c]">· {EXCHANGE}</span>
      </p>

      <p
        key={m.tick}
        className={cn(
          "drem-price inline-block px-1 tabular-nums",
          m.tick > 0 && (up ? "drem-flash-up" : "drem-flash-flat"),
        )}
      >
        {money(m.price)}
      </p>

      <p className="text-[#33d17a] tabular-nums">
        ▲ {money(change)} ({pct((change / IPO_PRICE) * 100)}) SINCE IPO
      </p>
      <p className="text-[#9a8a5c] tabular-nums">
        VOL {m.volume.toLocaleString("en-US")} · HALTS {m.halts} (ALL RESOLVED IN OUR FAVOR)
      </p>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 border-t border-[#3a2f10] pt-2">
        {STATS.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-[#9a8a5c]">{label}</dt>
            <dd className="text-[#e8e8e8]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
