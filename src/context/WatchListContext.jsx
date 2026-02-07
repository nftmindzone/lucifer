import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchListContext = createContext();

const STORAGE_KEY = 'cinetrack_watchlist';
const HISTORY_KEY = 'cinetrack_history';

const STATUSES = ['plan_to_watch', 'watching', 'completed', 'dropped'];

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function WatchListProvider({ children }) {
  const [items, setItems] = useState(() => loadFromStorage(STORAGE_KEY));
  const [history, setHistory] = useState(() => loadFromStorage(HISTORY_KEY));

  useEffect(() => { saveToStorage(STORAGE_KEY, items); }, [items]);
  useEffect(() => { saveToStorage(HISTORY_KEY, history); }, [history]);

  const addToHistory = useCallback((item) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.id === item.id && h.media_type === item.media_type));
      return [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, 100);
    });
  }, []);

  const addItem = useCallback((item, status = 'plan_to_watch') => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id && i.media_type === item.media_type);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id && i.media_type === item.media_type
            ? { ...i, status, updatedAt: Date.now() }
            : i
        );
      }
      return [...prev, {
        id: item.id,
        media_type: item.media_type || 'movie',
        title: item.title || item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
        status,
        currentSeason: 1,
        currentEpisode: 1,
        totalEpisodes: item.number_of_episodes || 0,
        totalSeasons: item.number_of_seasons || 0,
        episodesPerSeason: item.seasons?.map((s) => s.episode_count) || [],
        addedAt: Date.now(),
        updatedAt: Date.now(),
      }];
    });
  }, []);

  const removeItem = useCallback((id, mediaType) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.media_type === mediaType)));
  }, []);

  const updateStatus = useCallback((id, mediaType, status) => {
    setItems((prev) => prev.map((i) =>
      i.id === id && i.media_type === mediaType
        ? { ...i, status, updatedAt: Date.now() }
        : i
    ));
  }, []);

  const updateEpisodeProgress = useCallback((id, mediaType, season, episode) => {
    setItems((prev) => prev.map((i) =>
      i.id === id && i.media_type === mediaType
        ? { ...i, currentSeason: season, currentEpisode: episode, updatedAt: Date.now() }
        : i
    ));
  }, []);

  const getItemStatus = useCallback((id, mediaType) => {
    const item = items.find((i) => i.id === id && i.media_type === mediaType);
    return item?.status || null;
  }, [items]);

  const getItem = useCallback((id, mediaType) => {
    return items.find((i) => i.id === id && i.media_type === mediaType) || null;
  }, [items]);

  const getByStatus = useCallback((status) => {
    return items.filter((i) => i.status === status);
  }, [items]);

  const getProgress = useCallback((item) => {
    if (!item || item.media_type !== 'tv' || !item.totalEpisodes) return 0;
    let watched = 0;
    for (let s = 1; s < item.currentSeason; s++) {
      watched += item.episodesPerSeason?.[s] || 0;
    }
    watched += item.currentEpisode - 1;
    return Math.min(Math.round((watched / item.totalEpisodes) * 100), 100);
  }, []);

  return (
    <WatchListContext.Provider value={{
      items, history, STATUSES,
      addItem, removeItem, updateStatus, updateEpisodeProgress,
      getItemStatus, getItem, getByStatus, getProgress, addToHistory,
    }}>
      {children}
    </WatchListContext.Provider>
  );
}

export const useWatchList = () => useContext(WatchListContext);
