# Portfolio Handoff

Handoff document for **Varun Rao's interactive graph portfolio**. Use this when onboarding a new contributor, resuming work after a break, or deploying to production.

---

## Live site

| Item | Value |
|------|--------|
| **Production URL** | https://varunrao.is-a.dev/ |
| **Classic fallback** | https://varunrao.is-a.dev/classic.html |
| **GitHub** | https://github.com/VARUN3WARE/portfolio |
| **Active branch** | `graph-vector-portfolio` |
| **Deploy target** | Netlify (`netlify.toml` → `dist/`) |

---

## What this is

A **full-viewport interactive knowledge graph** portfolio built with Vite + React + React Flow (`@xyflow/react`). Nodes represent sections, experience, projects, skills, and achievements. Edges encode real relationships (`WORKED_AT`, `BUILT`, `FOUNDED`, `USED`, `RELATED_TO`, etc.).

The graph is not decorative — the same data drives:

- Canvas layout and node styling
- Detail drawer content
- Command palette (⌘K) lexical + semantic search
- Persona / fit-mode subgraph highlighting
- Story Mode camera tours
- Recruiter Mode role-fit scoring

A **classic linear portfolio** is preserved at `/classic.html` for accessibility and recruiters who prefer scrollable pages.

---

## Stack

- **Vite 5** + **React 18** + **TypeScript**
- **@xyflow/react** — graph canvas
- **lucide-react** — icons
- Plain CSS (`src/styles/tokens.css`, component-scoped CSS files)
- No backend — static site, TF-IDF search runs in-browser

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b --noEmit
npm run build      # outputs to dist/
npm run preview    # smoke-test production build
```

---

## Project layout

```text
handoff.md                  ← this file
index.html                  ← Vite entry + SEO meta / JSON-LD
netlify.toml                ← Netlify build + SPA redirects
public/
  classic.html              ← original linear portfolio
  classic/css|js/
  images/                   ← avatars, logos, favicon
  robots.txt
  sitemap.xml
src/
  data/
    portfolioGraph.ts       ← MAIN CONTENT DB (nodes, edges, copy)
    personas.ts             ← fit-mode lenses (AI Infra, LLM, etc.)
    stories.ts              ← Story Mode node sequences
    deepDives.ts            ← problem/stack/metrics for marquee projects
  lib/
    graphQueries.ts         ← neighbors, subgraph, persona queries
    embeddings.ts           ← TF-IDF semantic search
    intent.ts               ← command palette intent parser
    recruiter.ts            ← role-fit scoring
    analytics.ts            ← graph health counts
    introSequence.ts        ← intro animation BFS order
  hooks/
    useIntroReveal.ts       ← hub-first reveal animation
  components/
    PortfolioCanvas.tsx     ← state machine + React Flow orchestration
    HUD.tsx                 ← top bar + CredibilityBar
    CredibilityBar.tsx      ← Kaggle Expert · 54 repos · PyPI · Medium pills
    SearchPanel.tsx         ← ⌘K command palette
    PersonaBar.tsx          ← bottom fit-mode chips
    StoryPlayer.tsx         ← animated tours
    RecruiterPanel.tsx      ← "Why hire me?" panel
    DetailDrawer.tsx        ← node detail templates + deep dives
    AIAssistant.tsx         ← local semantic-search chatbot
    OnboardingHint.tsx      ← first-visit hint (localStorage dismiss)
    nodes/                  ← HubNode, SectionNode, ProjectNode, etc.
  styles/
    tokens.css, global.css
