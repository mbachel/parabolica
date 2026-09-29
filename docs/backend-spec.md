# Backend Spec

**Project:** Live Racing Data Platform (working name until the name is decided)  
**Covers:** `app/backend/` (ASP.NET Core on .NET 10.0.12, Entity Framework Core 10.0.12, Npgsql provider 10.0.3, PostgreSQL 17.11)  
**Last updated:** 2026-09-23

Status lives in the Master Plan. This document says what to build and how. Terms like Live Feed, Weekend Feed, and Race Activity State are defined in the Reference doc.

**Paths assume the repo reorganization is done.** That happens with the rename, before Phase 1 (Team Onboarding, section 6). Until then, `app/backend/` is `backend/`.

## What exists today

Paths below are inside `app/backend/`.

| File | What it does |
|---|---|
| `Program.cs` | Registers services, allows any website to call the API (CORS), runs database migrations at startup |
| `Nascar/NascarController.cs` | `GET /api/nascar/live` returns the latest Live Feed plus the detected race state |
| `Nascar/Services/NascarApiClient.cs` | Fetches the Live Feed |
| `Nascar/Services/NascarHistoricalApiClient.cs` | Fetches Weekend Feed and Race List Basic |
| `Nascar/Services/NascarLiveRaceDetector.cs` | Classifies the feed into Unknown, PreRace, Active, PostRace, or NoRace, and picks the next poll delay |
| `Nascar/Services/NascarPollingService.cs` | Background loop that polls on the detector's schedule |
| `Nascar/Services/NascarCacheService.cs` | Holds the latest feed and state in memory |
| `Admin/Import/NascarImportController.cs` | `POST /api/admin/import/nascar/race-list-basic` and `/weekend-feed`, protected by the X-Admin-Key header |
| `Data/Entities/` | `NascarRaceListBasicYear` and `NascarWeekendFeed`, each storing raw JSON (jsonb) |

## 1. Phase 1A: Live audit

Fixes, hardening, and version upgrades for existing code. The only new features are practice and qualifying support and the mock feed used for testing.

### 1.1 Checkered flag check uses the wrong value (bug)

In `NascarLiveRaceDetector.cs` (around line 183):

```csharp
var checkeredFlag = flagState == 4;
```

Flag 4 is the white flag (final lap). Flag 5 is the checkered flag. The check only runs when the feed hasn't changed since the last poll (30 seconds earlier). While the race is running, the detector returns Active before it gets here, so this is not an every-race bug. It causes two narrower problems:

- If the feed stalls for one poll during the white-flag lap, the race is marked finished early.
- Flag 5 is never recognized. A race that ends short of its scheduled distance (rain, for example) only reaches PostRace after the 45-minute frozen-feed timeout.

**Fix:** change it to `flagState == 5`.

Keep the May 17 red flag fix: flag 3 must never trigger PostRace. Unknown flags 6 and 7 hold the current state.

**Done when:**

- A *frozen* mock feed (same lap and elapsed time on two polls) with flag 4 stays Active.
- A frozen feed with flag 5 and run type 3 goes to PostRace right away.

The mock feed in 1.10 makes both testable.

### 1.2 Practice and qualifying states

Add states for practice and qualifying, plus a way to say "this session ended." Either add PracticeOver and QualifyingOver, or reuse PostRace tagged with the run type. Pick whichever keeps the frontend simpler, and agree the names between backend and frontend before the frontend builds these views.

In `GetStatusAsync`, check `RunType` before classifying Active:

- `RunType == 1` and feed advancing: Practice
- `RunType == 2` and feed advancing: Qualifying
- `RunType == 3`: existing race logic

**Practice specifics:**

- Practice is timed, not lap-based. The NascarApi reference documents `laps_in_race` as 999 during practice, so skip the `LapNumber >= LapsInRace` check and use `elapsed_time`.
- Flag 5 during practice or qualifying means that session ended, not the race.
- Flag 8 (hot track) holds the current state.

The full state map is in Reference, section 3.

