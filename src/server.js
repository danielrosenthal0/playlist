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
  var scope = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private';

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

      const redirectUrl = 'http://127.0.0.1:3000/?' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
          user_id: profile.id,
          display_name: profile.display_name
        });

      req.session.spotify = {
        access_token: access_token,
        refresh_token: refresh_token,
        user: {
          id: profile.id,
          display_name: profile.display_name,
          email: profile.email
        },
        expires_at: Date.now() + (data.expires_in * 1000)}

      console.log('Redirecting to frontend with tokens');
      res.redirect(redirectUrl);

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});