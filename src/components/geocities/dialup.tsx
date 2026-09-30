"use client";

import { useEffect, useState } from "react";
import { Win95Window } from "./window";
import { playDialup } from "./sound";

// ------------------------------------------------
// projects/dremnik/src/components/geocities/dialup.tsx
//
// Once per browser session you have to dial in. The Connect click doubles as
// the user gesture the browser needs before it will play the modem. While
// this is up, <html data-geo-dialup="open"> tells the hit counter to wait.
// ------------------------------------------------

const SEEN = "geo:connected";

const STATUS = [
  "Dialing 1-800-ANDREW-1…",
  "Negotiating with the Information Superhighway…",
  "Verifying user name and password…",
  "Verifying magnificence… (this may take a moment)",
  "Logging on to Andrew's Cyber Palace…",
];

// Used when the browser has no audio: roughly the length of the handshake.
const SILENT_S = 5;

type Phase = "idle" | "dialing" | "connected" | "gone";

function remember() {
  try {
    sessionStorage.setItem(SEEN, "1");
  } catch {}
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid grid-cols-[96px_1fr] items-center gap-2">
      <span>{label}</span>
      <input className="geo-field w-full" value={value} readOnly />
    </label>
  );
}

export function DialUp() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN)) setPhase("gone");
    } catch {}
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (phase === "gone") {
      delete html.dataset.geoDialup;
      html.style.overflow = "";
      return;
    }
    html.dataset.geoDialup = "open";
    html.style.overflow = "hidden";
  }, [phase]);

  const connect = () => {
    remember();
    const seconds = playDialup() || SILENT_S;
    setPhase("dialing");
    STATUS.forEach((_, i) => setTimeout(() => setStep(i), (i * seconds * 1000) / STATUS.length));
    setTimeout(() => setPhase("connected"), seconds * 1000);
    setTimeout(() => setPhase("gone"), seconds * 1000 + 1600);
  };

  const offline = () => {
    remember();
    setPhase("gone");
  };

  if (phase === "gone") return null;

  return (
    <div className="geo-desktop fixed inset-0 z-[150] grid place-items-center overflow-auto p-4">
      <Win95Window title="Connect To" className="w-full max-w-[400px]" onClose={offline}>
        <div className="flex gap-4 p-3">
          <div aria-hidden="true" className="geo-modem shrink-0">
            <span className={phase === "dialing" ? "geo-led geo-led-on" : "geo-led"} />
            <span className={phase === "dialing" ? "geo-led geo-led-on [animation-delay:.13s]" : "geo-led"} />
            <span className={phase === "connected" ? "geo-led geo-led-solid" : "geo-led"} />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="font-bold">Andrew&rsquo;s Cyber Palace</p>
            {phase === "idle" && (
              <>
                <Field label="User name:" value="guest_of_andrew" />
                <Field label="Password:" value="••••••••••" />
                <Field label="Phone number:" value="1-800-ANDREW-1" />
                <Field label="Dialing from:" value="The Information Superhighway" />
                <label className="flex items-center gap-2 pt-1">
                  <input type="checkbox" defaultChecked className="geo-check" />
                  Save password
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="geo-check" />
                  Connect automatically to greatness
                </label>
              </>
            )}
            {phase === "dialing" && (
              <div role="status" className="space-y-2 py-2">
                <p>Status: {STATUS[step]}</p>
                <div className="geo-progress">
                  <span style={{ width: `${((step + 1) / STATUS.length) * 100}%` }} />
                </div>
              </div>
            )}
            {phase === "connected" && (
              <p role="status" className="py-2">
                Connected at <b>56,000 bps</b> (Andrew&rsquo;s personal line).
                <br />
                Welcome!!
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-3 pb-3">
          {phase === "idle" && (
            <button type="button" autoFocus className="geo-btn font-bold" onClick={connect}>
              Connect
            </button>
          )}
          <button type="button" className="geo-btn" onClick={offline}>
            {phase === "idle" ? "Work Offline" : "Skip"}
          </button>
        </div>
      </Win95Window>
    </div>
  );
}
