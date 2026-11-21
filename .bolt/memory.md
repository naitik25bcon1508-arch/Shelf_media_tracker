# Project memory

## Product intent & audience

- Personal media tracker for movies and books, single-user, client-only
- All data persisted in localStorage; no backend
- Local auth with SHA-256 password hashing

## Brand personality & voice

- Minimal, dashboard-oriented, utility-first
- Production-quality but not flashy; calm and readable

## Visual design & UX direction

- Dark theme default; light/dark toggle in header persisted to localStorage
- Theme driven by CSS variables for consistent theming across all surfaces
- Accent color: green (used in bars, highlights)
- Components share theme-aware color classes; contrast verified for both themes
- UI surfaces: dashboard cards, add/edit form with suggestions dropdown, random-pick popup, stats cards, CSS bar chart, empty states, footer
- Bar chart: plain CSS bars, items completed per month over last 6 months
- Item cards: compact density — reduced padding, single-line title with ellipsis, smaller author/year font, scaled-down status badge and rating stars, smaller edit/delete icons that intensify on hover
- Poster aspect ratio fixed at 2:3; poster fills card width at all breakpoints
- Shelf grid responsive: 2 columns mobile, 3 tablet, 4 laptop, 5 large desktop; small gaps

## Decisions, constraints & rationale

- Stack: Vite + React + Tailwind + lucide-react; `@/` alias maps to `src/`
- No extra UI/icon packages beyond lucide-react unless explicitly requested
- Items have status (including "Done") and ratings; "Done" items count toward watch/read totals
- Stats: total movies watched, total books read (status Done), average rating across rated items, completions-per-month bar chart (last 6 months)
- Theme toggle appears on both sign-in and dashboard headers
- Card compaction restricted to size/layout only; no feature or color changes, no new files
- Storage: single localStorage key `"shelf_db"` with shape `{users:{}, items:{}}`; `loadDB()` reads/parses fresh each call (try/catch, default empty); `saveDB(db)` writes back
- No cached users/items as separate source of truth; every handler reads fresh at call time, mutates, saves, then sets React state from saved data
- Item IDs: `crypto.randomUUID()`
- Usernames normalized: lowercase + trim on both signup and login
- Signup writes `db.users[username]` and `db.items[username] = []`
- After login/refresh, items come from `loadDB().items[username]`
- No useEffect that writes to localStorage existed (none removed)
- Existing data under old scattered keys migrated automatically on first load
- Session key kept original to preserve existing logged-in sessions

## Open questions & assumptions

- "Average rating" computed across all rated items regardless of status
- Bar chart window fixed to last 6 months from current date
- Light mode not browser-verified; user to confirm visually in preview
- Migration from old keys runs once on first load; assumed safe to retire old keys afterward