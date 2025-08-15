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
  const [loading, setLoading] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  const [topPlaylists, setTopPlaylists] = useState<PlaylistSuggestion[]>([]);
  const [track, setTrack] = useState<Track | null>(null);

  const [trackUri, setTrackUri] = useState<string | null>(null);
  const [addedSuccessfullyId, setAddedSuccessfullyId] = useState<string | null>(null);

  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:3001/login';
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/user', {
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
    setLoading(false);
  }

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
      const response = await fetch(`http://127.0.0.1:3001/api/classify-song`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ trackId, url })
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Classification result:', result);
        setTopPlaylists(result.topPlaylists || []);
        setTrack(result.track);

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
      const response = await fetch(`http://127.0.0.1:3001/api/add-to-playlist`, {
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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {user ? (
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h1 className="font-bold text-lg">plauly</h1>
        <div className="w-full max-w-md">
              <input
                type="text"
                placeholder="Paste Spotify song URL here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAnalyzeSong(e.currentTarget.value);
                  }
                }}
                disabled={isClassifying}
              />
              <button 
                className="w-full mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  handleAnalyzeSong(input.value);
                }}
                disabled={isClassifying}
              >
                {isClassifying ? "Analyzing..." : "Analyze Song"}
              </button>
              {isClassifying && (
              <div className="flex justify-center items-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                <span className="ml-2 text-green-500">Analyzing...</span>
              </div>
            )}
            {track && (
              <div className="mt-6 text-center">
                <div className="text-md font-semibold text-white-700">Analyzed Track:</div>
                <div className="flex flex-col items-center mt-4">
                  <img src={track.album.images[0].url} alt={track.name} className="w-24 h-24 rounded mb-2" />
                  <div className="font-bold">{track.name}</div>
                  <div className="text-sm text-gray-500">by {track.artists.map(artist => artist.name).join(', ')}</div>
                  <div className="text-sm text-gray-500">Album: {track.album.name}</div>
                </div>
              </div>
            )}

            {topPlaylists.length > 0 && (
              <div className="mt-6 text-center">
                <div className="text-md font-semibold text-white-700">
                  Top Playlist Suggestions:
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  {topPlaylists.map((playlist) => (
                    <div key={playlist.playlistId} className="flex flex-col items-center border rounded-lg p-4 shadow">
                      {playlist.image && (
                        <img src={playlist.image} alt={playlist.playlistName} className="w-20 h-20 rounded mb-2" />
                      )}
                      <div className="font-bold">{playlist.playlistName}</div>
                      <div className="text-sm text-gray-500">Score: {playlist.score}</div>
                      <div className="text-sm text-gray-500">Score Description: {playlist.scoreDescription}</div>
                      <button
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        onClick={() => addToPlaylist(playlist.playlistId, `spotify:track:${trackUri}`)}
                      >
                        Add to this Playlist
                      </button>
                      {addedSuccessfullyId == playlist.playlistId && (
                        <div className="mt-2 text-sm text-green-500">
                          Track added to playlist successfully!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="text-center mt-6 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <div className="text-white-600 font-semibold">How are playlists scored?</div>
            </div>
            <div className="flex">This app uses a custom scoring system based on some of the few available features: tracks, artists, and popularity. All other factors like danceability, rhythm, genre, instrumentalness, tempo, etc have been incorporated manually.</div>

            </div>
        </main>
      ) : (
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        plauly
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors" onClick={handleLogin}>
          Connect your Spotify to classify a song</button>
        </main>
      )}
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        daniel rosenthal 2025
      </footer>
    </div>
  );
}
