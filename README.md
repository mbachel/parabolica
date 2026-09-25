# Parabolica

Parabolica is a real-time racing statistics platform providing driver tracking and performance analytics for NASCAR and Formula 1.

**Project site:** [parabolica.dev](https://parabolica.dev)

## 🏁 Overview

The platform aggregates data from various racing APIs, providing a centralized dashboard for enthusiasts and analysts. It features live polling for real-time race events, historical data storage, caching for performance, and a modern web interface.

## 🚀 Tech Stack

### Backend
- **Framework:** .NET 10.0 (ASP.NET Core)
- **Data Polling:** Background Services with `HttpClient`
- **Caching:** In-memory caching for live feeds
- **Database:** PostgreSQL 17

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

### Infrastructure
- **Containerization:** Docker & Docker Compose

## 📁 Project Structure

```text
.
├── backend/            # ASP.NET Core API
│   ├── Admin/          # Secured admin endpoints for data import
│   │   └── Import/     # Controllers and models for importing historical data
│   ├── Data/           # Entity Framework Core DbContext and Entities
│   │   └── Entities/   # Database models (e.g., NascarRaceListBasicYear, NascarWeekendFeed)
│   ├── Nascar/         # NASCAR specific controllers and services
│   │   ├── Models/     # API response models for live and historical feeds
│   │   └── Services/   # API clients, caching, and background polling services
│   ├── F1/             # F1 specific logic (planned)
│   └── Program.cs      # API configuration and service registration
├── frontend/           # Next.js web application
│   ├── app/            # App router pages and components
│   │   ├── components/ # Reusable UI components (Logo, Modal, ThemeToggle)
│   │   ├── f1/         # F1 specific pages and routes
│   │   └── nascar/     # NASCAR specific pages and routes
│   └── public/         # Static assets
└── docker-compose.yml  # Local development orchestration
```

## 🛠️ Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- (Optional) [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- (Optional) [Node.js](https://nodejs.org/)

### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/mbachel/parabolica.git
   cd parabolica
   ```
2. Copy `.env.example` to `.env` and configure your environment variables (e.g., `Admin__Key`, `POSTGRES_PASSWORD`).
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Access the applications:
   - **Frontend:** [http://localhost](http://localhost)
   - **Backend API:** [https://localhost/api/](https://localhost/api/)
   - **NASCAR Live Feed:** [https://localhost/api/nascar/live](https://localhost/api/nascar/live)

## ✨ Features

- **Live NASCAR Tracking:** Automated polling of official NASCAR feeds with configurable intervals.
- **Historical Data Import:** Secured admin endpoints to import and store historical race lists and weekend feeds in PostgreSQL.
- **Race Snapshots:** Quick view of leaders, status, and lap counts.
- **Multi-Series Support:** Dashboard prepared for both NASCAR and Formula 1 data. NASCAR pages read live data from the backend; F1 pages are scaffolded with placeholder data pending the F1 integration.

## 🛠 Development

### Backend
To run the backend locally without Docker:
```bash
cd backend
dotnet run
```

### Frontend
To run the frontend locally in development mode:
```bash
cd frontend
npm install
npm run dev
```

## 📄 License

The source code in this repository is released under the [MIT License](LICENSE).

The track map graphics in `frontend/public/tracks/` are **not** covered by the MIT License. They are adapted from Wikimedia Commons originals and remain under their original licenses, listed in the Credits section below. If you reuse this project, keep those attributions and honor the share-alike terms on the CC BY-SA files.

Note that share-alike applies to the track graphics themselves, not to this project's source code. Rendering these images in the application does not make the application a derivative work of them.

## 🙏 Credits

### Track Maps

Track map SVGs in `frontend/public/tracks/` are adapted from [Wikimedia Commons](https://commons.wikimedia.org/). Each file in this repository has been **modified** from its original, typically by removing elements that do not suit this site's presentation.

| File in this repo | Original | Author | License |
| --- | --- | --- | --- |
| `Atlanta_Motor_Speedway.svg` | [Atlanta Motor Speedway.svg](https://commons.wikimedia.org/wiki/File:Atlanta_Motor_Speedway.svg) | Pitlane02 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `Bristol_Motor_Speedway_2024.svg` | [Bristol Motor Speedway 2024.svg](https://commons.wikimedia.org/wiki/File:Bristol_Motor_Speedway_2024.svg) | Stl66dmk | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `Charlotte_Motor_Speedway_2024.svg` | [Charlotte Motor Speedway 2024.svg](https://commons.wikimedia.org/wiki/File:Charlotte_Motor_Speedway_2024.svg) | Stl66dmk | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `Daytona_International_Speedway edited.svg` | [Daytona International Speedway.svg](https://commons.wikimedia.org/wiki/File:Daytona_International_Speedway.svg) | Will Pittenger | Public domain |

**Licensing of the modified files.** Each modified CC BY-SA track map in this repository is released under the same license as its original: the Atlanta adaptation under CC BY-SA 3.0, the Bristol and Charlotte adaptations under CC BY-SA 4.0. The Daytona original is public domain, so its adaptation carries no license obligation; the credit above is retained as a courtesy.

When adding a new track map, record the original file, its author, and its license in the table above, and note that the version in this repository has been modified.

### Data Sources

Live and historical NASCAR timing data is retrieved from official NASCAR feeds. This project is an independent, non-commercial work and is not affiliated with, endorsed by, or sponsored by NASCAR, Formula 1, or any racing series, team, or venue.
