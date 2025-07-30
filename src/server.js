import express from 'express';
import cors from 'cors';
import querystring from 'querystring';
import dotenv from 'dotenv';
import session from 'express-session';
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
      state: state
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

// Replace your classify-song endpoint with this working version
app.post('/api/classify-song', async (req, res) => {
  if (!req.session.spotify) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { trackId } = req.body;

  if (!trackId) {
    return res.status(400).json({ error: 'Track ID is required' });
  }

  try {
    console.log('Getting track info for:', trackId);
    
    // Get detailed track information (this still works)
    const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': 'Bearer ' + req.session.spotify.access_token
      }
    });

    if (!trackResponse.ok) {
      const errorText = await trackResponse.text();
      console.error('Track info error:', trackResponse.status, errorText);
      throw new Error(`Track info error: ${trackResponse.status}`);
    }

    const trackData = await trackResponse.json();
    console.log('Track retrieved:', trackData.name, 'by', trackData.artists.map(a => a.name).join(', '));

    // Get artist information for additional context
    const artistIds = trackData.artists.map(artist => artist.id);
    const artistsResponse = await fetch(`https://api.spotify.com/v1/artists?ids=${artistIds.join(',')}`, {
      headers: {
        'Authorization': 'Bearer ' + req.session.spotify.access_token
      }
    });

    let artistsData = [];
    if (artistsResponse.ok) {
      const artistsResult = await artistsResponse.json();
      artistsData = artistsResult.artists;
      console.log('Artists data retrieved for:', artistsData.map(a => a.name).join(', '));
    }

    // Get album information
    const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${trackData.album.id}`, {
      headers: {
        'Authorization': 'Bearer ' + req.session.spotify.access_token
      }
    });

    let albumData = null;
    if (albumResponse.ok) {
      albumData = await albumResponse.json();
      console.log('Album data retrieved:', albumData.name);
    }

    // Create a comprehensive classification using available data
    const classification = classifyFromAvailableData(trackData, artistsData, albumData);

    res.json({
      success: true,
      trackId,
      trackInfo: {
        name: trackData.name,
        artists: trackData.artists.map(artist => ({
          name: artist.name,
          id: artist.id
        })),
        album: {
          name: trackData.album.name,
          id: trackData.album.id,
          release_date: trackData.album.release_date,
          total_tracks: trackData.album.total_tracks
        },
        duration_ms: trackData.duration_ms,
        popularity: trackData.popularity,
        explicit: trackData.explicit,
        preview_url: trackData.preview_url,
        external_urls: trackData.external_urls
      },
      artistInfo: artistsData.map(artist => ({
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity,
        followers: artist.followers.total
      })),
      albumInfo: albumData ? {
        name: albumData.name,
        genres: albumData.genres,
        release_date: albumData.release_date,
        total_tracks: albumData.total_tracks,
        album_type: albumData.album_type
      } : null,
      classification,
      note: 'Classification based on available metadata (audio-features deprecated Nov 2024)'
    });

  } catch (error) {
    console.error('Error classifying song:', error);
    res.status(500).json({ 
      error: 'Failed to classify song', 
      details: error.message 
    });
  }
});

// Enhanced classification using all available data
function classifyFromAvailableData(trackData, artistsData, albumData) {
  const duration = trackData.duration_ms;
  const popularity = trackData.popularity;
  const explicit = trackData.explicit;
  const year = trackData.album.release_date ? parseInt(trackData.album.release_date.split('-')[0]) : null;
  
  // Extract genres from artists
  const allGenres = artistsData.flatMap(artist => artist.genres || []);
  const uniqueGenres = [...new Set(allGenres)];
  
  // Calculate average artist popularity
  const artistPops = artistsData.filter(a => a.popularity).map(a => a.popularity);
  const avgArtistPopularity = artistPops.length > 0 ? 
    Math.round(artistPops.reduce((sum, pop) => sum + pop, 0) / artistPops.length) : null;

  // Determine if it's a single or album track
  const isFromAlbum = albumData && albumData.album_type === 'album' && albumData.total_tracks > 3;
  
  return {
    // Basic classifications
    duration_category: getDurationCategory(duration),
    popularity_level: getPopularityLevel(popularity),
    era: getEra(year),
    content_rating: explicit ? 'Explicit' : 'Clean',
    
    // Genre analysis
    genres: uniqueGenres.slice(0, 5), // Top 5 genres
    primary_genre: getPrimaryGenre(uniqueGenres),
    genre_diversity: getGenreDiversity(uniqueGenres),
    
    // Artist analysis
    artist_popularity: avgArtistPopularity ? getPopularityLevel(avgArtistPopularity) : 'Unknown',
    collaboration: trackData.artists.length > 1 ? 'Collaboration' : 'Solo',
    
    // Release analysis
    release_type: isFromAlbum ? 'Album Track' : 'Single/EP',
    release_context: getReleaseContext(albumData),
    
    // Calculated metrics
    track_length: formatDuration(duration),
    popularity_vs_artist: comparePopularity(popularity, avgArtistPopularity),
    
    // Raw data for reference
    raw_data: {
      duration_ms: duration,
      popularity: popularity,
      release_year: year,
      artist_count: trackData.artists.length,
      total_artist_followers: artistsData.reduce((sum, a) => sum + (a.followers?.total || 0), 0)
    },
    
    // Overall assessment
    overall_assessment: getOverallAssessment(trackData, artistsData, uniqueGenres),
    
    note: 'Enhanced classification using track, artist, and album metadata'
  };
}

function getDurationCategory(durationMs) {
  const minutes = durationMs / 60000;
  if (minutes < 2) return 'Very Short';
  if (minutes < 3) return 'Short';
  if (minutes < 4) return 'Average';
  if (minutes < 6) return 'Long';
  return 'Very Long';
}

function getPopularityLevel(popularity) {
  if (popularity >= 80) return 'Very Popular';
  if (popularity >= 60) return 'Popular';
  if (popularity >= 40) return 'Moderately Popular';
  if (popularity >= 20) return 'Less Popular';
  return 'Niche';
}

function getEra(year) {
  if (!year) return 'Unknown';
  if (year >= 2020) return '2020s';
  if (year >= 2010) return '2010s';
  if (year >= 2000) return '2000s';
  if (year >= 1990) return '1990s';
  if (year >= 1980) return '1980s';
  if (year >= 1970) return '1970s';
  return 'Classic';
}

function getPrimaryGenre(genres) {
  if (genres.length === 0) return 'Unknown';
  
  // Simple heuristics for primary genre
  const rockGenres = genres.filter(g => g.includes('rock') || g.includes('metal'));
  const popGenres = genres.filter(g => g.includes('pop'));
  const rapGenres = genres.filter(g => g.includes('rap') || g.includes('hip hop'));
  const electronicGenres = genres.filter(g => g.includes('electronic') || g.includes('edm') || g.includes('house'));
  
  if (rockGenres.length > 0) return 'Rock/Metal';
  if (popGenres.length > 0) return 'Pop';
  if (rapGenres.length > 0) return 'Hip-Hop/Rap';
  if (electronicGenres.length > 0) return 'Electronic';
  
  return genres[0]; // Return first genre if no matches
}

function getGenreDiversity(genres) {
  if (genres.length <= 1) return 'Single Genre';
  if (genres.length <= 2) return 'Limited Diversity';
  if (genres.length <= 4) return 'Moderate Diversity';
  return 'High Diversity';
}

function getReleaseContext(albumData) {
  if (!albumData) return 'Unknown';
  
  if (albumData.album_type === 'single') return 'Released as Single';
  if (albumData.album_type === 'album' && albumData.total_tracks > 15) return 'Full Album (Long)';
  if (albumData.album_type === 'album') return 'Full Album';
  if (albumData.album_type === 'compilation') return 'Compilation Album';
  return 'EP or Short Release';
}

function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function comparePopularity(trackPop, artistPop) {
  if (!artistPop) return 'Cannot Compare';
  
  const diff = trackPop - artistPop;
  if (diff > 10) return 'Above Artist Average';
  if (diff < -10) return 'Below Artist Average';
  return 'Typical for Artist';
}

function getOverallAssessment(trackData, artistsData, genres) {
  const pop = trackData.popularity;
  const isRecent = trackData.album.release_date && 
    new Date(trackData.album.release_date) > new Date('2020-01-01');
  
  if (pop >= 70 && isRecent) return 'Current Hit';
  if (pop >= 70) return 'Popular Classic';
  if (pop >= 40 && genres.some(g => g.includes('indie'))) return 'Indie Favorite';
  if (pop < 20 && artistsData.some(a => a.followers?.total > 1000000)) return 'Deep Cut from Popular Artist';
  if (pop < 20) return 'Underground/Niche Track';
  return 'Mainstream Track';
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});