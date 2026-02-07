import { useState } from 'react';
import { Key, ArrowRight, Film, ExternalLink } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';

export default function ApiKeySetup() {
  const { setApiKey, isChecking } = useApiKey();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter your API key');
      return;
    }
    setError('');
    setApiKey(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mb-4">
            <Film size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">CineTrack</h1>
          <p className="text-gray-500 mt-1">Your Personal Movie & TV Tracker</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/80 border border-gray-800/50 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <Key size={20} className="text-amber-500" />
            </div>
            <div>
              <h2 className="font-semibold text-white">TMDB API Key Required</h2>
              <p className="text-xs text-gray-500">Enter your key to get started</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(''); }}
                placeholder="Paste your TMDB API key here..."
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                autoFocus
              />
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isChecking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  Activate App
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-800/50">
            <p className="text-xs text-gray-500 leading-relaxed">
              Get a free API key from{' '}
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                themoviedb.org <ExternalLink size={10} />
              </a>
              . Create an account, go to Settings &rarr; API, and copy the API Key (v3 auth).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
