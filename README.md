ddd
# Shelf - Movie & Book Tracker

A personal tracker for movies and books. Create an account, search a title, and the poster or cover fills in automatically.

**Live demo:** https://shelf-media-tracker-0dze.bolt.host

## Features
- Signup and login (client-side, stored in localStorage)
- Search movies (TMDB) and books (Open Library) with automatic posters and covers
- Status (Want to / In progress / Done), star ratings, and notes
- Filters by type and status, plus title search
- "Pick something for me" random suggestion from your Want-to list
- Stats section and dark/light theme toggle

## Tech
React, Vite, TypeScript, Tailwind CSS, browser localStorage. Built with Bolt.

## Notes and limitations
- Accounts and data are stored in the browser only, per device and per address. They don't sync across devices, and this is a demo, not secure authentication.
- The TMDB key is a free read-only key included for the demo.
- This product uses the TMDB API but is not endorsed or certified by TMDB.

## Screenshots
<img width="1302" height="796" alt="image" src="https://github.com/user-attachments/assets/88b4c3d6-8dfc-418f-a77d-11ca981215e1" />
<img width="1291" height="806" alt="image" src="https://github.com/user-attachments/assets/736b2fbf-598f-4137-805b-1df048244c63" />
<img width="1285" height="817" alt="image" src="https://github.com/user-attachments/assets/40e84e19-370a-4174-b377-5f6d60abed82" />



## Prompts used
1. Initial build: login/signup with localStorage and an empty dashboard.
2. Items with automatic posters from Open Library and TMDB.
3. Filters, search, and a "Pick something for me" popup.
4. Stats section and dark/light theme.
5. Fix: popup rendered at the bottom of the page, so it became a centered modal.
6. Fix: cards too large, so a compact grid.
7. Fix: black screen on the published site after a styling update, so I restored an earlier version.
8. Fix: items weren't saving and login failed on the first try. Two patch prompts didn't work, so I inspected the Local Storage table in DevTools, found it saved one step behind, and wrote a rewrite prompt using a single `shelf_db` helper.

## What I learned
Bolt can't run a browser, so it can verify that code compiles but not that a feature behaves correctly. Testing each step myself and inspecting the browser's storage was what found the real bug.
