"use client";

import { useEffect, useRef, useState } from "react";
import { Win95Window } from "./window";

// ------------------------------------------------
// projects/dremnik/src/components/geocities/popups.tsx
//
// Pop-up dialog boxes, the defining art form of the era. Anything can open
// one with openPopup(); a single host renders them stacked and draggable.
// A button can chain into a follow-up popup with `then`.
// ------------------------------------------------

export type PopupIcon = "info" | "warn" | "error" | "question";

export type Popup = {
  title: string;
  text: string;
  icon?: PopupIcon;
  buttons?: { label: string; then?: Popup }[];
};

const EVENT = "geo:popup";
const MAX_OPEN = 4;

export function openPopup(popup: Popup) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: popup }));
}

// For server components: a button whose only job is to open a popup.
export function PopupButton({
  popup,
  className,
  children,
}: {
  popup: Popup;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={() => openPopup(popup)}>
      {children}
    </button>
  );
}

export function PopupIconGlyph({ icon }: { icon: PopupIcon }) {
  const glyph = { info: "i", warn: "!", error: "×", question: "?" }[icon];
  return (
    <span aria-hidden="true" className={`geo-icon geo-icon-${icon}`}>
      <span>{glyph}</span>
    </span>
  );
}

type Open = Popup & { id: number };

function PopupWindow({
  popup,
  index,
  onClose,
}: {
  popup: Open;
  index: number;
  onClose: (then?: Popup) => void;
}) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const start = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const titleId = `geo-popup-${popup.id}`;
  const buttons = popup.buttons?.length ? popup.buttons : [{ label: "OK" }];

  // Drag by the title bar, like it's 1995.
  const titleBarProps: React.HTMLAttributes<HTMLDivElement> = {
    onPointerDown: (e) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      start.current = { px: e.clientX, py: e.clientY, ...drag };
    },
    onPointerMove: (e) => {
      const s = start.current;
      if (s) setDrag({ x: s.x + e.clientX - s.px, y: s.y + e.clientY - s.py });
    },
    onPointerUp: () => {
      start.current = null;
    },
    style: { cursor: "move", touchAction: "none" },
  };

  return (
    <div
      role="alertdialog"
      aria-labelledby={titleId}
      className="geo-popup"
      style={{
        zIndex: 200 + index,
        transform: `translate(calc(-50% + ${index * 26 + drag.x}px), calc(-50% + ${index * 26 + drag.y}px))`,
      }}
    >
      <Win95Window
        title={popup.title}
        titleId={titleId}
        titleBarProps={titleBarProps}
        onClose={() => onClose()}
      >
        <div className="flex items-start gap-3 px-2 pt-3 pb-4">
          {popup.icon && <PopupIconGlyph icon={popup.icon} />}
          <p className="pt-1 leading-snug">{popup.text}</p>
        </div>
        <div className="flex justify-center gap-2 pb-2">
          {buttons.map((b, i) => (
            <button
              key={`${b.label}-${i}`}
              type="button"
              autoFocus={i === 0}
              className="geo-btn"
              onClick={() => onClose(b.then)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </Win95Window>
    </div>
  );
}

export function PopupHost() {
  const [open, setOpen] = useState<Open[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const onPopup = (e: Event) => {
      const popup = (e as CustomEvent<Popup>).detail;
      const id = nextId.current++;
      setOpen((o) => [...o.slice(-(MAX_OPEN - 1)), { ...popup, id }]);
    };
    addEventListener(EVENT, onPopup);
    return () => removeEventListener(EVENT, onPopup);
  }, []);

  useEffect(() => {
    if (!open.length) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen((o) => o.slice(0, -1));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open.length]);

  const close = (id: number, then?: Popup) => {
    setOpen((o) => o.filter((p) => p.id !== id));
    if (then) setTimeout(() => openPopup(then), 120);
  };

  return (
    <>
      {open.map((p, i) => (
        <PopupWindow key={p.id} popup={p} index={i} onClose={(then) => close(p.id, then)} />
      ))}
    </>
  );
}
