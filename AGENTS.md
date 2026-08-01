# AGENTS.md

## Cursor Cloud specific instructions

CineTrack is a **client-only** React + Vite SPA (`npm`). There is no backend, database, or Docker stack.

### Services

| Service | Command | Notes |
|---------|---------|-------|
| Dev server | `npm run dev` | Default: http://localhost:5173 |
| Preview (prod build) | `npm run build && npm run preview` | Optional smoke test of production bundle |

Only the Vite dev server must run locally. TMDB (`api.themoviedb.org` and `image.tmdb.org`) is called from the browser and requires internet egress plus a valid TMDB API key entered in the UI (stored in `localStorage` as `tmdb_api_key`).

### Common commands

See `package.json` scripts:

- `npm run lint` — ESLint (currently reports pre-existing `react-hooks/set-state-in-effect` and `no-unused-vars` issues)
- `npm run build` — production build to `dist/`
- `npm run dev` — development server with HMR

There is no test runner configured (no Vitest/Jest/Playwright in the repo).

### TMDB API key (required for full app flow)

On first launch the app shows an API key gate. Without a valid key, trending/search/watchlist cannot be exercised.

- Get a free v3 key: https://www.themoviedb.org/settings/api
- Enter it in the UI, or set `TMDB_API_KEY` in the environment for automated browser tests (the app UI still expects manual entry unless you inject `localStorage`)

### Dev server tips

- Bind to all interfaces when testing from automation: `npm run dev -- --host 0.0.0.0 --port 5173`
- Prefer tmux for long-running dev servers (e.g. session `vite-dev-server`).
