import Link from "next/link";
import { Crown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="w-full">
      <div className="max-w-[var(--content-width)] mx-auto px-6 md:px-10 pt-8 pb-2">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 font-mono text-[9pt] tracking-[0.02em] text-link hover:text-link/80 transition-colors duration-200"
          >
            <Crown
              aria-hidden="true"
              className="mag-flap size-[12px] text-[var(--gold)] [animation-duration:1.8s]"
            />
            dremnik
          </Link>
          <div className="flex items-center gap-5 text-[10pt]">
            <Link
              href="/blog"
              className="text-muted hover:text-ink transition-colors duration-200"
            >
              Blog
            </Link>
            {/* Work hidden for now — site is focused on the blog.
            <Link
              href="/work"
              className="text-muted hover:text-ink transition-colors duration-200"
            >
              Work
            </Link>
            */}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
