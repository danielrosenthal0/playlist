import { NextRequest, NextResponse } from 'next/server';
import { ensureFreshSession, spotifyFetch } from '@/lib/spotify';
import { getSession, setSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { session: activeSession, refreshed } = await ensureFreshSession(session);
    const spotifyResponse = await spotifyFetch('/me', activeSession.access_token);

    if (!spotifyResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: spotifyResponse.status });
    }

    const data = await spotifyResponse.json();
    const response = NextResponse.json(data);
    if (refreshed) {
      setSession(response, activeSession);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Token expired' }, { status: 401 });
  }
}
