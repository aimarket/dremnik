"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "motion/react";

// ------------------------------------------------
// projects/dremnik/src/components/magnificent/sparkles.tsx
//
// Gold sparkles trail the cursor while the Magnificent theme is on. Plain DOM
// nodes with a CSS animation, each one removing itself when it fades out.
// ------------------------------------------------

const EVERY_MS = 35;
const MAX_LIVE = 40;

export function SparkleTrail() {
  const { resolvedTheme } = useTheme();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (resolvedTheme !== "magnificent" || reduce) return;
    if (!matchMedia("(pointer: fine)").matches) return;

    let last = 0;
    let live = 0;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < EVERY_MS || live >= MAX_LIVE) return;
      last = now;
      live++;

      const s = document.createElement("span");
      s.className = "mag-sparkle";
      s.textContent = Math.random() < 0.5 ? "✦" : "✧";
      s.setAttribute("aria-hidden", "true");
      s.style.left = `${e.clientX}px`;
      s.style.top = `${e.clientY}px`;
      s.style.fontSize = `${8 + Math.random() * 8}px`;
      s.style.setProperty("--dx", `${(Math.random() - 0.5) * 30}px`);
      s.addEventListener(
        "animationend",
        () => {
          s.remove();
          live--;
        },
        { once: true },
      );
      document.body.appendChild(s);
    };

    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  }, [resolvedTheme, reduce]);

  return null;
}
