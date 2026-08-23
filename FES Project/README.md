# FES Project — React Edition

A React-based rebuild of the original FES Project anime library.

## Features

- React SPA using CDN React + React Router DOM
- Live search and filtering
- Sort by newest, oldest, A→Z, Z→A
- Favorites stored in localStorage
- Pagination controls
- Anime detail pages with deep linking
- Dark/light theme persistence
- AniList GraphQL data fetch with fallback content

## Run

1. Open `index.html` in your browser.
2. The app will load data automatically and render the React SPA.

## Notes

- The app uses `HashRouter` so it works locally without a web server.
- If the AniList API is unavailable, fallback anime data is displayed.
