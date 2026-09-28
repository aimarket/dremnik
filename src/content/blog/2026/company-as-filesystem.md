---
title: "Designing an autonomous company"
date: "2026-03-08"
slug: "designing-an-autonomous-company"
description: "Every piece of company state lives in a folder. Markdown files and shell scripts. The filesystem is the API."
published: false
painting: "antonello-st-jerome-in-his-study"
---

Context graphs are the hot thing at the moment. Everyone is trying to figure out how to give agents a view of the full state of a business, so they can run off and be autonomous workers.

Despite some of my anti-consensus tendencies, I couldn't help myself from jumping on the bandwagon. So I started by asking myself the question:

> What might a fully autonomous company look like, were such a thing possible?

## What does a company do?

Naturally, the question is begged.

You might reach for explanations of the various functions a company performs: the actions it takes, the customers it serves, the products it makes. But underneath all of this seeming multiplicity, can we distill a single procedure that governs the whole?

Everything a company does is a query against reality. A hypothesis about what *might* be true at this moment, and the actions that would generate profit if that statement — or bundle of statements — is true. Understanding terminates in the capacity to *predict*. A world model, then, is the set of beliefs about how the world *is*, and how it will *respond* to hypothetical actions. This shared world model — and the continual refinement of those beliefs as new evidence arrives — is the basic process underneath every function. "If we build X, customers will pay for it." "I'm not sure, but I *believe* this is true given the evidence I've observed in X, Y, Z situations, and the feedback I've heard from A and B."

In other words, building a company is a *search for truth*.

## The scientific method

Thankfully, people have been thinking about how to formalize the search for truth for centuries, and it has a name: *the scientific method*. It describes how you search the space of possible beliefs about reality, and how to make and refine predictions about the world. The basic steps:

> hypothesis → design experiment → execute → collect data → interpret → start again

In business the objective function is simple — maximize profit within your constraints (industry, values, risk tolerance):

1. *Hypothesis* — "If we build X, customers will pay for it." Or: "If we pitch this way, this buyer persona converts." Or: "If we hire for this role, it unblocks throughput."
2. *Design experiment* — the product spec, the outreach campaign, the job posting.
3. *Execute* — build it, send it, run it.
4. *Collect data* — usage metrics, response rates, pipeline quality.
5. *Interpret* — did the hypothesis hold? What do we believe now that we did not before?

Within that framework, each department has its own way of executing the basic loop. For engineering it is an SDLC (requirements → spec → design → build → verify → release). For GTM it is a campaign (target list → messaging → outreach → follow-up). For hiring it is a pipeline. But the outer structure is always the same.

The smallest complete turn of this loop is a *cycle* — plan, execute, review. That is the atomic unit of the epistemic loop: the shortest span over which you can actually form a hypothesis, test it against reality, and update what you believe. The *daily* rhythm beneath it is execution: you are running the experiment and capturing what happened, not forming a new belief every morning.

Above the cycle, the loop runs at longer timescales. *Monthly and quarterly* reviews consolidate the beliefs that survived multiple cycles into worldview and strategy. Each level feeds the next: daily observations bubble up into the weekly review, weekly learnings update the worldview, durable worldview shifts reshape strategy, and strategy constrains the next cycle's planning. It compounds.

The key is closing the loop: every action traces back to a decision, every decision to a hypothesis, every hypothesis to a goal. If that chain breaks, you stop learning.

## Cycles

The cycle is the heartbeat — tight enough for fast feedback, long enough to actually run an experiment. A week-long sprint with a plan and a review, and each step of the scientific method has a home inside it: the plan is the hypothesis and the experiment design, the cycle itself is execution, signal capture is data collection, and the review is interpretation. Beliefs that survive get promoted upward into the worldview.

**Planning (start of cycle):**

1. Scan opportunities — inventory everything across projects, network, signals.
2. Evaluate — expected payoff = likelihood × magnitude. Factor in effort, time-to-first-dollar, dependencies.
3. Budget — allocate hours top-down by expected payoff. Hard constraint: nothing gets time unless it clears the budget check.
4. Pick the main effort — *what really matters* this cycle.
5. Write the plan down somewhere it can be found again.

**Review (end of cycle):**

1. What happened vs. what was planned?
2. What got deferred, and why? If something has been deferred three or more cycles, force a decision: commit, kill, or redesign.
3. Signal analysis — what patterns are emerging? Where are independent signals converging?
4. Worldview update — how should beliefs change given new information?
5. Conclusions → feed into next cycle's planning.

The review is the "interpret and draw conclusions" step. The plan is "hypothesis and design experiment." The cycle itself is execution.

What makes this work is that the review is brutally honest. The outer loop only compounds if the "interpret" step is truthful. A real one:

> Planned to build feature X. By day three, two prospect calls revealed the pricing assumption was wrong — they wanted it, but not at that price point. Killed the feature. Pivoted the cycle to validating a different pricing model. Would not have caught it without the signal capture.

The review is the mechanism by which you update your beliefs. Did you actually do what you said you would do? If not, why? Is the plan wrong, or are you avoiding something?

This is where learning compounds, provided the cycle leaves a record. With one, you can go back to an earlier cycle and trace which bets you made, which ones paid off. And the learning crystallizes upward: insights that survive multiple cycles get promoted into your worldview as durable beliefs, and beliefs that prove out over longer horizons harden into strategy — maxims, heuristics, structural truths you operate from. The structure mirrors the confidence level: a cycle is a single experiment, the worldview is medium-term conviction, strategy is what you have learned the hard way and do not expect to change soon. All of it needs somewhere to live.

