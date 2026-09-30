// ------------------------------------
// projects/dremnik/src/components/theme-toggle.tsx
//
// export function ThemeToggle()    L25
// ------------------------------------

"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Crown } from "lucide-react";
import { IconMoon, IconSun } from "@/components/ui/icons";

// Magnificent → light → dark → Magnificent. The icon shows where you're going.
const NEXT = { magnificent: "light", light: "dark", dark: "magnificent" } as const;
type Theme = keyof typeof NEXT;

const LABEL: Record<Theme, string> = {
  magnificent: "Restore magnificence",
  light: "Switch to light mode",
  dark: "Switch to dark mode",
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [protest, setProtest] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!protest) return;
    const t = setTimeout(() => setProtest(false), 2600);
    return () => clearTimeout(t);
  }, [protest]);

  if (!mounted) {
    return <span className="inline-block size-[13px]" aria-hidden="true" />;
  }

  const current = (resolvedTheme ?? "magnificent") as Theme;
  const next = NEXT[current] ?? "magnificent";

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={LABEL[next]}
        title={LABEL[next]}
        onClick={() => {
          setTheme(next);
          setProtest(current === "magnificent");
        }}
        className="text-muted hover:text-ink transition-colors duration-200 cursor-pointer inline-flex items-center"
      >
        {next === "light" && <IconSun className="size-[13px]" />}
        {next === "dark" && <IconMoon className="size-[13px]" />}
        {next === "magnificent" && <Crown className="size-[14px] text-[var(--gold)]" />}
      </button>
      {protest && (
        <span
          role="status"
          className="absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md border border-rule bg-background px-2.5 py-1.5 font-mono text-[8pt] text-muted shadow-sm"
        >
          Magnificence dimmed. It cannot be turned off.
        </span>
      )}
    </span>
  );
}
