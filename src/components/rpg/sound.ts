// ------------------------------------------------
// projects/dremnik/src/components/rpg/sound.ts
//
// An 8-bit sound chip in about a hundred lines: square and triangle
// oscillators, plus one noise burst. Every melody here is original.
//
// Browsers only allow audio after a user gesture, so the context is created
// by unlockAudio(), which is only ever called from a click or keypress.
// Sounds that fire on their own (level-ups while scrolling) stay silent
// until that has happened.
// ------------------------------------------------

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

export function unlockAudio() {
  if (typeof window === "undefined" || !("AudioContext" in window)) return;
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  if (master) master.gain.value = value ? 0 : 0.9;
}

function chip() {
  if (!ctx || !master || muted) return null;
  return { ac: ctx, out: master };
}

type Wave = "square" | "triangle" | "sawtooth";

function note(freq: number, at: number, dur: number, wave: Wave = "square", vol = 0.08) {
  const c = chip();
  if (!c) return;
  const osc = c.ac.createOscillator();
  const amp = c.ac.createGain();
  const t = c.ac.currentTime + at;
  osc.type = wave;
  osc.frequency.value = freq;
  // Chiptune envelope: instant attack, flat sustain, a quick release.
  amp.gain.setValueAtTime(vol, t);
  amp.gain.setValueAtTime(vol, t + Math.max(0, dur - 0.03));
  amp.gain.linearRampToValueAtTime(0, t + dur);
  osc.connect(amp).connect(c.out);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

const N = {
  C3: 130.81,
  G3: 196.0,
  C4: 261.63,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
  E6: 1318.51,
  G6: 1567.98,
  C7: 2093.0,
} as const;

// The title fanfare: a rising call, an answer, and a held chord over a
// marching triangle bass.
export function playFanfare() {
  const lead: [number, number, number][] = [
    [N.G4, 0, 0.12],
    [N.C5, 0.13, 0.12],
    [N.E5, 0.26, 0.12],
    [N.G5, 0.39, 0.36],
    [N.E5, 0.78, 0.12],
    [N.F5, 0.91, 0.12],
    [N.A5, 1.04, 0.12],
    [N.G5, 1.17, 0.7],
  ];
  for (const [f, at, d] of lead) note(f, at, d, "square", 0.07);
  note(N.E5, 1.17, 0.7, "square", 0.04);
  note(N.C5, 1.17, 0.7, "square", 0.04);
  for (const [f, at] of [
    [N.C3, 0],
    [N.G3, 0.26],
    [N.C3, 0.52],
    [N.G3, 0.78],
    [N.C3, 1.04],
  ] as const) {
    note(f, at, 0.2, "triangle", 0.14);
  }
  note(N.C3, 1.17, 0.7, "triangle", 0.14);
}

export function playLevelUp() {
  [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => note(f, i * 0.07, 0.07, "square", 0.06));
  note(N.E6, 0.28, 0.3, "square", 0.06);
  note(N.C6, 0.28, 0.3, "square", 0.04);
}

export function playSelect() {
  note(N.A5, 0, 0.04, "square", 0.05);
  note(N.E6, 0.04, 0.06, "square", 0.05);
}

export function playBlip() {
  note(N.B5, 0, 0.025, "square", 0.025);
}

export function playAchievement() {
  note(N.B5, 0, 0.1, "triangle", 0.18);
  note(N.E6, 0.1, 0.35, "triangle", 0.18);
}

export function playExtraLives() {
  [N.C6, N.E6, N.G6, N.C7, N.G6, N.C7].forEach((f, i) =>
    note(f, i * 0.06, 0.06, "square", 0.05),
  );
}

export function playVictory() {
  const run: [number, number, number][] = [
    [N.C5, 0, 0.1],
    [N.D5, 0.1, 0.1],
    [N.E5, 0.2, 0.1],
    [N.G5, 0.3, 0.2],
    [N.E5, 0.5, 0.1],
    [N.G5, 0.6, 0.5],
  ];
  for (const [f, at, d] of run) note(f, at, d, "square", 0.07);
  note(N.C4, 0, 0.3, "triangle", 0.14);
  note(N.G3, 0.3, 0.3, "triangle", 0.14);
  note(N.C4, 0.6, 0.5, "triangle", 0.14);
}

// A hit: a burst of white noise that dies away, with a pitch drop underneath.
export function playHit() {
  const c = chip();
  if (!c) return;
  const t = c.ac.currentTime;
  const len = Math.floor(c.ac.sampleRate * 0.18);
  const buf = c.ac.createBuffer(1, len, c.ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.ac.createBufferSource();
  const amp = c.ac.createGain();
  src.buffer = buf;
  amp.gain.value = 0.12;
  src.connect(amp).connect(c.out);
  src.start(t);

  const osc = c.ac.createOscillator();
  const g = c.ac.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(420, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.16);
  g.gain.setValueAtTime(0.06, t);
  g.gain.linearRampToValueAtTime(0, t + 0.16);
  osc.connect(g).connect(c.out);
  osc.start(t);
  osc.stop(t + 0.18);
}
