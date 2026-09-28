import { ImageResponse } from "next/og";
import { allPosts } from "content-collections";

import { OG_SIZE, renderPaintingCard } from "@/lib/og";
import { paintingFor } from "@/lib/paintings";

export const runtime = "nodejs";
export const alt = "dremnik essay";
export const size = OG_SIZE;
export const contentType = "image/png";

// Per-post OG card: the post's painting (frontmatter `painting`, else a stable
// pick by slug).
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  return new ImageResponse(
    await renderPaintingCard(paintingFor(slug, post?.painting)),
    size
  );
}
