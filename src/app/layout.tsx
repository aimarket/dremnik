import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { geist, geistMono, tiemposText, financierDisplay, edictDisplay, spezia } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { NavTracker } from "@/components/back-link";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dremnik.com"),
  title: { default: "ANDREW JONES", template: "%s — ANDREW JONES" },
  description: "I build and write at the intersection of capital, machines, and intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${tiemposText.variable} ${financierDisplay.variable} ${edictDisplay.variable} ${spezia.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <NavTracker />
          <div className="min-h-[100svh] flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
