# Frontend Spec

**Project:** Live Racing Data Platform (working name until the name is decided)  
**Covers:** `app/frontend/` (Next.js 16.3 running as a server in "standalone" mode, React 19.3, TypeScript 6.0, Tailwind CSS 4.3, Node.js 24 LTS)  
**Last updated:** 2026-09-23

Status lives in the Master Plan. Terms like run type and flag state are defined in the Reference doc.

**Paths assume the repo reorganization is done.** That happens with the rename, before Phase 1 (Team Onboarding, section 6). Until then, `app/frontend/` is `frontend/`.

**All testing runs through Docker Compose,** so the frontend, backend, and a sample database run together.

## Design principles

- **Works across series where it can.** Leaderboards, flag badges, session headers, and stat panels should take props that fit NASCAR, F1, and later series. Keep NASCAR-specific logic out of shared components.
- **Readable files.** Keep every file under 300 lines.
- **Phase 1 is about structure and correctness, not visual design.** When and how a visual redesign happens isn't decided yet.
- **Relative API paths.** The live page already calls `/api/nascar/live`, and nginx routes `/api` to the backend. Keep it that way, so the site never needs CORS or hardcoded URLs.

## What exists today

Paths below are inside `app/frontend/`.

| Route | File | Lines | State |
|---|---|---|---|
| `/` | `app/page.tsx` | 277 | All made-up data (fake Daytona 500 at lap 34 of 200, "52 live drivers," fuel-burn signals) |
| `/nascar` | `app/nascar/page.tsx` | 602 | Real live data, all in one file |
| `/nascar/[race]` | `app/nascar/[race]/page.tsx` | 200 | Hardcoded details for 5 races (Daytona 500, Atlanta 400, Las Vegas 400, Phoenix 500, Auto Club 400) |
| `/f1` | `app/f1/page.tsx` | 621 | Full mock UI hidden behind `isLiveRaceAvailable = false` |
| `/f1/[race]` | `app/f1/[race]/page.tsx` | 201 | Placeholder race page |

- **Shared components:** `Logo`, `Modal`, `ThemeToggle`.
- **Track maps:** in `public/tracks/`.
- **Layout:** the header shows a hardcoded "Live" pill on every page, and the footer says "Data placeholders until live integrations go online."

## 1. Phase 1B: Live audit

### 1.1 Upgrade to current, patched versions

Recommended early in Phase 1, because of the security fixes. Versions checked 2026-09-23 against the npm registry:

| Package | In the repo | Target | Why |
|---|---|---|---|
| `next` | 16.1.6 | 16.3.6 now; 16.3.7 once it's out (scheduled Sept 30, 2026) | 16.1.6 is missing about 30 security fixes, including two critical remote-code-execution fixes (16.3.3) and a critical fix in 16.3.6. 16.3.7 is announced with 9 more fixes (1 critical). Pin the exact version |
| `eslint-config-next` | 16.1.6 | Same as `next` | Must match `next` |
| `react`, `react-dom` | 19.2.3 | 19.3.0 | Newest stable, no advisories. Keep the two equal. 19.2.8 is the fallback if 19.3 causes trouble |
| `tailwindcss`, `@tailwindcss/postcss` | ^4 (4.1.18) | 4.3.3 | Newest stable, no advisories |
| `typescript` | 5.9.3 | 6.0.3 | Newest version the lint tools support (typescript-eslint allows up to 6.0.x). TypeScript 7.0.2 is out but breaks linting today. If 6.0 raises new errors, 5.9.3 is the fallback |
| `eslint` | 9.39.2 | 9.39.5 | Newest 9.x. ESLint 10.11.0 is out, but two plugins used by `eslint-config-next` (`eslint-plugin-react`, `eslint-plugin-import`) only support ESLint 9 |
| Node.js (Dockerfile base image) | `node:22-alpine` | `node:24-alpine` | Node 24 is the current long-term-support line. Node 26 becomes long-term support on Oct 28, 2026; revisit then |
| `@types/node` | ^20 (20.19.33) | ^24 (24.13.6) | Match the Node version |
| `@types/react`, `@types/react-dom` | ^19 (19.2.14) | 19.3.0 | Match React 19.3 |
| `react-icons` | 5.5.0 | 5.7.0 | Newest stable |

**Done when:** `docker compose up --build` works, lint passes, and every live view renders.

### 1.2 Split up the live page

Break `app/nascar/page.tsx` apart:

