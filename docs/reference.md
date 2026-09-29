# Reference

**Project:** Live Racing Data Platform (working name until the name is decided)  
**Covers:** shared vocabulary, lookup tables, data sources, decision records, licenses  
**Last updated:** 2026-09-23 (every item re-checked against the code and sources on this date)

The glossary gives both of us and the AI agents the same words for the same things. When a term below lists words to avoid, use the main term instead.

## 1. Glossary

### Data sources

- **Live Feed:** the single JSON snapshot NASCAR publishes at `cf.nascar.com/live/feeds/live-feed.json`. It holds current positions, lap counts, flag state, and per-car data for whatever session is on. NASCAR updates it every second during practice, qualifying, and races. *Avoid:* live data, live stream, real-time feed.
- **Weekend Feed:** per-race JSON at `cf.nascar.com/cacher/{year}/{seriesId}/{raceId}/weekend-feed.json`. It holds final results, caution periods, stage winners, qualifying times, and pit reports for a finished race weekend. *Avoid:* race feed, historical feed.
- **Race List Basic:** per-season JSON at `cf.nascar.com/cacher/{year}/race_list_basic.json`. It lists every race that season across all series, with schedule and result details. *Avoid:* season feed, schedule feed.
- **Lap Times:** per-race JSON at `cf.nascar.com/cacher/{year}/{seriesId}/{raceId}/lap-times.json`. It holds every lap for every driver: lap time, speed, and running position. Confirmed working 2026-09-23 (race 5597).

### Domain

- **Series:** a NASCAR competition level, identified by number. Sponsor names change, so labels should depend on the season. *Avoid:* division, category, league.
  - 1 = Cup Series
  - 2 = O'Reilly Auto Parts Series (the Xfinity Series through 2025)
  - 3 = Craftsman Truck Series (Camping World Truck Series through 2022; becomes the FedEx Freight Truck Series in 2027)
- **Race Activity State:** the backend's reading of the Live Feed. It controls how often the backend polls and what the frontend shows. *Avoid:* race status, live state.
  - Today: Unknown, PreRace, Active, PostRace, NoRace.
  - Phase 1 adds practice and qualifying states.
- **Run Type:** what kind of session is on. 1 = Practice, 2 = Qualifying, 3 = Race. Field `run_type` in the Live Feed. *Avoid:* session type, event type.
- **Flag State:** the current track condition. Field `flag_state`; values in section 2. *Avoid:* flag status, track state.
- **Admin Import:** a request that fetches NASCAR data and saves it to the database as raw JSON. It needs the admin key in the `X-Admin-Key` header, and it's triggered by hand with an HTTP POST. *Avoid:* sync, ingest, scrape.
- **Raw JSON Store:** how imported data is saved: NASCAR's JSON exactly as received, in Postgres `jsonb` columns, rather than split into tables. *Avoid:* blob storage.
- **Polling Service:** the background loop in the backend that fetches the Live Feed, works out the Race Activity State, and keeps the latest result in memory. How often it polls depends on the state. *Avoid:* poller, background worker, scheduler.
- **Mock Feed:** a testing-only replacement for the Live Feed. It replays saved feed files from `test-data/nascar/live/` so any session can be forced (Backend Spec 1.10). Always off in production.
- **View Override:** a testing-only switch on the live page (`?view=<name>`). It loads a saved backend response instead of calling the API (Frontend Spec 1.5). It isn't included in production builds at all.

## 2. Flag states

| Value | Meaning | Backend behavior |
|---|---|---|
| 0 | None | No session |
| 1 | Green | Active |
| 2 | Yellow (caution) | Active |
| 3 | Red | Active, race suspended. Never ends the race |
| 4 | White (final lap) | Active. Never ends the race (current code treats it as checkered when the feed stalls; Backend Spec 1.1) |
| 5 | Checkered | Session over. Post-race only if run type is 3 |
| 6, 7 | Unknown values (documented only as "Who Knows 1" and "Who Knows 2"); treat as active. Frontend label "Active" | Keep current state |
| 8 | Hot track (between sessions) | Keep current state, or show a waiting screen |
| 9 | Cold track | No session |

In practice, `laps_in_race` is 999 because practice is timed, not lap-based. Use `elapsed_time` and `run_name` instead.

## 3. Session state map

Check rows top to bottom; the first match wins.

