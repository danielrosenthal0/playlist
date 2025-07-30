'use client';

import { useEffect, useState } from "react";
interface User {
  id: string;
  display_name: string;
  email?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      } else {
        alert('Failed to classify song. Please try again.');
      }
    }
    catch (error) {
     console.error('Error classifying song:', error);
      alert('Error classifying song. Please try again.');
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
              />
              <button 
                className="w-full mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                onClick={() => {
                  const input = document.querySelector('input') as HTMLInputElement;
                  handleAnalyzeSong(input.value);
                }}
              >
                Analyze Song
              </button>
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
