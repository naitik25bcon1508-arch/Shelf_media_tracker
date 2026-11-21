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

## Decisions, constraints & rationale

- Stack: Vite + React + Tailwind + lucide-react; `@/` alias maps to `src/`
- No extra UI/icon packages beyond lucide-react unless explicitly requested
- Items have status (including "Done") and ratings; "Done" items count toward watch/read totals
- Stats: total movies watched, total books read (status Done), average rating across rated items, completions-per-month bar chart (last 6 months)
- Theme toggle appears on both sign-in and dashboard headers

## Open questions & assumptions

- "Average rating" computed across all rated items regardless of status
- Bar chart window fixed to last 6 months from current date
- Light mode not browser-verified; user to confirm visually in preview