| Session | Trigger | Frontend shows |
|---|---|---|
| Pre-race | run type 3, lap 0 and clock at 0 (any flag) | Starting grid |
| No session | flag 0 or 9 | "Next up" or no-session screen |
| Hot track | flag 8, between sessions | Waiting screen, or last view |
| Practice | run type 1, running | Practice leaderboard |
| Qualifying | run type 2, running | Qualifying leaderboard |
| Race | run type 3, flags 1 to 4 | Race leaderboard with flag banner |
| Post-race | run type 3, flag 5 | Final results |
| Practice over | run type 1, flag 5 | Final practice results |
| Qualifying over | run type 2, flag 5 | Final qualifying order |

## 4. Data sources

| Source | What | Access | License / terms |
|---|---|---|---|
| NASCAR feeds (section 1) | Live, weekend, season, lap times | Free, unofficial, no key | No published license. The README states the app is independent and non-commercial |
| NASCAR feed documentation | Field meanings, flag values | github.com/ooohfascinating/NascarApi | MIT; community project |
| F1 data | Not chosen yet (Master Plan, open decision 5) | 18 options with their limits in Backend Spec, section 4 | Most free sources are non-commercial (CC BY-NC-SA 4.0). F1DB is CC BY 4.0 |

## 5. Decision records

### ADR 0001: Core stack

**Decision:** ASP.NET Core (.NET, C#) with Entity Framework Core and PostgreSQL for the backend, and Next.js (TypeScript, Tailwind) for the frontend. Docker Compose runs it all locally, with nginx sending `/api/*` to the backend and everything else to the Next.js server.

**Why:**

- Motorsport DevOps and infrastructure roles value .NET and cloud-native skills.
- Postgres stores JSON natively (`jsonb`), and managed Postgres is available on every cloud.
- Next.js keeps server rendering available for historical pages.

**Rejected:**

- SQLite: no `jsonb`.
- Node/Express: less relevant to the target jobs.
- Static export (`output: export`): can't fetch data at request time. The repo uses `output: standalone`.

**Update 2026-09-23:** some hosting options (for example, the frontend on Cloudflare Workers) need an adapter to run Next.js. They're covered in the pricing (Master Plan, open decision 2).

### ADR 0002: Store historical data as raw JSON

**Decision:** Weekend Feed and Race List Basic payloads are saved exactly as received in `jsonb` columns. Fields are pulled out when reading, not when importing.

**Why:**

- The results page design wasn't settled.
- The data is small: hundreds of races, a few KB each.
- Past races never change, so with caching the database is rarely read.

**Consequences:**

- Import code stays simple.
- A new field on a page needs only a code change, no database change.
- If queries ever need to filter or join across races, revisit (jsonb operators or proper tables).

**Update 2026-09-23:** Backend Spec section 3 recommends the same approach for lap times (open decision 9).

## 6. Licenses and credits

- **Code:** MIT today (LICENSE in the repo, copyright both contributors). Whether to keep MIT is open decision 7. Changing it needs both copyright holders to agree, and code already released under MIT stays MIT.
- **Track maps** (`app/frontend/public/tracks/light/` after the reorganization):
  - Adapted from Wikimedia Commons: Atlanta is CC BY-SA 3.0; Bristol and Charlotte are CC BY-SA 4.0; Daytona is public domain.
  - Modified versions keep their original license, and that license covers only the images, not the code.
  - The credit table is in the README; add each new track there.
- **NASCAR data:** unofficial feeds. The app states it is independent, non-commercial, and not affiliated with NASCAR, F1, or any series.
- **F1 data:** depends on the source chosen. Most free F1 sources (including OpenF1 and Jolpica) require credit and forbid commercial use without permission. If the project ever makes money (ads, a paid tier), check every data source's terms first.

## Sources

- NASCAR feed documentation (flag states, run types, series IDs, practice laps): https://github.com/ooohfascinating/NascarApi
- O'Reilly Auto Parts Series rename: https://en.wikipedia.org/wiki/NASCAR_O'Reilly_Auto_Parts_Series
- Craftsman Truck Series (2023 on) and FedEx Freight Truck Series (from 2027): https://sports.yahoo.com/articles/nascar-confirms-18-billion-truck-184322418.html
- OpenF1: https://openf1.org/
- Jolpica terms: https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md
- F1DB: https://github.com/f1db/f1db
- Creative Commons ShareAlike scope: https://wiki.creativecommons.org/wiki/ShareAlike_interpretation
