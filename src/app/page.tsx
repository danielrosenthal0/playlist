'use client';

import { useEffect, useState } from "react";
interface User {
  id: string;
  display_name: string;
  email?: string;
}
interface SuggestedPlaylist {
  id: string;
  name: string;
  score: number;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  const [suggestedPlaylist, setSuggestedPlaylist] = useState<SuggestedPlaylist | null>(null);
  const [trackUri, setTrackUri] = useState<string | null>(null);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

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
    setSuggestedPlaylist(null);
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
        setSuggestedPlaylist(result.suggestedPlaylist);
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
        setAddedSuccessfully(true);
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
       
       <div className="text-center">
              <div className="text-lg">Welcome, <span className="font-semibold">{user.display_name}</span>!</div>
              <div className="text-sm text-gray-600 mt-1">Ready to analyze a song?</div>
        </div>
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
            {suggestedPlaylist && (
              <div className="mt-6 text-center">
                <div className="text-md font-semibold text-green-700">
                  Recommended Playlist:
                </div>
                <div className="text-lg font-bold">{suggestedPlaylist.name}</div>
                <div className="text-sm text-gray-500">Score: {suggestedPlaylist.score}</div>
                  <button 
                className="w-full mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                onClick={() => {
                 addToPlaylist(suggestedPlaylist.id, `spotify:track:${trackUri}`);
                }}
                
              >
                Add to Recommended Playlist
              </button>
              {addedSuccessfully && (
                <div className="mt-2 text-sm text-white-500">
                  Track added to playlist successfully!
                </div>
              )}
              </div>
            )}
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
