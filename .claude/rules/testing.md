# Testing

- All testing runs through Docker Compose, so the frontend, backend and database run together. Don't call something done until it works there.
- Never wipe the local database (`docker compose down -v`, `docker volume rm`). Use `docker compose down` without `-v`.
- Saved feed scenarios live in `test-data/nascar/live/<scenario>/01.json, 02.json...`, played in order. The last file repeats.
- Once they exist: the backend mock feed forces live states, and the frontend `?view=` override forces views. Both stay off in production.
- Data and logic changes are test-first.