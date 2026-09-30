// ------------------------------------------------
// projects/dremnik/src/components/rpg/quest-log.tsx
//
// Every quest he has ever taken, and how it went. One failure, entirely on
// principle. The rewards are real, give or take.
// ------------------------------------------------

type Status = "complete" | "failed" | "active";

type Quest = { name: string; status: Status; reward: string };

const QUESTS: Quest[] = [
  {
    name: "Build an AI operating system for firms managing $1B+",
    status: "complete",
    reward: "Title: CTO · Private equity, modernized",
  },
  {
    name: "Lift Claude from 19.8% to 90.8% on a finance benchmark",
    status: "complete",
    reward: "One grateful AI (Hermaeus)",
  },
  {
    name: "Earn 3,927 stars on a dictation-adjacent side project",
    status: "complete",
    reward: "quill (Legendary)",
  },
  {
    name: "Free thousands from an unnecessary subscription",
    status: "complete",
    reward: "parrot (Legendary) · Gratitude ×1000",
  },
  {
    name: "Write a letter, by hand, to a real person",
    status: "complete",
    reward: "Intimacy +50",
  },
  {
    name: "Become water (side quest)",
    status: "complete",
    reward: "Formlessness · A nod from Bruce Lee",
  },
  {
    name: "Ask the right question",
    status: "complete",
    reward: "The answer (it was the question all along)",
  },
  {
    name: "Use Slack",
    status: "failed",
    reward: "Refused on principle. Built them a CLI anyway.",
  },
  {
    name: "Scale clarity",
    status: "active",
    reward: "Blocked by Amdahl's Law. Negotiations ongoing.",
  },
  {
    name: "Achieve AGI",
    status: "active",
    reward: "AGI reportedly nervous",
  },
];

const BADGE: Record<Status, { label: string; className: string; mark: string }> = {
  complete: { label: "COMPLETE", className: "text-[#9fe870]", mark: "✔" },
  failed: { label: "FAILED", className: "text-[#ff6b6b]", mark: "✖" },
  active: { label: "IN PROGRESS", className: "text-[#ffd84a] rpg-blink-slow", mark: "…" },
};

export function QuestLog() {
  const done = QUESTS.filter((q) => q.status === "complete").length;
  return (
    <section className="rpg-window mt-10" aria-labelledby="quest-title">
      <h2 id="quest-title" className="rpg-window-title">
        QUEST LOG
      </h2>
      <p className="mb-3 font-pixel text-[8px] leading-[1.8] text-[#9fa6ff]">
        {done}/{QUESTS.length} COMPLETE · 1 FAILED (ON PURPOSE)
      </p>
      <ul className="space-y-3">
        {QUESTS.map((q) => {
          const b = BADGE[q.status];
          return (
            <li key={q.name} className="grid grid-cols-[18px_1fr] gap-x-3">
              <span aria-hidden="true" className={`font-pixel text-[10px] leading-[22px] ${b.className}`}>
                {b.mark}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-vt text-[20px] leading-[1.1] text-white">{q.name}</span>
                  <span className={`font-pixel text-[8px] ${b.className}`}>{b.label}</span>
                </div>
                <p className="font-vt text-[17px] leading-[1.1] text-[#9fa6ff]">
                  {q.status === "failed" ? "" : "Reward: "}
                  {q.reward}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
