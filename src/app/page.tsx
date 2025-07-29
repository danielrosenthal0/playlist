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


  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {user ? (
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
       plauly
       <div className="text-center">
              <div className="text-lg">Welcome back, <span className="font-semibold">{user.display_name}</span>!</div>
              <div className="text-sm text-gray-600 mt-1">Ready to classify some songs?</div>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
              Classify a song
            </button>
       </main>
      ) : (
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
       plauly
       <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors" onClick={handleLogin}
>
        Connect your Spotify to classify a song</button>
      </main>
      )
      }
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        daniel rosenthal 2025
      </footer>
    </div>
  );
}
