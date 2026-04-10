# Blindspot — Product

## Core Model

An automated daily publication that applies philosophical analysis to the news. Not a chatbot. Not an aggregator. A **judgment engine** that runs every day.

**Pipeline:** discover stories → gather multiple sources → apply philosophical lenses → generate visuals → publish judgment maps.

**Output:** 5-10 judgment maps per day. Each one tells you not just what happened, but what different frameworks see that the others miss.

Ground News shows you **that** coverage differs. Blindspot shows you **why** — the value frames, hidden assumptions, and power dynamics driving the disagreement.

---

## The Judgment Map

The core artifact is a **judgment map** — a single-screen structured brief, not an essay with headings. Think newsroom graphic + strategy memo + argument map.

Every judgment map has 6 zones:

### Zone 1: Synthesis bar

One sentence. The bottom line, up front. Quotable and shareable.

*"The ceasefire reduces immediate harm but rests on coercive legitimacy and unresolved enrichment risk."*

### Zone 2: Lens cards

3-4 cards in a grid. Each card is 40-80 words max:

- **sees:** the core insight (1 sentence)
- **fears:** what could go wrong through this lens (1 sentence)
- **would do:** the action or stance it implies (1 sentence)

Cards feel like index cards, not mini-essays. The constraint forces the sharpest formulation.

### Zone 3: Disagreement matrix

Rows = lenses. Columns = dimensions at stake (chosen per story, not fixed).

Each cell: **supports / contested / rejects / blindspot** or a 2-5 word position.

Makes convergence and divergence visible at a glance. Where a column is all "supports," confidence is high. Where it's split, that's the hard part.

### Zone 4: Actor map

Key actors with:
- **leverage** — what power they hold
- **stake** — what they want or fear
- **exposure** — what they risk

Plus key relationships: who pressures whom, who mediates, who is absent but affected.

### Zone 5: Scenario cards

3 cards showing plausible next states:

- **Name** — short label ("Fragile truce," "Coerced deal," "Structured de-escalation")
- **What happens** — 1-2 sentences
- **Trigger** — what would cause this
- **Watch for** — the signal that tells you this is the path you're on

### Zone 6: Hidden assumptions + limits

**Assumptions** — 2-4 things the framing treats as obvious that are actually contestable.

**What this misses** — what no lens in this analysis can see.

---

## Export Formats

Each judgment map exports into 3 formats:

### 1. Report page
Full artifact on the site. All 6 zones rendered as the core reading experience.

### 2. Social carousel
5 slides for sharing:
- Situation
- Lens contrast (2 cards side by side)
- Main tension
- Likely scenarios
- Bottom line

### 3. Briefing card
Single image: headline, one-line judgment, mini matrix, one key tension. Optimized for social media screenshots.

---

## Daily Pipeline

```
[1] DISCOVER     Exa search + Twitter trends → 20-30 candidate stories
      ↓
[2] CURATE       LLM ranks by "philosophical richness" → select 5-10
      ↓
[3] SOURCE       Exa search per story → 3-5 diverse sources each
      ↓
[4] ANALYZE      Apply SKILL.md workflow → judgment map JSON per story
      ↓
[5] IMAGE        AI image generation → editorial header per report
      ↓
[6] PUBLISH      Write JSON → Next.js renders as publication
```

Estimated cost: ~$1/day for the full pipeline.

---

## Story Selection Criteria

Not every news story deserves a judgment map. The best candidates are:

- Stories where reasonable people genuinely disagree (not obvious outrage bait)
- Situations with real tension between values (fairness vs efficiency, autonomy vs safety)
- Events where "it depends" is the lazy answer but a real position is possible
- Topics where hidden assumptions are doing most of the work
- Stories that will still matter in a week

Categories: AI regulation, geopolitics, labor, corporate decisions, policy proposals, technology ethics, institutional power, cultural shifts.

---

## Report Categories

Stories are classified into one of five categories, each with default lens selections:

| Category | Signals | Default lenses |
|----------|---------|----------------|
| **Decision** | Choices, tradeoffs, strategy | Stoic + Utilitarian + Nietzschean |
| **Ethics** | Fairness, manipulation, consent, harm | Kantian + Utilitarian + Foucauldian |
| **Conflict** | Disagreement, incompatible values | Aristotelian + Kantian + Existentialist |
| **Identity/Meaning** | Purpose, culture, burnout, narrative | Existentialist + Stoic + Buddhist |
| **Power** | Incentives, norms, systemic analysis | Foucauldian + Utilitarian + Nietzschean |

