"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const raceDetails: Record<
  string,
  {
    name: string;
    location: string;
    date: string;
    headline: string;
  }
> = {
  "daytona-500-2026": {
    name: "Daytona 500",
    location: "Daytona",
    date: "Feb 16, 2026",
    headline: "Drafting packs and fuel burn define the opening stages.",
  },
  "atlanta-400-2026": {
    name: "Atlanta 400",
    location: "Atlanta",
    date: "Feb 23, 2026",
    headline: "High line momentum and pit sequencing highlight performance.",
  },
  "las-vegas-400-2026": {
    name: "Las Vegas 400",
    location: "Las Vegas",
    date: "Mar 02, 2026",
    headline: "Long-run speed favors teams with smoother tire falloff.",
  },
  "phoenix-500-2026": {
    name: "Phoenix 500",
    location: "Phoenix",
    date: "Mar 09, 2026",
    headline: "Restarts and clean air strength drive overtakes.",
  },
  "auto-club-400-2026": {
    name: "Auto Club 400",
    location: "Fontana",
    date: "Mar 23, 2026",
    headline: "Fuel mapping and draft partners determine late pace.",
  },
};

export default function NascarRacePage({
  params,
}: {
  params: { race: string };
}) {
  const [search, setSearch] = useState("");
  const recentRaces = [
    {
      name: "Daytona 500",
      location: "Daytona",
      date: "Feb 16, 2026",
      slug: "daytona-500-2026",
    },
    {
      name: "Atlanta 400",
      location: "Atlanta",
      date: "Feb 23, 2026",
      slug: "atlanta-400-2026",
    },
    {
      name: "Las Vegas 400",
      location: "Las Vegas",
      date: "Mar 02, 2026",
      slug: "las-vegas-400-2026",
    },
    {
      name: "Phoenix 500",
      location: "Phoenix",
      date: "Mar 09, 2026",
      slug: "phoenix-500-2026",
    },
    {
      name: "Auto Club 400",
      location: "Fontana",
      date: "Mar 23, 2026",
      slug: "auto-club-400-2026",
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

  const race = raceDetails[params.race] ?? {
    name: "Race analytics",
    location: "TBD",
    date: "TBD",
    headline: "This race will appear once data is connected.",
  };

  return (
    <div className="series-layout">
      <aside className="series-sidebar">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Recent races</h2>
            <span className="chip">NASCAR</span>
          </div>
          <label className="search-label" htmlFor="nascar-archive-search">
            Search races
          </label>
          <input
            id="nascar-archive-search"
            className="search-input"
            type="search"
            placeholder="Search by race, city, date"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="race-list">
            {filteredRaces.map((item) => (
              <Link
                key={item.slug}
                className="race-link"
                href={`/nascar/${item.slug}`}
              >
                <span className="race-name">{item.name}</span>
                <span className="race-meta">{item.location}</span>
                <span className="race-meta">{item.date}</span>
              </Link>
            ))}
            {filteredRaces.length === 0 && (
              <span className="muted">No races match your search.</span>
            )}
          </div>
        </div>
      </aside>

      <div className="series-main">
        <section className="panel p-8 md:p-12 fade-up">
          <span className="chip">NASCAR archive</span>
          <h1 className="hero-title">{race.name}</h1>
          <p className="hero-subtitle muted">{race.headline}</p>
          <div className="flex flex-wrap gap-3">
            <span className="panel-soft px-4 py-2 text-sm">
              {race.location}
            </span>
            <span className="panel-soft px-4 py-2 text-sm">{race.date}</span>
            <Link className="nav-link panel-soft" href="/nascar">
              Back to NASCAR live
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="panel p-6 md:p-8">
            <h2 className="section-title">Race summary</h2>
            <div className="mt-6 space-y-4">
              <div className="panel-soft p-4">
                <p className="text-base font-semibold">Drafting trends</p>
                <p className="mt-2 text-sm muted">
                  Placeholder summary for drafting, pack splits, and clean air.
                </p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-base font-semibold">Fuel story</p>
                <p className="mt-2 text-sm muted">
                  Placeholder for fuel windows, pit cycles, and burn efficiency.
                </p>
              </div>
            </div>
          </div>

          <div className="panel p-6 md:p-8">
            <h2 className="section-title">Performance data</h2>
            <div className="mt-6 space-y-4">
              <div className="panel-soft p-4">
                <p className="text-base font-semibold">Passer rating</p>
                <p className="mt-2 text-sm muted">
                  Placeholder for overtakes, time in range, and completion speed.
                </p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-base font-semibold">Loop data</p>
                <p className="mt-2 text-sm muted">
                  Placeholder for driver rating and speed consistency.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
