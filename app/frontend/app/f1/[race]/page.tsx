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
  "bahrain-gp-2026": {
    name: "Bahrain GP",
    location: "Sakhir",
    date: "Mar 02, 2026",
    headline: "Heat management and tire degradation shaping strategy.",
  },
  "saudi-arabian-gp-2026": {
    name: "Saudi Arabian GP",
    location: "Jeddah",
    date: "Mar 09, 2026",
    headline: "High-speed corners stressing aero balance and braking zones.",
  },
  "australian-gp-2026": {
    name: "Australian GP",
    location: "Melbourne",
    date: "Mar 23, 2026",
    headline: "Soft tire choices and safety-car probability in focus.",
  },
  "japanese-gp-2026": {
    name: "Japanese GP",
    location: "Suzuka",
    date: "Apr 06, 2026",
    headline: "Sector 1 flows pushing downforce tuning decisions.",
  },
  "chinese-gp-2026": {
    name: "Chinese GP",
    location: "Shanghai",
    date: "Apr 20, 2026",
    headline: "Long straight favors DRS-assisted overtakes.",
  },
};

export default function F1RacePage({
  params,
}: {
  params: { race: string };
}) {
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
            <span className="chip">F1</span>
          </div>
          <label className="search-label" htmlFor="f1-archive-search">
            Search races
          </label>
          <input
            id="f1-archive-search"
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
                href={`/f1/${item.slug}`}
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
          <span className="chip">F1 archive</span>
          <h1 className="hero-title">{race.name}</h1>
          <p className="hero-subtitle muted">{race.headline}</p>
          <div className="flex flex-wrap gap-3">
            <span className="panel-soft px-4 py-2 text-sm">
              {race.location}
            </span>
            <span className="panel-soft px-4 py-2 text-sm">{race.date}</span>
            <Link className="nav-link panel-soft" href="/f1">
              Back to F1 live
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="panel p-6 md:p-8">
            <h2 className="section-title">Race summary</h2>
            <div className="mt-6 space-y-4">
              <div className="panel-soft p-4">
                <p className="text-base font-semibold">Key swings</p>
                <p className="mt-2 text-sm muted">
                  Placeholder summary of strategy shifts, safety cars, and
                  overtaking moments.
                </p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-base font-semibold">Tire story</p>
                <p className="mt-2 text-sm muted">
                  Placeholder for stint lengths, degradation, and compound mix.
                </p>
              </div>
            </div>
          </div>

          <div className="panel p-6 md:p-8">
            <h2 className="section-title">Performance data</h2>
            <div className="mt-6 space-y-4">
              <div className="panel-soft p-4">
                <p className="text-base font-semibold">Qualifying delta</p>
                <p className="mt-2 text-sm muted">
                  Placeholder for best lap, sector gains, and grid advantage.
                </p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-base font-semibold">Race pace</p>
                <p className="mt-2 text-sm muted">
                  Placeholder for average pace, clean air speed, and DRS effect.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
