# 0002: Next.js as a server, and admin-only imports

**Decided:** February 2026 (exact day not recorded)
**Sources:** Master Plan, "Decisions made"; Reference, section 5; Backend Spec

## 1. Next.js runs as a server, not a static export

**Status:** Accepted

**Decision:** The frontend builds with `output: standalone` and runs as a Node server behind nginx.

**Why:** A static export (`output: export`) can't fetch data at request time, and the live page and server components need to.

**Rejected:** Static export. It would have made hosting on a static file host simpler, but it can't serve live data.

**Consequences:** Hosting has to run a server for the frontend. Some options (for example, the frontend on Cloudflare Workers) need an adapter to run Next.js. Those are covered in the Infrastructure Plan pricing (added 2026-09-23).

## 2. Historical imports are admin-only

**Status:** Accepted

**Decision:** Importing NASCAR data into the database is done by hand through `POST` endpoints under `/api/admin/import/nascar/`. Each request needs the admin key in the `X-Admin-Key` header. There is no automatic import.

**Why:** Imports call NASCAR's servers and write to the database. Keeping them manual and key-protected stops visitors from triggering them.

**Consequences:**
- The key lives in `.env` locally and in the cloud's secret store in production. It is never committed.
- Phase 2 keeps imports admin-only (Master Plan, Phase 2 done criteria).
- The Infrastructure Plan (section 2) proposes also blocking `/api/admin/*` at Cloudflare except from our own IPs. See 0004, section 13.
