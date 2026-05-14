# Varun Rao — Graph Portfolio

An interactive, full-viewport portfolio rendered as a graph. Each node is a section, role, project, or achievement; each edge is a real relationship (`worked_at`, `built`, `used`, `awarded`). The same data drives the canvas, the detail drawer, and search — like a tiny graph database baked into the site.

## Stack

- [Vite](https://vitejs.dev) + React 18 + TypeScript
- [@xyflow/react](https://reactflow.dev) for the graph canvas
- [lucide-react](https://lucide.dev) for icons
- Plain CSS (tokens in [`src/styles/tokens.css`](src/styles/tokens.css))

## Project layout

```text
public/
  classic.html        # Original linear portfolio, served as /classic.html
  classic/css/...     # Original styles
  classic/js/...      # Original script
  images/             # Avatars, logos, favicon
src/
  data/portfolioGraph.ts   # Typed nodes + edges + tags (the "DB")
  lib/graphQueries.ts      # neighbors / subgraph / search / tags
  components/
    PortfolioCanvas.tsx    # React Flow wiring, highlight + drawer
    DetailDrawer.tsx       # Templates per node kind
    HUD.tsx                # Top bar (brand, recenter, classic link)
    SearchPanel.tsx        # ⌘K search + arrow-key navigation
    nodes/                 # Hub / Section / Experience / Project / Skill / Achievement
  styles/                  # Tokens + global reset
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

- `⌘K` / `Ctrl+K` or `/` — focus search
- `↑ / ↓ / Enter` — navigate and pick a hit
- `Esc` — close the drawer
