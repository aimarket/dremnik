import type { Metadata } from "next";
import { allPosts } from "content-collections";
import { Terminal } from "@/components/terminal/terminal";
import { SIDE_PROJECTS } from "@/lib/projects";

// -------------------------------------
// projects/dremnik/src/app/page.tsx
//
// const IR                          L21
// const latestPosts                 L28
// export default function Home()    L33
// -------------------------------------

// The homepage is a trading terminal now. Andrew has gone public.

export const metadata: Metadata = {
  title: { absolute: "$DREM — ANDREW JONES HOLDINGS" },
  description: "ANDREW JONES HOLDINGS ($DREM). Rating: STRONG BUY. Price target: ∞.",
};

const IR = {
  email: "andrew@dremnik.com",
  x: "https://x.com/dremnik",
  github: "https://github.com/dremnik",
  linkedin: "https://www.linkedin.com/in/andrew-jones-013154219",
};

const latestPosts = [...allPosts]
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .map((p) => ({ slug: p.slug, title: p.title, date: String(p.date) }));

export default function Home() {
  return <Terminal posts={latestPosts} subsidiaries={SIDE_PROJECTS} ir={IR} />;
}
