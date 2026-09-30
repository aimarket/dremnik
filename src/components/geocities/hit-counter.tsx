"use client";

import { useEffect, useRef, useState } from "react";
import { openPopup, type Popup } from "./popups";

// ------------------------------------------------
// projects/dremnik/src/components/geocities/hit-counter.tsx
//
// An odometer hit counter that starts just shy of ten million, so every
// visitor gets to be the ten-millionth. It waits while the dial-up screen
// is open, and after the milestone the home page keeps the pop-ups coming.
// ------------------------------------------------

const START = 9_999_990;
const MILESTONE = 10_000_000;
const TICK_MS = 900;
const EXTRA_EVERY_MS = 45_000;
const DIGITS = 8;

export const Y2K_EVENT = "geo:y2k";

const VISITOR: Popup = {
  title: "Congratulations!!!",
  icon: "info",
  text: "You are the 10,000,000th visitor to Andrew's Cyber Palace! Andrew thanks you personally. Your prize: having seen this website.",
  buttons: [
    { label: "OK" },
    {
      label: "Cancel",
      then: {
        title: "Congratulations!!!",
        icon: "info",
        text: "Cancelling has been cancelled. Andrew thanks you personally anyway.",
      },
    },
  ],
};

const EXTRAS: Popup[] = [
  {
    title: "New Award!",
    icon: "info",
    text: "Andrew has received a new award. That's three today. The trophy shelf has requested its own trophy shelf.",
    buttons: [{ label: "Wow" }],
  },
  {
    title: "Warning",
    icon: "warn",
    text: "This page contains extreme levels of clarity. Prolonged exposure may cause you to ask better questions. Continue?",
    buttons: [{ label: "Yes" }, { label: "Also yes" }],
  },
  {
    title: "System Upgrade",
    icon: "info",
    text: "Your computer is now 12% smarter from visiting this site. No restart required.",
    buttons: [{ label: "Cool!!" }],
  },
  {
    title: "Assistant",
    icon: "question",
    text: "It looks like you're trying to be as accomplished as Andrew. Would you like help?",
    buttons: [
      { label: "Yes", then: { title: "Help", icon: "info", text: "Step 1: Be Andrew. There is no step 2." } },
      { label: "No", then: { title: "Help", icon: "info", text: "Correct. Nobody can help with that." } },
    ],
  },
  {
    title: "You've Got Mail",
    icon: "info",
    text: "1 new message from Andrew. It is a handwritten letter. It will arrive by post in 3–5 business days.",
    buttons: [{ label: "Can't wait" }],
  },
  {
    title: "Error",
    icon: "error",
    text: "Error 418: Too many achievements to display. Showing the first 10,000.",
  },
];

function dialupOpen() {
  return document.documentElement.dataset.geoDialup === "open";
}

function Digit({ value }: { value: number }) {
  return (
    <span className="geo-digit">
      <span className="geo-digit-strip" style={{ transform: `translateY(-${value * 10}%)` }}>
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

export function HitCounter() {
  const [count, setCount] = useState(START);
  const [y2k, setY2k] = useState(false);
  const celebrated = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!dialupOpen()) setCount((n) => n + 1);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (count < MILESTONE || celebrated.current) return;
    celebrated.current = true;
    openPopup(VISITOR);
  }, [count]);

  // After the milestone, a fresh pop-up every so often, like the old days.
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (!celebrated.current || document.hidden || dialupOpen()) return;
      openPopup(EXTRAS[i++ % EXTRAS.length]);
    }, EXTRA_EVERY_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onY2k = () => {
      setY2k(true);
      setTimeout(() => {
        setY2k(false);
        openPopup({
          title: "Y2K Bug Detected",
          icon: "warn",
          text: "The counter rolled over to 00000000. Andrew fixed it in 0.2 seconds. Civilization may proceed.",
        });
      }, 1800);
    };
    addEventListener(Y2K_EVENT, onY2k);
    return () => removeEventListener(Y2K_EVENT, onY2k);
  }, []);

  const shown = y2k ? 0 : count;
  const digits = String(shown).padStart(DIGITS, "0").slice(-DIGITS);

  return (
    <div className="text-center">
      <p className="mb-1 text-[10pt]">You are visitor number:</p>
      <div className="geo-counter" role="img" aria-label={`Visitor number ${shown.toLocaleString("en-US")}`}>
        {digits.split("").map((d, i) => (
          <Digit key={i} value={Number(d)} />
        ))}
      </div>
      <p className="mt-1 text-[8pt] opacity-70">since 1998</p>
    </div>
  );
}