## Collecting data

The outer loop only works if you are actually collecting data. It is easy to run experiments without systematically capturing what happened. The learnings live in someone's head, or in a Slack thread no one will ever find again.

So raw observations need a home too. A signal is just: something happened in the world that might matter. No analysis, no judgment — just capture it.

- A competitor launched a new feature.
- A prospect said something interesting on a call.
- A pricing experiment got an unexpected response.
- An industry report dropped with relevant data.

Each signal is a short, dated note: source, and what happened. That is it.

The magic is in the processing. During the cycle review, you scan all signals from the past week and ask:

- *Trendlines* — what patterns are emerging across multiple signals?
- *Convergences* — where are independent signals pointing the same way?
- *Surprises* — anything contradicting our current hypotheses?

Signals that matter get promoted into the worldview — they update your beliefs. Signals that do not matter get archived or discarded. The point is that *nothing falls through the cracks*. Every observation enters the system, gets evaluated, and either changes your beliefs or gets explicitly dismissed.

This is the "collect data" step of the scientific method, made concrete. Without it, the cycle review is just vibes — you are reflecting on what you *remember* happened, not what *actually* happened. And memory is a terrible database.

## Representing the state

Everything the loop produces needs somewhere to live: the beliefs, the experiments and their reviews, the raw observations, and the procedures that operate on all of it. Taken together, that is the company's state — a representation of its shared world model, the knowledge it has and the objects it cares about. The only question is what to represent it in. For a thought experiment, the simplest substrate is the one any agent already knows how to read and write: a single filesystem.

```
company/
├── .self/                # identity — mission, values, principles
│   ├── mission.md
│   ├── values.md
│   └── principles.md
├── .plan/
│   └── cycle/
│       ├── C-09/
│       │   ├── plan.md   # what we intend to do
│       │   └── review.md # what happened + conclusions
│       ├── C-10/
│       │   └── plan.md
│       └── ...
├── .inbox/               # unprocessed inputs — triage weekly
├── .tasks/
│   └── TODO.md           # stack (active) + heap (deferred)
├── strategy/
│   ├── positioning.md    # how we win
│   ├── competitors/      # landscape, threat profiles
│   ├── maxims.md         # hard-won truths we operate from
│   ├── quarterly/        # quarterly strategy reviews
│   └── yearly/           # annual planning + retrospectives
├── signals/              # raw observations — what happened
├── worldview/            # hypotheses, beliefs, confidence
│   ├── daily/            # short-lived observations
│   ├── cycle/            # beliefs that survived a cycle
│   ├── monthly/          # durable convictions
│   └── quarterly/        # strategic-grade theses
├── projects/
│   ├── product-alpha/
│   │   ├── .tasks/
│   │   ├── .plan/
│   │   └── ...
│   ├── product-beta/
│   │   ├── .tasks/
│   │   └── .plan/
│   └── index.md          # all projects, statuses, focus
├── SOP/
│   ├── cycle-review.md
│   ├── cycle-plan.md
│   ├── daily-shutdown.md
│   └── morning-brief.md
└── index.md              # root — current cycle, links
```

Every piece of company state lives here. Every hypothesis, every experiment, every observation, every signal. All of it in one shared world model.

Think of `index.md` the way you think of `main()`. It is the entrypoint for any agent trying to understand what the company is doing right now — a map that links to all the relevant modules. It points at the current cycle, lists active projects and their statuses, and so on. The system prompt only has to point at the index file for the agent to understand the layout of the entire system and locate the procedures for operating on it.

Those procedures live in `SOP/`. They are step-by-step: how to run a cycle review, how to do a daily shutdown, how to produce a morning brief, how to write a ticket for the engineering team, how to submit a PR on a given repo. Written in plain English, specific enough that an agent can follow them directly. At first glance these might look just like skills, to those of you who use those heavily — and you would be right. They are more structured versions of skills, with a clearer relationship to the data state they operate on. This is the formalization of a proper home for what are usually ad-hoc skills living in random folders on people's computers. Skills is sending random Python scripts over Slack; defining SOPs is consolidating into a monorepo on GitHub.

The rest of the system holds the other aspects of the world model that any company needs to define its internal state and its understanding of the external world at a given moment — and, being good data scientists, point-in-time understanding too, so we can see how it evolved and learn from the meta-learning.

`.self/` is the constitution — it changes rarely and constrains everything downstream. `worldview/` holds current beliefs about the market, competitors, and opportunities, updated every cycle as new data comes in. `strategy/` holds positioning, competitive landscape, and the hard-won truths you operate from. `signals/` captures raw observations. `projects/` holds the actual work. `.plan/cycle/` holds the cycle plans and reviews that record the rhythm of planning and reflection. `.inbox/` is where raw inputs land before being routed. `.tasks/` is working memory.

And because it is all files, it is all version-controlled. You can diff your beliefs from three months ago against today. You can grep across every cycle review you have ever written. You can trace exactly when and why you changed your mind about something.

I don't think this is the final form. But the core idea is right: structure your company state so that agents can read it, write it, and run procedures against it. Start with `.self/`, `.plan/cycle/`, and a few SOPs. The rest will grow as you need it.
