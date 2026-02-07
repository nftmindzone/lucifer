import { createContext, useContext, useState, useEffect } from 'react';
import { tmdb } from '../services/tmdb';

const ApiKeyContext = createContext();

export function ApiKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tmdb_api_key') || '');
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setIsValid(false);
      return;
    }
    let cancelled = false;
    setIsChecking(true);
    tmdb.validateKey(apiKey).then((valid) => {
      if (!cancelled) {
        setIsValid(valid);
        setIsChecking(false);
        if (valid) localStorage.setItem('tmdb_api_key', apiKey);
      }
    });
    return () => { cancelled = true; };
  }, [apiKey]);

  const clearKey = () => {
    setApiKey('');
    setIsValid(false);
    localStorage.removeItem('tmdb_api_key');
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isValid, isChecking, clearKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export const useApiKey = () => useContext(ApiKeyContext);
