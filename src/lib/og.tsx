import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { PAINTINGS, type Painting, type PaintingId } from "@/lib/paintings";

// Shared renderer for the dynamic OG cards (app/opengraph-image.tsx and
// app/blog/[slug]/opengraph-image.tsx). The card is the painting alone; the
// title travels in the og:title metadata.
export const OG_SIZE = { width: 1200, height: 630 } as const;

// object-fit: cover, positioned so `focus` sits as near the card's centre as
// the painting's edges allow.
function coverCrop({ width, height, focus: [fx, fy] }: Painting) {
  const scale = Math.max(OG_SIZE.width / width, OG_SIZE.height / height);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const clamp = (v: number, min: number) => Math.min(0, Math.max(min, v));
  return {
    width: w,
    height: h,
    left: Math.round(clamp(OG_SIZE.width / 2 - fx * w, OG_SIZE.width - w)),
    top: Math.round(clamp(OG_SIZE.height / 2 - fy * h, OG_SIZE.height - h)),
  };
}

export async function renderPaintingCard(id: PaintingId) {
  const photo = await readFile(
    join(process.cwd(), `public/og/paintings/${id}.jpg`)
  );
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const crop = coverCrop(PAINTINGS[id]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#0e0a06",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width={crop.width}
        height={crop.height}
        style={{ position: "absolute", left: crop.left, top: crop.top }}
        alt=""
      />
    </div>
  );
}
