# PhilOS

![PhilOS — Philosophers gathered around a round table](header.jpeg)

**Structured judgment for things that are hard to think about.**

An automated daily publication. Philosophy is the engine, not the UI. The output is a **judgment map** — not an essay.

---

## What It Does

Different philosophical traditions expose different failure modes. PhilOS applies them as **mental operators** and produces a structured visual artifact for each story.

The core output is a **judgment map** with 6 zones:

| Zone | What it shows |
|------|--------------|
| **Synthesis bar** | One-sentence bottom line, up front |
| **Lens cards** | 3-4 cards, 40-80 words each: sees / fears / would do |
| **Disagreement matrix** | Lenses as rows, dimensions as columns — convergence and divergence at a glance |
| **Actor map** | Key actors with leverage, stake, and exposure |
| **Scenario cards** | 3 plausible next states with triggers and signals |
| **Assumptions + limits** | What the framing smuggles in, what the analysis can't see |

Not an essay with headings. A newsroom graphic + strategy memo + argument map.

---

## The Lens Engine

Users see human-readable labels. Philosophy runs under the hood.

| User sees | Engine applies |
|-----------|---------------|
| **Consequences** | Utilitarian |
| **Principles** | Kantian |
| **Character** | Aristotelian |
| **Power** | Foucauldian |
| **Hidden motives** | Nietzschean |
| **Attachment** | Buddhist |
| **Ownership** | Existentialist |
| **Noise vs signal** | Stoic |
| **Assumptions** | Socratic |
| **Responsibility** | Arendtian |
| **What works** | Pragmatist |

The system selects 3-4 relevant lenses per judgment map. Users can override, but the default should be good enough that most don't.

---

## Skill Structure

The analysis engine is built as a skill with a core workflow and reference files loaded on demand:

```
analysis/
├── SKILL.md                              # Core workflow + lens selection + judgment map format
└── references/
    ├── decision-stress-test.md           # Workflow: pressure-test decisions
    ├── ethics-review.md                  # Workflow: ethical analysis
    ├── conflict-mediation.md             # Workflow: value-frame mismatch resolution
    ├── lens-stoic.md                     # Separate control from noise
    ├── lens-aristotelian.md              # Find the balanced practical path
    ├── lens-kantian.md                   # Test principle consistency
    ├── lens-utilitarian.md               # Model outcome distribution
    ├── lens-nietzschean.md               # Uncover hidden motives
    ├── lens-buddhist.md                  # Reduce attachment and craving
    ├── lens-existentialist.md            # Force ownership and choice
    ├── lens-foucauldian.md               # Inspect power and incentives
    └── examples.md                       # 5 worked examples across domains
```

### How the skill works

1. **Classify** the problem: decision, ethics, conflict, identity/meaning, or power/institution
2. **Select** 2-4 lenses based on the category
3. **Map actors** and stakes
4. **Build the judgment map** — all 6 zones as structured output, not essay prose

### Three core workflows

- **Decision Stress Test** — pressure-test a choice before committing
- **Ethics Review** — operational ethical analysis of a product, policy, or practice
- **Conflict Mediation** — identify the value-frame mismatch and translate between sides

---

## Design Principles

> The artifact is a judgment map, not an essay.

> Use structure, not fake precision. No numerical scores, no radar charts, no percentages.

> Philosophy is the engine, not the UI.

> The useful version is not "an agent that talks like Nietzsche." It is "an agent that can apply Nietzsche's style of critique to a startup, a policy, a life decision, or a product."

---

## Further Reading

- [PRODUCT.md](PRODUCT.md) — judgment map spec, pipeline architecture, roadmap, positioning, and export formats
