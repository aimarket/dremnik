import { TitleScreen } from "./title-screen";
import { Hud } from "./hud";
import { AchievementToasts } from "./achievements";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/index.tsx
//
// The game layer that follows him from page to page. Mounted once in the
// root layout, so the title screen shows on a fresh load, never on
// navigation.
// ------------------------------------------------

export function GameLayer() {
  return (
    <>
      <TitleScreen />
      <AchievementToasts />
      <Hud />
    </>
  );
}

export { CharacterSheet } from "./character-sheet";
export { QuestLog } from "./quest-log";
export { BossBattle } from "./battle";
export { Inventory } from "./inventory";
export { ScrollComplete } from "./scroll-complete";
