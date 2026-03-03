'use client';

import { useEffect, useState } from "react";
interface User {
  id: string;
  display_name: string;
  email?: string;
}

interface PlaylistSuggestion {
  playlistId: string;
  playlistName: string;
  score: number;
  avgPopularity?: number;
  popularityScore?: number;
  image: string | null;
  scoreDescription: string;
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
}
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [topPlaylists, setTopPlaylists] = useState<PlaylistSuggestion[]>([]);
  const [track, setTrack] = useState<Track | null>(null);
  const [trackUrl, setTrackUrl] = useState('');
  const [maxPlaylists, setMaxPlaylists] = useState(30);
  const [tracksPerPlaylist, setTracksPerPlaylist] = useState(100);
  const [searchedPlaylists, setSearchedPlaylists] = useState<number | null>(null);
  const [analyzedTracksPerPlaylist, setAnalyzedTracksPerPlaylist] = useState<number | null>(null);

  const [trackUri, setTrackUri] = useState<string | null>(null);
  const [addedSuccessfullyId, setAddedSuccessfullyId] = useState<string | null>(null);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/user', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
      // Not authenticated, just set user to null
      setUser(null);
    } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  }

  useEffect(() => {
    // Initial auth bootstrap on first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuthStatus();
  }, []);

  const handleAnalyzeSong = async (url: string) => {
    if (!url.trim()) {
      alert('Please enter a valid Spotify song URL.');
      return;
    }

    const spotifyTrackRegex = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
    const match = url.match(spotifyTrackRegex);
    if (!match) {
      alert('Please enter a valid Spotify song URL.');
      return;
    }

    const trackId = match[1];
    setTrackUri(trackId);
    setIsClassifying(true);
    console.log('Analyzing track with ID:', trackId);

    try {
      const response = await fetch('/api/classify-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ trackId, maxPlaylists, tracksPerPlaylist })
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Classification result:', result);
        setTopPlaylists(result.topPlaylists || []);
        setTrack(result.track);
        setSearchedPlaylists(result.searchedPlaylists ?? null);
        setAnalyzedTracksPerPlaylist(result.tracksPerPlaylist ?? null);

      } else {
        alert('Failed to classify song. Please try again.');
      }
    }
    catch (error) {
      console.error('Error classifying song:', error);
      alert('Error classifying song. Please try again.');
    }
        setIsClassifying(false);

  }

  const addToPlaylist = async (playlistId: string, trackUri: string) => {
    try {
      const response = await fetch('/api/add-to-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ playlistId, trackUri })
      });
      if (response.ok) {
        console.log('Track added to playlist successfully');
        setAddedSuccessfullyId(playlistId);
      }
    } catch (error) {
      console.error('Error adding to playlist:', error);
      alert('Error adding to playlist. Please try again.');
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-6 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">plauly</h1>
        </header>

        {user ? (
          <main className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Paste a Spotify track URL
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="https://open.spotify.com/track/..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  value={trackUrl}
                  onChange={(e) => setTrackUrl(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAnalyzeSong(e.currentTarget.value);
                    }
                  }}
                  disabled={isClassifying}
                />
                <button
                  className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                  onClick={() => handleAnalyzeSong(trackUrl)}
                  disabled={isClassifying}
                >
                  {isClassifying ? "Analyzing..." : "Analyze Song"}
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-slate-700">
                  Playlists to search
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={maxPlaylists}
                    onChange={(e) => setMaxPlaylists(Number(e.currentTarget.value))}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Tracks per playlist
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={tracksPerPlaylist}
                    onChange={(e) => setTracksPerPlaylist(Number(e.currentTarget.value))}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>
              {isClassifying && (
                <div className="mt-4 flex items-center gap-2 text-emerald-700">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
                  <span className="text-sm font-medium">Analyzing your song...</span>
                </div>
              )}
            </section>

            {track && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Analyzed Track</h2>
                <div className="mt-4 flex items-center gap-4">
                  <img src={track.album.images[0].url} alt={track.name} className="h-20 w-20 rounded-xl object-cover shadow-sm" />
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{track.name}</div>
                    <div className="text-sm text-slate-600">by {track.artists.map((artist) => artist.name).join(", ")}</div>
                    <div className="text-sm text-slate-500">Album: {track.album.name}</div>
                  </div>
                </div>
              </section>
            )}

            {topPlaylists.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Top Playlist Suggestions</h2>
                <div className="mt-2 text-sm text-slate-600">
                  Searched {searchedPlaylists ?? 0} playlists, analyzed up to {analyzedTracksPerPlaylist ?? 0} tracks per playlist.
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {topPlaylists.map((playlist) => (
                    <article key={playlist.playlistId} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        {playlist.image && (
                          <img src={playlist.image} alt={playlist.playlistName} className="h-14 w-14 rounded-lg object-cover" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">{playlist.playlistName}</div>
                          <div className="text-sm text-slate-500">Score: {playlist.score}</div>
                        </div>
                      </div>
                      <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{playlist.scoreDescription}</p>
                      <button
                        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                        onClick={() => addToPlaylist(playlist.playlistId, `spotify:track:${trackUri}`)}
                      >
                        Add to Playlist
                      </button>
                      {addedSuccessfullyId === playlist.playlistId && (
                        <div className="mt-2 text-sm font-medium text-emerald-700">
                          Track added successfully.
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                How playlists are scored
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                This app uses a custom scoring system based on available features like tracks, artists, and popularity, plus manually weighted factors like danceability, rhythm, genre, instrumentalness, and tempo.
              </p>
            </section>
          </main>
        ) : (
          <main className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">Connect Spotify to classify a song and find the best playlist.</p>
            <p className="text-slate-600">Spotify only allows 5 users on development accounts, so contact me <a href="https://danielrosenthal.io/contact" target="_blank" rel="noopener noreferrer">here</a> to gain access if you are interested.</p>
            <button
              className="mt-4 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
              onClick={handleLogin}
            >
              Connect your Spotify
            </button>
          </main>
        )}

        <footer className="text-center text-sm text-slate-500">daniel rosenthal 2026</footer>
      </div>
    </div>
  );
}
