// ------------------------------------
// projects/dremnik/src/components/theme-toggle.tsx
//
// export function ThemeToggle()    L26
// ------------------------------------

"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Gamepad2 } from "lucide-react";
import { IconMoon, IconSun } from "@/components/ui/icons";
import { unlock } from "@/components/rpg/achievements";

// Andrew Quest → light → dark → Andrew Quest. The icon shows where you're going.
const NEXT = { rpg: "light", light: "dark", dark: "rpg" } as const;
type Theme = keyof typeof NEXT;

const LABEL: Record<Theme, string> = {
  rpg: "Resume Andrew Quest",
  light: "Switch to light mode",
  dark: "Switch to dark mode",
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), 2600);
    return () => clearTimeout(t);
  }, [paused]);

  if (!mounted) {
    return <span className="inline-block size-[13px]" aria-hidden="true" />;
  }

  const current = (resolvedTheme ?? "rpg") as Theme;
  const next = NEXT[current] ?? "rpg";

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={LABEL[next]}
        title={LABEL[next]}
        onClick={() => {
          setTheme(next);
          if (current === "rpg") {
            setPaused(true);
            unlock("pause");
          }
        }}
        className="text-muted hover:text-ink transition-colors duration-200 cursor-pointer inline-flex items-center"
      >
        {next === "light" && <IconSun className="size-[13px]" />}
        {next === "dark" && <IconMoon className="size-[13px]" />}
        {next === "rpg" && <Gamepad2 className="size-[15px] text-[#e0a92a]" />}
      </button>
      {paused && (
        <span
          role="status"
          className="absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md border border-rule bg-background px-2.5 py-1.5 font-mono text-[8pt] text-muted shadow-sm"
        >
          GAME PAUSED. He keeps leveling without you.
        </span>
      )}
    </span>
  );
}
