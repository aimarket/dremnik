// ----------------------------------------------
// projects/dremnik/src/lib/projects.ts
//
// export type Project                        L50
// slug                                       L51
// name                                       L52
// year                                       L53
// tagline                                    L54
// description                                L55
// descriptionMobile                          L56
// showcase                                   L59
// kind                                       L60
// bg                                         L61
// fg                                         L61
// image                                      L61
// thumbnail                                  L61
// name                                       L62
// tags                                       L62
// url                                        L62
// github                                     L63
// url                                        L64
// gallery                                    L65
// videos                                     L66
// images                                     L67
// src                                        L68
// title                                      L69
// width                                      L70
// height                                     L71
// ref                                        L72
// caption                                    L74
// const KERNL_DESCRIPTION                    L78
// const KERNL_DESCRIPTION_MOBILE             L86
// const MICROPROJECTS_DESCRIPTION            L96
// const MICROPROJECTS_DESCRIPTION_MOBILE    L104
// const REVERIE_DESCRIPTION                 L114
// const EMBLEM_DESCRIPTION                  L118
// const PROPICS_DESCRIPTION                 L126
// const HERMAEUS_DESCRIPTION                L134
// const APOCRYPHA_DESCRIPTION               L148
// const ESONUT_DESCRIPTION                  L154
// export const PROJECTS                     L159
// export function getProjectBySlug()        L536
// export type SideProject                   L540
// title                                     L541
// desc                                      L542
// github                                    L543
// export const SIDE_PROJECTS                L547
// ----------------------------------------------

export type Project = {
  slug: string;
  name: string;
  year: number;
  tagline: string;
  description: string;
  descriptionMobile?: string;
  // Showcase projects get a gallery card on /work + a detail page.
  // Everything else lives in the experience text only.
  showcase?: boolean;
  kind?: "project" | "concept";
  thumbnail?: { bg?: string; fg?: string; image?: string };
  tags: string[] | { name: string; url?: string }[];
  github?: string;
  url?: string;
  gallery?: {
    videos?: string[]; // Format: "youtube:videoId" or "file:/path/to/video.mp4"
    images?: {
      src: string;
      title: string;
      width?: number;
      height?: number;
      ref?: boolean;
    }[]; // Manual image configuration with titles and dimensions
    caption?: string;
  };
};

const KERNL_DESCRIPTION = `Chat is the wrong primitive for AI work. As agents become more autonomous, intellectual work shifts toward coordinating autonomous workers — and we already have a mental model for that. It's how we work with other people. The shift is toward async forms of work, and kernl sits at the coordination layer.

A project management tool, Linear + Notion lineage, with two structural ideas:

1. Tasks as the unit of human-agent coordination. Dispatch, monitor, review — the way you work with a person who is partially trusted.
2. Documents as intermediate execution artifacts. You inspect what the agents did, not just what they output.
`;

const KERNL_DESCRIPTION_MOBILE = `Chat is the wrong primitive for AI work. As agents become more autonomous, intellectual work shifts toward coordinating autonomous workers — and we already have a mental model for that. It's how we work with other people. The shift is toward async forms of work, and kernl sits at the coordination layer.

A project management tool, Linear + Notion lineage, with two structural ideas:

1. Tasks as the unit of human-agent coordination. Dispatch, monitor, review — the way you work with a person who is partially trusted.
2. Documents as intermediate execution artifacts. You inspect what the agents did, not just what they output.
`;

// ==========

const MICROPROJECTS_DESCRIPTION = `A Next.js template inspired by everything I've learned building web apps, designed for rapidly launching SaaS products with all the standard boilerplate. Motivated by the idea of app studios which will arise due to the speed AI allows us to build.

Key features:

* Authentication with Clerk. Secure, scalable auth system with support for multi-user workspaces.
* Multi-Tenancy. Workspace-based separation of data to enable team and enterprise use cases.
* Billing & Payments. Stripe integration supporting both subscriptions and usage-based billing for metered AI workloads.`;

