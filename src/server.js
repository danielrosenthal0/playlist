import express from 'express';
import cors from 'cors';
import querystring from 'querystring';
import dotenv from 'dotenv';
import session from 'express-session';
import { genreMap } from './genreMap.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
//session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
//middlware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
function getBestGenreMatch(artistNames, genres) {
  let bestMatch = { main: null, sub: null, score: 0 };
  Object.entries(genreMap).forEach(([mainGenre, subgenres]) => {
    Object.entries(subgenres).forEach(([sub, data]) => {
      let score = 0;
      if (data.artists.some(a => artistNames.includes(a))) score += 2;
      if (genres.some(g => data.keywords.includes(g))) score += 1;
      if (score > bestMatch.score) {
        bestMatch = { main: mainGenre, sub, score };
      }
    });
  });
  return bestMatch;
}
app.get('/login', (req, res) => { 
  var state = generateRandomString(16);
  var scope = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-playback-state',
  'user-read-recently-played',
  'user-top-read',
  'user-library-read',
  'user-library-modify',
  'streaming'
].join(' ');


  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
      show_dialog: true
    })
  )
});

app.get('/callback', async (req, res) => {
  console.log('Callback received with query params:', req.query);

  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    console.log('State is null - redirecting with error');
    res.redirect('http://127.0.0.1:3000/?' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
    return;
  }

  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify({
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  };

  try {
    console.log('Exchanging code for access token...');
    
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const data = await response.json();

    console.log('Token exchange response status:', response.status);
    console.log('Token exchange response data:', data);

    if (response.ok) {
      const access_token = data.access_token;
      const refresh_token = data.refresh_token;

      console.log('Getting user profile...');
      const profileResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': 'Bearer ' + access_token }
      });
      const profile = await profileResponse.json();

      console.log('User profile:', profile);

      req.session.spotify = {
        access_token: access_token,
        refresh_token: refresh_token,
        user: {
          id: profile.id,
          display_name: profile.display_name,
          email: profile.email
        },
        expires_at: Date.now() + (data.expires_in * 1000)}

      console.log('Redirecting to frontend');
      res.redirect('http://127.0.0.1:3000');

    } else {
      console.error('Token exchange failed:', data);
      res.redirect('http://127.0.0.1:3000/?' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  } catch (error) {
    console.error('Error during token exchange:', error);
    res.redirect('http://127.0.0.1:3000/?' +
      querystring.stringify({
        error: 'server_error'
      }));
  }
});

app.get('/api/user', (req, res) => {
  if (!req.session.spotify) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    user: req.session.spotify.user,
    authenticated: true
  });
});

app.get('/api/spotify/me', async (req, res) => {
  if (!req.session.spotify) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + req.session.spotify.access_token }
    });
    
    if (response.status === 401) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});


app.post('/api/classify-song', async (req, res) => {
  if (!req.session.spotify) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { trackId } = req.body;
  if (!trackId) {
    return res.status(400).json({ error: 'Track ID is required' });
  }

  try {
    // Get track info
    const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { 'Authorization': 'Bearer ' + req.session.spotify.access_token }
    });
    if (!trackResponse.ok) throw new Error('Track info error');
    const trackData = await trackResponse.json();

    // Get genres for the new song's artists
    let newSongGenres = [];
    for (const artist of trackData.artists) {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
        headers: { 'Authorization': 'Bearer ' + req.session.spotify.access_token }
      });
      if (artistRes.ok) {
        const artistData = await artistRes.json();
        newSongGenres.push(...artistData.genres);
      }
    }
    newSongGenres = [...new Set(newSongGenres)];
    const newSongArtistNames = trackData.artists.map(a => a.name);
