# Varun Rao — Graph Portfolio

An interactive, full-viewport portfolio rendered as a graph. Each node is a section, role, project, or achievement; each edge is a real relationship (`worked_at`, `built`, `used`, `awarded`). The same data drives the canvas, the detail drawer, and search — like a tiny graph database baked into the site.

## Stack

- [Vite](https://vitejs.dev) + React 18 + TypeScript
- [@xyflow/react](https://reactflow.dev) for the graph canvas
- [lucide-react](https://lucide.dev) for icons
- Plain CSS (tokens in [`src/styles/tokens.css`](src/styles/tokens.css))

## What's inside

- **Graph canvas** — full-viewport pan/zoom, custom nodes for hub, sections, experience, projects, skills, achievements.
- **Detail drawer** with structured deep-dives (problem / approach / stack / metrics / why) for marquee projects.
- **Fit-mode chips** — AI Infra, LLM Systems, Research, Startup, Data Science — each lights the subgraph that proves that fit.
- **Animated Story Mode** — picks a narrative (Origin / AI Infra / LLM / Research) and flies the camera through it.
- **AI Shadow Assistant** — A lightweight, local-first chatbot that uses the TF-IDF engine to answer queries by identifying and linking to relevant graph nodes.
- **Semantic Node Traversal** — "Similar Research" engine that suggests related projects based on content similarity, even without direct edges.
- **AI Command Palette** (⌘K) — natural-language intents like "play journey", "why hire me", "CUDA projects" mixed with lexical + semantic search.
- **TF-IDF semantic search** — in-memory cosine retrieval over node summaries, ready to swap for real embeddings later.
- **Recruiter Mode** — graph-derived role-fit scores with evidence nodes and contact CTAs.
- **Graph health chip + Cypher strip** — live counts and a live "MATCH … RETURN" line that mirrors whatever filter you're on.
- **Classic view** preserved verbatim at `/classic.html`.

## Project layout

```text
public/
  classic.html              # Original linear portfolio, served as /classic.html
  classic/css|js/...        # Original styles and script
  images/                   # Avatars, logos, favicon
src/
  data/
    portfolioGraph.ts       # Typed nodes + edges + tags (the "DB")
    personas.ts             # AI-engineer fit modes (lenses on the graph)
    stories.ts              # Narrative sequences for Story Mode
    deepDives.ts            # Deep-dive content keyed by project node id
  lib/
    graphQueries.ts         # neighbors / subgraph / persona / lexical search
    embeddings.ts           # TF-IDF cosine semantic search
    intent.ts               # Command palette intent parser
    recruiter.ts            # Role-fit scoring + headline stats
    analytics.ts            # Graph health (nodes/edges/clusters/tags)
  components/
    PortfolioCanvas.tsx     # State machine + React Flow wiring
    HUD.tsx                 # Top bar (brand, recenter, recruiter, classic)
    SearchPanel.tsx         # Command palette (intents + lexical + semantic)
    PersonaBar.tsx          # Fit-mode chips
    CypherStrip.tsx         # MATCH (…) RETURN n  monospace strip
    GraphHealthChip.tsx     # Live count widget
    StoryPlayer.tsx         # Animated tour player + launcher
    RecruiterPanel.tsx      # "Why hire me?" panel
    DetailDrawer.tsx        # Templates per node kind, with deep-dives
    nodes/                  # Hub / Section / Experience / Project / Skill / Achievement
  styles/                   # Tokens + global reset
  App.tsx, main.tsx
```

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

The graph view is `/`. The original linear page is preserved at `/classic.html` (linked from the HUD).

## Build & deploy

```bash
npm run build    # Outputs static assets to dist/
npm run preview  # Smoke-test the production build locally
```

Deploy `dist/` to any static host (GitHub Pages, Netlify, Vercel static, Cloudflare Pages).

### GitHub Pages

If you serve from a project subpath (e.g. `https://VARUN3WARE.github.io/portfolio`), set `base` in [`vite.config.ts`](vite.config.ts) accordingly, for example:

```ts
export default defineConfig({ plugins: [react()], base: '/portfolio/' });
```

Then push the contents of `dist/` to the `gh-pages` branch (or use a GitHub Action).

## Editing content

All copy lives in [`src/data/portfolioGraph.ts`](src/data/portfolioGraph.ts). Add a node, attach edges, and the canvas, drawer, and search will reflect it automatically. Hand-tuned `position` keeps the layout stable; tweak coordinates to relocate clusters.

## Keyboard

- `⌘K` / `Ctrl+K` or `/` — focus the command palette
- `↑ / ↓ / Enter` — navigate and pick a result (intent or node)
- `Esc` — peel off the topmost overlay (drawer → recruiter → story → persona)

## Sample commands

Type these into ⌘K:

- `why hire me` — opens Recruiter Mode
- `play journey` — runs the Origin story
- `AI Infra` — activates the AI Infra fit lens
- `CUDA projects` — semantic + lexical match across the graph
- `home` / `recenter` — clear everything and fit-view
