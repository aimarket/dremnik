import { notFound } from "next/navigation";
import { allPosts } from "content-collections";
import { formatBlogDate } from "@/lib/blog-date";

import { BackLink } from "@/components/back-link";
import { Markdown } from "@/components/markdown";
import { ScrollComplete } from "@/components/rpg";

interface Props {
  params: Promise<{ slug: string }>;
}


export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
    <div className="max-w-[var(--content-width)] mx-auto px-6 md:px-10 pt-8 pb-40">
      <div className="mb-12">
        <BackLink
          fallback="/blog"
          className="font-mono text-[8.5pt] text-muted hover:text-ink transition-colors duration-200"
        >
          ← back
        </BackLink>
      </div>

      <article>
        <header className="flex flex-col gap-2 pb-2">
          <p className="font-pixel text-[8px] leading-[1.8] text-[#9fe870]">
            QUEST LOG · SCROLL OF LORE
          </p>
          <h1 className="text-[22pt] md:text-[25pt] font-medium text-ink tracking-[-0.02em] leading-[1.15]">
            {post.title}
          </h1>
          <div className="font-system text-[10.5pt] text-muted tabular-nums">
            {formatBlogDate(post.date)}
          </div>
        </header>

        {post.hero && (
          <figure className="mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.hero}
              alt={post.heroAlt ?? post.title}
              className="w-full h-auto rounded-lg"
            />
          </figure>
        )}

        <div className="prose-tilde">
          <Markdown content={post.content} />
        </div>
        <ScrollComplete />
      </article>
    </div>
    </>
  );
}

export async function generateStaticParams() {
  const posts = allPosts;

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return {};
  }

  const siteUrl = "https://dremnik.com";

  // OG/Twitter images come from the dynamic opengraph-image.tsx in this route.
  return {
    title: post.title,
    description: post.description ?? post.title,
    openGraph: {
      title: post.title,
      description: post.description ?? post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? post.title,
    },
  };
}