---

## Product Shape

### The site feels like a publication, not a chatbot.

- Masthead and navigation, not a prompt box
- Lead story with hero image, supporting stories in a card grid
- Individual report pages rendering the judgment map as a visual artifact
- Archive browsable by date
- RSS feed for subscribers

### Sharing

- Every report has a public URL
- Dynamic OG images (briefing card format)
- Social carousel export
- PDF export per report
- RSS feed

---

## Architecture

### Next.js App (presentation)

```
src/app/
├── page.tsx                    # Home: today's judgment maps
├── day/[date]/page.tsx         # All reports for a specific date
├── report/[date]/[slug]/       # Individual judgment map
├── archive/page.tsx            # Browse by date
├── feed.xml/route.ts           # RSS
└── api/pdf/[date]/[slug]/      # PDF export
```

### Pipeline (generation)

```
pipeline/
├── index.ts                    # Orchestrator
├── discover.ts                 # Exa + Twitter → candidate stories
├── curate.ts                   # LLM ranks and selects 5-10
├── source.ts                   # Exa → 3-5 sources per story
├── analyze.ts                  # SKILL.md → judgment map JSON
├── image.ts                    # AI Gen → header images
├── write.ts                    # JSON output to content/
└── lib/
    ├── x402.ts                 # x402 payment via AgentWallet
    ├── exa.ts                  # Exa API client
    ├── ai-gen.ts               # Image generation client
    └── llm.ts                  # LLM client (OpenRouter)
```

### Data (file-based JSON, no database)

```
content/
├── reports/
│   └── 2026-04-08/
│       ├── index.json          # Daily manifest
│       ├── story-slug.json     # Individual judgment map
│       └── ...
└── archive.json                # Global index
```

---

## Roadmap

### v1 — Daily automated judgment maps
- Pipeline: discover → curate → source → analyze → image → publish
- Next.js site rendering judgment maps (all 6 zones)
- Shareable URLs with OG briefing cards
- PDF export
- RSS feed
- 5-10 judgment maps per day, fully automated

### v2 — Watchlist and topics
- Users follow topics ("AI regulation," "US-China," "founder burnout")
- Periodic judgment maps on followed topics
- Email digest with briefing cards

### v3 — Bring your own artifact
- Users paste URL, text, or upload files for personal analysis
- Private judgment maps (not published to the public feed)
- Structured decision form
- Browser extension, mobile share sheet

### v4 — Community and curation
- User-submitted stories for analysis
- Upvoting and discussion on judgment maps
- Community lens suggestions

---

## Positioning

**Do not sell:**
- "AI-generated news"
- "philosophy for agents"
- "chat with philosophers"
- essay reports with headings

**Sell:**
- "a daily judgment map that shows you what different frameworks see in the same story"
- "not just what happened — why it matters, and what the disagreement is really about"
- "structured judgment for the news"
- "the native visual form of judgment"

---

## Comparable Products

| Product | What it does | What Blindspot learns from it |
|---------|-------------|---------------------------|
| **Ground News** | Groups coverage, shows framing and blindspots | Make comparison spatial, not textual |
| **NotebookLM** | Sources in, artifacts out | Artifact-first, not chat-first |
| **Argument mapping tools** | Claims, evidence, objections as visible structure | Structure over paragraphs |
| **Scenario planning tools** | Multiple plausible futures, not single predictions | Show branching paths, not forecasts |
| **The Economist** | Opinionated analysis with a clear editorial stance | Take positions, don't just summarize |
| **Stratechery** | Deep analysis of a few topics, not broad coverage | Quality over quantity, judgment over neutrality |

---

## Design Principles

> The artifact is a judgment map, not an essay.

> Use structure, not fake precision. No numerical scores, no radar charts, no percentages.

> Every zone has a different visual weight. The disagreement matrix and scenario cards are the highest-value components.

> 10 high-quality judgment maps per day beats 100 summaries.

> The interesting version reads like a newsroom graphic + strategy memo + argument map.

## What to avoid

- Long essay reports (the old format)
- Radar charts for philosophical lenses
- Fake numerical scores ("Kantian score: 82")
- Pie charts
- Giant force-directed graphs
- Over-academic visuals
- Same paragraph rhythm for every section
- Pretending judgments are more quantitative than they are
