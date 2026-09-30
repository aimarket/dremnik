// ------------------------------------------------
// projects/dremnik/src/components/terminal/market.ts
//
// The $DREM market: a random walk with a strong upward drift, aggregated
// into candles. It lives at module level so the price survives navigating
// to a research note and back, and components read it through
// useSyncExternalStore.
//
// House rules:
//   - A candle that closes red halts trading, opens an investigation, and
//     is then corrected (turned right side up).
//   - Going up too fast trips the circuit breaker. This is the only way
//     trading ever stops for a good reason.
// ------------------------------------------------

import { useSyncExternalStore } from "react";

export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  red?: boolean; // closed down, pending investigation
  corrected?: boolean; // closed down, investigated, fixed
};

export type Notice = { kind: "halt" | "fixed" | "moon" | "breaker"; text: string };

export type Market = {
  status: "pre" | "open" | "halted" | "breaker";
  price: number;
  prev: number; // price one tick ago, for the flash direction
  tick: number;
  candles: Candle[]; // closed candles
  forming: Candle | null; // the candle still being drawn
  volume: number;
  halts: number;
  notice: Notice | null;
};

export const IPO_PRICE = 100;
export const MAX_CANDLES = 48;

const TICK_MS = 450;
const TICKS_PER_CANDLE = 7;
// ~+2% per candle with ~1.5% noise: roughly 1 candle in 13 closes red, so a
// halt shows up about every 40 seconds.
const DRIFT = 0.003;
const VOLATILITY = 0.0055;
const MOON_DRIFT = 0.055;
const MOON_MS = 4200;
const BREAKER_MS = 5200;
const HALT_MS = 2600;
const NOTICE_MS = 3400;

// Deterministic, so the server and the browser draw the same pre-IPO chart.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The private rounds: 36 candles of steady, suspiciously green growth that
// land exactly on the IPO price.
function privateRounds(): Candle[] {
  const rand = mulberry32(1487);
  const out: Candle[] = [];
  let p = 38;
  for (let i = 0; i < 36; i++) {
    const open = p;
    const close = open * (1.012 + rand() * 0.035);
    out.push({
      open,
      close,
      high: close * (1 + rand() * 0.012),
      low: open * (1 - rand() * 0.012),
    });
    p = close;
  }
  const scale = IPO_PRICE / p;
  return out.map((c) => ({
    open: c.open * scale,
    high: c.high * scale,
    low: c.low * scale,
    close: c.close * scale,
  }));
}

const INITIAL: Market = {
  status: "pre",
  price: IPO_PRICE,
  prev: IPO_PRICE,
  tick: 0,
  candles: privateRounds(),
  forming: null,
  volume: 0,
  halts: 0,
  notice: null,
};

let state = INITIAL;
let timer: ReturnType<typeof setInterval> | null = null;
let ticksInCandle = 0;
let moonUntil = 0;
let noticeTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function set(next: Partial<Market>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function notify(notice: Notice) {
  if (noticeTimer) clearTimeout(noticeTimer);
  set({ notice });
  noticeTimer = setTimeout(() => set({ notice: null }), NOTICE_MS);
}

function gaussian() {
  // Box–Muller.
  const u = 1 - Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

function trim(candles: Candle[]) {
  return candles.length > MAX_CANDLES ? candles.slice(-MAX_CANDLES) : candles;
}

function halt(candle: Candle) {
  set({
    status: "halted",
    halts: state.halts + 1,
    candles: trim([...state.candles, { ...candle, red: true }]),
    forming: null,
  });
  notify({ kind: "halt", text: "TRADING HALTED — PRICE WENT DOWN. INVESTIGATION OPENED." });

  setTimeout(() => {
    // Turn it right side up. The investigation found a rounding error in reality.
    const fixed: Candle = {
      open: candle.close,
      close: candle.open,
      high: candle.high,
      low: candle.low,
      corrected: true,
    };
    set({
      status: "open",
      price: fixed.close,
      prev: fixed.open,
      candles: [...state.candles.slice(0, -1), fixed],
    });
    notify({ kind: "fixed", text: "INVESTIGATION CLOSED: CANDLE WAS UPSIDE DOWN. CORRECTED." });
  }, HALT_MS);
}

function tick() {
  if (state.status !== "open") return;

  const mooning = Date.now() < moonUntil;
  const drift = mooning ? MOON_DRIFT : DRIFT;
  const price = state.price * (1 + drift + gaussian() * VOLATILITY);

  const forming: Candle = state.forming
    ? {
        ...state.forming,
        high: Math.max(state.forming.high, price),
        low: Math.min(state.forming.low, price),
        close: price,
      }
    : {
        open: state.price,
        high: Math.max(state.price, price),
        low: Math.min(state.price, price),
        close: price,
      };

  ticksInCandle++;
  const volume = state.volume + Math.round(40 + Math.random() * 400) * (mooning ? 20 : 1);

  if (ticksInCandle < TICKS_PER_CANDLE) {
    set({ price, prev: state.price, tick: state.tick + 1, forming, volume });
    return;
  }

  ticksInCandle = 0;
  if (forming.close < forming.open && !mooning) {
    set({ price, prev: state.price, tick: state.tick + 1, volume });
    halt(forming);
    return;
  }
  set({
    price,
    prev: state.price,
    tick: state.tick + 1,
    candles: trim([...state.candles, forming]),
    forming: null,
    volume,
  });
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot() {
  return state;
}

export function getServerSnapshot() {
  return INITIAL;
}

export function useMarket() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Ring the bell. Safe to call twice.
export function openMarket() {
  if (state.status === "pre") set({ status: "open" });
  timer ??= setInterval(tick, TICK_MS);
}

// Stop the clock when nobody is watching; the price waits where it was.
export function pauseMarket() {
  if (timer) clearInterval(timer);
  timer = null;
}

export function toTheMoon() {
  if (state.status !== "open") return false;
  moonUntil = Date.now() + MOON_MS;
  notify({ kind: "moon", text: "UNUSUAL BUYING ACTIVITY DETECTED. ALL OF IT." });
  setTimeout(() => {
    set({ status: "breaker" });
    notify({
      kind: "breaker",
      text: "LIMIT UP — CIRCUIT BREAKER TRIPPED. THE STOCK ROSE TOO FAST FOR THE MARKET'S OWN SAFETY.",
    });
    setTimeout(() => set({ status: "open" }), BREAKER_MS);
  }, MOON_MS);
  return true;
}

// Formatting shared by every panel.
export function money(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function pct(v: number) {
  return `${v >= 0 ? "+" : ""}${money(v)}%`;
}
