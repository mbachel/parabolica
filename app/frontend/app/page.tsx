import Link from "next/link";

export default function Home() {
  const kpis = [
    { label: "Active races", value: "2" },
    { label: "Live drivers tracked", value: "52" },
    { label: "Strategy alerts", value: "8" },
    { label: "Telemetry streams", value: "14" },
  ];

  const liveSnapshot = [
    {
      series: "Formula 1",
      event: "Bahrain GP",
      leader: "Verstappen",
      status: "Green flag",
      laps: "22 / 57",
    },
    {
      series: "NASCAR",
      event: "Daytona 500",
      leader: "Larson",
      status: "Stage 1",
      laps: "34 / 200",
    },
  ];

  const signals = [
    {
      title: "Undercut risk rising",
      detail: "P2 pit window opens in 3 laps; tire delta +0.7s.",
    },
    {
      title: "Fuel burn trending high",
      detail: "Top 5 NASCAR group at 104% burn rate; draft needed.",
    },
    {
      title: "DRS effectiveness",
      detail: "Main straight passes up 18% vs last stint.",
    },
  ];

  const positions = [
    {
      pos: "1",
      driver: "Verstappen",
      delta: "+0.0",
      pace: "1:35.4",
      note: "Soft 8L",
    },
    {
      pos: "2",
      driver: "Leclerc",
      delta: "+1.9",
      pace: "1:35.8",
      note: "Soft 9L",
    },
    {
      pos: "3",
      driver: "Norris",
      delta: "+3.2",
      pace: "1:36.1",
      note: "Medium 6L",
    },
    {
      pos: "4",
      driver: "Hamilton",
      delta: "+4.5",
      pace: "1:36.3",
      note: "Medium 7L",
    },
  ];

  const nascarTopFour = [
    {
      pos: "1",
      driver: "Larson",
      delta: "+0.0",
      pace: "46.82",
      note: "Fuel 89%",
    },
    {
      pos: "2",
      driver: "Hamlin",
      delta: "+0.6",
      pace: "46.90",
      note: "Fuel 87%",
    },
    {
      pos: "3",
      driver: "Elliott",
      delta: "+1.2",
      pace: "46.98",
      note: "Fuel 85%",
    },
    {
      pos: "4",
      driver: "Wallace",
      delta: "+1.9",
      pace: "47.05",
      note: "Fuel 83%",
    },
  ];

  const products = [
    {
      title: "Strategy Console",
      detail: "Live pit windows, undercut alerts, and alternative outcomes.",
    },
    {
      title: "Race Health",
      detail: "Tire life, thermal stress, and braking efficiency trends.",
    },
    {
      title: "Overtake Radar",
      detail: "Passing ranges, speed delta, and clean-air advantage.",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <section className="panel p-8 md:p-12 fade-up">
        <div className="flex flex-col gap-6">
          <div className="mx-auto max-w-4xl space-y-4 text-center">
            <span className="chip">Unified race intelligence</span>
            <h1 className="hero-title">
              Live data and analytics Formula 1 & NASCAR.
            </h1>
            <p className="hero-subtitle muted">
              Monitor positions, tire life, fuel burn, and strategy signals in a
              single view. This dashboard blends broadcast-ready insights with
              team-level telemetry context.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link className="nav-link panel-soft" href="/f1">
                Explore F1 live
              </Link>
              <Link className="nav-link panel-soft" href="/nascar">
                Explore NASCAR live
              </Link>
            </div>
          </div>
          <div className="kpi-row">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="kpi-item">
                <p className="kpi-label muted">
                  {kpi.label}
                </p>
                <p className="kpi-value">{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 fade-up delay-1">
        <div className="panel p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Live snapshot</h2>
            <span className="chip">In progress</span>
          </div>
          <div className="mt-6 space-y-4">
            {liveSnapshot.map((race) => (
              <div
                key={race.series}
                className="panel-soft flex flex-col gap-3 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-widest muted">
                      {race.series}
                    </p>
                    <p className="text-lg font-semibold">{race.event}</p>
                  </div>
                  <span className="chip">{race.status}</span>
                </div>
                <div className="grid gap-2 text-sm sm:grid-cols-3">
                  <span className="muted">Leader</span>
                  <span>{race.leader}</span>
                  <span className="muted">{race.laps}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6 md:p-8">
          <h2 className="section-title">Strategy signals</h2>
          <div className="mt-6 space-y-4">
            {signals.map((signal) => (
              <div key={signal.title} className="panel-soft p-4">
                <p className="text-base font-semibold">{signal.title}</p>
                <p className="mt-2 text-sm muted">{signal.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 fade-up delay-2">
        <div className="panel p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="section-title">F1 top 4</h2>
            <span className="muted text-sm">Live telemetry feed</span>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Driver</th>
                  <th>Gap</th>
                  <th>Pace</th>
                  <th>Stint</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((row) => (
                  <tr key={row.pos}>
                    <td>{row.pos}</td>
                    <td>{row.driver}</td>
                    <td>{row.delta}</td>
                    <td>{row.pace}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="section-title">NASCAR top 4</h2>
            <span className="muted text-sm">Live race feed</span>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Driver</th>
                  <th>Gap</th>
                  <th>Lap</th>
                  <th>Fuel</th>
                </tr>
              </thead>
              <tbody>
                {nascarTopFour.map((row) => (
                  <tr key={row.pos}>
                    <td>{row.pos}</td>
                    <td>{row.driver}</td>
                    <td>{row.delta}</td>
                    <td>{row.pace}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="panel p-6 md:p-8 fade-up delay-3">
        <h2 className="section-title">Data products</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.title} className="panel-soft p-4">
              <p className="text-base font-semibold">{product.title}</p>
              <p className="mt-2 text-sm muted">{product.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
