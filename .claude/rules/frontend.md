---
paths:
  - "app/frontend/**"
---

# Frontend (Next.js)

- App Router, standalone server build. Before using a Next.js or React API, read the installed version from `app/frontend/package.json`, then look up docs for that version with Context7; older examples are often wrong.
- Tailwind CSS: check how the repo configures it before adding config.
- No file over 300 lines. Page-specific components go in `app/<route>/components/`, shared ones in `app/components/`.
- Shared components stay series-agnostic (NASCAR now, F1 later).
- API calls use relative paths (`/api/...`).
- No made-up data. Unfinished pages show a clean "coming soon".
- Every page handles loading, error and empty states.
- `npm run lint` must pass before a PR.
- Design and UI tasks go through UI/UX Pro Max.