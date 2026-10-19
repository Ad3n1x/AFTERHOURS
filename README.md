# AFTERHOURS

**A quiet personal operating system for clearer thinking, focused work, and keeping your best ideas.**

This replaces the previous 3D life-simulator direction with a calm command centre for attention and ideas.

## Features
- **Operations:** daily mission board and progress tracking.
- **Thought Vault:** capture, tag, search, and delete thoughts.
- **Signal / Noise:** separate facts, assumptions, options, and next moves.
- **Explore:** rotating discoveries across science, psychology, history, and systems.
- **Focus:** 25-minute timer.
- **Progress:** review saved thoughts, completed missions, and focus time.
- **Local-first:** workspace data is stored in the browser; no account or AI key required.
- Responsive on phones and desktops.

## Stack
React 19, TypeScript, Vite, Lucide icons, Express API.
Vercel hosts the frontend; Render hosts the lightweight API.

## Local development
```bash
npm install
npm run dev
npm run build
npm run server
```

## API
- `GET /` service overview
- `GET /api/health` health check
- `GET /api/discoveries` discovery cards

Thoughts, mission state, and decision notes stay in localStorage and are not uploaded to the API. Clearing browser site data or switching devices will not carry the workspace over.
