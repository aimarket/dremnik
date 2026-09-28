import { ImageResponse } from "next/og";

import { OG_SIZE, renderPaintingCard } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Andrew Jones · dremnik";
export const size = OG_SIZE;
export const contentType = "image/png";

// Default OG card for the site root (inherited by routes without their own
// opengraph-image).
export default async function Image() {
  return new ImageResponse(
    await renderPaintingCard("raphael-school-of-athens"),
    size
  );
}
