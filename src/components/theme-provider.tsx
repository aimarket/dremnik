// --------------------------------------
// projects/dremnik/src/components/theme-provider.tsx
//
// export function ThemeProvider()    L13
// children                           L16
// --------------------------------------

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      themes={["light", "dark", "rpg"]}
      defaultTheme="rpg"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
