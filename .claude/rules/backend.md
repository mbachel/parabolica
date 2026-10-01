---
paths:
  - "app/backend/**"
---

# Backend (C#, .NET)

- Namespaces stay PascalCase and follow the folder: `Parabolica.Api.Nascar.Services` lives in `nascar/services/`. New folders are lowercase, except `Migrations/` and `Properties/`, which stay as they are for tooling.
- Keep controllers thin; put logic in services. Admin controllers inherit `AdminControllerBase`, which applies `AdminKeyAuthFilter`.
- Call outside APIs through typed clients registered with `AddHttpClient`, with an explicit timeout and a User-Agent.
- Async all the way down, and pass the `CancellationToken` through.
- Background services must catch exceptions inside their loop. An unhandled exception stops the whole app.
- Store NASCAR responses as raw JSON. Pull fields out when reading.
- Migrations: `dotnet ef migrations add <Name>` from `app/backend`, default output folder. Never edit or delete a migration that's already on `dev`.
- Public types get `///` XML doc comments, matching the existing code.
- Before using a .NET or EF Core API, read the installed version from `app/backend/Parabolica.Api.csproj`, then look up docs for that version with Context7.