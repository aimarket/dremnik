import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { geist, geistMono, tiemposText, financierDisplay, edictDisplay, spezia, comicNeue, anton } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { NavTracker } from "@/components/back-link";
import { Geocities } from "@/components/geocities";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dremnik.com"),
  title: { default: "~*~ Andrew's Cyber Palace ~*~", template: "%s ~*~ Andrew's Cyber Palace" },
  description: "The official homepage of Andrew Jones on the World Wide Web!!! Sign my guestbook!!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${tiemposText.variable} ${financierDisplay.variable} ${edictDisplay.variable} ${spezia.variable} ${comicNeue.variable} ${anton.variable} geo font-sans`}
      >
        <ThemeProvider>
          <NavTracker />
          <Geocities />
          <div className="min-h-[100svh] flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
