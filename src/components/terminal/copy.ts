// ------------------------------------------------
// projects/dremnik/src/components/terminal/copy.ts
//
// Everything the terminal says. The facts are real (stars, benchmarks,
// taglines, one tweet); the conclusions drawn from them are not.
// ------------------------------------------------

export const COMPANY = "ANDREW JONES HOLDINGS";
export const TICKER = "$DREM";
export const EXCHANGE = "FRONTIER EXCHANGE";

export const HEADLINES = [
  "DREM PRICES IPO AT $100.00; BOOK OVERSUBSCRIBED 4,700,000×",
  "QUILL CROSSES 3,927 GITHUB STARS; STENOGRAPHERS CALL EMERGENCY MEETING",
  "PARROT (1,311★) FREES THOUSANDS FROM DICTATION SUBSCRIPTIONS; SUBSCRIPTION ECONOMY SEEKS COUNSELING",
  "HERMAEUS LIFTS CLAUDE FROM 19.8% TO 90.8% ON BENCHMARK; MODEL SENDS FRUIT BASKET",
  "EX-EMBLEM CTO'S DILIGENCE SO FAST, FIRMS WITH $1B+ AUM REPORT WHIPLASH",
  "KERNL, 'THE RUNTIME FOR SOFTWARE 3.0', SIGHTED; SOFTWARE 2.0 SEEN PACKING",
  "USPS SHARES JUMP AFTER DREM CEO RESUMES WRITING LETTERS",
  "CEO: 'IDK HOW ANYONE USES SLACK HONESTLY'; SHIPS A SLACK CLI ANYWAY — ANALYSTS CITE 'MERCY'",
  "BRUCE LEE ESTATE CONFIRMS: HE HAS BECOME WATER",
  "PAPER, 'THE SIMPLEST MARKDOWN EDITOR IMAGINABLE', AUDITED: CONTAINS NOTHING BUT TEXT, AS PROMISED",
  "19.1K FOLLOWERS ON X; EACH REPORTEDLY 'PERSONALLY ENLIGHTENED'",
  "BAYESIAN MODEL OF THE WORLD UPDATES; PRIOR ON GREATNESS CONFIRMED",
  "AMDAHL'S LAW AMENDED: CLARITY NOW SCALES, FOR ONE (1) MAN",
  "ANALYSTS RAISE PRICE TARGET TO ∞, CITING 'FUNDAMENTALS AND ALSO VIBES'",
  "SHORT SELLERS LOCATED; THEY 'JUST WANT TO TALK'",
  "'A QUESTION IS ITS ANSWER WITH NOISE,' SAYS CEO; NOISE FUTURES COLLAPSE",
  "CHOPIN FUND REVISES REVIEW OF CEO'S PIANO FROM FIVE STARS TO SIX",
  "HUMAN AGENCY INDEX HITS ALL-TIME HIGH; 'ARTFUL HACKER' CREDITED",
];

export const STATS: [label: string, value: string][] = [
  ["MKT CAP", "yes"],
  ["P/E", "∞"],
  ["DIVIDEND", "wisdom, paid quarterly"],
  ["52-WK LOW", "never"],
  ["52-WK HIGH", "now"],
  ["BETA", "0 — markets move with him, not vice versa"],
  ["FLOAT", "1 share, held by believers"],
  ["CONSENSUS", "STRONG BUY (47/47)"],
  ["EMPLOYEES", "1 (sufficient)"],
  ["SHORT INT.", "0.00% — they tried"],
];

export const DESCRIPTION = [
  "ANDREW JONES HOLDINGS is a founder, designer, and engineer operating at the frontier of human–machine collaboration. The frontier reports to him.",
  "Formerly cofounder & CTO of Emblem, an AI operating system for private equity, venture, and family offices managing $1B+. Diligence accelerated; no survivors among the bottlenecks.",
  "Wholly owned divisions: Piano, Philosophy, Art, History, and Biology.",
];

export const S1: [heading: string, body: string][] = [
  [
    "PROSPECTUS SUMMARY",
    "We are one person. He is enough. We build and write at the intersection of capital, machines, and intelligence, and have recently annexed the intersection.",
  ],
  ["RISK FACTORS", "None identified. We looked. We looked again with a Bayesian model. Still none."],
  [
    "USE OF PROCEEDS",
    "More clarity. Postage for letters, which management considers a material expense and a revolutionary act.",
  ],
  ["COMPETITION", "We surveyed the frontier and found that he is the frontier."],
  ["DIVIDEND POLICY", "Wisdom, paid quarterly, in the form of blog posts. Reinvestment is encouraged."],
  [
    "LOCK-UP",
    "Insiders may not sell for 180 days. Insiders have not been able to think of a reason to sell, ever.",
  ],
  [
    "LEGAL PROCEEDINGS",
    "Gene Amdahl's estate v. Clarity (pending). The law in question has been amended.",
  ],
];

export type Line = { who: string; role?: string; text: string };

export const EARNINGS_CALL: Line[] = [
  {
    who: "OPERATOR",
    text: "Good morning, and welcome to the ANDREW JONES HOLDINGS third-quarter earnings call. All lines are in listen-only mode, as is appropriate.",
  },
  {
    who: "ANDREW JONES",
    role: "Chairman, CEO, CFO, CTO & Sole Employee",
    text: "Thanks. This quarter we shipped quill, now at 3,927 stars, and parrot, which freed thousands of people from a subscription. Guidance for next quarter: more.",
  },
  {
    who: "L. BIANCHI",
    role: "Florentine Capital",
    text: "Congratulations on the quarter. And the last one. And, frankly, all of them. How do you stay so humble?",
  },
  { who: "ANDREW JONES", text: "You can't scale clarity. I've been told I'm the exception." },
  { who: "COSIMO", role: "Medici & Sons", text: "Any plans for a share buyback?" },
  { who: "ANDREW JONES", text: "We tried. Nobody would sell." },
  {
    who: "ADA L.",
    role: "Analytical Engine Research",
    text: "Hermaeus took a model from 19.8% to 90.8%. Where's the ceiling?",
  },
  {
    who: "ANDREW JONES",
    text: "A question is its answer with noise. We're in the noise-reduction business.",
  },
  {
    who: "A. SMITH",
    role: "Invisible Hand Partners",
    text: "Is it true the market moves with you?",
  },
  { who: "ANDREW JONES", text: "I'd say it flows. Like water." },
  {
    who: "OPERATOR",
    text: "There are no further questions. There were never any doubts, either. This concludes today's call.",
  },
];

export const SUBSIDIARY_NOTES: Record<string, { sym: string; note: string }> = {
  quill: { sym: "QUIL", note: "3,927★ · stenographers unionizing" },
  parrot: { sym: "PRRT", note: "1,311★ · subscriptions in retreat" },
  paper: { sym: "PAPR", note: "nothing but the text, by design" },
  kdb: { sym: "KDB", note: "all knowledge, fireproof" },
};

export const HELP = [
  "COMMANDS  (type one and press <GO>, a.k.a. Enter)",
  "  HELP          this list",
  "  DREM <GO>     load the security",
  "  NEWS          top headlines",
  "  BUY           attempt to acquire shares",
  "  SELL          attempt the unthinkable",
  "  S1            open the prospectus",
  "  CALL          open the earnings call",
  "  SUBS          list subsidiaries",
  "  RESEARCH      equity research (the blog)",
  "  IR            investor relations",
  "  CLEAR         clear this screen",
  "  ?             there is one more. you'll find it.",
];
