// ------------------------------------------------
// projects/dremnik/src/components/rpg/pixel-sprite.tsx
//
// Sprites as strings: each row is a line of characters, each character a
// palette key, "." is transparent. Rendered as one <rect> per pixel with
// crisp edges, so they scale to any size without blurring.
// ------------------------------------------------

type Palette = Record<string, string>;

export type Sprite = { rows: string[]; palette: Palette };

// The hero, after the Florentine portrait: bald, round glasses, a black
// doublet with gold embroidery, and the faint smile of a man who has
// already shipped it.
export const ANDREW: Sprite = {
  palette: {
    k: "#1a1020",
    s: "#f2c29b",
    S: "#d49a72",
    h: "#ffe6cc",
    g: "#3b2a1f",
    w: "#bfe3ff",
    m: "#9c4a35",
    c: "#f4f0e8",
    d: "#1d1d27",
    D: "#3a3a4a",
    y: "#e8b84a",
  },
  rows: [
    "....kkkkkkkk....",
    "...khhhsssssk...",
    "..khhssssssSSk..",
    "..khsssssssssk..",
    "..kssssssssssk..",
    ".kkgggsssgggskk.",
    ".ksgwgggggwgsSk.",
    ".kSgggsssgggsSk.",
    "..ksssssssssSk..",
    "..kssmsssmssSk..",
    "...kssmmmssSk...",
    "....kkssssSkk...",
    "....kcSSSSck....",
    "..kdddcccccddk..",
    ".kddyddcccddyddk",
    "kdDdyddcddydDddk",
    "kdDdyddddddydDdk",
    "kdDdyyyyyyyydDdk",
  ],
};

// A green glass bottle with a very narrow neck and a very bad attitude.
export const BOTTLENECK: Sprite = {
  palette: {
    k: "#0b2016",
    g: "#35a468",
    G: "#8fe6ad",
    r: "#ff3b3b",
    c: "#c9a27a",
  },
  rows: [
    "....kkkk....",
    "....kcck....",
    "....kggk....",
    "....kGgk....",
    "...kkGgkk...",
    "..kgGggggk..",
    ".kgGggggggk.",
    ".kGgrkgkrgk.",
    ".kGgkrgrkgk.",
    ".kGggggggggk",
    ".kGggkkkkggk",
    ".kGgkggggkgk",
    ".kGggggggggk",
    ".kGggggggggk",
    "..kkkkkkkkk.",
  ],
};

// A stone tablet inscribed with a formula about serial fractions. Furious.
export const AMDAHL: Sprite = {
  palette: {
    k: "#16161c",
    t: "#8d8f9e",
    T: "#b9bbc8",
    l: "#4b4d5a",
    r: "#ff3b3b",
  },
  rows: [
    "...kkkkkkkk...",
    "..kTTTTTTTTk..",
    ".kTttttttttTk.",
    "kTtrktttttkrtk",
    "kTttrkttkrtttk",
    "kTttttttttttkk",
    "kTtllllllllttk",
    "kTttttttttttkk",
    "kTtlllllllttk.",
    "kTttttttttttk.",
    "kTtlllllltttk.",
    "kTttttttttttk.",
    "kTtllllllllttk",
    ".kttttttttttk.",
    "..kkkkkkkkkk..",
  ],
};

// A red notification badge that has been waiting for you since Tuesday.
export const BADGE: Sprite = {
  palette: {
    k: "#2a0508",
    r: "#e8283a",
    R: "#ff6b78",
    w: "#ffffff",
  },
  rows: [
    "....kkkkk....",
    "..kkRrrrrkk..",
    ".kRRrrrrrrrk.",
    ".kRrrrwwrrrk.",
    "kRrrrrwwrrrrk",
    "kRrrrrwwrrrrk",
    "kRrrrrwwrrrrk",
    "kRrrrrwwrrrrk",
    "kRrrrrrrrrrrk",
    "kRrrrrwwrrrrk",
    ".krrrrwwrrrk.",
    ".krrrrrrrrrk.",
    "..kkrrrrrkk..",
    "....kkkkk....",
  ],
};

export function PixelSprite({
  sprite,
  className,
  title,
}: {
  sprite: Sprite;
  className?: string;
  title?: string;
}) {
  const width = Math.max(...sprite.rows.map((r) => r.length));
  const height = sprite.rows.length;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {sprite.rows.flatMap((row, y) =>
        [...row].map((key, x) =>
          key === "." || !sprite.palette[key] ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={sprite.palette[key]} />
          ),
        ),
      )}
    </svg>
  );
}
