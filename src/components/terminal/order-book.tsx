"use client";

import { money, useMarket } from "./market";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/order-book.tsx
//
// Depth of market. Bids only. The ask side has been empty since the IPO.
// Sizes are a hash of the tick, so the book reshuffles every tick without
// Math.random() breaking hydration.
// ------------------------------------------------

const BIDDERS = [
  "MEDICI & SONS",
  "FLORENTINE CAP",
  "3,927 STARGAZERS",
  "AGI (EARLY)",
  "A BELIEVER",
  "THE FRONTIER",
  "LETTER-WRITERS CO-OP",
  "INVISIBLE HAND",
];

// Integer hash, not Math.sin: identical on every JS engine, so the server
// and Safari always agree on the book.
function size(tick: number, row: number) {
  let h = (Math.imul(tick, 374761393) + Math.imul(row + 1, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return 100 + ((h >>> 0) % 9000);
}

export function OrderBook({ onBuy }: { onBuy: () => void }) {
  const m = useMarket();

  return (
    <div className="space-y-2.5">
      <table className="w-full tabular-nums">
        <thead>
          <tr className="text-left text-[#9a8a5c]">
            <th className="font-normal">BIDDER</th>
            <th className="text-right font-normal">SIZE</th>
            <th className="text-right font-normal">BID</th>
          </tr>
        </thead>
        <tbody>
          {BIDDERS.map((who, i) => (
            <tr key={who}>
              <td className="truncate pr-2 text-[#e8e8e8]">{who}</td>
              <td className="text-right text-[#e8e8e8]">{size(m.tick, i).toLocaleString("en-US")}</td>
              <td className="text-right text-[#33d17a]">{money(m.price * (1 - 0.0007 * (i + 1)))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border border-dashed border-[#3a2f10] p-2 text-center">
        <p className="text-[#9a8a5c]">ASK</p>
        <p className="font-bold text-[#ff4d4d]">NO SELLERS FOUND</p>
        <p className="text-[#9a8a5c]">(we checked. twice.)</p>
      </div>

      <button type="button" onClick={onBuy} className="drem-button w-full">
        BUY $DREM
      </button>
    </div>
  );
}
