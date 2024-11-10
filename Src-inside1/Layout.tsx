import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { HomeIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
          >
            <HomeIcon className="h-6 w-6" />
            <span className="font-bold text-xl">Home</span>
          </button>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">@{user.username}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-500"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-2xl mx-auto bg-white min-h-screen border-x border-gray-200">
        {children}
      </main>
    </div>
  );
};