These fields are already in `LiveFeedResponse`; confirm they reach the frontend:

- `run_name` and `elapsed_time`
- for each vehicle: `best_lap_time`, `best_lap_speed`, `last_lap_time`, `last_lap_speed`, `laps_completed`, `is_on_track`, `qualifying_status`

Save a real qualifying response to learn what the `qualifying_status` values mean.

### 1.3 Polling Service error recovery

`NascarPollingService.ExecuteAsync` has no try/catch. `NascarApiClient` already catches network errors and returns null, so most failures are handled.

Any other exception in the loop (the detector, the cache) takes down the whole backend. On .NET 6 and later, an unhandled exception in a background service stops the app. Docker then restarts it, and the API is down in the meantime.

Wrap the loop body so one bad poll only costs a minute:

```csharp
try
{
    var status = await _detector.GetStatusAsync(stoppingToken);
    // existing logic
}
catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
{
    break; // clean shutdown
}
catch (Exception ex)
{
    _logger.LogError(ex, "Polling loop failed; retrying in 60s");
    await Task.Delay(TimeSpan.FromSeconds(60), stoppingToken);
}
```

### 1.4 Startup delay

Wait 5 to 10 seconds before the first poll so the app finishes starting up.

### 1.5 Timeouts and User-Agent

- **Timeouts:** `AddHttpClient<NascarApiClient>()` and `AddHttpClient<NascarHistoricalApiClient>()` set none, so the default is 100 seconds. Set about 10 to 15 seconds for the live client and about 30 for historical.
- **User-Agent:** set a header that identifies the app, so NASCAR's servers can tell who's calling.

### 1.6 Health endpoint

The cloud platform uses this to check the container is alive. Simplest version:

```csharp
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));
```

A better version also checks the database:

- register it with `builder.Services.AddHealthChecks().AddDbContextCheck<RaceIntelDbContext>();` (package `Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore`)
- map it with `app.MapHealthChecks("/health");`

### 1.7 Run type and series in the API response

`GetLiveFeed()` returns `{ raceState, lastUpdated, data }`, where `data` is NASCAR's `LiveFeedResponse` unchanged. So `run_type` and `series_id` are already there; confirm they serialize.

Later: the original plan recommended returning our own data shape instead of passing NASCAR's through, so a change on NASCAR's side doesn't break the frontend. Not required for Phase 1.

### 1.8 CORS

Currently `AllowAnyOrigin()`. All testing runs through Docker Compose, where the browser calls `/api` on the same address through nginx. Production works the same way. Neither needs CORS, so remove the policy.

### 1.9 Production settings (needed before Phase 3)

- **Environment:** `docker-compose.yml` sets `ASPNETCORE_ENVIRONMENT=Development`. Production must use `Production`.
- **Database user:** the backend connects as the `postgres` superuser. In production, create an app user that can only touch the app's tables.
- **Migrations:** they run at startup in `Program.cs`. That's fine with one container. In the cloud, consider running them as a deploy step so two containers starting together can't collide.
- **Logging:** make sure production logging isn't set to Trace.

### 1.10 Mock feed for forcing sessions (testing only)

**Goal:** force any live session, in Docker Compose, without waiting for a real race. The backend's state detection and the frontend's views get tested together. The frontend has its own view-only switch too (Frontend Spec 1.5).

**How it works:**

- **Interface:** put an interface (for example `INascarLiveFeedSource`) in front of where the Polling Service gets the Live Feed. `NascarApiClient` is the real version. A new mock version reads saved feed files from the repo instead.
- **Settings:** two new settings, `Nascar:MockFeed:Enabled` (default `false`) and `Nascar:MockFeed:Directory` (default `/test-data/nascar/live`). Compose mounts the repo's `test-data/` folder into the backend container, read-only.
- **Scenarios:** each scenario is a folder of snapshots played in order, one per poll (`red-flag/01.json`, `red-flag/02.json`, ...). The last file repeats.
  - Order matters because the detector compares each poll with the one before it. A single file played forever looks like a frozen feed.
  - That's also what the frozen-feed tests in 1.1 need.
