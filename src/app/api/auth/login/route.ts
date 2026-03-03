import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getSpotifyClientId, getSpotifyRedirectUri, spotifyScopes } from '@/lib/spotify';
import { setOAuthState } from '@/lib/session';

export async function GET() {
  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: getSpotifyClientId(),
    scope: spotifyScopes(),
    redirect_uri: getSpotifyRedirectUri(),
    state,
    show_dialog: 'true'
  });

  const response = NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
  setOAuthState(response, state);
  return response;
}
