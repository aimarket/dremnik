"use client";

import Link from "next/link";
import { useMemo } from "react";
import { allPosts } from "content-collections";
import { formatBlogDate } from "@/lib/blog-date";


export default function Blog() {
  const groupedPosts = useMemo(() => {
    const sortedPosts = [...allPosts]
      .filter((post) => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const grouped: { [key: string]: typeof allPosts } = {};
    sortedPosts.forEach((post) => {
      const year = new Date(post.date).getFullYear().toString();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(post);
    });

    return grouped;
  }, []);

  return (
    <div className="max-w-[var(--content-width)] mx-auto px-6 md:px-10 pt-8 pb-24 text-[10.5pt]">
      {Object.entries(groupedPosts)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
        .map(([year, posts]) => (
          <section key={year} className="mb-10">
            <h2 className="font-mono text-[8.5pt] uppercase tracking-[0.08em] text-muted mb-3 pb-1.5 border-b border-rule">
              {year}
            </h2>
            <ul className="space-y-1.5">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex items-baseline justify-between gap-4"
                  >
                    <span className="text-ink text-[10.5pt] font-medium tracking-[-0.015em] group-hover:underline underline-offset-4 decoration-[1px] decoration-muted">
                      {post.title}
                    </span>
                    <span className="font-system text-[9pt] text-muted shrink-0 tabular-nums">
                      {formatBlogDate(post.date, false)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
