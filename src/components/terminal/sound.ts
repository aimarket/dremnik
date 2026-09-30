// ------------------------------------------------
// projects/dremnik/src/components/terminal/sound.ts
//
// The exchange's sound design, synthesized with Web Audio: the opening
// bell, a cash-register ding, a rejection buzz, and the circuit-breaker
// alarm. Browsers only allow audio after a user gesture, so every caller
// sits behind a click or a keypress.
// ------------------------------------------------

let ctx: AudioContext | null = null;
let bus: AudioNode | null = null;

function audio(): { ac: AudioContext; out: AudioNode } | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  if (!ctx) {
    ctx = new AudioContext();
    // One compressor for the whole trading floor so stacked sounds never clip.
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.connect(ctx.destination);
    bus = comp;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ac: ctx, out: bus! };
}

function voice(
  ac: AudioContext,
  out: AudioNode,
  type: OscillatorType,
  freq: number,
  at: number,
  dur: number,
  peak: number,
) {
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(peak, at + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(amp).connect(out);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

// A struck brass bell: inharmonic partials, each decaying at its own rate.
// The higher the partial, the faster it dies, which is what makes it "clang"
// and then "hum".
const BELL_PARTIALS: [ratio: number, gain: number, decay: number][] = [
  [0.5, 0.35, 4.5],
  [1, 0.5, 3.6],
  [1.183, 0.28, 2.8],
  [1.506, 0.22, 2.2],
  [2, 0.2, 1.8],
  [2.514, 0.12, 1.2],
  [2.662, 0.1, 1.0],
  [3.011, 0.08, 0.8],
  [4.166, 0.06, 0.5],
];

function strike(ac: AudioContext, out: AudioNode, base: number, at: number) {
  for (const [ratio, gain, decay] of BELL_PARTIALS) {
    voice(ac, out, "sine", base * ratio, at, decay, gain);
  }
}

// Ding. Ding. Ding. The market is open.
export function playOpeningBell() {
  const a = audio();
  if (!a) return;
  const out = a.ac.createGain();
  out.gain.value = 0.22;
  out.connect(a.out);
  const t = a.ac.currentTime + 0.03;
  for (let i = 0; i < 3; i++) strike(a.ac, out, 523.25, t + i * 0.42);
}

// Ka-ching: two bright pings over a short burst of noise (the drawer).
export function playRegister() {
  const a = audio();
  if (!a) return;
  const { ac } = a;
  const out = ac.createGain();
  out.gain.value = 0.1;
  out.connect(a.out);
  const t = ac.currentTime;

  const noise = ac.createBuffer(1, ac.sampleRate * 0.15, ac.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ac.createBufferSource();
  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 3000;
  src.buffer = noise;
  src.connect(hp).connect(out);
  src.start(t);

  voice(ac, out, "triangle", 2093, t + 0.05, 0.5, 0.9);
  voice(ac, out, "triangle", 2637, t + 0.12, 0.7, 0.9);
}

// The sound of an order that will never be filled.
export function playReject() {
  const a = audio();
  if (!a) return;
  const out = a.ac.createGain();
  out.gain.value = 0.06;
  out.connect(a.out);
  const t = a.ac.currentTime;
  voice(a.ac, out, "square", 110, t, 0.18, 1);
  voice(a.ac, out, "square", 92.5, t + 0.2, 0.3, 1);
}

// Limit up. Everybody stay calm.
export function playAlarm(seconds = 1.6) {
  const a = audio();
  if (!a) return;
  const out = a.ac.createGain();
  out.gain.value = 0.045;
  out.connect(a.out);
  const t = a.ac.currentTime;
  for (let i = 0; i * 0.2 < seconds; i++) {
    voice(a.ac, out, "square", i % 2 ? 660 : 880, t + i * 0.2, 0.18, 1);
  }
}
