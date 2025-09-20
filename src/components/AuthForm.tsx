import React, { useState } from 'react';
import { Key, Lock, LogIn } from 'lucide-react';

interface AuthFormProps {
  onAuthenticate: (key: string, secret: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticate, loading, error }) => {
  const [credentials, setCredentials] = useState({
    key: 'general',
    secret: 'cEDVwGMEDigPzc/FAh3/GneExIEjtIi571UXgtmLapU='
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAuthenticate(credentials.key.trim(), credentials.secret.trim());
  };

  const handleInputChange = (field: 'key' | 'secret') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const isFormValid = credentials.key.trim() && credentials.secret.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Involve Asia</h1>
            <p className="text-gray-600">Deeplink Generator</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="apiKey"
                  type="text"
                  value={credentials.key}
                  onChange={handleInputChange('key')}
                  placeholder="Enter your API key"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-700 mb-2">
                API Secret
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="apiSecret"
                  type="password"
                  value={credentials.secret}
                  onChange={handleInputChange('secret')}
                  placeholder="Enter your API secret"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-emerald-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Authenticate</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Need API credentials?</strong> Login to your Publisher Dashboard → Tools → API to request your API key and secret.
              <br /><br />
              <strong>Note:</strong> This app uses a serverless proxy to connect to the Involve Asia API securely. Make sure your API credentials are valid and your account has the necessary permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};