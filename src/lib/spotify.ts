import { SpotifySession } from './session';

const ACCOUNTS_API = 'https://accounts.spotify.com';
const WEB_API = 'https://api.spotify.com/v1';

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function getSpotifyClientId() {
  return requiredEnv('SPOTIFY_CLIENT_ID');
}

function getSpotifyClientSecret() {
  return requiredEnv('SPOTIFY_CLIENT_SECRET');
}

export function getSpotifyRedirectUri() {
  return requiredEnv('SPOTIFY_REDIRECT_URI');
}

export function spotifyScopes() {
  return [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-top-read',
    'user-library-read',
    'user-library-modify'
  ].join(' ');
}

export async function exchangeCodeForToken(code: string) {
  const auth = Buffer.from(`${getSpotifyClientId()}:${getSpotifyClientSecret()}`).toString('base64');

  const response = await fetch(`${ACCOUNTS_API}/api/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code,
      redirect_uri: getSpotifyRedirectUri(),
      grant_type: 'authorization_code'
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  }

  return data as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const auth = Buffer.from(`${getSpotifyClientId()}:${getSpotifyClientSecret()}`).toString('base64');

  const response = await fetch(`${ACCOUNTS_API}/api/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  }

  return data as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };
}

export async function getSpotifyProfile(accessToken: string) {
  const response = await fetch(`${WEB_API}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Profile lookup failed: ${JSON.stringify(data)}`);
  }

  return data as {
    id: string;
    display_name: string;
    email?: string;
  };
}

export async function ensureFreshSession(session: SpotifySession) {
  const gracePeriodMs = 30 * 1000;
  if (Date.now() < session.expires_at - gracePeriodMs) {
    return { session, refreshed: false };
  }

  const refreshed = await refreshAccessToken(session.refresh_token);
  return {
    refreshed: true,
    session: {
      ...session,
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token ?? session.refresh_token,
      expires_at: Date.now() + refreshed.expires_in * 1000
    }
  };
}

export async function spotifyFetch(path: string, accessToken: string, init?: RequestInit) {
  return fetch(`${WEB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });
}
