"use client";

import { cn } from "@/lib/utils";
import { openPopup, type Popup } from "./popups";

// ------------------------------------------------
// projects/dremnik/src/components/geocities/window.tsx
//
// A 1995-era desktop window: navy title bar, beveled grey chrome, three
// little buttons. Windows without an onClose refuse to close, politely.
// ------------------------------------------------

const REFUSE: Record<"min" | "max" | "close", Popup> = {
  min: {
    title: "Cannot Minimize",
    icon: "error",
    text: "Andrew cannot be minimized.",
  },
  max: {
    title: "Already Maximized",
    icon: "info",
    text: "This window is already at maximum greatness.",
  },
  close: {
    title: "Are you sure?",
    icon: "question",
    text: "Are you sure you want to stop reading?",
    buttons: [
      { label: "No" },
      { label: "No", then: { title: "Great choice", icon: "info", text: "Andrew appreciates your loyalty." } },
    ],
  },
};

export function Win95Window({
  title,
  children,
  className,
  bodyClassName,
  onClose,
  titleBarProps,
  titleId,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  onClose?: () => void;
  titleBarProps?: React.HTMLAttributes<HTMLDivElement>;
  titleId?: string;
}) {
  return (
    <div className={cn("geo-window", className)}>
      <div className="geo-titlebar" {...titleBarProps}>
        <span id={titleId} className="truncate">
          {title}
        </span>
        <span className="flex shrink-0 gap-[2px]">
          <button type="button" aria-label="Minimize" className="geo-ctl" onClick={() => openPopup(REFUSE.min)}>
            _
          </button>
          <button type="button" aria-label="Maximize" className="geo-ctl" onClick={() => openPopup(REFUSE.max)}>
            □
          </button>
          <button
            type="button"
            aria-label="Close"
            className="geo-ctl ml-[2px]"
            onClick={onClose ?? (() => openPopup(REFUSE.close))}
          >
            ×
          </button>
        </span>
      </div>
      <div className={cn("geo-window-body", bodyClassName)}>{children}</div>
    </div>
  );
}