```
app/frontend/app/nascar/
├── page.tsx                      entry point only
├── components/
│   ├── NascarLivePage.tsx        picks the view and lays it out
│   ├── SessionHeader.tsx         session name, track, stage, lap counter, last updated
│   ├── FlagBadge.tsx             colored chip for the current flag
│   ├── RaceLeaderboard.tsx
│   ├── PracticeLeaderboard.tsx
│   ├── QualifyingLeaderboard.tsx
│   ├── TrackInfo.tsx             lead changes, caution laps, leaders
│   ├── RaceStats.tsx             laps, to go, cautions, lead changes
│   ├── PositionsModal.tsx        full field with analytics
│   └── Sidebar.tsx
└── lib/
    ├── types.ts                  types for the live feed
    ├── formatters.ts             lap time, speed, flag label, flag chip color
    └── useLiveFeed.ts            the polling hook, pulled out of the page
```

`FlagBadge` and `SessionHeader` are the first candidates to move to `app/components/` once F1 needs them.

### 1.3 Flag labels, run type, and series

Current gaps:

- `run_type` (1 practice, 2 qualifying, 3 race) is never read
- `series_id` is never shown, so you can't tell which series is on screen
- flag 4 is labeled "Checkered flag" when it's the white flag
- flags 5, 6, and 7 have no label

```ts
function flagLabel(state: number | null | undefined): string {
  switch (state) {
    case 0: return "No session";
    case 1: return "Green flag";
    case 2: return "Yellow flag";
    case 3: return "Red flag";
    case 4: return "White flag";
    case 5: return "Checkered flag";
    case 6: case 7: return "Active"; // unknown values; treat as active
    case 8: return "Hot track";
    case 9: return "Cold track";
    default: return "Unknown";
  }
}
```

Add `run_type` and `series_id` to the feed type, and show the series as a chip near the session header. Current series names:

- 1 = Cup Series
- 2 = O'Reilly Auto Parts Series (called the Xfinity Series through 2025)
- 3 = Craftsman Truck Series (becomes the FedEx Freight Truck Series in 2027)

Sponsor names keep changing, so pick the label by season rather than hardcoding one name.

### 1.4 Show the right view for each session

The backend adds practice and qualifying states in Backend Spec 1.2. Agree the state names between backend and frontend before building these views. Full map:

| Session | Trigger | Show |
|---|---|---|
| Pre-race | run type 3, lap 0 and clock at 0 (any flag) | Starting grid, sorted by starting position |
| No session | flag 0 or 9 | "Next up" or a clean no-session screen |
| Hot track | flag 8, between sessions | "Track is hot" waiting screen, or keep the last view |
| Practice | run type 1, running | Practice leaderboard |
| Qualifying | run type 2, running | Qualifying leaderboard |
| Race, green | run type 3, flag 1 | Race leaderboard |
| Race, caution | run type 3, flag 2 | Race leaderboard + caution banner |
| Race, red flag | run type 3, flag 3 | Race leaderboard + red flag banner (not post-race) |
| Final lap | run type 3, flag 4 | Race leaderboard + "Final lap" banner |
| Post-race | run type 3, flag 5 | Final results |
| Practice over | run type 1, flag 5 | Final practice results |
| Qualifying over | run type 2, flag 5 | Final qualifying order |

Check rows top to bottom; the first match wins. Pre-race comes first because a race-day feed before the start looks like hot track too: the Feb 22 sample has run type 3, flag 8, lap 0.

Columns:

- **Practice:** Pos, #, Driver, Best Time, Best Speed, Last Time, Last Speed, Laps, On Track. The header shows the session name and elapsed time as mm:ss.
- **Qualifying:** Pos, #, Driver, Best Time, Best Speed, Laps Run.
- **Race:** Pos, Driver, Car, Gap, Last Lap, Avg Speed, +/-, Best Lap (as today).

Sort practice and qualifying by best lap time, fastest first. Drivers without a time go at the bottom.

### 1.5 Forcing views for testing

We need to force any view on demand to confirm it renders correctly when the backend sends the right values. There are two ways, and both are switched off in production:

1. **Backend mock feed** (Backend Spec 1.10).
   - The backend replays saved NASCAR feed files from the repo's `test-data/nascar/live/` folder.
   - Scenarios can be switched while it's running.
   - This tests the backend's state detection and the frontend view together, in Docker Compose.
2. **Frontend view override** (this item). This checks the views alone.
   - Adding `?view=<name>` to the live page (for example `?view=red-flag`) makes the page skip the API call. It loads `app/frontend/test-data/views/<name>.json` instead.
   - Those files are in the backend's response shape, `{ raceState, lastUpdated, data }`, with one file per row of the table in 1.4.
   - It only works when the frontend is built with `NEXT_PUBLIC_ENABLE_VIEW_OVERRIDE=true`, which only the Compose setup sets. A production build leaves the switch out entirely.
   - A clear "TEST VIEW" banner shows whenever an override is active.

