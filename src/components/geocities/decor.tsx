import { PopupButton, type Popup } from "./popups";

// ------------------------------------------------
// projects/dremnik/src/components/geocities/decor.tsx
//
// The furniture of a 1998 homepage: WordArt, marquees, "under construction"
// tape, 88x31 award buttons, and a webring. All CSS; no GIFs were harmed.
// ------------------------------------------------

// ─── WordArt: rainbow, extruded, and waving ───

export function WordArt({ text, className }: { text: string; className?: string }) {
  let i = 0;
  return (
    <h1 className={`geo-wordart ${className ?? ""}`} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {word.split("").map((ch) => (
            <span key={i} className="geo-wave" style={{ "--i": i++ } as React.CSSProperties}>
              {ch}
            </span>
          ))}
          {" "}
        </span>
      ))}
    </h1>
  );
}

// ─── Marquee: the <marquee> tag, rebuilt in CSS, as the W3C intended ───

export function Marquee({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`geo-marquee ${className ?? ""}`}>
      <div className="geo-marquee-track">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </div>
    </div>
  );
}

// ─── Under construction: hazard tape and two pixel traffic cones ───

function Cone() {
  // 12x14 pixel art, one <rect> per run.
  const px: [number, number, number, string][] = [
    [5, 0, 2, "#ff6600"],
    [5, 1, 2, "#ff6600"],
    [4, 2, 4, "#ffffff"],
    [4, 3, 4, "#ffffff"],
    [4, 4, 4, "#ff6600"],
    [3, 5, 6, "#ff6600"],
    [3, 6, 6, "#ffffff"],
    [3, 7, 6, "#ffffff"],
    [2, 8, 8, "#ff6600"],
    [2, 9, 8, "#ff6600"],
    [2, 10, 8, "#ff6600"],
    [0, 11, 12, "#cc4400"],
    [0, 12, 12, "#993300"],
  ];
  return (
    <svg viewBox="0 0 12 13" className="h-7 w-7 shrink-0 [image-rendering:pixelated]" aria-hidden="true" shapeRendering="crispEdges">
      {px.map(([x, y, w, fill]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={fill} />
      ))}
    </svg>
  );
}

export function UnderConstruction() {
  return (
    <div className="geo-construction" role="note">
      <Cone />
      <p>
        <b className="geo-blink">!! UNDER CONSTRUCTION !!</b>{" "}
        Andrew keeps adding achievements faster than we can build pages for them.
      </p>
      <Cone />
    </div>
  );
}

// ─── 88x31 award buttons ───

const BADGES: { top: string; bottom: string; tone: string }[] = [
  { top: "COOL SITE", bottom: "OF THE MILLENNIUM", tone: "geo-badge-gold" },
  { top: "TOP 0.0001%", bottom: "OF THE WEB", tone: "geo-badge-red" },
  { top: "Y2K", bottom: "COMPLIANT (he fixed it)", tone: "geo-badge-green" },
  { top: "MADE WITH", bottom: "kernl", tone: "geo-badge-blue" },
  { top: "BAYESIAN", bottom: "INSIDE", tone: "geo-badge-purple" },
  { top: "HTML 3.2", bottom: "✔ VALID", tone: "geo-badge-grey" },
  { top: "CLARITY", bottom: "ON", tone: "geo-badge-cyan" },
  { top: "0 SUBSCRIPTIONS", bottom: "thx parrot", tone: "geo-badge-orange" },
];

export function Badges() {
  return (
    <ul className="flex flex-wrap justify-center gap-1.5" aria-label="Awards">
      {BADGES.map((b) => (
        <li key={b.top} className={`geo-badge ${b.tone}`}>
          <span className="block">{b.top}</span>
          <span className="block text-[6.5px]">{b.bottom}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── The webring ───

const RING: Record<string, Popup> = {
  prev: {
    title: "Webring",
    icon: "info",
    text: "Leonardo da Vinci's homepage is still under construction (since 1519). Returning you to Andrew.",
  },
  random: {
    title: "Webring",
    icon: "info",
    text: "You have been randomly selected to stay on Andrew's page. Congratulations!",
  },
  next: {
    title: "Webring",
    icon: "warn",
    text: "Nikola Tesla's site is too far ahead of its time. Please try again in 2040.",
  },
  list: {
    title: "All Sites in This Ring",
    icon: "info",
    text: "1. Andrew Jones  2. Andrew Jones (mirror)  3. Andrew Jones (mirror 2)  4. Leonardo da Vinci (offline)  5. Nikola Tesla (in the future)",
  },
};

export function Webring() {
  return (
    <section className="geo-box text-center">
      <p className="text-[9pt] text-[#99ccff]">
        This site is a proud member of the
      </p>
      <p className="geo-rainbow-text my-1 text-[13pt] font-bold">★ Renaissance Men of the Web ★ Webring</p>
      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        <PopupButton className="geo-btn" popup={RING.prev}>
          ← Da Vinci
        </PopupButton>
        <PopupButton className="geo-btn" popup={RING.random}>
          Random
        </PopupButton>
        <PopupButton className="geo-btn" popup={RING.list}>
          List Sites
        </PopupButton>
        <PopupButton className="geo-btn" popup={RING.next}>
          Tesla →
        </PopupButton>
      </div>
    </section>
  );
}