- **Switching while running:** admin-only endpoints (X-Admin-Key). They exist only while the mock is on.
  - `GET /api/admin/mock/nascar/scenarios` lists the scenarios.
  - `POST /api/admin/mock/nascar/scenario` with `{ "scenario": "red-flag" }` switches without a restart.
- **Optional:** a shorter poll interval while the mock is on, so scenarios play out in seconds instead of minutes.
- **Production guard:** the backend refuses to start if the mock is on and the environment is Production.

**Starting scenarios:**

- pre-race: the real Feb 22, 2026 snapshot
- no session
- hot track
- practice and practice over
- qualifying and qualifying over
- green, caution, red flag, and final lap
- post-race
- a frozen feed under flag 4
- a frozen feed under flag 5

Use real captured feeds where we have them, and edited copies otherwise.

**Done when:** every row of the Reference state map can be forced from a scenario and shows the right view.

### 1.11 Upgrade to current, patched versions

Recommended early in Phase 1, because of the security fixes. Versions checked 2026-09-24 against Microsoft's .NET release notes, nuget.org, and the official Docker image list:

| Component | In the repo | Target | Why |
|---|---|---|---|
| .NET runtime and SDK (Docker images `mcr.microsoft.com/dotnet/aspnet:10.0` and `sdk:10.0`) | Floating `10.0` tags; the version depends on when each machine last pulled the image | Runtime 10.0.12, SDK 10.0.401 | 9 patch releases since 10.0.3 fixed 48 security issues (CVEs), including several remote-code-execution fixes. The ASP.NET Core fixes ship inside the runtime image, so rebuilding the image is what patches them. Keep the `10.0` tags and rebuild with `docker compose build --pull`; check the result with `dotnet --info` inside the container |
| `Microsoft.AspNetCore.OpenApi` | 10.0.3 | 10.0.12 | Match the runtime |
| `Microsoft.EntityFrameworkCore` and `Microsoft.EntityFrameworkCore.Design` | 10.0.3 | 10.0.12 | Newest 10.0.x |
| `Npgsql.EntityFrameworkCore.PostgreSQL` | 10.0.0 | 10.0.3 | Newest stable; works with EF Core 10.0.x |
| PostgreSQL (Compose image) | `postgres:17-alpine` | `postgres:17.11-alpine` | Newest 17.x, with many security fixes. Pinning the exact version keeps both machines on the same database |

**Not included, on purpose:**

- **.NET 11:** only a release candidate so far, and a short-support release. Stay on .NET 10, which is supported until November 2028.
- **PostgreSQL 18:** a major version. Moving to it takes a dump and restore rather than a tag change, so it's a separate decision.

**Done when:**

- The backend builds and starts in Docker Compose.
- `dotnet --info` in the backend container shows runtime 10.0.12.
- Migrations still apply.
- `/api/nascar/live` returns data.

## 2. Phase 2A: Historical v1

### 2.1 Read service

New: `Nascar/Services/Historical/INascarHistoricalService.cs` and `NascarHistoricalService.cs`.

- **What it does:** reads `NascarWeekendFeed` and `NascarRaceListBasicYear` rows, turns the stored JSON back into objects, and maps them to the data shapes below.
- **Caching:** `IMemoryCache`, 1 hour for season and race lists and 24 hours for race detail, since past races don't change.

```csharp
Task<List<SeasonSummaryDto>> GetSeasonsAsync(int seriesId, CancellationToken ct);
Task<List<RaceSummaryDto>> GetRacesForSeasonAsync(int seriesId, int year, CancellationToken ct);
Task<RaceDetailDto?> GetRaceDetailAsync(int raceId, CancellationToken ct);
```

### 2.2 Public endpoints

New: `Nascar/NascarHistoricalController.cs`, next to the existing `NascarController.cs`. No auth.

