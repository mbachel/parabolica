# 0003: Components work across series

**Decided:** June 2026 (exact day not recorded)
**Sources:** Master Plan, "Decisions made"; Frontend Spec, "Design principles"

## 1. Shared components are series-agnostic

**Status:** Accepted

**Decision:** Leaderboards, flag badges, session headers and stat panels take props that fit NASCAR, F1 and later series wherever that's feasible. NASCAR-specific logic stays out of shared components.

**Why:** F1 is planned (Phase 4). Building shared components once avoids a second copy of every view.

**Consequences:**
- Page-specific components live next to their route. Shared ones live in `app/frontend/app/components/`.
- `FlagBadge` and `SessionHeader` are the first candidates to move into shared components once F1 needs them (Frontend Spec 1.2).
- In Phase 4, F1 views reuse the shared components (Frontend Spec, section 4).
