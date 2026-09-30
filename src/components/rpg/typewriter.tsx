"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { playBlip } from "./sound";

// ------------------------------------------------
// projects/dremnik/src/components/rpg/typewriter.tsx
//
// Dialog text that types itself out one character at a time, blipping as
// it goes, the way every text box should. Reduced motion shows it whole.
// ------------------------------------------------

const MS_PER_CHAR = 22;

export function Typewriter({
  text,
  onDone,
  className,
}: {
  text: string;
  onDone?: () => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduce) {
      setShown(text.length);
      onDone?.();
      return;
    }
    setShown(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(i);
      if (i % 3 === 0) playBlip();
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, MS_PER_CHAR);
    return () => clearInterval(id);
    // onDone is deliberately left out: a new callback identity must not restart the text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduce]);

  return (
    <span className={className}>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {/* The rest of the line holds its space, so the box never jumps as it types. */}
        <span className="invisible">{text.slice(shown)}</span>
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
