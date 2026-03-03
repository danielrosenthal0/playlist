import { NextRequest, NextResponse } from 'next/server';
import { ensureFreshSession, spotifyFetch } from '@/lib/spotify';
import { getSession, setSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { trackUri, playlistId } = await request.json();
  if (!trackUri || !playlistId) {
    return NextResponse.json(
      { error: 'Track URI and Playlist ID are required' },
      { status: 400 }
    );
  }

  try {
    const { session: activeSession, refreshed } = await ensureFreshSession(session);

    const addResponse = await spotifyFetch(`/playlists/${playlistId}/tracks`, activeSession.access_token, {
      method: 'POST',
      body: JSON.stringify({ uris: [trackUri] })
    });

    if (!addResponse.ok) {
      throw new Error('Add to playlist error');
    }

    const response = NextResponse.json({ success: true });
    if (refreshed) {
      setSession(response, activeSession);
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add track to playlist' }, { status: 500 });
  }
}
