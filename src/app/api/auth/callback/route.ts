import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getSpotifyProfile } from '@/lib/spotify';
import { clearOAuthState, clearSession, getOAuthState, setSession } from '@/lib/session';

function redirectWithError(request: NextRequest, error: string) {
  const url = new URL('/', request.url);
  url.searchParams.set('error', error);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const expectedState = getOAuthState(request);

  if (!code || !state || !expectedState || state !== expectedState) {
    const response = redirectWithError(request, 'state_mismatch');
    clearOAuthState(response);
    clearSession(response);
    return response;
  }

  try {
    const token = await exchangeCodeForToken(code);
    const profile = await getSpotifyProfile(token.access_token);

    const response = NextResponse.redirect(new URL('/', request.url));
    setSession(response, {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: Date.now() + token.expires_in * 1000,
      user: {
        id: profile.id,
        display_name: profile.display_name,
        email: profile.email
      }
    });
    clearOAuthState(response);
    return response;
  } catch (error) {
    console.error(error);
    const response = redirectWithError(request, 'invalid_token');
    clearOAuthState(response);
    clearSession(response);
    return response;
  }
}