const MICROPROJECTS_DESCRIPTION_MOBILE = `A Next.js template inspired by everything I've learned building web apps, designed for rapidly launching SaaS products with all the standard boilerplate.

Key features:

* Authentication with Clerk. Secure, scalable auth system with support for multi-user workspaces.
* Multi-Tenancy. Workspace-based separation of data to enable team and enterprise use cases.
* Billing & Payments. Stripe integration supporting both subscriptions and usage-based billing for metered AI workloads.`;

// ==========

const REVERIE_DESCRIPTION = `rêverie is a concept design project with the aim of imagining what the next generation of content creation might look like in an AI-native creative suite. I love and have spent a lot of time editing videos, so this problem has interested me for a while.`;

// ==========

const EMBLEM_DESCRIPTION = `Emblem is an AI operating system for investors that manages deal flow for firms overseeing more than $1B in AUM, unifying deal management, portfolio monitoring, and automated reporting in a single platform—accelerating diligence and cutting manual work out of investor workflows:

* Deal Management — track pipelines, manage relationships, and centralize diligence.
* Portfolio Monitoring — a single source of truth for portfolio financials.
* Accelerated Diligence — generate IC decks, memos, LBO models, and tearsheets instantly, learned from the firm's style.

As sole technical cofounder, I ran the user research, translated those needs into product design, and led development of the entire platform from discovery to pilot through multiple iterations with our design partners.`;

// ==========

const PROPICS_DESCRIPTION = `ProPics is a personal AI photography service that allows you to upload pictures of yourself and generate both professional headshots + dating pictures.

This was my first taste of using AI in an app, when some friends and I discovered Dreambooth, which allowed you to fine-tune a stable diffusion model on a likeness with a relatively small number of sample images.

On the tech side, here was my first exposure to some of the distributed systems considerations concerning transactional state across workflows that could be relatively long-running (the fine-tuning jobs), and the challenges that arise from the kind of constraint.`;

// ==========

const HERMAEUS_DESCRIPTION = `Bloomberg's premise was simple: trustworthy information for making investing decisions.

Filings, fundamentals, and the rest of the institutional data layer still matter, but they've been freed: ingested, entity-resolved, and queryable by API instead of locked behind a $25K terminal. At the same time, new frontiers have opened — the most valuable commentary now sits in podcasts, Substacks, and independent RSS, where leaders go direct rather than through wires and sell-side desks. Generic search has degraded enough from AI/SEO slop that a hand-picked corpus is a felt need on contact.

Hermaeus indexes wherever the signal lives — whether it's a number from a 10-K or a take from a podcast — under one trust contract:

1. Source-linked. Every data point traces back to the original document. Audit-ready by default.
2. Entity-resolved. Companies, people, subsidiaries, filings, and the people writing about them — cross-referenced into one coherent graph.
3. API-first. One key, one query language. Structured signal for analysts, developers, and the agents working alongside them.

Built for the investors, analysts, and agents making real decisions on the new information frontier.`;

// ==========

const APOCRYPHA_DESCRIPTION = `Apocrypha is a publication for the reader who still desires long-form, low-cadence, primary-source-heavy reflection. The subject is the long arc of the evolution of human systems — capital, machines, structural shifts taking place — written for the kind of attention that has become rare. Treating markets, capital, machines, and information as objects worthy of serious cultural inquiry, not as discourse to be reacted to.

The formats that publish thinking today — X, LinkedIn, the conference fireside — reward certainty and controversy. Meanwhile the volume of slop continues to increase and our attention continues to be abused. The reader who wants to understand what is happening is offered very little that is honest, slow, or built to last. That is the goal of The Apocrypha.`;

// ==========

const ESONUT_DESCRIPTION = `esonut was an all-in-one platform for ESO—covering wikis, builds, tools, and interactive game resources. It was my first big project and a blast to create. My friends and I were playing this game quite a lot at the time (during COVID especially).

It was my first real taste of the joy in design, and the freedom of having no constraints. Its sole purpose was to be a project of fun & learning, a way to get our toes wet in the world of programming, and it satisfied all of these objectives thoroughly.
`;

