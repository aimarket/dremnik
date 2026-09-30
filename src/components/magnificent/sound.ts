// ------------------------------------------------
// projects/dremnik/src/components/magnificent/sound.ts
//
// Synthesized brass, choir, and coins. No audio files ship; every sound is
// built from oscillators. Browsers only allow audio after a user gesture, so
// every caller is a click or keypress handler.
// ------------------------------------------------

let ctx: AudioContext | null = null;
let bus: AudioNode | null = null;

function audio(): { ac: AudioContext; out: AudioNode } | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  if (!ctx) {
    ctx = new AudioContext();
    // One compressor for everything, so a fanfare on top of a choir on top of
    // forty coins never clips.
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.connect(ctx.destination);
    bus = comp;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ac: ctx, out: bus! };
}

function volume(ac: AudioContext, out: AudioNode, level: number) {
  const g = ac.createGain();
  g.gain.value = level;
  g.connect(out);
  return g;
}

const NOTE = {
  C3: 130.81,
  C4: 261.63,
  E4: 329.63,
  G4: 392.0,
  C5: 523.25,
  E5: 659.25,
  G5: 783.99,
} as const;

function brass(ac: AudioContext, out: AudioNode, freq: number, at: number, dur: number) {
  const osc = ac.createOscillator();
  const tone = ac.createBiquadFilter();
  const amp = ac.createGain();

  osc.type = "sawtooth";
  // Lip into the pitch from slightly flat, like a real herald's trumpet.
  osc.frequency.setValueAtTime(freq * 0.96, at);
  osc.frequency.exponentialRampToValueAtTime(freq, at + 0.05);

  // Brass gets brighter as it gets louder: open the filter on the attack.
  tone.type = "lowpass";
  tone.frequency.setValueAtTime(freq * 1.5, at);
  tone.frequency.exponentialRampToValueAtTime(freq * 7, at + 0.06);
  tone.frequency.exponentialRampToValueAtTime(freq * 3, at + dur);

  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(1, at + 0.03);
  amp.gain.setValueAtTime(0.8, at + Math.max(0.04, dur - 0.06));
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  osc.connect(tone).connect(amp).connect(out);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

// Ta-ta-ta-TAAA, ta-ta-ta-TAAAAAA.
export function playFanfare() {
  const a = audio();
  if (!a) return;
  const out = volume(a.ac, a.out, 0.09);
  const t = a.ac.currentTime + 0.05;
  const phrase: [number[], number, number][] = [
    [[NOTE.G4], 0, 0.13],
    [[NOTE.G4], 0.16, 0.13],
    [[NOTE.G4], 0.32, 0.13],
    [[NOTE.C5], 0.48, 0.55],
    [[NOTE.G4], 1.08, 0.18],
    [[NOTE.C5], 1.28, 0.18],
    [[NOTE.E5], 1.48, 0.18],
    [[NOTE.C5, NOTE.E5, NOTE.G5], 1.68, 1.4],
  ];
  for (const [freqs, at, dur] of phrase) {
    for (const f of freqs) brass(a.ac, out, f, t + at, dur);
  }
}

// A C-major "aaah": two singers per part, sawtooth voices pushed through the
// two formants of an open "ah" vowel, each with its own vibrato.
export function playChoir(seconds = 5) {
  const a = audio();
  if (!a) return;
  const { ac } = a;
  const t = ac.currentTime;
  const out = volume(ac, a.out, 0.35);

  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(1, t + 0.9);
  env.gain.setValueAtTime(1, t + seconds - 1.2);
  env.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  env.connect(out);

  const formants = [
    [800, 6],
    [1150, 8],
  ].map(([freq, q]) => {
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = q;
    f.connect(env);
    return f;
  });

  for (const freq of [NOTE.C3, NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5]) {
    for (const detune of [-8, 7]) {
      const voice = ac.createOscillator();
      voice.type = "sawtooth";
      voice.frequency.value = freq;
      voice.detune.value = detune;

      const lfo = ac.createOscillator();
      const depth = ac.createGain();
      lfo.frequency.value = 4.8 + Math.random();
      depth.gain.value = freq * 0.012;
      lfo.connect(depth).connect(voice.frequency);

      for (const f of formants) voice.connect(f);
      voice.start(t);
      lfo.start(t);
      voice.stop(t + seconds + 0.1);
      lfo.stop(t + seconds + 0.1);
    }
  }
}

// Two quick square-wave blips, B5 then E6. You know the one.
export function playCoin() {
  const a = audio();
  if (!a) return;
  const { ac } = a;
  const out = volume(ac, a.out, 0.05);
  const t = ac.currentTime;
  for (const [freq, at] of [
    [987.77, 0],
    [1318.51, 0.07],
  ] as const) {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0.0001, t + at);
    amp.gain.exponentialRampToValueAtTime(1, t + at + 0.005);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.3);
    osc.connect(amp).connect(out);
    osc.start(t + at);
    osc.stop(t + at + 0.32);
  }
}
