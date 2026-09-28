// Public-domain paintings used as OG card backgrounds. Files live in
// public/og/paintings/<id>.jpg (Wikimedia Commons scans, ≤1600px). A post picks
// one with `painting: <id>` in its frontmatter; posts without one get a stable
// pick by slug. Satori ignores object-position, so the card crops by hand
// around `focus`.

export type Painting = {
  artist: string;
  title: string;
  year: string;
  width: number; // source file pixels
  height: number;
  focus: [number, number]; // x, y (0–1) of the point to keep in frame
};

export const PAINTINGS = {
  "caravaggio-calling-of-saint-matthew": {
    artist: "Caravaggio",
    title: "The Calling of Saint Matthew",
    year: "1600",
    width: 1283,
    height: 1200,
    focus: [0.5, 0.5],
  },
  "carpaccio-vision-of-st-augustine": {
    artist: "Vittore Carpaccio",
    title: "The Vision of Saint Augustine",
    year: "1502",
    width: 1600,
    height: 1071,
    focus: [0.5, 0.45],
  },
  "giorgione-the-tempest": {
    artist: "Giorgione",
    title: "The Tempest",
    year: "c. 1508",
    width: 1431,
    height: 1600,
    focus: [0.5, 0.16],
  },
  "antonello-st-jerome-in-his-study": {
    artist: "Antonello da Messina",
    title: "Saint Jerome in His Study",
    year: "c. 1475",
    width: 1261,
    height: 1600,
    focus: [0.5, 0.68],
  },
  "bruegel-tower-of-babel": {
    artist: "Pieter Bruegel the Elder",
    title: "The Tower of Babel",
    year: "1563",
    width: 1600,
    height: 1171,
    focus: [0.5, 0.12],
  },
  "raphael-school-of-athens": {
    artist: "Raphael",
    title: "The School of Athens",
    year: "1511",
    width: 1600,
    height: 1241,
    focus: [0.5, 0.52],
  },
  "botticelli-birth-of-venus": {
    artist: "Sandro Botticelli",
    title: "The Birth of Venus",
    year: "c. 1485",
    width: 1600,
    height: 1005,
    focus: [0.5, 0.45],
  },
} satisfies Record<string, Painting>;

export type PaintingId = keyof typeof PAINTINGS;

const IDS = Object.keys(PAINTINGS) as PaintingId[];

export function isPaintingId(id: string | undefined): id is PaintingId {
  return !!id && id in PAINTINGS;
}

// Explicit frontmatter choice, else a deterministic pick from the slug.
export function paintingFor(slug: string, requested?: string): PaintingId {
  if (isPaintingId(requested)) return requested;
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return IDS[h % IDS.length];
}