const bestGenreMatch = getBestGenreMatch(newSongArtistNames, newSongGenres);

    // Get all user playlists
    const playlistsResponse = await fetch(`https://api.spotify.com/v1/me/playlists?limit=5`, {
      headers: { 'Authorization': 'Bearer ' + req.session.spotify.access_token }
    });
    if (!playlistsResponse.ok) throw new Error('Playlists info error');
    const playlistsData = await playlistsResponse.json();

    // Score each playlist
    const playlistScores = [];

    for (const playlist of playlistsData.items) {
      const playlistTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100`, {
        headers: { 'Authorization': 'Bearer ' + req.session.spotify.access_token }
      });
      if (!playlistTracksResponse.ok) continue;
      const playlistTracksData = await playlistTracksResponse.json();

      let score = 0;
      let popularitySum = 0;
      let popularityCount = 0;
      let scoreDescription = '';
      let matchedArtistsArr = [];
let matchedGenresArr = [];
let matchedSubgenresArr = [];
      for (const item of playlistTracksData.items) {
        if (!item.track) continue;

        // Get artist genres for each track
        let trackArtistGenres = [];
        for (const artist of item.track.artists) {
          const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
            headers: { 'Authorization': 'Bearer ' + req.session.spotify.access_token }
          });
          if (artistRes.ok) {
            const artistData = await artistRes.json();
            trackArtistGenres.push(...artistData.genres);
          }
        }
        trackArtistGenres = [...new Set(trackArtistGenres)];
        const trackArtistNames = item.track.artists.map(a => a.name);

        // Score: +2 for artist match, +1 for genre match
  const matchedArtist = trackArtistNames.find(name => newSongArtistNames.includes(name));
  if (matchedArtist) {
    score += 2;
    matchedArtistsArr.push(matchedArtist);
  }
  const matchedGenre = trackArtistGenres.find(g => newSongGenres.includes(g));
  if (matchedGenre) {
    score += 2;
    matchedGenresArr.push(matchedGenre);
  }
  const trackBestGenre = getBestGenreMatch(trackArtistNames, trackArtistGenres);
  if (
    trackBestGenre.main === bestGenreMatch.main &&
    trackBestGenre.sub === bestGenreMatch.sub
  ) {
    score += 3;
    matchedSubgenresArr.push(`${trackBestGenre.main} - ${trackBestGenre.sub}`);
  }
        
        popularitySum += item.track.popularity;
        popularityCount++;
      }
      const uniqueArtists = [...new Set(matchedArtistsArr)];
const uniqueGenres = [...new Set(matchedGenresArr)];
const uniqueSubgenres = [...new Set(matchedSubgenresArr)];

scoreDescription =
  (uniqueArtists.length ? `+2 for artist match: ${uniqueArtists.join(', ')}\n` : '') +
  (uniqueGenres.length ? `+2 for genre match: ${uniqueGenres.join(', ')}\n` : '') +
  (uniqueSubgenres.length ? `+3 for subgenre match: ${uniqueSubgenres.join(', ')}\n` : '');
      const avgPopularity = popularityCount > 0 ? popularitySum / popularityCount : 50; // fallback to 50 if no data
      const newSongPopularity = typeof trackData.popularity === 'number' ? trackData.popularity : 50;
      const popularityDiff = Math.abs(avgPopularity - newSongPopularity);
      const popularityScore = Math.max(0, 10 - popularityDiff / 5);
      score += popularityScore;

      playlistScores.push({
        playlistId: playlist.id,
        playlistName: playlist.name,
        score: Math.round(score),
        avgPopularity: Math.round(avgPopularity),
        popularityScore: Math.round(popularityScore),
        image: playlist.images.length > 0 ? playlist.images[0].url : null,
        scoreDescription: scoreDescription || 'No matches found'
      });

    }
    const topPlaylists = playlistScores.sort((a, b) => b.score - a.score).slice(0, 3);

    res.json({
      track: trackData,
      topPlaylists
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to classify song' });
  }
});

app.post('/api/add-to-playlist', async (req, res) => {
  if (!req.session.spotify) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { trackUri, playlistId } = req.body;
  if (!trackUri || !playlistId) {
    return res.status(400).json({ error: 'Track URI and Playlist ID are required' });
  }

  try {
    const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + req.session.spotify.access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: [trackUri] })
    });

    if (!addResponse.ok) throw new Error('Add to playlist error');

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add track to playlist' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});