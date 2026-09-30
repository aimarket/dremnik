"use client";

import Link from "next/link";
import { COMPANY, TICKER } from "./copy";
import { money, useMarket } from "./market";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/research-banner.tsx
//
// The blog is equity research now. A terminal strip on top of every note,
// carrying the live price if you've come from the trading floor, and a
// disclosure at the bottom, as regulations (his) require.
// ------------------------------------------------

export function ResearchBanner({ note }: { note?: string }) {
  const m = useMarket();
  const live = m.status !== "pre";

  return (
    <div className="bg-black font-plex text-[8.5pt] leading-[1.5] text-[#e8e8e8]">
      <div className="mx-auto flex max-w-[var(--content-width)] flex-wrap items-center justify-between gap-x-4 gap-y-0.5 px-6 py-1.5 md:px-10">
        <p>
          <span className="font-bold text-[#ffb000]">{COMPANY}</span>{" "}
          <span className="text-[#9a8a5c]">EQUITY RESEARCH{note ? ` · ${note}` : ""}</span>
        </p>
        <Link href="/" className="tabular-nums hover:underline">
          <span className="font-bold text-[#ffb000]">{TICKER}</span>{" "}
          {live ? (
            <span className="text-[#33d17a]">{money(m.price)} ▲</span>
          ) : (
            <span className="text-[#9a8a5c]">PRE-MARKET · RING THE BELL &lt;GO&gt;</span>
          )}
        </Link>
      </div>
      <p className="border-t border-[#3a2f10] bg-[#0b0b0b] py-1 text-center text-[#33d17a]">
        RATING: STRONG BUY · PRICE TARGET: ∞ · ANALYST: THE AUTHOR, WHO IS ALSO THE STOCK
      </p>
    </div>
  );
}

export function ResearchDisclosure() {
  return (
    <p className="mt-16 border border-dashed border-rule p-3 font-plex text-[8pt] leading-[1.6] text-muted">
      DISCLOSURE: The author of this note owns 100% of {TICKER} and is {TICKER}. No sell-side
      analysts were harmed; there is no sell side. Ratings are issued by a committee of one, which
      voted unanimously.
    </p>
  );
}