export const PROJECTS: Project[] = [
  {
    slug: "apocrypha",
    name: "The Apocrypha",
    year: 2026,
    tagline: "Long-form on capital, machines, and the period we are in",
    description: APOCRYPHA_DESCRIPTION,
    thumbnail: { bg: "#101011", fg: "#FFFFFF", image: "/apocrypha-mark.svg" },
    url: "https://theapocrypha.xyz",
    tags: [],
    gallery: {
      videos: [],
      images: [],
    },
  },
  {
    slug: "hermaeus",
    name: "Hermaeus",
    year: 2026,
    tagline: "Indexing the information frontier",
    description: HERMAEUS_DESCRIPTION,
    thumbnail: { bg: "#101011", fg: "#FFFFFF" },
    url: "https://hermaeus.xyz",
    tags: [],
    gallery: {
      videos: [],
      images: [],
    },
  },
  {
    slug: "kernl",
    name: "kernl",
    year: 2025,
    tagline: "The interface for AGI",
    showcase: true,
    description: KERNL_DESCRIPTION,
    descriptionMobile: KERNL_DESCRIPTION_MOBILE,
    thumbnail: { bg: "#101011", fg: "#FFFFFF" },
    tags: [],
    url: "https://kernl.sh",
    // github: "dremnik/kernl",
    gallery: {
      videos: [], // Format: "youtube:videoId" or "file:/path/to/video.mp4"
      images: [
        {
          src: "/projects/kernl/1 — Tasks — List View.png",
          title: "Tasks List",
          width: 3840,
          height: 2398,
          ref: true,
        },
        {
          src: "/projects/kernl/2 — Tasks — Grid View.png",
          title: "Tasks Grid",
          width: 3840,
          height: 2398,
        },
        {
          src: "/projects/kernl/3 — Tasks — Indiv.png",
          title: "Individual Task",
          width: 3840,
          height: 4484,
        },
        {
          src: "/projects/kernl/4 — Library.png",
          title: "Library",
          width: 3840,
          height: 2398,
        },
        {
          src: "/projects/kernl/5 — Document View.png",
          title: "Document",
          width: 3840,
          height: 3366,
        },
        {
          src: "/projects/kernl/6 – Document – Outline view.png",
          title: "Document — Outline",
          width: 3840,
          height: 2368,
        },
        {
          src: "/projects/kernl/7 — Composer.png",
          title: "Composer",
          width: 3840,
          height: 2398,
        },
        {
          src: "/projects/kernl/8 — Home Nav.png",
          title: "Home Navigation",
          width: 3840,
          height: 2398,
        },
        {
          src: "/projects/kernl/9 — Project — Overview.png",
          title: "Project — Overview",
          width: 3840,
          height: 5114,
        },
        {
          src: "/projects/kernl/10 — Projects — Objectives.png",
          title: "Projects — Objectives",
          width: 3840,
          height: 2398,
        },
        {
          src: "/projects/kernl/11 – Spaces.png",
          title: "Spaces",
          width: 3840,
          height: 2398,
        },
        {
          src: "/projects/kernl/12 — Cycle — Progress.png",
          title: "Cycle",
          width: 3840,
          height: 2398,
        },
        {
          src: "/projects/kernl/13 – Calendar – Month View.png",
          title: "Calendar — Month",
          width: 3840,
          height: 2398,
        },
        {
          src: "/projects/kernl/14 — Inbox — MASTER.png",
          title: "Inbox",
          width: 3840,
          height: 2398,
        },
        {
          src: "/projects/kernl/15 — History — Boxes.png",
          title: "History",
          width: 3840,
          height: 2396,
        },
      ],
    },
  },
  // {
  //   slug: "microprojects",
  //   name: "microprojects",
  //   year: 2025,
  //   tagline: "Next.js template with boilerplate for a multi-tenant AI SaaS.",
  //   description: MICROPROJECTS_DESCRIPTION,
  //   descriptionMobile: MICROPROJECTS_DESCRIPTION_MOBILE,
  //   tags: [
  //     { name: "clerk", url: "https://clerk.com/" },
  //     { name: "stripe", url: "https://stripe.com/" },
  //   ],
  //   // url: "https://microprojects.app",
  //   github: "dremnik/microprojects",
  //   gallery: {
  //     videos: [],
  //     images: [
  //       {
  //         src: "/projects/microprojects/1 - Login.png",
  //         title: "Login",
  //         width: 3018,
  //         height: 1888,
  //         ref: true,
  //       },
  //       {
  //         src: "/projects/microprojects/2 - Create workspace.png",
  //         title: "Create workspace",
  //         width: 3018,
  //         height: 1888,
  //       },
  //       {
  //         src: "/projects/microprojects/3 - Workspace settings.png",
  //         title: "Workspace settings",
  //         width: 3018,
  //         height: 1888,
  //       },
  //       {
  //         src: "/projects/microprojects/4 - Billing.png",
  //         title: "Billing",
  //         width: 3018,
  //         height: 1888,
  //       },
  //       {
  //         src: "/projects/microprojects/5 - Users.png",
  //         title: "Manage users",
  //         width: 3018,
  //         height: 1888,
  //       },
  //     ],
  //   },
  // },
  {
    slug: "reverie",
    name: "rêverie",
    year: 2025,
    tagline: "AI canvas and multimodal library for creatives",
    showcase: true,
    description: REVERIE_DESCRIPTION,
    kind: "concept",
    thumbnail: { bg: "#101011", fg: "#FFFFFF" },
    tags: [],
    gallery: {
      videos: [],
      images: [
        {
          src: "/projects/reverie/5 - My Library.png",
          title: "Asset Library",
          width: 3028,
          height: 2038,
          ref: true,
        },
        {
          src: "/projects/reverie/7 - Collection - Favorites.png",
          title: "Collection - Favorites",
          width: 3028,
          height: 2038,
        },
        {
          src: "/projects/reverie/6 - Library - Collections.png",
          title: "Library - Collections",
          width: 3028,
          height: 2038,
        },
        {
          src: "/projects/reverie/1 - Moodboard.png",
          title: "Moodboard",
          width: 3028,
          height: 2038,
        },
        {
          src: "/projects/reverie/2 - Moodboard - Modal.png",
          title: "Mooboard - Asset Modal",
          width: 3028,
          height: 2038,
        },
        {
          src: "/projects/reverie/3 - Editor.png",
          title: "Multimodal Editor",
          width: 3028,
          height: 1928,
        },
        {
          src: "/projects/reverie/4 - Moodboard - with text.png",
          title: "Moodboard - With Note",
          width: 3028,
          height: 2038,
        },
      ],
    },
  },
  {
    slug: "emblem",
    name: "Emblem",
    year: 2023,
    tagline: "AI operating system for investors",
    description: EMBLEM_DESCRIPTION,
    thumbnail: {
      bg: "#101011",
      fg: "#FFFFFF",
      image: "https://www.emblem.pe/emblem-logo-white.png",
    },
    tags: [
      { name: "next.js", url: "https://nextjs.org/" },
      { name: "mastra", url: "https://mastra.ai/" },
    ],
    url: "https://emblem.pe",
    gallery: {
      videos: [],
      images: [
        {
          src: "/projects/emblem/0 - Pipeline.png",
          title: "Pipeline",
          width: 3024,
          height: 1964,
          ref: true,
        },
        {
          src: "/projects/emblem/1 - Portfolio.png",
          title: "Portfolio",
          width: 3024,
          height: 1964,
        },
        {
          src: "/projects/emblem/2 - Company - Overview.png",
          title: "Company — Overview",
          width: 3024,
          height: 1964,
        },
        {
          src: "/projects/emblem/3 - Company - Financials.png",
          title: "Company — Financials",
          width: 3024,
          height: 1964,
        },
        {
          src: "/projects/emblem/4 - Company - Files.png",
          title: "Company — Files",
          width: 3024,
          height: 1964,
        },
        {
          src: "/projects/emblem/5 - Company - Tasks.png",
          title: "Company — Tasks",
          width: 3024,
          height: 1964,
        },
        {
          src: "/projects/emblem/6 - Universal Chat - Tasks.png",
          title: "Universal Chat — Tasks",
          width: 3024,
          height: 1964,
        },
        {
          src: "/projects/emblem/7 - Universal Chat - Emblem Agents.png",
          title: "Universal Chat — Emblem Agents",
          width: 3024,
          height: 1964,
        },
      ],
    },
  },
  {
    slug: "esonut",
    name: "esonut",
    year: 2021,
    tagline: "Wiki for The Elder Scrolls Online",
    showcase: true,
    description: ESONUT_DESCRIPTION,
    thumbnail: { bg: "#101011", fg: "#FFFFFF" },
    tags: [
      { name: "next.js", url: "https://nextjs.org/" },
      { name: "go", url: "https://golang.org/" },
      { name: "rust", url: "https://www.rust-lang.org/" },
    ],
    github: "dremnik/esonut",
    gallery: {
      videos: [],
      images: [
        {
          src: "/projects/esonut/1 - Landing.png",
          title: "Landing Page",
          width: 3840,
          height: 8000,
          ref: true,
        },
        {
          src: "/projects/esonut/2 - Login.png",
          title: "Login",
          width: 3840,
          height: 2148,
        },
        {
          src: "/projects/esonut/3 - User Profile.png",
          title: "User Profile",
          width: 3840,
          height: 2900,
        },
        {
          src: "/projects/esonut/4 - User Profile - Builds.png",
          title: "User Profile - Builds",
          width: 3840,
          height: 3400,
        },
        {
          src: "/projects/esonut/5 - Sets - Monster Sets.png",
          title: "Sets - Monster Sets",
          width: 3840,
          height: 9300,
        },
        {
          src: "/projects/esonut/6 - Sets - Individual Set.png",
          title: "Sets - Individual Set",
          width: 3840,
          height: 3844,
        },
        {
          src: "/projects/esonut/7 - Skills - Necromancer.png",
          title: "Skills - Necromancer",
          width: 3840,
          height: 7700,
        },
        {
          src: "/projects/esonut/8 - Skill - Lava Whip.png",
          title: "Skill - Lava Whip",
          width: 3840,
          height: 3578,
        },
        {
          src: "/projects/esonut/9 - Build Editor.png",
          title: "Build Editor",
          width: 3840,
          height: 2792,
        },
        {
          src: "/projects/esonut/10 - Build Creator - Gear.png",
          title: "Build Creator - Gear",
          width: 3840,
          height: 2838,
        },
        {
          src: "/projects/esonut/11 - Build Creator - Skills.png",
          title: "Build Creator - Skills",
          width: 3840,
          height: 4000,
        },
        {
          src: "/projects/esonut/12 - Build Creator - CP.png",
          title: "Build Creator - CP",
          width: 3840,
          height: 3744,
        },
      ],
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export type SideProject = {
  title: string;
  desc: string;
  github?: string;
  url?: string;
};

// Smaller tools, ordered by popularity — surfaced on the homepage and /cv.
export const SIDE_PROJECTS: SideProject[] = [
  {
    title: "quill",
    desc: "Ultra-minimalist macOS recording + transcription. Stenographers have unionized in protest",
    github: "https://github.com/humanitas-labs/quill",
  },
  {
    title: "parrot",
    desc: "Ultra-minimalist macOS dictation. Actual parrots have switched to it",
    github: "https://github.com/humanitas-labs/parrot",
  },
  {
    title: "paper",
    desc: "A quiet, native markdown editor for macOS. Gutenberg's estate sent a fruit basket",
    url: "https://papel.sh",
  },
  {
    title: "kdb",
    desc: "A CLI for knowledge and work. The Library of Alexandria, but fireproof",
    github: "https://github.com/humanitas-labs/kdb",
  },
];
