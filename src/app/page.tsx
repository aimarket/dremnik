import Link from "next/link";
import { allPosts } from "content-collections";
import { IconGithub, IconLinkedIn, IconTwitterX } from "@/components/ui/icons";
import { Header } from "@/components/header";
import { BossBattle, CharacterSheet, Inventory, QuestLog } from "@/components/rpg";

// -------------------------------------
// projects/dremnik/src/app/page.tsx
//
// const X_URL                       L19
// const GITHUB_URL                  L20
// const LINKEDIN_URL                L21
// const latestPosts                 L23
// function formatDate()             L28
// export default function Home()    L39
// -------------------------------------

const X_URL = "https://x.com/dremnik";
const GITHUB_URL = "https://github.com/dremnik";
const LINKEDIN_URL = "https://www.linkedin.com/in/andrew-jones-013154219";

const latestPosts = [...allPosts]
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 4);

function formatDate(d: Date | string) {
  const date = new Date(d);
  return date
    .toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    })
    .replaceAll("/", ".");
}

export default function Home() {
  return (
    <>
    <Header />
    <div className="max-w-[var(--content-width)] mx-auto px-6 md:px-10 pt-8 pb-40 text-[11pt] md:text-[10.5pt] leading-[1.5]">
      <section className="mb-12">
        <p className="font-pixel text-[8px] leading-[1.8] text-[#9fe870] mb-3">
          ★ ANDREW HAS JOINED THE PARTY
        </p>
        <h1 className="text-[22pt] md:text-[20pt] font-medium tracking-[-0.035em] text-ink leading-tight">
          Andrew Jones
        </h1>
        <div className="mt-4 flex items-center justify-between gap-4">
          <a
            href="mailto:andrew@dremnik.com"
            className="text-muted text-[10.5pt] md:text-[9.5pt] hover:underline underline-offset-4 decoration-[1px] decoration-muted"
          >
            andrew@dremnik.com
          </a>
          <div className="flex items-center gap-4 shrink-0 text-ink">
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="hover:text-link transition-colors duration-200"
            >
              <IconTwitterX className="size-[14px] md:size-[13px]" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-link transition-colors duration-200"
            >
              <IconGithub className="size-[14px] md:size-[13px]" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-link transition-colors duration-200"
            >
              <IconLinkedIn className="size-[16px] md:size-[15px]" />
            </a>
          </div>
        </div>

        <CharacterSheet />

        <section className="rpg-window mt-10" aria-labelledby="lore-title">
          <h2 id="lore-title" className="rpg-window-title">
            LORE
          </h2>
          <div className="space-y-4 text-[11pt] md:text-[10.5pt] leading-[1.65] text-[#e2e4ff]">
            <p>
              Long ago, in an age of slow software, a founder, designer, and
              engineer set out for the frontier of human&ndash;machine
              collaboration. He never came back. He didn&rsquo;t need to. He
              lives there now.
            </p>
            <p>
              As cofounder and CTO of{" "}
              <a
                href="https://emblem.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ffd84a] underline underline-offset-4 decoration-[1px] decoration-[#ffd84a]/50 hover:decoration-[#ffd84a]"
              >
                Emblem
              </a>
              , he forged an AI operating system for private equity, venture,
              and family offices, and accelerated diligence for firms managing
              over $1B in assets. The old diligence took weeks. His took a
              cutscene.
            </p>
            <p>
              He is at home in the dark, searching for new language to describe
              unknown possibilities. The oracle speaks:{" "}
              <em className="text-white">&ldquo;A question is its answer with noise.&rdquo;</em>{" "}
              AI will happily give you answers, but it won&rsquo;t tell you
              you&rsquo;re asking the wrong question. He will. It&rsquo;s his
              signature move.
            </p>
          </div>
        </section>
      </section>

      <QuestLog />

      <BossBattle />

      <Inventory />

      {latestPosts.length > 0 && (
        <section className="rpg-window mt-10" aria-labelledby="scrolls-title">
          <h2 id="scrolls-title" className="rpg-window-title">
            SCROLLS OF LORE
          </h2>
          <ul className="space-y-2.5 md:space-y-1.5">
            {latestPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline justify-between gap-4"
                >
                  <span className="text-white text-[11pt] md:text-[10.5pt] font-medium tracking-[-0.015em]">
                    <span aria-hidden="true" className="mr-2 font-pixel text-[8px] text-[#ffd84a] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                      ▶
                    </span>
                    <span className="group-hover:underline underline-offset-4 decoration-[1px]">
                      {post.title}
                    </span>
                  </span>
                  <span className="font-pixel text-[7px] md:text-[8px] text-[#9fa6ff] shrink-0">
                    {formatDate(post.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-16 text-center font-pixel text-[7px] md:text-[8px] leading-[2.2] text-muted">
        <p>© 1487–∞ ANDREW QUEST · NO CONTINUES REQUIRED</p>
        <p className="opacity-70">↑ ↑ ↓ ↓ ← → ← → B A</p>
      </footer>
    </div>
    </>
  );
}
