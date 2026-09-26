import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import Logo from "./components/Logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parabolica",
  description: "Live F1 and NASCAR data and analytics dashboards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Outfit:wght@400;500;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="app-shell">
          <header className="app-header">
            <Link className="app-brand" href="/">
              <Logo size={48} />
              <div className="brand-copy">
                <span className="brand-title">Parabolica</span>
                <span className="brand-sub muted">
                  F1 and NASCAR analytics hub
                </span>
              </div>
            </Link>
            <nav className="app-nav">
              <Link className="nav-link" href="/">
                Dashboard
              </Link>
              <Link className="nav-link" href="/f1">
                F1
              </Link>
              <Link className="nav-link" href="/nascar">
                NASCAR
              </Link>
            </nav>
            <div className="header-actions">
              <span className="status-pill">Live</span>
              <ThemeToggle />
            </div>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            <span className="muted">
              Built for race strategy teams, broadcasters, and fans.
            </span>
            <span className="muted">
              Data placeholders until live integrations go online.
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
