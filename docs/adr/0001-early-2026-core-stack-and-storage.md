# 0001: Core stack and data storage

**Decided:** early 2026 (exact day not recorded)
**Sources:** Reference, section 5; Master Plan, "Decisions made"
**Replaces:** the old `0001-core-stack.md` and `0002-historical-elt-raw-json.md` (kept in Drive under Parabolica/Old/)

## 1. Core technology stack

**Status:** Accepted

**Decision:** The backend is ASP.NET Core (C#) with Entity Framework Core and PostgreSQL. The frontend is Next.js (TypeScript, Tailwind CSS). Docker Compose runs everything locally, with nginx sending `/api/*` to the backend and everything else to the Next.js server.

**Why:**
- Motorsport DevOps and infrastructure roles value .NET and cloud-native skills.
- PostgreSQL stores JSON natively (jsonb), and managed PostgreSQL is available on every cloud.
- Next.js keeps server rendering available for historical pages.

**Rejected:**
- SQLite: no jsonb.
- Node/Express: less relevant to the target jobs.

**Consequences:** Versions are not recorded here. The installed versions live in `app/backend/Parabolica.Api.csproj`, `app/frontend/package.json`, the Dockerfiles and `docker-compose.yml`.

## 2. Store NASCAR historical data as raw JSON

**Status:** Accepted

**Decision:** Weekend Feed and Race List Basic payloads are saved exactly as NASCAR sends them, in jsonb columns. Fields are pulled out when reading, not when importing.

**Why:**
- The results page design wasn't settled when the importers were written.
- The data is small: hundreds of races, a few KB each.
- Past races never change, so with caching the database is rarely read.

**Rejected:** A normalized schema. A field change would mean a database migration, which costs more than deserializing a stored payload on a cache miss.

**Consequences:**
- Import code stays simple: download, save, done.
- A new field on a page needs only a code change, no database change.
- Revisit if queries ever need to filter or join across races. The options then are jsonb operators or proper tables.
- The Backend Spec recommends the same approach for lap times. That is still open decision 9 in the Master Plan.
