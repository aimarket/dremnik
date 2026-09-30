import { DialUp } from "./dialup";
import { PopupHost } from "./popups";
import { Effects } from "./effects";

// ------------------------------------------------
// projects/dremnik/src/components/geocities/index.tsx
//
// Everything that follows you around the Cyber Palace. Mounted once in the
// root layout, so you only dial in on a fresh load.
// ------------------------------------------------

export function Geocities() {
  return (
    <>
      <DialUp />
      <PopupHost />
      <Effects />
    </>
  );
}

export { Win95Window } from "./window";
export { PopupButton, type Popup } from "./popups";
export { HitCounter } from "./hit-counter";
export { MidiPlayer } from "./midi-player";
export { Guestbook } from "./guestbook";
export { WordArt, Marquee, UnderConstruction, Badges, Webring } from "./decor";
