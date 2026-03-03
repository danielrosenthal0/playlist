this app helps me categorize and place specific songs into the correct playlist.

this app now uses Next API routes (no separate express server).

to run locally:
`npm run dev`

required environment variables:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI` (for local dev, use `http://127.0.0.1:3000/api/auth/callback`)
- `SESSION_SECRET`

optional classifier tuning:
- `CLASSIFY_MAX_PLAYLISTS` (default `30`, max `50`)
- `CLASSIFY_TRACKS_PER_PLAYLIST` (default `100`, max `200`)
