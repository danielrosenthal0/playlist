import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export type SpotifySession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: {
    id: string;
    display_name: string;
    email?: string;
  };
};

const SESSION_COOKIE_NAME = 'playlist_session';
const OAUTH_STATE_COOKIE_NAME = 'spotify_oauth_state';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET is required');
  }
  return crypto.createHash('sha256').update(secret).digest();
}

function encode(data: Buffer) {
  return data.toString('base64url');
}

function decode(data: string) {
  return Buffer.from(data, 'base64url');
}

function encrypt(payload: SpotifySession) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getSessionSecret(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return `${encode(iv)}.${encode(tag)}.${encode(encrypted)}`;
}

function decrypt(value: string): SpotifySession | null {
  const parts = value.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const iv = decode(parts[0]);
    const tag = decode(parts[1]);
    const encrypted = decode(parts[2]);
    const decipher = crypto.createDecipheriv('aes-256-gcm', getSessionSecret(), iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
  } catch {
    return null;
  }
}

export function getSession(request: NextRequest): SpotifySession | null {
  const value = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!value) {
    return null;
  }

  return decrypt(value);
}

export function setSession(response: NextResponse, session: SpotifySession) {
  response.cookies.set(SESSION_COOKIE_NAME, encrypt(session), {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS
  });
}

export function clearSession(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });
}

export function setOAuthState(response: NextResponse, state: string) {
  response.cookies.set(OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10
  });
}

export function getOAuthState(request: NextRequest) {
  return request.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value ?? null;
}

export function clearOAuthState(response: NextResponse) {
  response.cookies.set(OAUTH_STATE_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });
}
