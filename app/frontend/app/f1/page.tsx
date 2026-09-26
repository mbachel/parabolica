"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Modal from "../components/Modal";

export default function F1LivePage() {
  const [positionsOpen, setPositionsOpen] = useState(false);
  const [telemetryOpen, setTelemetryOpen] = useState(false);
  const [strategyOpen, setStrategyOpen] = useState(false);
  const [search, setSearch] = useState("");
  const recentRaces = [
    {
      name: "Bahrain GP",
      location: "Sakhir",
      date: "Mar 02, 2026",
      slug: "bahrain-gp-2026",
    },
    {
      name: "Saudi Arabian GP",
      location: "Jeddah",
      date: "Mar 09, 2026",
      slug: "saudi-arabian-gp-2026",
    },
    {
      name: "Australian GP",
      location: "Melbourne",
      date: "Mar 23, 2026",
      slug: "australian-gp-2026",
    },
    {
      name: "Japanese GP",
      location: "Suzuka",
      date: "Apr 06, 2026",
      slug: "japanese-gp-2026",
    },
    {
      name: "Chinese GP",
      location: "Shanghai",
      date: "Apr 20, 2026",
      slug: "chinese-gp-2026",
    },
  ];

  const filteredRaces = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return recentRaces;
    }

    return recentRaces.filter((race) =>
      `${race.name} ${race.location} ${race.date}`
        .toLowerCase()
        .includes(query)
    );
  }, [recentRaces, search]);
  const liveStandings = [
    {
      pos: "1",
      driver: "Verstappen",
      team: "Red Bull",
      gap: "+0.0",
      tire: "Soft",
      stint: "8",
    },
    {
      pos: "2",
      driver: "Leclerc",
      team: "Ferrari",
      gap: "+1.9",
      tire: "Soft",
      stint: "9",
    },
    {
      pos: "3",
      driver: "Norris",
      team: "McLaren",
      gap: "+3.2",
      tire: "Medium",
      stint: "6",
    },
    {
      pos: "4",
      driver: "Hamilton",
      team: "Mercedes",
      gap: "+4.5",
      tire: "Medium",
      stint: "7",
    },
    {
      pos: "5",
      driver: "Alonso",
      team: "Aston Martin",
      gap: "+6.1",
      tire: "Hard",
      stint: "12",
    },
  ];

  const telemetry = [
    {
      title: "DRS usage",
      value: "74%",
      detail: "Leclerc within 0.9s on the main straight.",
    },
    {
      title: "Brake energy",
      value: "92%",
      detail: "Turn 10 stability improved in last 4 laps.",
    },
    {
      title: "Tire life",
      value: "Soft 61%",
      detail: "Drop-off expected in 6 laps for lead group.",
    },
  ];

  const strategy = [
    {
      title: "Undercut threat",
      detail: "P2 pit window opens on lap 24; delta 1.4s.",
    },
    {
      title: "Alternate strategy",
      detail: "Switch to hard tire on lap 28 for one-stop path.",
    },
    {
      title: "Safety car model",
      detail: "14% probability based on sector incidents.",
    },
  ];

  const fullStandings = [
    {
      pos: "1",
      driver: "Verstappen",
      team: "Red Bull",
      gap: "+0.0",
      tire: "Soft",
      stint: "8",
      lastLap: "1:35.4",
      s1: "+0.05",
      s2: "-0.02",
      s3: "+0.01",
      life: "61%",
    },
    {
      pos: "2",
      driver: "Leclerc",
      team: "Ferrari",
      gap: "+1.9",
      tire: "Soft",
      stint: "9",
      lastLap: "1:35.8",
      s1: "-0.03",
      s2: "+0.08",
      s3: "+0.02",
      life: "58%",
    },
    {
      pos: "3",
      driver: "Norris",
      team: "McLaren",
      gap: "+3.2",
      tire: "Medium",
      stint: "6",
      lastLap: "1:36.1",
      s1: "+0.12",
      s2: "-0.01",
      s3: "+0.04",
      life: "72%",
    },
    {
      pos: "4",
      driver: "Hamilton",
      team: "Mercedes",
      gap: "+4.5",
      tire: "Medium",
      stint: "7",
      lastLap: "1:36.3",
      s1: "+0.09",
      s2: "+0.04",
      s3: "-0.02",
      life: "69%",
    },
    {
      pos: "5",
      driver: "Alonso",
      team: "Aston Martin",
      gap: "+6.1",
      tire: "Hard",
      stint: "12",
      lastLap: "1:36.6",
      s1: "+0.18",
      s2: "+0.03",
      s3: "+0.06",
      life: "84%",
    },
    {
      pos: "6",
      driver: "Perez",
      team: "Red Bull",
      gap: "+7.4",
      tire: "Hard",
      stint: "10",
      lastLap: "1:36.8",
      s1: "+0.22",
      s2: "+0.02",
      s3: "+0.08",
      life: "79%",
    },
    {
      pos: "7",
      driver: "Russell",
      team: "Mercedes",
      gap: "+9.0",
      tire: "Medium",
      stint: "8",
      lastLap: "1:36.9",
      s1: "+0.14",
      s2: "+0.11",
      s3: "+0.01",
      life: "63%",
    },
    {
      pos: "8",
      driver: "Sainz",
      team: "Ferrari",
      gap: "+10.6",
      tire: "Hard",
      stint: "11",
      lastLap: "1:37.1",
      s1: "+0.19",
      s2: "+0.08",
      s3: "+0.03",
      life: "82%",
    },
    {
      pos: "9",
      driver: "Piastri",
      team: "McLaren",
      gap: "+12.2",
      tire: "Medium",
      stint: "7",
      lastLap: "1:37.2",
      s1: "+0.21",
      s2: "+0.09",
      s3: "+0.04",
      life: "67%",
    },
    {
      pos: "10",
      driver: "Gasly",
      team: "Alpine",
      gap: "+13.6",
      tire: "Hard",
      stint: "9",
      lastLap: "1:37.3",
      s1: "+0.25",
      s2: "+0.05",
      s3: "+0.07",
      life: "77%",
    },
  ];

  const positionAnalytics = [
    { label: "Fastest lap", value: "1:34.9", note: "Leclerc (lap 19)" },
    { label: "Pit window", value: "L24-L28", note: "Top 3 within range" },
    { label: "Overtake delta", value: "+0.7s", note: "Needed on main straight" },
  ];

  const telemetryDetails = [
    {
      label: "Throttle average",
      value: "71%",
      note: "Top 5 running more lift in sector 2.",
    },
    {
      label: "Brake pressure",
      value: "128 bar",
      note: "Turn 10 decel highest of race so far.",
    },
    {
      label: "DRS gain",
      value: "12.4 km/h",
      note: "Overtake probability +18% vs last stint.",
    },
  ];

  const sectorTable = [
    { driver: "Verstappen", s1: "26.104", s2: "33.221", s3: "36.082" },
    { driver: "Leclerc", s1: "26.030", s2: "33.310", s3: "36.118" },
    { driver: "Norris", s1: "26.210", s2: "33.268", s3: "36.200" },
    { driver: "Hamilton", s1: "26.184", s2: "33.402", s3: "36.260" },
  ];

  const strategyTable = [
    {
      driver: "Verstappen",
      current: "Soft",
      plan: "Soft -> Hard",
      window: "L26-L28",
    },
    {
      driver: "Leclerc",
      current: "Soft",
      plan: "Soft -> Hard",
      window: "L24-L27",
    },
    {
      driver: "Norris",
      current: "Medium",
      plan: "Medium -> Soft",
      window: "L30-L33",
    },
    {
      driver: "Hamilton",
      current: "Medium",
      plan: "Medium -> Hard",
      window: "L29-L32",
    },
  ];

  const isLiveRaceAvailable = false;

  return (
    <div className="series-layout">
      <aside className="series-sidebar">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Recent races</h2>
            <span className="chip">F1</span>
          </div>
          <label className="search-label" htmlFor="f1-race-search">
            Search races
          </label>
          <input
            id="f1-race-search"
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
                href={`/f1/${race.slug}`}
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

      <div className="series-main">
        {isLiveRaceAvailable ? (
          <>
            <section className="panel p-8 md:p-12 fade-up">
              <div className="flex flex-col gap-4">
                <span className="chip">Live now</span>
                <h1 className="hero-title">Bahrain Grand Prix telemetry board</h1>
                <p className="hero-subtitle muted">
                  Live positions, tire data, and strategy insights for the current
                  session. Replace with real feeds once telemetry APIs are connected.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="panel-soft px-4 py-2 text-sm">
                    Track temp: 31C
                  </span>
                  <span className="panel-soft px-4 py-2 text-sm">Lap: 22 / 57</span>
                  <span className="panel-soft px-4 py-2 text-sm">
                    DRS status: Enabled
                  </span>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr] fade-up delay-1">
              <div className="panel p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">
                    <button
                      type="button"
                      className="section-title-button"
                      onClick={() => setPositionsOpen(true)}
                    >
                      Live positions
                    </button>
                  </h2>
                  <span className="chip">Green flag</span>
                </div>
                <div className="mt-6 overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Driver</th>
                        <th>Team</th>
                        <th>Gap</th>
                        <th>Tire</th>
                        <th>Stint</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveStandings.map((row) => (
                        <tr key={row.pos}>
                          <td>{row.pos}</td>
                          <td>{row.driver}</td>
                          <td>{row.team}</td>
                          <td>{row.gap}</td>
                          <td>{row.tire}</td>
                          <td>{row.stint}L</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel p-6 md:p-8">
                <h2 className="section-title">
                  <button
                    type="button"
                    className="section-title-button"
                    onClick={() => setTelemetryOpen(true)}
                  >
                    Telemetry snapshot
                  </button>
                </h2>
                <div className="mt-6 space-y-4">
                  {telemetry.map((item) => (
                    <div key={item.title} className="panel-soft p-4">
                      <p className="text-base font-semibold">{item.title}</p>
                      <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                      <p className="mt-2 text-sm muted">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="panel p-6 md:p-8 fade-up delay-2">
              <div className="flex items-center justify-between">
                <h2 className="section-title">
                  <button
                    type="button"
                    className="section-title-button"
                    onClick={() => setStrategyOpen(true)}
                  >
                    Strategy console
                  </button>
                </h2>
                <span className="muted text-sm">AWS-style insights</span>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {strategy.map((item) => (
                  <div key={item.title} className="panel-soft p-4">
                    <p className="text-base font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm muted">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="panel p-8 md:p-12 fade-up">
            <div className="flex flex-col gap-4 text-center">
              <span className="chip mx-auto">Live status</span>
              <h1 className="hero-title">No current live race</h1>
              <p className="hero-subtitle muted">Check again later.</p>
            </div>
          </section>
        )}
      </div>

      {isLiveRaceAvailable && (
        <>
      <Modal
        isOpen={positionsOpen}
        title="F1 live positions + analytics"
        onClose={() => setPositionsOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {positionAnalytics.map((item) => (
            <div key={item.label} className="panel-soft p-4">
              <p className="text-sm uppercase tracking-widest muted">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              <p className="mt-2 text-sm muted">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="panel-soft p-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Driver</th>
                <th>Team</th>
                <th>Gap</th>
                <th>Tire</th>
                <th>Stint</th>
                <th>Last lap</th>
                <th>S1</th>
                <th>S2</th>
                <th>S3</th>
                <th>Life</th>
              </tr>
            </thead>
            <tbody>
              {fullStandings.map((row) => (
                <tr key={row.pos}>
                  <td>{row.pos}</td>
                  <td>{row.driver}</td>
                  <td>{row.team}</td>
                  <td>{row.gap}</td>
                  <td>{row.tire}</td>
                  <td>{row.stint}L</td>
                  <td>{row.lastLap}</td>
                  <td>{row.s1}</td>
                  <td>{row.s2}</td>
                  <td>{row.s3}</td>
                  <td>{row.life}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        isOpen={telemetryOpen}
        title="Telemetry breakdown"
        onClose={() => setTelemetryOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {telemetryDetails.map((item) => (
            <div key={item.label} className="panel-soft p-4">
              <p className="text-sm uppercase tracking-widest muted">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              <p className="mt-2 text-sm muted">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="panel-soft p-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>S1</th>
                <th>S2</th>
                <th>S3</th>
              </tr>
            </thead>
            <tbody>
              {sectorTable.map((row) => (
                <tr key={row.driver}>
                  <td>{row.driver}</td>
                  <td>{row.s1}</td>
                  <td>{row.s2}</td>
                  <td>{row.s3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        isOpen={strategyOpen}
        title="Strategy console details"
        onClose={() => setStrategyOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {strategy.map((item) => (
            <div key={item.title} className="panel-soft p-4">
              <p className="text-base font-semibold">{item.title}</p>
              <p className="mt-2 text-sm muted">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="panel-soft p-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Current</th>
                <th>Plan</th>
                <th>Window</th>
              </tr>
            </thead>
            <tbody>
              {strategyTable.map((row) => (
                <tr key={row.driver}>
                  <td>{row.driver}</td>
                  <td>{row.current}</td>
                  <td>{row.plan}</td>
                  <td>{row.window}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
        </>
      )}
    </div>
  );
}
