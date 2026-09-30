import { Herald } from "./herald";
import { Ticker } from "./ticker";
import { FlorinRain } from "./florins";
import { CherubFlyby } from "./cherub";
import { SparkleTrail } from "./sparkles";
import { EasterEggs } from "./easter-eggs";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/index.tsx
//
// Everything that follows him from page to page. Mounted once in the root
// layout, so the herald only plays on a fresh load, never on navigation.
// ------------------------------------------------

export function Magnificence() {
  return (
    <>
      <Herald />
      <Ticker />
      <FlorinRain />
      <CherubFlyby />
      <SparkleTrail />
      <EasterEggs />
    </>
  );
}

export { MagnificentName } from "./name";
export { Portrait } from "./portrait";
export { HallOfAchievements } from "./achievements";
export { Testimonials } from "./testimonials";
export { WaxSeal } from "./wax-seal";
