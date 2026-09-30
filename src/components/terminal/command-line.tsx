"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/command-line.tsx
//
// The prompt at the bottom of the terminal. Scrollback above, input below,
// ↑/↓ walks through history. What the commands do lives in terminal.tsx.
// ------------------------------------------------

export type LogLine = { id: number; text: string; tone?: "cmd" | "ok" | "err" | "dim" };

const TONE: Record<NonNullable<LogLine["tone"]>, string> = {
  cmd: "text-[#ffb000]",
  ok: "text-[#33d17a]",
  err: "text-[#ff4d4d]",
  dim: "text-[#9a8a5c]",
};

export function CommandLine({
  log,
  onCommand,
  inputRef,
}: {
  log: LogLine[];
  onCommand: (cmd: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroll.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const h = history.current;
    if (e.key === "ArrowUp" && h.length) {
      e.preventDefault();
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(h[cursor.current]);
    } else if (e.key === "ArrowDown" && h.length) {
      e.preventDefault();
      cursor.current = Math.min(h.length, cursor.current + 1);
      setValue(h[cursor.current] ?? "");
    }
  };

  return (
    <div>
      <div
        ref={scroll}
        aria-live="polite"
        className="mb-2 max-h-[180px] min-h-[64px] overflow-y-auto whitespace-pre-wrap break-words"
      >
        {log.map((l) => (
          <p key={l.id} className={cn(l.tone ? TONE[l.tone] : "text-[#e8e8e8]")}>
            {l.text}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          history.current = [...history.current, value].slice(-30);
          cursor.current = history.current.length;
          onCommand(value);
          setValue("");
        }}
        className="flex items-center gap-2 border-t border-[#3a2f10] pt-2"
      >
        <label htmlFor="drem-cmd" className="shrink-0 font-bold text-[#ffb000]">
          DREM&gt;
        </label>
        <input
          ref={inputRef}
          id="drem-cmd"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="type HELP, press enter  ·  press / from anywhere"
          className="min-w-0 flex-1 bg-transparent uppercase text-[#e8e8e8] caret-[#ffb000] outline-none placeholder:normal-case placeholder:text-[#5c5236]"
        />
        <button type="submit" className="drem-button shrink-0 px-2 py-0.5">
          &lt;GO&gt;
        </button>
      </form>
    </div>
  );
}
