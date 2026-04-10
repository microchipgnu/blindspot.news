# Blindspot

![Blindspot — Philosophers gathered around a round table](header.jpeg)

**See what you're missing.**

An automated daily publication of structured judgment briefs. Philosophy is the engine, not the UI. The output is a brief with hidden bets, real disagreements, and cause-effect threads across stories.

Live at [blindspot.news](https://blindspot.news).

---

## What It Does

Different philosophical traditions expose different failure modes. Blindspot applies them as **mental operators** and produces a structured visual artifact for each story.

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

## Monorepo Structure

```
blindspot/
├── skills/analysis/            # Philosophical lens skill (SKILL.md + references)
├── site/                       # Astro website rendering judgment maps
├── content/reports/            # Generated judgment map JSON (by date)
├── .philos/prompt.md           # Agent prompt for automated generation
├── .github/workflows/          # GitHub Actions cron (4x daily)
└── opencode.json               # OpenCode config (OpenRouter)
```

### How it works

1. **GitHub Actions** triggers 4x daily
2. **OpenCode** runs with `.philos/prompt.md` — discovers news, applies the analysis skill, writes JSON
3. **JSON reports** are committed to `content/reports/YYYY-MM-DD/`
4. **Astro** reads the JSON and renders judgment maps as a static site

### The analysis skill

Located at `skills/analysis/`. Classifies problems, selects 2-4 lenses, maps actors, and produces structured judgment maps with all 6 zones. Three core workflows: decision stress test, ethics review, conflict mediation.

---

## Development

```bash
cd site && npm install && npx astro dev
```

---

## Design Principles

> The artifact is a judgment map, not an essay.

> Use structure, not fake precision. No numerical scores, no radar charts, no percentages.

> Philosophy is the engine, not the UI.

> The useful version is not "an agent that talks like Nietzsche." It is "an agent that can apply Nietzsche's style of critique to a startup, a policy, a life decision, or a product."

---

## Further Reading

- [PRODUCT.md](PRODUCT.md) — judgment map spec, pipeline architecture, roadmap, positioning, and export formats
