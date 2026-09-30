import localFont from "next/font/local";
import { Inter, Geist, Geist_Mono, Press_Start_2P, VT323 } from "next/font/google";

// 8-bit type for Andrew Quest: Press Start 2P for labels and titles (small
// doses only), VT323 for dialog boxes, where you actually read.
export const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

export const vt = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt",
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const ppFamily = localFont({
  src: [
    { path: "../../public/fonts/Family/TestFamilyVF-Roman.ttf", style: "normal" },
    { path: "../../public/fonts/Family/TestFamily-Italic.otf", style: "italic", weight: "400" },
    { path: "../../public/fonts/Family/TestFamily-MediumItalic.otf", style: "italic", weight: "500" },
  ],
  variable: "--font-family",
  display: "swap",
});

export const financierText = localFont({
  src: [
    { path: "../../public/fonts/Family/TestFinancierText-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Family/TestFinancierText-RegularItalic.otf", weight: "400", style: "italic" },
  ],
  variable: "--font-financier-text",
  display: "swap",
});

export const tiemposText = localFont({
  src: [
    { path: "../../public/fonts/Tiempos/TestTiemposText-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Tiempos/TestTiemposText-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/Tiempos/TestTiemposText-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Tiempos/TestTiemposText-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../../public/fonts/Tiempos/TestTiemposText-Semibold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Tiempos/TestTiemposText-SemiboldItalic.otf", weight: "600", style: "italic" },
    { path: "../../public/fonts/Tiempos/TestTiemposText-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Tiempos/TestTiemposText-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-tiempos",
  display: "swap",
});

export const edictDisplay = localFont({
  src: [
    { path: "../../public/fonts/Edict/EdictDisplayTrial-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Edict/EdictDisplayTrial-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../../public/fonts/Edict/EdictDisplayTrial-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Edict/EdictDisplayTrial-RegularItalic.otf", weight: "400", style: "italic" },
    // no Medium in the trial — map 500 -> Regular to avoid faux-bold
    { path: "../../public/fonts/Edict/EdictDisplayTrial-Regular.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Edict/EdictDisplayTrial-RegularItalic.otf", weight: "500", style: "italic" },
  ],
  variable: "--font-edict",
  display: "swap",
});

export const financierDisplay = localFont({
  src: [
    { path: "../../public/fonts/Family/TestFinancierDisplay-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Family/TestFinancierDisplay-Regular.otf", weight: "400", style: "normal" },
  ],
  variable: "--font-financier-display",
  display: "swap",
});

// ----------------------------------
// projects/dremnik/src/lib/fonts.ts
//
// export const inter             L13
// export const sfProDisplay      L19
// export const sfMono            L40
// export const founderGrotesk    L56
// ----------------------------------

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const sfProDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/SF/SF-Pro-Display-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF/SF-Pro-Display-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF/SF-Pro-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro-display",
});

export const sfMono = localFont({
  src: [
    {
      path: "../../public/fonts/SF/SF-Mono-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF/SF-Mono-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sf-mono",
});

export const founderGrotesk = localFont({
  src: "../../public/fonts/FoundersGrotesk/TestFoundersGrotesk-Regular.otf",
  variable: "--font-founder-grotesk",
});

export const spezia = localFont({
  src: [
    { path: "../../public/fonts/Spezia/Spezia-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Spezia/Spezia-Book.woff2", weight: "350", style: "normal" },
    { path: "../../public/fonts/Spezia/Spezia-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Spezia/Spezia-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-spezia",
  display: "swap",
});