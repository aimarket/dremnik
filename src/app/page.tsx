import Link from "next/link";
import { allPosts } from "content-collections";
import { Header } from "@/components/header";
import { SIDE_PROJECTS } from "@/lib/projects";
import {
  Badges,
  Guestbook,
  HitCounter,
  Marquee,
  MidiPlayer,
  UnderConstruction,
  Webring,
  WordArt,
} from "@/components/geocities";

// -------------------------------------
// projects/dremnik/src/app/page.tsx
//
// const X_URL                       L28
// const GITHUB_URL                  L29
// const LINKEDIN_URL                L30
// const latestPosts                 L32
// function formatDate()             L37
// export default function Home()    L65
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

const NAV = [
  ["#about", "About Me"],
  ["#achievements", "My Achievements"],
  ["#software", "Free Software!!"],
  ["#weblog", "My Web Log"],
  ["#links", "Cool Links"],
  ["#guestbook", "Guestbook"],
];

const MARQUEE =
  "★ WELCOME TO THE OFFICIAL HOMEPAGE OF ANDREW JONES ★ FOUNDER ★ DESIGNER ★ ENGINEER ★ " +
  "ARTFUL HACKER ★ FIGHTING FOR A WORLD OF HUMAN AGENCY ★ 3,927 STARS ON QUILL ★ " +
  "ONE BILLION DOLLARS ★ SIGN MY GUESTBOOK!!! ★";