Starting sample: `live-feed.json`, a real pre-race snapshot from Feb 22, 2026 (run type 3, flag 8, lap 0). Right now it's only in the Claude project; copy it into `test-data/nascar/live/pre-race/` during the reorganization. The other samples are real captures where we have them and edited copies otherwise.

**Done when:** every row in the 1.4 table can be forced both ways and shows the right view.

### 1.6 Homepage (open decision 3)

What the homepage should look like isn't decided. Options A to C come from the earlier docs:

- **A. Status and about us:** what works now, what's coming, who's building it.
- **B. Live NASCAR summary:** the top 5 and the current flag, or a clean "no race right now."
- **C. Landing page:** a short welcome with links to the live pages and honest "coming soon" labels.
- **D. A mix of these.**

Whichever is picked:

- Remove every made-up number from `app/page.tsx`.
- Include the "not affiliated with NASCAR or F1" note and a link to the track map credits.
- Once the page is honest, the footer's placeholder note can go.

### 1.7 Sidebars and header

- Remove the five hardcoded race links from the `/nascar` sidebar.
- Remove the fake Grand Prix links from the `/f1` sidebar. They show even while the F1 mock is hidden.
- Show "Historical results coming soon" until Phase 2.
- The header's "Live" pill should only show when a session is actually live, or be removed.

### 1.8 Loading, error, and empty states

Each needs its own screen; no blank tables. When no session is on, show a proper empty state.

### 1.9 Pages at first launch

| Route | At launch |
|---|---|
| `/` | Per the homepage decision (1.6) |
| `/nascar` | Full live page |
| `/nascar/[race]` | Removed, or a clean "coming soon." No hardcoded races |
| `/f1` | Clean "coming soon." Remove the `isLiveRaceAvailable` branch and mock data |
| `/f1/[race]` | Removed, or a clean "coming soon" |

## 2. Phase 2B: Historical v1

**Blocked** until the data shapes in Backend Spec 2.3 are agreed (open decision 8).

```
app/frontend/app/nascar/historical/
├── page.tsx                  season hub: year picker, list of seasons
├── loading.tsx, error.tsx
├── [year]/
│   ├── page.tsx              race list for a season
│   └── [raceId]/
│       └── page.tsx          race detail: results, stage winners, cautions
├── components/
│   ├── SeasonPicker.tsx
│   ├── RaceCard.tsx
│   ├── RaceResultsTable.tsx  good candidate for a shared component (takes column config)
│   ├── StageWinners.tsx
│   └── CautionSegments.tsx
└── lib/
    ├── api.ts                typed fetch functions for /api/nascar/historical/*
    └── types.ts              matches the backend data shapes
```

- **Rendering and caching:** these pages render on the server and cache to match the backend. Use `revalidate: 3600` (1 hour) for the season and race-list pages, and `revalidate: 86400` (24 hours) for race detail, since past races don't change.
- **Errors:** `api.ts` throws on any non-2xx response so `error.tsx` catches it.

**Done when:** any race is three clicks or fewer from `/nascar/historical`.

## 3. Phase 2C: Lap-time charts (open decision 4)

Not decided yet:

- live, historical, or both
- what the visual is
- whether the track SVG maps are part of it

The original plan assumed Recharts line charts: lap time per driver, running position by lap (position 1 at the top), and a driver filter that defaults to the top 5. Treat that as one option, not the plan.

**Data:** for each driver and lap (Backend Spec 3), we get lap number, lap time in seconds, lap speed in mph, and running position. A full race is roughly 38 cars times 260 laps, about 10,000 points, so plan on filtering.

**Track map licenses:**

- The track SVGs are CC BY-SA, except Daytona, which is public domain.
- Changed versions keep the same license and need credit. The README has the credit table; add each new track to it.
- The Sept 18 commit renamed the Daytona file to `Daytona_International_Speedway_edited.svg`, but the README table still lists the old name with a space.

## 4. F1 pages

- **Phase 1:** replace the mock UI with "coming soon" (1.9).
- **Phase 4:** reuse the shared components for F1 views once the data source is decided (open decision 5).

## Sources

- Next.js security releases: https://nextjs.org/blog/nextjs-security-update-september-22-2026 and https://nextjs.org/blog/upcoming-nextjs-security-release-september-2026
- React 19.3: https://react.dev/blog/2026/09/09/react-19-3
- Package versions and advisories: https://registry.npmjs.org/
- Node.js release schedule: https://nodejs.org/en/about/previous-releases
