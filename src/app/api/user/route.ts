import { NextRequest, NextResponse } from 'next/server';
import { ensureFreshSession } from '@/lib/spotify';
import { getSession, setSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { session: activeSession, refreshed } = await ensureFreshSession(session);
    const response = NextResponse.json({
      user: activeSession.user,
      authenticated: true
    });

    if (refreshed) {
      setSession(response, activeSession);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
}