- `GET /api/nascar/historical/seasons?seriesId=1`
- `GET /api/nascar/historical/seasons/{year}/races?seriesId=1`
- `GET /api/nascar/historical/races/{raceId}`

Add `[ResponseCache]` (1 hour on lists, 24 hours on detail), plus `AddResponseCaching()` and `UseResponseCaching()` in `Program.cs`.

### 2.3 Data shapes (draft; open decision 8)

These are what the backend sends the frontend. They go in `Nascar/Models/Historical/`, separate from NASCAR's own models. This draft comes from the original plan. It's a starting point for backend and frontend to agree on, not a decision.

```csharp
public record SeasonSummaryDto(int Year, int SeriesId, int RaceCount);
public record RaceSummaryDto(int RaceId, string RaceName, string TrackName, DateOnly RaceDate, string? WinnerName);
public record RaceDetailDto(int RaceId, string RaceName, string TrackName, DateOnly RaceDate, int TotalLaps,
    List<RaceResultRowDto> Results, List<StageWinnerDto> StageWinners);
public record RaceResultRowDto(int FinishPosition, int StartPosition, string CarNumber, string DriverName,
    int LapsLed, string Status);
public record StageWinnerDto(int Stage, string DriverName);
```

- **Car numbers are strings.** In NASCAR's data they come as strings (for example `"48"`), so `CarNumber` is a string here too. Stored as a number, "03" would lose its leading zero.
- **Watch out for a slow season list.** If filling in each `RaceSummaryDto.WinnerName` means opening that race's Weekend Feed, the list gets slow. Take the winner from Race List Basic if it's there.

### 2.4 Load the data

No code needed; the importers exist. Call them for the Cup Series (seriesId 1) for 2024, 2025, and 2026, waiting 1 to 2 seconds between calls. Request bodies:

- `POST /api/admin/import/nascar/race-list-basic` with `{ "year": 2026 }`
- `POST /api/admin/import/nascar/weekend-feed` with `{ "year": 2026, "seriesId": 1, "raceId": 5597 }`

Both accept `"force": true` to re-import. A helper script for this belongs in `scripts/`.

### 2.5 Tests

One integration test per endpoint, using `WebApplicationFactory<Program>` against a test Postgres database. They run in CI once Phase 3 sets it up.

## 3. Phase 2C: Lap times

**The data source works.** Confirmed 2026-09-23 against race 5597 (2026 Autotrader 400, EchoPark Speedway):

`https://cf.nascar.com/cacher/{year}/{seriesId}/{raceId}/lap-times.json`

Shape observed:

```json
{
  "laps": [
    {
      "Number": "...",
      "FullName": "...",
      "Manufacturer": "...",
      "RunningPos": 1,
      "NASCARDriverID": 0,
      "Laps": [ { "Lap": 2, "LapTime": 31.024, "LapSpeed": "178.700", "RunningPos": 1 } ]
    }
  ]
}
```

- **`LapSpeed` is a string.**
- **Don't use the old draft models.** The original plan guessed different field names (`NASCAR_driver_id`, `Full_Name`).
- **First step:** save one full response in the repo (`test-data/nascar/lap-times/5597.json`) and build the models from that file.

**Storage (open decision 9)**

- **Option A: raw JSON, one row per race.**
  - Matches ADR 0002 and follows the same pattern as the existing importers.
  - A race is roughly 38 cars times 260 laps, about 10,000 laps, which is small.
  - The chart endpoint reads the row and caches it for 24 hours.
