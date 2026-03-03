import { NextRequest, NextResponse } from 'next/server';
import { genreMap } from '@/genreMap';
import { ensureFreshSession, spotifyFetch } from '@/lib/spotify';
import { getSession, setSession } from '@/lib/session';

type PlaylistScore = {
  playlistId: string;
  playlistName: string;
  score: number;
  avgPopularity: number;
  popularityScore: number;
  image: string | null;
  scoreDescription: string;
};

type SimpleArtist = {
  id: string;
  name: string;
};

type SimpleTrack = {
  id: string;
  popularity: number;
  artists: SimpleArtist[];
};

const DEFAULT_MAX_PLAYLISTS = 30;
const DEFAULT_TRACKS_PER_PLAYLIST = 100;
const ARTIST_BATCH_SIZE = 50;
const PLAYLIST_FETCH_CONCURRENCY = 4;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function parsePositiveInt(value: string | undefined, fallback: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return clamp(Math.floor(parsed), 1, max);
}

function getBestGenreMatch(artistNames: string[], genres: string[]) {
  let bestMatch: { main: string | null; sub: string | null; score: number } = {
    main: null,
    sub: null,
    score: 0
  };

  Object.entries(genreMap).forEach(([mainGenre, subgenres]) => {
    Object.entries(subgenres).forEach(([sub, data]) => {
      let score = 0;
      if (data.artists.some((artist: string) => artistNames.includes(artist))) {
        score += 2;
      }
      if (genres.some((genre) => data.keywords.includes(genre))) {
        score += 1;
      }
      if (score > bestMatch.score) {
        bestMatch = { main: mainGenre, sub, score };
      }
    });
  });

  return bestMatch;
}

