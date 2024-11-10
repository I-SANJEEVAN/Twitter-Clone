import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Auth } from './components/Auth';
import { Feed } from './components/Feed';
import { Layout } from './components/Layout';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Layout>
                  <Feed />
                </Layout>
              ) : (
                <Navigate to="/auth" />
              )
            } 
          />
          <Route 
            path="/auth" 
            element={!user ? <Auth /> : <Navigate to="/" />} 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;