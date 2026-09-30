// ------------------------------------------------
// projects/dremnik/src/components/geocities/sound.ts
//
// The sounds of 1998, synthesized: a dial-up modem handshake and a looping
// General MIDI-grade rendition of Für Elise (Beethoven, public domain).
// No audio files. Browsers only allow audio after a user gesture, so every
// caller is a click handler.
// ------------------------------------------------

let ctx: AudioContext | null = null;
let bus: AudioNode | null = null;

function audio(): { ac: AudioContext; out: AudioNode } | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  if (!ctx) {
    ctx = new AudioContext();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.connect(ctx.destination);
    bus = comp;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ac: ctx, out: bus! };
}

function gainNode(ac: AudioContext, out: AudioNode, level: number) {
  const g = ac.createGain();
  g.gain.value = level;
  g.connect(out);
  return g;
}

function tones(ac: AudioContext, out: AudioNode, freqs: number[], at: number, dur: number) {
  for (const f of freqs) {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.frequency.value = f;
    amp.gain.setValueAtTime(0, at);
    amp.gain.linearRampToValueAtTime(0.5, at + 0.01);
    amp.gain.setValueAtTime(0.5, at + dur - 0.01);
    amp.gain.linearRampToValueAtTime(0, at + dur);
    osc.connect(amp).connect(out);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }
}

// ─── Dial-up ───────────────────────────────────────────────────────────

// Touch-tone pairs (row Hz, column Hz).
const DTMF: Record<string, [number, number]> = {
  "1": [697, 1209], "2": [697, 1336], "3": [697, 1477],
  "4": [770, 1209], "5": [770, 1336], "6": [770, 1477],
  "7": [852, 1209], "8": [852, 1336], "9": [852, 1477],
  "0": [941, 1336],
};

// 1-800-ANDREW-1, on a keypad.
const NUMBER = "18002637391";

// Plays the whole handshake and returns how long it lasts, in seconds.
export function playDialup(): number {
  const a = audio();
  if (!a) return 0;
  const { ac } = a;
  const out = gainNode(ac, a.out, 0.07);
  const t0 = ac.currentTime + 0.05;
  let t = t0;

  // Dial tone.
  tones(ac, out, [350, 440], t, 0.6);
  t += 0.75;

  for (const digit of NUMBER) {
    tones(ac, out, DTMF[digit], t, 0.09);
    t += 0.13;
  }
  t += 0.45;

  // The far end answers.
  tones(ac, out, [2100], t, 0.9);
  t += 1.0;

  // Handshake squawks.
  for (let i = 0; i < 14; i++) {
    tones(ac, out, [i % 2 ? 1180 : 980, i % 3 ? 1850 : 1650], t, 0.07);
    t += 0.07;
  }

  // And the part everyone remembers: filtered static over a warbling carrier.
  const len = 1.4;
  const noise = ac.createBuffer(1, Math.ceil(ac.sampleRate * len), ac.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = noise;
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1800;
  band.Q.value = 0.7;
  const hiss = ac.createGain();
  hiss.gain.value = 0.6;
  src.connect(band).connect(hiss).connect(out);
  src.start(t);
  src.stop(t + len);

  const carrier = ac.createOscillator();
  const wobble = ac.createOscillator();
  const depth = ac.createGain();
  carrier.frequency.value = 1200;
  wobble.frequency.value = 23;
  depth.gain.value = 400;
  wobble.connect(depth).connect(carrier.frequency);
  const carrierAmp = ac.createGain();
  carrierAmp.gain.value = 0.25;
  carrier.connect(carrierAmp).connect(out);
  carrier.start(t);
  wobble.start(t);
  carrier.stop(t + len);
  wobble.stop(t + len);
  t += len;

  return t - ac.currentTime;
}

// ─── Für Elise ─────────────────────────────────────────────────────────

// Notes as NAME+OCTAVE:SIXTEENTHS, "r" for rest. The loop is 48 sixteenths;
// the pickup sits at the end of the last bar so it repeats seamlessly.
const RIGHT_HAND =
  "E5:1 D#5:1 E5:1 D#5:1 E5:1 B4:1 D5:1 C5:1 A4:2 r:1 C4:1 E4:1 A4:1 " +
  "B4:2 r:1 E4:1 G#4:1 B4:1 C5:2 r:1 E4:1 E5:1 D#5:1 E5:1 D#5:1 E5:1 B4:1 D5:1 C5:1 " +
  "A4:2 r:1 C4:1 E4:1 A4:1 B4:2 r:1 E4:1 C5:1 B4:1 A4:2 r:2";
const LEFT_HAND =
  "r:8 A2:1 E3:1 A3:1 r:3 E2:1 E3:1 G#3:1 r:3 A2:1 E3:1 A3:1 r:3 r:6 " +
  "A2:1 E3:1 A3:1 r:3 E2:1 E3:1 G#3:1 r:3 A2:1 E3:1 A3:1 r:1";

const STEP_S = 0.14;
const LOOP_STEPS = 48;
const SEMITONE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

type Note = { midi: number | null; steps: number };

function parseNotes(score: string): Note[] {
  return score.split(" ").map((token) => {
    const [name, steps] = token.split(":");
    if (name === "r") return { midi: null, steps: Number(steps) };
    const m = /^([A-G])(#?)(\d)$/.exec(name);
    if (!m) throw new Error(`bad note ${name}`);
    const midi = 12 * (Number(m[3]) + 1) + SEMITONE[m[1]] + (m[2] ? 1 : 0);
    return { midi, steps: Number(steps) };
  });
}

const PARTS: [OscillatorType, Note[], number][] = [
  ["square", parseNotes(RIGHT_HAND), 0.55],
  ["triangle", parseNotes(LEFT_HAND), 1],
];

function voice(ac: AudioContext, out: AudioNode, type: OscillatorType, midi: number, at: number, dur: number, level: number) {
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
  // A quick strike that decays like a (very cheap) piano.
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(level, at + 0.005);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur * 1.8);
  osc.connect(amp).connect(out);
  osc.start(at);
  osc.stop(at + dur * 1.8 + 0.02);
}

// Starts the loop; returns a function that stops it.
export function playFurElise(): () => void {
  const a = audio();
  if (!a) return () => {};
  const { ac } = a;
  const out = gainNode(ac, a.out, 0.09);
  let loopStart = ac.currentTime + 0.08;
  let timer: ReturnType<typeof setTimeout>;

  const scheduleLoop = () => {
    for (const [type, notes, level] of PARTS) {
      let step = 0;
      for (const n of notes) {
        if (n.midi !== null) voice(ac, out, type, n.midi, loopStart + step * STEP_S, n.steps * STEP_S, level);
        step += n.steps;
      }
    }
    loopStart += LOOP_STEPS * STEP_S;
    // Queue the next pass a second before this one runs out.
    timer = setTimeout(scheduleLoop, Math.max(0, (loopStart - ac.currentTime - 1) * 1000));
  };
  scheduleLoop();

  return () => {
    clearTimeout(timer);
    out.gain.setTargetAtTime(0, ac.currentTime, 0.02);
    setTimeout(() => out.disconnect(), 200);
  };
}
