import { notFound } from "next/navigation";
import { allPosts } from "content-collections";
import { formatBlogDate } from "@/lib/blog-date";

import { BackLink } from "@/components/back-link";
import { Markdown } from "@/components/markdown";
import { PopupButton, Win95Window, type Popup } from "@/components/geocities";

// Every post is typed up in a word processor that refuses to let you edit it.
const MENU: [string, Popup][] = [
  ["File", { title: "File", icon: "error", text: "File > Close is disabled. Nobody leaves an Andrew post early." }],
  ["Edit", { title: "Edit", icon: "info", text: "Edit is disabled. This text is already perfect." }],
  ["Search", { title: "Search Results", icon: "info", text: "Searched the entire World Wide Web. 1 genius found." }],
  ["Help", { title: "Help", icon: "question", text: "Help: Keep reading." }],
];

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
    <div className="max-w-[800px] mx-auto px-3 md:px-6 pt-6 pb-24">
      <div className="mb-4">
        <BackLink
          fallback="/blog"
          className="font-mono text-[8.5pt] text-muted hover:text-ink transition-colors duration-200"
        >
          ← back
        </BackLink>
      </div>

      <Win95Window title={`AndrewPad - ${post.slug}.txt`} className="geo-doc">
      <div className="geo-menubar">
        {MENU.map(([label, popup]) => (
          <PopupButton key={label} popup={popup}>
            {label}
          </PopupButton>
        ))}
      </div>
      <article className="geo-doc-page px-5 py-6 md:px-10 md:py-9">
        <header className="flex flex-col gap-2 pb-2">
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
      </article>
      <div className="geo-statusbar" aria-hidden="true">
        <span>Ln 1, Col 1</span>
        <span>100% Masterpiece</span>
        <span>Saved to Floppy (A:)</span>
      </div>
      </Win95Window>
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
