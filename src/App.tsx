import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { involveAsiaAPI } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthenticate = async (key: string, secret: string) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await involveAsiaAPI.authenticate(key, secret);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthError(null);
  };

  if (!isAuthenticated) {
    return (
      <AuthForm 
        onAuthenticate={handleAuthenticate}
        loading={authLoading}
        error={authError}
      />
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;