function tokenizeGenres(genres: Iterable<string>) {
  const stopWords = new Set(['and', 'the', 'of', 'music', 'pop', 'rap', 'rock']);
  const tokens = new Set<string>();

  for (const genre of genres) {
    genre
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2 && !stopWords.has(token))
      .forEach((token) => tokens.add(token));
  }

  return tokens;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>) {
  if (a.size === 0 || b.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) {
      intersection += 1;
    }
  }

  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, mapper: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await mapper(items[current]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function fetchUserPlaylists(accessToken: string, maxPlaylists: number) {
  const playlists: Array<{ id: string; name: string; image: string | null }> = [];
  let offset = 0;

  while (playlists.length < maxPlaylists) {
    const limit = Math.min(50, maxPlaylists - playlists.length);
    const response = await spotifyFetch(`/me/playlists?limit=${limit}&offset=${offset}`, accessToken);
    if (!response.ok) {
      throw new Error('Playlists info error');
    }

    const data = await response.json();
    for (const playlist of data.items ?? []) {
      playlists.push({
        id: playlist.id,
        name: playlist.name,
        image: playlist.images?.[0]?.url ?? null
      });
    }

    if (!data.next || (data.items?.length ?? 0) === 0) {
      break;
    }

    offset += limit;
  }

  return playlists;
}

async function fetchPlaylistTracks(accessToken: string, playlistId: string, maxTracks: number) {
  const tracks: SimpleTrack[] = [];
  let offset = 0;

  while (tracks.length < maxTracks) {
    const limit = Math.min(100, maxTracks - tracks.length);
    const path = `/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}&fields=items(track(id,popularity,artists(id,name))),next`;
    const response = await spotifyFetch(path, accessToken);

    if (!response.ok) {
      break;
    }

    const data = await response.json();
    for (const item of data.items ?? []) {
      if (!item.track || !item.track.id) {
        continue;
      }

      tracks.push({
        id: item.track.id,
        popularity: item.track.popularity ?? 50,
        artists: (item.track.artists ?? []).map((artist: { id: string; name: string }) => ({
          id: artist.id,
          name: artist.name
        }))
      });
    }

    if (!data.next || (data.items?.length ?? 0) === 0) {
      break;
    }

    offset += limit;
  }

  return tracks;
}

async function fetchArtistGenreMap(accessToken: string, artistIds: string[]) {
  const uniqueArtistIds = [...new Set(artistIds)].filter(Boolean);
  const genreMapByArtistId = new Map<string, string[]>();

  for (let i = 0; i < uniqueArtistIds.length; i += ARTIST_BATCH_SIZE) {
    const batch = uniqueArtistIds.slice(i, i + ARTIST_BATCH_SIZE);
    const response = await spotifyFetch(`/artists?ids=${batch.join(',')}`, accessToken);
    if (!response.ok) {
      continue;
    }

    const data = await response.json();
    for (const artist of data.artists ?? []) {
      if (!artist?.id) {
        continue;
      }
      genreMapByArtistId.set(artist.id, artist.genres ?? []);
    }
  }

  return genreMapByArtistId;
}

export async function POST(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let payload: { trackId?: string; maxPlaylists?: number; tracksPerPlaylist?: number };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }

  const trackId = payload.trackId;
  if (!trackId) {
    return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
  }

  const maxPlaylists = clamp(
    Number.isFinite(payload.maxPlaylists)
      ? Math.floor(payload.maxPlaylists as number)
      : parsePositiveInt(process.env.CLASSIFY_MAX_PLAYLISTS, DEFAULT_MAX_PLAYLISTS, 50),
    1,
    50
  );

  const tracksPerPlaylist = clamp(
    Number.isFinite(payload.tracksPerPlaylist)
      ? Math.floor(payload.tracksPerPlaylist as number)
      : parsePositiveInt(process.env.CLASSIFY_TRACKS_PER_PLAYLIST, DEFAULT_TRACKS_PER_PLAYLIST, 200),
    1,
    200
  );

  try {
    const { session: activeSession, refreshed } = await ensureFreshSession(session);

    const trackResponse = await spotifyFetch(`/tracks/${trackId}`, activeSession.access_token);
    if (!trackResponse.ok) {
      throw new Error('Track info error');
    }

    const trackData = await trackResponse.json();
    const songArtists: SimpleArtist[] = (trackData.artists ?? []).map((artist: { id: string; name: string }) => ({
      id: artist.id,
      name: artist.name
    }));

    const playlists = await fetchUserPlaylists(activeSession.access_token, maxPlaylists);
    const playlistTracksList = await mapWithConcurrency(
      playlists,
      PLAYLIST_FETCH_CONCURRENCY,
      async (playlist) => ({
        playlist,
        tracks: await fetchPlaylistTracks(activeSession.access_token, playlist.id, tracksPerPlaylist)
      })
    );

    const artistIds = [
      ...songArtists.map((artist) => artist.id),
      ...playlistTracksList.flatMap((entry) => entry.tracks.flatMap((track) => track.artists.map((artist) => artist.id)))
    ];

    const artistGenresById = await fetchArtistGenreMap(activeSession.access_token, artistIds);

    const songArtistNames = songArtists.map((artist) => artist.name);
    const songGenres = new Set<string>();
    for (const artist of songArtists) {
      for (const genre of artistGenresById.get(artist.id) ?? []) {
        songGenres.add(genre);
      }
    }

    const songGenreTokens = tokenizeGenres(songGenres);
    const songBestGenre = getBestGenreMatch(songArtistNames, [...songGenres]);
    const newSongPopularity = typeof trackData.popularity === 'number' ? trackData.popularity : 50;

    const scoredPlaylists: PlaylistScore[] = [];

    for (const { playlist, tracks } of playlistTracksList) {
      if (tracks.length === 0) {
        continue;
      }

      const playlistArtistIds = new Set<string>();
      const playlistArtistNames = new Set<string>();
      const playlistGenres = new Set<string>();
      const playlistSubgenreHits = new Map<string, number>();

      let popularitySum = 0;

      for (const track of tracks) {
        popularitySum += track.popularity;

        const trackArtistNames: string[] = [];
        const trackGenres = new Set<string>();

        for (const artist of track.artists) {
          playlistArtistIds.add(artist.id);
          playlistArtistNames.add(artist.name);
          trackArtistNames.push(artist.name);

          for (const genre of artistGenresById.get(artist.id) ?? []) {
            playlistGenres.add(genre);
            trackGenres.add(genre);
          }
        }

        const trackBestGenre = getBestGenreMatch(trackArtistNames, [...trackGenres]);
        if (trackBestGenre.main && trackBestGenre.sub) {
          const key = `${trackBestGenre.main}::${trackBestGenre.sub}`;
          playlistSubgenreHits.set(key, (playlistSubgenreHits.get(key) ?? 0) + 1);
        }
      }

      const avgPopularity = popularitySum / tracks.length;
      const popularityDiff = Math.abs(avgPopularity - newSongPopularity);
      const popularityScore = Math.max(0, 10 - popularityDiff / 5);

      const songArtistIdSet = new Set(songArtists.map((artist) => artist.id));
      let sharedArtistCount = 0;
      for (const artistId of songArtistIdSet) {
        if (playlistArtistIds.has(artistId)) {
          sharedArtistCount += 1;
        }
      }
      const artistScore = Math.min(sharedArtistCount * 8, 24);

      const genreJaccard = jaccardSimilarity(songGenres, playlistGenres);
      const genreScore = genreJaccard * 30;

      const playlistGenreTokens = tokenizeGenres(playlistGenres);
      const tokenJaccard = jaccardSimilarity(songGenreTokens, playlistGenreTokens);
      const tokenScore = tokenJaccard * 8;

      let subgenreScore = 0;
      let bestPlaylistSubgenre: string | null = null;
      let bestPlaylistSubgenreCount = 0;
      for (const [key, count] of playlistSubgenreHits.entries()) {
        if (count > bestPlaylistSubgenreCount) {
          bestPlaylistSubgenre = key;
          bestPlaylistSubgenreCount = count;
        }
      }

      if (bestPlaylistSubgenre && songBestGenre.main && songBestGenre.sub) {
        const [main, sub] = bestPlaylistSubgenre.split('::');
        if (main === songBestGenre.main && sub === songBestGenre.sub) {
          subgenreScore = 12;
        } else if (main === songBestGenre.main) {
          subgenreScore = 6;
        }
      }

      const totalScore = artistScore + genreScore + tokenScore + subgenreScore + popularityScore;

      const explanationParts = [
        `Artist overlap: +${artistScore.toFixed(1)} (${sharedArtistCount} shared artist${sharedArtistCount === 1 ? '' : 's'})`,
        `Genre overlap: +${genreScore.toFixed(1)} (Jaccard ${(genreJaccard * 100).toFixed(0)}%)`,
        `Genre token similarity: +${tokenScore.toFixed(1)} (token overlap ${(tokenJaccard * 100).toFixed(0)}%)`,
        `Subgenre alignment: +${subgenreScore.toFixed(1)}`,
        `Popularity fit: +${popularityScore.toFixed(1)} (avg ${Math.round(avgPopularity)} vs song ${newSongPopularity})`,
        `Tracks analyzed: ${tracks.length}`
      ];

      scoredPlaylists.push({
        playlistId: playlist.id,
        playlistName: playlist.name,
        score: Math.round(totalScore),
        avgPopularity: Math.round(avgPopularity),
        popularityScore: Math.round(popularityScore),
        image: playlist.image,
        scoreDescription: explanationParts.join('\n')
      });
    }

    const topPlaylists = scoredPlaylists.sort((a, b) => b.score - a.score).slice(0, 5);
    const response = NextResponse.json({
      track: trackData,
      topPlaylists,
      searchedPlaylists: playlists.length,
      tracksPerPlaylist
    });

    if (refreshed) {
      setSession(response, activeSession);
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to classify song' }, { status: 500 });
  }
}
