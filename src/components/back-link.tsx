"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// "← back" that returns to wherever the reader came from inside the site
// (home, blog index, …). On a cold landing (shared link, new tab) there is no
// in-app history, so it falls through to its href.

let navigatedInApp = false;
let firstPath: string | null = null;

// Mounted once in the root layout; flips the flag after the first client-side
// route change.
export function NavTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (firstPath === null) firstPath = pathname;
    else if (pathname !== firstPath) navigatedInApp = true;
  }, [pathname]);
  return null;
}

export function BackLink({
  fallback,
  className,
  children,
}: {
  fallback: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Link
      href={fallback}
      className={className}
      onClick={(e) => {
        if (!navigatedInApp || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        router.back();
      }}
    >
      {children}
    </Link>
  );
}