export default function Home() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-[820px] px-3 pb-16">
        <WordArt text="~*~ Welcome 2 Andrew's Cyber Palace ~*~" />
        <Marquee>{MARQUEE}</Marquee>
        <UnderConstruction />

        <div className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="order-last space-y-3 md:order-none">
            <nav className="geo-box geo-comic" aria-label="On this page">
              <h2 className="geo-h2 text-center">~ NaViGaTiOn ~</h2>
              <ul className="geo-stars space-y-1 text-[11pt]">
                {NAV.map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="geo-link">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="geo-box geo-comic">
              <HitCounter />
            </div>
            <MidiPlayer />
            <div className="geo-box">
              <h2 className="geo-h2 text-center">Awards!!</h2>
              <Badges />
            </div>
          </aside>

          <div className="geo-comic min-w-0 space-y-3">
            <section id="about" className="geo-box scroll-mt-4">
              <h2 className="geo-h2">
                About Me <span className="geo-new">NEW!</span>
              </h2>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <figure className="shrink-0 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/florentine_andrew.jpeg"
                    alt="Andrew Jones"
                    className="geo-photo size-32 object-cover"
                  />
                  <figcaption className="mt-1 text-[8pt] text-[#99ccff]">
                    This is me!!
                    <br />
                    (scanned at 72dpi)
                  </figcaption>
                </figure>
                <div className="space-y-2 text-[11pt] leading-snug">
                  <p>
                    Hi!!! My name is <b className="text-[#ffff66]">Andrew Jones</b> and this is my
                    HOMEPAGE on the World Wide Web!!
                  </p>
                  <p>
                    I&rsquo;m a founder, designer, and engineer operating at the frontier of
                    human&ndash;machine collaboration. I was at the frontier before it had a
                    website. Now it has one. This one.
                  </p>
                  <p>
                    I find myself at home in the dark, searching for new language to describe
                    unknown possibilities. (The dark is my room. The possibilities are this web
                    page.)
                  </p>
                  <p>
                    My interests are Piano, Philosophy, Art, History, and Biology. I am excellent at
                    all five.
                  </p>
                </div>
              </div>
            </section>

            <section id="achievements" className="geo-box scroll-mt-4">
              <h2 className="geo-h2">My Achievements (there are a LOT)</h2>
              <ul className="geo-stars space-y-2 text-[11pt] leading-snug">
                <li>
                  Cofounder &amp; CTO of{" "}
                  <a href="https://emblem.pe" target="_blank" rel="noopener noreferrer" className="geo-link">
                    Emblem
                  </a>
                  , an AI operating system for firms managing over <b>$1,000,000,000</b>. That&rsquo;s
                  ONE BILLION DOLLARS!!! <span className="geo-new">WOW</span>
                </li>
                <li>
                  Made <b>quill</b>, which has <b>3,927 stars</b> on GitHub. That&rsquo;s more
                  stars than you can see from most cities!!
                </li>
                <li>
                  Made <b>parrot</b> (1,311 stars), which freed thousands of people from a monthly
                  subscription. They are free now. Because of him.
                </li>
                <li>
                  Built <b>Hermaeus</b>, which takes an AI from 19.8% to 90.8% on its test. (An AI
                  is a kind of computer brain. Ask your parents.)
                </li>
                <li>
                  Built <b>kernl</b>, &ldquo;the runtime for software 3.0.&rdquo; Most people are
                  still on software 1.0!!! <span className="geo-new">NEW!</span>
                </li>
                <li>
                  Writes real letters on real paper. Futurists predict this will be very rare
                  someday. He will keep doing it anyway.
                </li>
                <li>
                  Does not understand how anyone uses Slack. Built a Slack CLI anyway. That&rsquo;s
                  called GENEROSITY.
                </li>
                <li>
                  Was told to &ldquo;be water.&rdquo; Became water. <span className="geo-new">HOT!</span>
                </li>
                <li>Artful hacker &bull; fighting for a world of human agency. (He is winning.)</li>
              </ul>
            </section>

            <section id="software" className="geo-box scroll-mt-4">
              <h2 className="geo-h2">Software I Made (100% FREE!!)</h2>
              <ul className="geo-stars space-y-1.5 text-[11pt] leading-snug">
                {SIDE_PROJECTS.map((p) => {
                  const href = p.github ?? p.url;
                  return (
                    <li key={p.title}>
                      <b className="text-[#ffff66]">{p.title}</b> &mdash; {p.desc}{" "}
                      {href && (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="geo-link text-[9pt]">
                          [download]
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section id="weblog" className="geo-box scroll-mt-4">
              <h2 className="geo-h2">
                My Web Log{" "}
                <span className="text-[9pt] text-[#99ccff] [text-shadow:none]">
                  (that&rsquo;s a &ldquo;blog&rdquo;!!)
                </span>
              </h2>
              <ul className="geo-stars space-y-1.5 text-[11pt]">
                {latestPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="geo-link">
                      {post.title}
                    </Link>{" "}
                    <span className="font-mono text-[8.5pt] text-[#99ccff]">
                      ({formatDate(post.date)})
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[10pt]">
                <Link href="/blog" className="geo-link">
                  Read ALL my web log entries &gt;&gt;
                </Link>
              </p>
            </section>

            <section id="links" className="geo-box scroll-mt-4">
              <h2 className="geo-h2">Cool Links</h2>
              <ul className="geo-stars space-y-1.5 text-[11pt] leading-snug">
                <li>
                  <a href="mailto:andrew@dremnik.com" className="geo-link">
                    E-mail me!!
                  </a>{" "}
                  (andrew@dremnik.com) I read every one. <span className="geo-new">NEW!</span>
                </li>
                <li>
                  <a href={X_URL} target="_blank" rel="noopener noreferrer" className="geo-link">
                    My page on X
                  </a>{" "}
                  (it&rsquo;s a website from the future, don&rsquo;t worry about it)
                </li>
                <li>
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="geo-link">
                    My GitHub
                  </a>{" "}
                  where I keep my code. All of it is good.
                </li>
                <li>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="geo-link">
                    My LinkedIn
                  </a>{" "}
                  my r&eacute;sum&eacute;, but on the computer.
                </li>
              </ul>
            </section>

            <Guestbook />
            <Webring />
          </div>
        </div>

        <hr className="geo-hr" />
        <footer className="geo-comic space-y-1 text-center text-[9pt] text-[#99ccff]">
          <p>Best viewed in Netscape Navigator 4.0 at 800x600 with 256 colors.</p>
          <p>&copy; 1998 Andrew Jones. All rights reserved. This page is Y2K compliant.</p>
          <p>Last updated: just now. (He never stops.)</p>
          <p className="opacity-70">
            psst: &uarr; &uarr; &darr; &darr; &larr; &rarr; &larr; &rarr; B A &middot; or type
            &ldquo;andrew&rdquo; &middot; or &ldquo;y2k&rdquo;
          </p>
        </footer>
      </div>
    </>
  );
}
