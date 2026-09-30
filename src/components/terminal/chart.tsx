"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MAX_CANDLES, money, useMarket, type Candle, type Notice } from "./market";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/chart.tsx
//
// Candlesticks, drawn in SVG at the container's real pixel width so the
// axis labels stay legible on a phone. Red candles exist only briefly,
// between the halt and the correction.
// ------------------------------------------------

const AXIS = 64;
const PAD = 14;

const COLOR = {
  up: "#33d17a",
  down: "#ff4d4d",
  corrected: "#ffb000",
  grid: "#3a2f10",
  label: "#9a8a5c",
};

function useWidth(fallback: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function CandleMark({
  c,
  x,
  body,
  y,
}: {
  c: Candle;
  x: number;
  body: number;
  y: (v: number) => number;
}) {
  const up = c.close >= c.open;
  const color = c.red ? COLOR.down : up ? COLOR.up : COLOR.down;
  const top = y(Math.max(c.open, c.close));
  const height = Math.max(1, Math.abs(y(c.open) - y(c.close)));
  return (
    <g className={c.red ? "drem-blink" : undefined}>
      <line x1={x} x2={x} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth={1} />
      <rect
        x={x - body / 2}
        y={top}
        width={body}
        height={height}
        fill={color}
        stroke={c.corrected ? COLOR.corrected : color}
        strokeWidth={c.corrected ? 1.5 : 0}
      >
        {c.corrected && <title>Corrected by the investigation</title>}
      </rect>
    </g>
  );
}

const NOTICE_STYLE: Record<Notice["kind"], string> = {
  halt: "bg-[#b3001b] text-white drem-blink",
  fixed: "bg-[#ffb000] text-black",
  moon: "bg-[#33d17a] text-black",
  breaker: "bg-[#ffb000] text-black drem-blink",
};

export function Chart() {
  const m = useMarket();
  const [ref, width] = useWidth(640);
  const W = Math.max(280, width);
  const H = Math.round(Math.min(300, Math.max(190, W * 0.42)));
  const plot = W - AXIS;
  const slot = plot / MAX_CANDLES;

  const candles = (m.forming ? [...m.candles, m.forming] : m.candles).slice(-MAX_CANDLES);
  const hi = Math.max(...candles.map((c) => c.high));
  const lo = Math.min(...candles.map((c) => c.low));
  const span = hi - lo || 1;
  const y = (v: number) => PAD + ((hi - v) / span) * (H - PAD * 2);
  const x0 = plot - candles.length * slot;
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => lo + span * f);
  const last = Math.min(H - 8, Math.max(8, y(m.price)));

  return (
    <div ref={ref} className="relative">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block max-w-full"
        role="img"
        aria-label={`$DREM price chart. Last ${money(m.price)}. It goes up.`}
      >
        {grid.map((v) => (
          <g key={v}>
            <line x1={0} x2={plot} y1={y(v)} y2={y(v)} stroke={COLOR.grid} strokeDasharray="2 4" />
            <text x={plot + 6} y={y(v) + 4} fill={COLOR.label} fontSize={11}>
              {money(v)}
            </text>
          </g>
        ))}
        {candles.map((c, i) => (
          <CandleMark key={i} c={c} x={x0 + i * slot + slot / 2} body={Math.max(2, slot * 0.62)} y={y} />
        ))}
        <line x1={0} x2={plot} y1={last} y2={last} stroke="#ffb000" strokeDasharray="4 3" />
        <rect x={plot + 2} y={last - 9} width={AXIS - 4} height={18} fill="#ffb000" />
        <text x={plot + 6} y={last + 4} fill="#000" fontSize={11} fontWeight={700}>
          {money(m.price)}
        </text>
      </svg>

      {m.status === "pre" && (
        <p className="absolute left-2 top-2 bg-black/70 px-1.5 text-[#9a8a5c]">
          PRIVATE ROUNDS · MARKET OPENS AT THE BELL
        </p>
      )}
      {m.notice && (
        <p
          role="status"
          className={cn(
            // Bottom, not top: in an uptrend the newest candles live up there.
            "absolute inset-x-2 bottom-2 px-2 py-1 text-center font-bold tracking-wide",
            NOTICE_STYLE[m.notice.kind],
          )}
        >
          {m.notice.text}
        </p>
      )}
    </div>
  );
}
