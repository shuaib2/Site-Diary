# Site Diary

A small full-stack app for a site team to keep a daily diary: log entries, filter them by contract, and see a summary of entries per contract.

**Stack:** Node.js + Express REST API, SQLite (via `better-sqlite3`) for storage, Vue 3 + Vite front-end. Plain CSS, no UI framework.

## How to run

Requires Node.js 18+.

```bash
# from the repo root, installs server + client deps
npm run install:all

# runs the API (port 3001) and the Vue dev server (port 5173) together
npm run dev
```

Then open http://localhost:5173. The Vite dev server proxies `/api/*` to the Express server, so there's no CORS setup needed in dev.

To run them separately instead:

```bash
cd server && npm install && npm run dev   # http://localhost:3001
cd client && npm install && npm run dev   # http://localhost:5173
```

The SQLite file is created automatically at `server/data/diary.sqlite` on first run.

## API

| Method | Route                          | Description                                   |
|--------|---------------------------------|------------------------------------------------|
| GET    | `/api/entries?contract=X`      | List entries, newest first, optional contract filter |
| GET    | `/api/entries/contracts`       | Distinct contract names, for the filter dropdown |
| POST   | `/api/entries`                 | Create an entry (validated server-side)        |
| GET    | `/api/summary`                 | Entries grouped by contract, with counts       |

## Decisions I made

- **SQLite over JSON file/in-memory:** gives real querying (`GROUP BY` for the summary, `ORDER BY` for sorting) without hand-rolling it, and the data survives restarts. `better-sqlite3` is synchronous, which keeps the route handlers simple for a project this size.
- **Validation on both ends:** the client checks the same rules (future date, required notes, 500-char limit) so the user gets instant feedback, but the server re-validates because the API shouldn't trust the client.
- **No ORM.** For four columns and three queries, raw SQL is easier to read and audit than adding an ORM layer.
- **Tabs instead of routes.** With only two views (diary, summary) and a 3-hour budget, a simple `v-if` toggle in `App.vue` was faster and simpler than pulling in Vue Router.
- **Contract as a free-text field, not a separate table.** Keeps the data model small; the `/entries/contracts` endpoint derives the dropdown list from existing entries instead of maintaining a separate contracts table.
- **Kept styling plain CSS** rather than a component library, to spend the time budget on the API/data flow instead of visual polish.

## Where AI helped

I used GitHub Copilot to scaffold the boilerplate quickly: the Express route skeletons, the `better-sqlite3` setup, and the repetitive parts of the Vue components (form fields, table markup). I reviewed and adjusted all of it by hand — in particular:

- Checked the date validation logic manually (it compares against end-of-today so "today" is always a valid entry, and rejects anything after that).
- Tightened the notes length check so it's enforced identically on the client (character counter) and server (400 response), rather than trusting one side.
- Simplified a couple of AI-suggested additions that weren't needed for the brief (e.g. removed an unused `watch` handler in `EntryList.vue`, and a no-op line in the form reset logic).
- Ran the API manually with test requests (health check, valid entry, future-dated entry, list, summary) to confirm the validation and grouping behave as expected before considering it done.

## What I'd do next with more time

- **Automated tests:** a few Vitest/Supertest tests for the validation rules and the summary grouping query — I only did manual smoke testing given the time-box.
- **Edit/delete entries.** The brief only asked for list + add, so that's all that's built.
- **Pagination** on the entry list once it grows large; right now it fetches everything.
- **Better contract filtering UX:** an autocomplete/combobox instead of a plain `<select>`, and remembering the last filter in the URL so it's shareable/refreshable.
- **Author as a stored "current user" concept** (still no auth, per the brief) so it doesn't have to be retyped each time.
- **Dockerfile / single deploy step** so the API can also serve the built client for a single-process deployment.
