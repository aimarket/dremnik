"use client";

import { useEffect } from "react";
import { money, useMarket } from "./market";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/buy-modal.tsx
//
// The order ticket. Every order is accepted, acknowledged, and rejected,
// in that order.
// ------------------------------------------------

export function BuyModal({ onClose }: { onClose: () => void }) {
  const m = useMarket();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drem-buy-title"
        onClick={(e) => e.stopPropagation()}
        className="drem-panel w-full max-w-md"
      >
        <p className="drem-panel-title">
          <span className="drem-code">ORDR</span> ORDER TICKET · $DREM
        </p>
        <div className="space-y-3 p-4">
          <p className="text-[#9a8a5c] tabular-nums">
            SIDE: BUY · QTY: ANY · LIMIT: {money(m.price)} · TIF: FOREVER
          </p>
          <p id="drem-buy-title" className="drem-blink text-[16pt] font-bold text-[#ff4d4d]">
            ORDER REJECTED: SOLD OUT
          </p>
          <p className="text-[#e8e8e8]">Every share is held by believers.</p>
          <p className="text-[#e8e8e8]">
            You have been added to the waitlist, behind the Medici, 3,927 GitHub stargazers, and
            AGI (who asked to remain anonymous, then told everyone).
          </p>
          <p className="text-[#9a8a5c]">Estimated wait: until clarity scales.</p>
          <button type="button" autoFocus onClick={onClose} className="drem-button w-full">
            I UNDERSTAND. I BELIEVE.
          </button>
        </div>
      </div>
    </div>
  );
}
