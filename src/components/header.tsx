import Link from "next/link";
import { PopupButton, type Popup } from "@/components/geocities";

// A row of beveled buttons, the way navigation was meant to be.

const DARK_MODE: Popup = {
  title: "Dark Mode",
  icon: "info",
  text: "Dark mode has not been invented yet. Andrew has been notified and will get to it in 2019.",
  buttons: [{ label: "OK" }, { label: "Remind me in 2019" }],
};

export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-[820px] px-3 pt-4">
        <nav className="geo-navbar" aria-label="Main">
          <Link href="/" className="geo-btn">
            ⌂ dremnik
          </Link>
          <Link href="/blog" className="geo-btn">
            ✎ Web Log
          </Link>
          <Link href="/#guestbook" className="geo-btn">
            ✉ Guestbook
          </Link>
          <PopupButton className="geo-btn" popup={DARK_MODE}>
            ☾ Dark Mode
          </PopupButton>
        </nav>
      </div>
    </header>
  );
}
