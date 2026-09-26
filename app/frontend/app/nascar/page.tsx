"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VscTriangleUp, VscTriangleDown } from "react-icons/vsc";
import Modal from "../components/Modal";

/* ─── Types matching the backend response ─── */

type RaceState = "unknown" | "pre-race" | "active" | "post-race" | "no-race";

interface DriverInfo {
  driver_id: number | null;
  full_name: string;
  first_name: string;
  last_name: string;
}

interface VehicleInfo {
  running_position: number | null;
  driver: DriverInfo;
  vehicle_number: string;
  delta: number | null;
  last_lap_time: number | null;
  last_lap_speed: number | null;
  average_speed: number | null;
  best_lap: number | null;
  best_lap_speed: number | null;
  best_lap_time: number | null;
  starting_position: number | null;
  passes_made: number | null;
  times_passed: number | null;
  quality_passes: number | null;
  laps_completed: number | null;
  laps_led: { start_lap: number | null; end_lap: number | null }[];
  vehicle_manufacturer: string;
  status: number | null;
  is_on_track: boolean | null;
}

interface StageInfo {
  stage_num: number | null;
  finish_at_lap: number | null;
  laps_in_stage: number | null;
}

interface LiveFeedData {
  lap_number: number | null;
  laps_in_race: number | null;
  laps_to_go: number | null;
  flag_state: number | null;
  run_name: string;
  track_name: string;
  elapsed_time: number | null;
  number_of_caution_segments: number | null;
  number_of_caution_laps: number | null;
  number_of_lead_changes: number | null;
  number_of_leaders: number | null;
  stage: StageInfo;
  vehicles: VehicleInfo[];
}

interface ApiResponse {
  raceState: unknown;
  reason: string;
  lastUpdated: string;
  data: LiveFeedData | null;
}

function normalizeRaceState(raw: unknown): RaceState {
  // Handle integer enum (ASP.NET default serialization)
  if (typeof raw === "number") {
    const map: Record<number, RaceState> = { 0: "unknown", 1: "pre-race", 2: "active", 3: "post-race", 4: "no-race" };
    return map[raw] ?? "unknown";
  }
  // Handle PascalCase string enum (JsonStringEnumConverter without naming policy)
  if (typeof raw === "string") {
    const map: Record<string, RaceState> = {
      Unknown: "unknown", PreRace: "pre-race", Active: "active", PostRace: "post-race", NoRace: "no-race",
      // Also accept kebab-case in case the backend is already correct
      unknown: "unknown", "pre-race": "pre-race", active: "active", "post-race": "post-race", "no-race": "no-race",
    };
    return map[raw] ?? "unknown";
  }
  return "unknown";
}

/** Map NASCAR API flag_state to a display label */
function flagLabel(state: number | null | undefined): string {
  switch (state) {
    case 1: return "Green flag";
    case 2: return "Yellow flag";
    case 3: return "Red flag";
    case 4: return "Checkered flag";
    case 8: return "Warm-up";
    case 9: return "Not active";
    default: return "—";
  }
}

function flagChipClass(state: number | null | undefined): string {
  switch (state) {
    case 1: return "chip-green";
    case 2: return "chip-yellow";
    case 3: return "chip-red";
    default: return "";
  }
}

function formatLapTime(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return "—";
  return `${seconds.toFixed(3)}s`;
}

function formatSpeed(speed: number | null | undefined): string {
  if (speed == null || speed <= 0) return "—";
  return `${speed.toFixed(1)} mph`;
}

function computePassRate(made: number | null, passed: number | null): string {
  const m = made ?? 0;
  const p = passed ?? 0;
  const total = m + p;
  if (total === 0) return "0%";
  return `${Math.round((m / total) * 100)}%`;
}

function positionDiff(start: number | null, current: number | null): number {
  if (start == null || current == null) return 0;
  return start - current; // positive = gained positions
}

/* ─── Sidebar data (static — recent / upcoming races) ─── */

const recentRaces = [
  { name: "Daytona 500", location: "Daytona", date: "Feb 16, 2026", slug: "daytona-500-2026" },
  { name: "Atlanta 400", location: "Atlanta", date: "Feb 23, 2026", slug: "atlanta-400-2026" },
  { name: "Las Vegas 400", location: "Las Vegas", date: "Mar 02, 2026", slug: "las-vegas-400-2026" },
  { name: "Phoenix 500", location: "Phoenix", date: "Mar 09, 2026", slug: "phoenix-500-2026" },
  { name: "Auto Club 400", location: "Fontana", date: "Mar 23, 2026", slug: "auto-club-400-2026" },
];

/* ─── Component ─── */