```

---

## Features (current)

| Feature | Entry point |
|---------|-------------|
| Intro animation | `useIntroReveal.ts` — hub-first BFS reveal; skip via sessionStorage `portfolio-intro-done` |
| Credibility bar | `CredibilityBar.tsx` — Kaggle Expert, 54 repos, PyPI, 70+ articles |
| Command palette | `SearchPanel.tsx` — ⌘K / `/`; intents + lexical + TF-IDF search |
| Fit modes | `personas.ts` + `PersonaBar.tsx` — AI Infra, LLM Systems, Research, Startup, Data Science |
| Story Mode | `stories.ts` + `StoryPlayer.tsx` — Origin, AI Infra, LLM, Research tracks |
| Recruiter Mode | `recruiter.ts` + `RecruiterPanel.tsx` — graph-derived role fit + CTAs |
| Deep dives | `deepDives.ts` — structured panels for marquee projects |
| Graph health | `analytics.ts` + `GraphHealthChip.tsx` |
| Cypher strip | `CypherStrip.tsx` — live MATCH query aesthetic |
| AI Assistant | `AIAssistant.tsx` — closed by default; semantic search replies |
| Classic view | `public/classic.html` — link in HUD |

---

## Content editing

**All portfolio copy lives in `src/data/portfolioGraph.ts`.**

1. Add or edit a node in the `nodes` array (set `id`, `kind`, `label`, `position`, `tags`, `detail`).
2. Add edges in the `edges` array connecting nodes.
3. For marquee projects, add a matching entry in `src/data/deepDives.ts` keyed by node id (e.g. `proj-dml`).
4. Run `npm run typecheck` — node `detail` shapes are typed per `kind`.

Hand-tuned `position` coordinates keep clusters stable. After adding nodes, nudge `x`/`y` so labels don't overlap.

**Hub node** (`id: 'hub'`) includes `role`, `tagline`, `badges`, `socials`, and `avatar`.

**Featured projects** (GitHub-pinned): Human Slop, pytorch-dml, Hedgera, Kerala-Ayurveda-RAG.

---

## SEO

- Canonical domain: **https://varunrao.is-a.dev/**
- Meta tags + JSON-LD in `index.html`
- `public/robots.txt` and `public/sitemap.xml` should use the same domain
- `og:image` should be an **absolute URL** for social previews

---

## Deployment (Netlify)

1. Connect repo; branch `graph-vector-portfolio` (or merge to `main` first).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. SPA redirect is configured in `netlify.toml` (`/*` → `/index.html`)
5. Custom domain: `varunrao.is-a.dev`

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `⌘K` / `Ctrl+K` or `/` | Focus command palette |
| `↑` `↓` `Enter` | Navigate search results |
| `Esc` | Close topmost overlay (drawer → recruiter → story → persona) |

---

## Session / local storage keys

| Key | Purpose |
|-----|---------|
| `portfolio-intro-done` | Skip intro animation (sessionStorage) |
| `portfolio-onboarding-dismissed` | Hide onboarding hint (localStorage) |

---

## Recent work (graph-vector-portfolio branch)

- Built interactive graph portfolio (Vite + React Flow)
- Added fit modes, story mode, command palette, semantic search, recruiter panel, deep dives, AI assistant, intro animation, onboarding
- Enriched content from [GitHub profile](https://github.com/VARUN3WARE): Kaggle Expert, PyPI, Medium, expanded skills, Kerala-Ayurveda-RAG promoted to featured
- Professional copy refresh (hub, about, HUD, classic view)
- Credibility bar + hub badges/tagline
- SEO canonical URLs → `varunrao.is-a.dev`

---

## Recommended next steps (not yet done)

Priority order if continuing polish:

1. **Custom OG image** — designed social preview card (name + title + graph motif)
2. **Live demo links** — add `demoUrl` on deployed projects (Human Slop, Ayurveda-RAG) in drawer
3. **Project screenshots** — one image per featured project in detail drawer
4. **DSAI Club Coordinator** — separate experience node (currently only in education summary)
5. **Story copy refresh** — align `stories.ts` tone with professional hub copy
6. **"Pinned on GitHub" story track** — short tour of top 5 repos
7. **Deep links** — `?node=proj-dml` or `?story=infra` in URL for shareable outreach
8. **Recruiter stats** — swap generic tag counts for Kaggle Expert / PyPI / team-lead highlights
9. **Analytics** — Plausible or similar to track recruiter panel usage

---

## Known gotchas

- **Do not** use `varunrao.dev` in canonical/OG URLs — live domain is `varunrao.is-a.dev`
- GitHub X handle in graph: `varun_slops` (social link label: X)
- CV link: Google Drive folder in hub socials
- `dist/` is build output — edit source, not `dist/`
- Mobile: minimap hidden; AI assistant is bottom sheet; credibility bar reflows under HUD
- Intro animation hides HUD, credibility bar, search, persona bar until complete

---

## Contact / profile links

| Platform | URL |
|----------|-----|
| Website | https://varunrao.is-a.dev |
| Email | varunr@iitbhilai.ac.in |
| GitHub | https://github.com/VARUN3WARE |
| LinkedIn | https://linkedin.com/in/varun3ware/ |
| Kaggle | https://www.kaggle.com/varunraosfanlkan |
| Medium | https://medium.com/@varunrao.aiml |
| X | https://x.com/varun_slops |

---

## Build verification

Before pushing or deploying:

```bash
npm run typecheck && npm run build
```

Last known good build: ~418 KB JS (gzip ~132 KB), typecheck clean.

---

*Last updated: June 2026 — branch `graph-vector-portfolio`*