- **Option B: one database row per driver per lap** (the original plan's `NascarLapTime` table).
  - Makes cross-race questions easy, like a driver's average pace at a track across seasons.
  - That's data-science territory.

**Recommendation:** A now, and switch to B when there's a real cross-race question to answer. ADR 0002 names that same trigger for revisiting.

**Build (Option A):**

- an entity plus migration
- `POST /api/admin/import/nascar/lap-times`
- `GET /api/nascar/historical/races/{raceId}/laps`

What that endpoint returns depends on the chart decision (open decision 4). One option is per-driver arrays of lap times and positions.

**If charts should also work live:** the Live Feed only has each car's latest lap. A live chart would mean saving a snapshot on every poll during a race, which is a bigger change. Decide scope first.

## 4. Phase 4: F1 data options (open decision 5)

Not decided. Every option researched on 2026-09-23 is listed, with its limits. "From C#" says how the .NET backend would use it.

| Option | Cost | Live? | History | Limits and license | From C# |
|---|---|---|---|---|---|
| OpenF1 (free) | Free | No. Sessions show up about 30 min after they end | 2023 on: car telemetry, laps, positions, intervals, pit, tyre stints, weather, race control, some team radio | 3 requests/second, 30/minute. CC BY-NC-SA 4.0 (credit, non-commercial). One volunteer maintainer | REST (JSON or CSV) |
| OpenF1 Sponsor | €9.90/month | Yes, about 3 s behind | Same as free | 6/second, 60/minute, up to 10 live connections. Login token expires hourly. CC BY-NC-SA 4.0 | REST, plus MQTT or WebSocket for live |
| OpenF1 self-hosted | Free code; we pay hosting and MongoDB | Yes, if we record sessions ourselves | Whatever we record or import | Live recording needs our own F1 TV subscription token (expires about every 4 days) and must start 1 hour before a race. Code is CC BY-NC-SA 4.0 | Python + MongoDB service next to ours; we read its REST output |
| FastF1 | Free (MIT code) | No. It can record a session but not process it in real time | 2018 on: laps, telemetry, positions, weather. Results back to 1950 through Jolpica | Data usually ready 30 to 120 min after a session. Live recording needs an F1 TV login. Data belongs to F1 | Python only; run as an import script that writes to Postgres |
| Jolpica API (replaced Ergast) | Free, donation-funded | No | Results, qualifying, sprints, standings from 1950; lap times from 1996; pit stops from 2011. No telemetry | 4/second burst, 500/hour, custom User-Agent required. Data CC BY-NC-SA 4.0; commercial use by request | REST (JSON) |
| Jolpica database dumps | Free (14 days behind); paid supporter tier gets current dumps plus a commercial license | No | Full historical database | Free tier non-commercial. Column order can change | CSV bulk load into Postgres |
| F1DB | Free | No. New release after each race | 1950 on: results, qualifying, sprints, grids, fastest laps, pit stops, standings. Per-lap times not confirmed | CC BY 4.0: commercial use allowed with credit | Ready-made PostgreSQL dumps, also CSV and JSON |
| TracingInsights RaceData | Free | No. Updated within 3 hours of a race | Results and standings from 1950; lap times and pit stops only as far back as its source data (Jolpica: 1996 and 2011); safety cars | Labeled CC0, but built from Ergast/Jolpica data, so treat it as CC BY-NC-SA | CSV |
| TracingInsights season repos | Free | No. About 30 min after each session | Per season: telemetry, laps, weather, race control (built with FastF1) | Code Apache-2.0; data rights are F1's. One maintainer | JSON files |
| Kaggle F1 dataset (1950 to 2024) | Free | No | 1950 to 2024, Ergast tables | Stops at 2024. License not shown | CSV |
| Official F1 live timing feed | Free feed; full data needs F1 TV (US: F1 TV Access $3.49/month, or Premium through Apple TV at $12.99/month) | Yes, real time | Only what we record; past-session archives exist | Unofficial, no public API terms. Some streams need an F1 TV login since the 2025 Dutch GP. formula1.com allows personal, non-commercial use only | UndercutF1.Data (.NET 10 library, GPL-3.0) |
| LiveF1 | Free (MIT) | Yes, through the official feed | Official archive plus Jolpica | Same risks as the official feed | Python only |
| API-Sports Formula-1 | Free 100 requests/day; Pro $15, Ultra $25, Mega $35 per month | Claims live; delay not confirmed | About 15 seasons: races, rankings, pit stops, laps | Pro 7,500/day, up to 150,000/day on Mega. Commercial product | REST (JSON), API key |
| Sportmonks Formula One | €69/month or €830/year; free test token | Yes (polling) | Laps, sectors, pit stops, stints, tyres. How far back not confirmed | 3,000 calls/hour per endpoint. Commercial | REST (JSON) |
| Sportradar F1 | Enterprise pricing; 30-day trial (1,000 requests) | Yes, lap by lap | Current season plus 2 previous | Commercial contract | REST (JSON) |
| Hyprace | Pro $7.99 to Mega $69.99 per month; no free tier | No. Minutes after the checkered flag | 1950s on: results, standings, stats | Monthly quotas. No lap, pit, or telemetry data listed. Commercial | REST (JSON) |
| PitStop Data | Free 15 requests/day; Pro $4.99 to Mega $49.99 per month | No. Minutes after sessions | Calendars 2000 to 2026; lap times, sectors, pit stops 2024 to 2026 | Daily and monthly quotas. New, small provider | REST (JSON) |
| f1api.dev | Free (MIT code) | Has a live dashboard; delay not confirmed | Seasons, drivers, teams, circuits | Limits and data origin not published. One maintainer | REST (JSON) |

**Things that apply across options:**

- **Commercial use:** almost every free source is non-commercial. That's fine as long as the project stays non-commercial. F1DB (CC BY 4.0) and Jolpica's paid supporter dumps are the verified sources that allow commercial use.
- **The official feed has no public license.** Anything built on it (FastF1 live, self-hosted OpenF1, UndercutF1, LiveF1) can break when F1 changes access, as it did in 2025.
- **UndercutF1.Data is GPL-3.0,** which affects the project's license choice (open decision 7).
- **Ergast is gone.** Ergast shut down at the end of 2024, and ergast.com now hosts unrelated gambling content. Don't link to it.
- **Coverage by data type:** telemetry from 2023 (OpenF1) or 2018 (FastF1); lap times from 1996 (Jolpica); results from 1950 (Jolpica, F1DB).

**Design, whichever source wins:** mirror the NASCAR pattern.

- an `F1/` folder beside `Nascar/`
- admin-triggered imports
- raw JSON storage
- cached reads

Pace imports under the source's rate limit.

## Sources

- NASCAR feed reference: https://github.com/ooohfascinating/NascarApi
- OpenF1: https://openf1.org/, https://openf1.org/docs/, https://openf1.org/auth.html, https://github.com/br-g/openf1
- FastF1: https://docs.fastf1.dev/data_reference/index.html, https://docs.fastf1.dev/livetiming.html, https://github.com/theOehrly/Fast-F1/releases
- Jolpica: https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md, https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md, https://github.com/jolpica/jolpica-f1/blob/main/docs/database_dumps.md
- F1DB: https://github.com/f1db/f1db
- .NET 10 releases: https://github.com/dotnet/core/blob/main/release-notes/10.0/releases.json
- NuGet packages: https://www.nuget.org/packages/Microsoft.EntityFrameworkCore, https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL
- PostgreSQL versions: https://www.postgresql.org/support/versioning/
- TracingInsights: https://github.com/TracingInsights/RaceData, https://github.com/TracingInsights/2026
- Kaggle: https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020
- Official feed and F1 TV: https://www.formula1.com/en/information/legal-notices.7egvZU48hzrypubGBNcQKt, https://www.formula1.com/en-us/subscribe-to-f1-tv, https://github.com/JustAman62/undercut-f1, https://www.nuget.org/packages/UndercutF1.Data
- LiveF1: https://github.com/GoktugOcal/LiveF1
- API-Sports: https://api-sports.io/sports/formula-1
- Sportmonks: https://www.sportmonks.com/formula-one-api/
- Sportradar: https://developer.sportradar.com/racing/reference/f1-faq
- Hyprace: https://developers.hyprace.com/
- PitStop Data: https://pitstopdata.com/
- f1api.dev: https://f1api.dev/