export default function NascarLivePage() {
  const [positionsOpen, setPositionsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [raceState, setRaceState] = useState<RaceState>("unknown");
  const [feed, setFeed] = useState<LiveFeedData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLastRace, setShowLastRace] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* fetch from backend */
  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch(`/api/nascar/live`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse = await res.json();
      setRaceState(normalizeRaceState(json.raceState));
      setFeed(json.data);
      setLastUpdated(json.lastUpdated);
    } catch {
      setRaceState("unknown");
    } finally {
      setLoading(false);
    }
  }, []);

  /* polling loop — interval depends on current race state */
  useEffect(() => {
    fetchLive();

    const intervalMs = (() => {
      switch (raceState) {
        case "active": return 30_000;     // 30s when live
        case "pre-race": return 30_000;   // 30s pre-race
        case "post-race": return 120_000; // 2min post-race
        default: return 60_000;           // 1min otherwise
      }
    })();

    timerRef.current = setInterval(fetchLive, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [raceState, fetchLive]);

  /* sidebar filtering */
  const filteredRaces = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return recentRaces;
    return recentRaces.filter((race) =>
      `${race.name} ${race.location} ${race.date}`.toLowerCase().includes(query)
    );
  }, [search]);

  /* sorted positions (by running_position) */
  const sortedVehicles = useMemo(() => {
    if (!feed?.vehicles) return [];
    return [...feed.vehicles].sort(
      (a, b) => (a.running_position ?? 999) - (b.running_position ?? 999)
    );
  }, [feed]);

  const topDrivers = sortedVehicles.slice(0, 5);
  const allDrivers = sortedVehicles;

  /* position analytics for the modal */
  const positionAnalytics = useMemo(() => {
    if (!sortedVehicles.length) return [];
    const leader = sortedVehicles[0];
    let biggestMover = sortedVehicles[0];
    let biggestGain = 0;
    for (const v of sortedVehicles) {
      const diff = positionDiff(v.starting_position, v.running_position);
      if (diff > biggestGain) {
        biggestGain = diff;
        biggestMover = v;
      }
    }
    const top10 = sortedVehicles.slice(0, 10);
    const deltas = top10.map((v) => Math.abs(v.delta ?? 0));
    const avgGap = deltas.length ? deltas.reduce((a, b) => a + b, 0) / deltas.length : 0;

    return [
      {
        label: "Leader Avg Speed",
        value: formatSpeed(leader?.average_speed),
        note: `${leader?.driver?.full_name ?? "—"} average speed this run`,
      },
      {
        label: "Biggest Mover",
        value: `+${biggestGain} spots`,
        note: `${biggestMover?.driver?.full_name ?? "—"} P${biggestMover?.starting_position ?? "?"} → P${biggestMover?.running_position ?? "?"}`,
      },
      {
        label: "Average Gap",
        value: `${avgGap.toFixed(1)}s`,
        note: "Mean delta across top 10",
      },
    ];
  }, [sortedVehicles]);

  const showRaceData =
    raceState === "active" ||
    raceState === "pre-race" ||
    raceState === "post-race" ||
    raceState === "unknown" ||
    (raceState === "no-race" && feed !== null) ||
    showLastRace;

  /* Loading state */
  if (loading) {
    return (
      <div className="series-layout">
        <Sidebar search={search} setSearch={setSearch} filteredRaces={filteredRaces} />
        <div className="series-main">
          <section className="panel p-8 md:p-12 fade-up">
            <div className="flex flex-col gap-4 text-center">
              <span className="chip mx-auto">Live status</span>
              <h1 className="hero-title">Connecting…</h1>
              <p className="hero-subtitle muted">Fetching live race data from the server.</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="series-layout">
      <Sidebar search={search} setSearch={setSearch} filteredRaces={filteredRaces} />

      <div className="series-main">
        {/* ── Unknown / NoRace (no feed) ── */}
        {(raceState === "unknown" || (raceState === "no-race" && feed === null)) && !showLastRace && (
          <section className="panel p-8 md:p-12 fade-up">
            <div className="flex flex-col gap-4 text-center">
              <span className="chip mx-auto">Live status</span>
              <h1 className="hero-title">No current live race</h1>
              <p className="hero-subtitle muted">Check again later.</p>
              {feed && (
                <button
                  type="button"
                  className="nav-link panel-soft mx-auto mt-2"
                  onClick={() => setShowLastRace(true)}
                >
                  View most recent race
                </button>
              )}
            </div>
          </section>
        )}

        {/* ── PostRace banner ── */}
        {raceState === "post-race" && (
          <section className="panel p-8 md:p-12 fade-up">
            <div className="flex flex-col gap-4 text-center">
              <span className="chip mx-auto">Post-race</span>
              <h1 className="hero-title">No live race</h1>
              <p className="hero-subtitle muted">
                Showing most recent race results below.
              </p>
            </div>
          </section>
        )}

        {/* ── PreRace / Active / PostRace data ── */}
        {showRaceData && feed && (
          <>
            {/* Hero */}
            <section className="panel p-8 md:p-12 fade-up">
              <div className="flex flex-col gap-4">
                <span className="chip">
                  {raceState === "pre-race"
                    ? "Pre-race"
                    : raceState === "active"
                    ? "Live now"
                    : raceState === "post-race"
                    ? "Final results"
                    : raceState === "no-race"
                    ? "Last known data"
                    : "No active race"
                  }
                </span>
                <h1 className="hero-title">
                  {feed.run_name || "NASCAR Race"} performance command
                </h1>
                <p className="hero-subtitle muted">
                  {raceState === "pre-race"
                    ? `Pre-race data for ${feed.track_name || "the upcoming race"}. Race has not started yet.`
                    : raceState === "active"
                    ? "Live position tracking, speed analytics, and passing metrics powered by the NASCAR live feed."
                    : raceState === "post-race"
                    ? `Final results from ${feed.track_name || "the race"}.`
                    : `Last known feed data from ${feed.track_name || "the most recent session"}. No race currently active.`
                  }
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="panel-soft px-4 py-2 text-sm">
                    Stage: {feed.stage?.stage_num ?? "—"} of 3
                  </span>
                  <span className="panel-soft px-4 py-2 text-sm">
                    Lap: {feed.lap_number ?? 0} / {feed.laps_in_race ?? "—"}
                  </span>
                  <span className="panel-soft px-4 py-2 text-sm">
                    Caution count: {feed.number_of_caution_segments ?? 0}
                  </span>
                  {lastUpdated && (
                    <span className="panel-soft px-4 py-2 text-sm muted">
                      Updated: {new Date(lastUpdated).toLocaleTimeString()}
                    </span>
                  )}
                  {showLastRace && (
                    <button
                      type="button"
                      className="nav-link panel-soft"
                      onClick={() => setShowLastRace(false)}
                    >
                      Back to live status
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Positions table + Track info */}
            <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr] fade-up delay-1">
              <div className="panel p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">
                    <button
                      type="button"
                      className="section-title-button"
                      onClick={() => setPositionsOpen(true)}
                    >
                      {raceState === "pre-race" ? "Starting grid" : "Live positions"}
                    </button>
                  </h2>
                  <span className={`chip ${flagChipClass(feed.flag_state)}`}>
                    {flagLabel(feed.flag_state)}
                  </span>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="data-table w-full" style={{ minWidth: 620 }}>
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap">Pos</th>
                        <th className="whitespace-nowrap">Driver</th>
                        <th className="whitespace-nowrap">Car</th>
                        <th className="whitespace-nowrap">Gap</th>
                        <th className="whitespace-nowrap">Last Lap</th>
                        <th className="whitespace-nowrap">Avg Speed</th>
                        <th className="whitespace-nowrap">+/−</th>
                        <th className="whitespace-nowrap">Best Lap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topDrivers.map((v) => {
                        const diff = positionDiff(v.starting_position, v.running_position);
                        return (
                          <tr key={v.vehicle_number}>
                            <td className="whitespace-nowrap">{v.running_position ?? "—"}</td>
                            <td className="whitespace-nowrap">{v.driver?.full_name ?? "—"}</td>
                            <td className="whitespace-nowrap">#{v.vehicle_number}</td>
                            <td className="whitespace-nowrap">
                              {v.delta != null ? `${v.delta > 0 ? "+" : ""}${v.delta.toFixed(3)}s` : "—"}
                            </td>
                            <td className="whitespace-nowrap">{formatLapTime(v.last_lap_time)}</td>
                            <td className="whitespace-nowrap">{formatSpeed(v.average_speed)}</td>
                            <td className={`whitespace-nowrap ${diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : ""}`}>
                              <span className="inline-flex items-center gap-0.5">
                                {diff > 0 && <VscTriangleUp className="text-green-500" />}
                                {diff < 0 && <VscTriangleDown className="text-red-500" />}
                                {Math.abs(diff)}
                              </span>
                            </td>
                            <td className="whitespace-nowrap">{formatLapTime(v.best_lap_time)}</td>
                          </tr>
                        );
                      })}
                      {topDrivers.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center muted py-8">
                            No vehicle data available yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel p-6 md:p-8 flex flex-col items-center">
                <h2 className="section-title self-start">Track info</h2>
                <div className="mt-6 space-y-3 w-full">
                  <div className="panel-soft p-4">
                    <p className="text-sm uppercase tracking-widest muted">Track</p>
                    <p className="mt-1 text-lg font-semibold">{feed.track_name || "—"}</p>
                  </div>
                  <div className="panel-soft p-4">
                    <p className="text-sm uppercase tracking-widest muted">Lead changes</p>
                    <p className="mt-1 text-lg font-semibold">{feed.number_of_lead_changes ?? 0}</p>
                  </div>
                  <div className="panel-soft p-4">
                    <p className="text-sm uppercase tracking-widest muted">Caution laps</p>
                    <p className="mt-1 text-lg font-semibold">{feed.number_of_caution_laps ?? 0}</p>
                  </div>
                  <div className="panel-soft p-4">
                    <p className="text-sm uppercase tracking-widest muted">Leaders</p>
                    <p className="mt-1 text-lg font-semibold">{feed.number_of_leaders ?? 0}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Race stats row */}
            <section className="panel p-6 md:p-8 fade-up delay-2">
              <h2 className="section-title">Race stats</h2>
              <div className="kpi-row mt-4">
                <div className="kpi-item">
                  <span className="kpi-label muted">Laps</span>
                  <span className="kpi-value">{feed.lap_number ?? 0}</span>
                </div>
                <div className="kpi-item">
                  <span className="kpi-label muted">To go</span>
                  <span className="kpi-value">{feed.laps_to_go ?? "—"}</span>
                </div>
                <div className="kpi-item">
                  <span className="kpi-label muted">Cautions</span>
                  <span className="kpi-value">{feed.number_of_caution_segments ?? 0}</span>
                </div>
                <div className="kpi-item">
                  <span className="kpi-label muted">Lead changes</span>
                  <span className="kpi-value">{feed.number_of_lead_changes ?? 0}</span>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Full positions modal */}
      {showRaceData && feed && (
        <Modal
          isOpen={positionsOpen}
          title="NASCAR live positions + analytics"
          onClose={() => setPositionsOpen(false)}
        >
          {positionAnalytics.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3">
              {positionAnalytics.map((item) => (
                <div key={item.label} className="panel-soft p-4">
                  <p className="text-sm uppercase tracking-widest muted">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  <p className="mt-2 text-sm muted">{item.note}</p>
                </div>
              ))}
            </div>
          )}
          <div className="panel-soft p-4 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Driver</th>
                  <th>Car</th>
                  <th>Gap</th>
                  <th>Last Lap</th>
                  <th>Avg Speed</th>
                  <th title="PassesMade / (PassesMade + TimesPassed) — % of passing battles won">Pass Rate</th>
                  <th>Start</th>
                  <th>+/−</th>
                  <th>Best Lap</th>
                </tr>
              </thead>
              <tbody>
                {allDrivers.map((v) => {
                  const diff = positionDiff(v.starting_position, v.running_position);
                  return (
                    <tr key={v.vehicle_number}>
                      <td>{v.running_position ?? "—"}</td>
                      <td>{v.driver?.full_name ?? "—"}</td>
                      <td>#{v.vehicle_number}</td>
                      <td>{v.delta != null ? `${v.delta > 0 ? "+" : ""}${v.delta.toFixed(3)}s` : "—"}</td>
                      <td>{formatLapTime(v.last_lap_time)}</td>
                      <td>{formatSpeed(v.average_speed)}</td>
                      <td title={`Made: ${v.passes_made ?? 0} | Passed: ${v.times_passed ?? 0} | Quality: ${v.quality_passes ?? 0}`}>
                        {computePassRate(v.passes_made, v.times_passed)}
                      </td>
                      <td>{v.starting_position ?? "—"}</td>
                      <td className={diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : ""}>
                        <span className="inline-flex items-center gap-0.5">
                          {diff > 0 && <VscTriangleUp className="text-green-500" />}
                          {diff < 0 && <VscTriangleDown className="text-red-500" />}
                          {Math.abs(diff)}
                        </span>
                      </td>
                      <td>{formatLapTime(v.best_lap_time)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Sidebar sub-component ─── */

function Sidebar({
  search,
  setSearch,
  filteredRaces,
}: {
  search: string;
  setSearch: (v: string) => void;
  filteredRaces: typeof recentRaces;
}) {
  return (
    <aside className="series-sidebar">
      <div className="panel p-5">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Recent races</h2>
          <span className="chip">NASCAR</span>
        </div>
        <label className="search-label" htmlFor="nascar-race-search">
          Search races
        </label>
        <input
          id="nascar-race-search"
          className="search-input"
          type="search"
          placeholder="Search by race, city, date"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="race-list">
          {filteredRaces.map((race) => (
            <Link
              key={race.slug}
              className="race-link"
              href={`/nascar/${race.slug}`}
            >
              <span className="race-name">{race.name}</span>
              <span className="race-meta">{race.location}</span>
              <span className="race-meta">{race.date}</span>
            </Link>
          ))}
          {filteredRaces.length === 0 && (
            <span className="muted">No races match your search.</span>
          )}
        </div>
      </div>
    </aside>
  );
}
