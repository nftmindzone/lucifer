const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMG_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path) => getImageUrl(path, 'w1280');
export const getPosterUrl = (path) => getImageUrl(path, 'w342');
export const getProfileUrl = (path) => getImageUrl(path, 'w185');

const request = async (endpoint, apiKey, params = {}) => {
  if (!apiKey) throw new Error('API key is required');

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key');
    throw new Error(`TMDB API error: ${res.status}`);
  }
  return res.json();
};

export const tmdb = {
  getTrending: (apiKey, mediaType = 'all', timeWindow = 'week') =>
    request(`/trending/${mediaType}/${timeWindow}`, apiKey),

  searchMulti: (apiKey, query, page = 1) =>
    request('/search/multi', apiKey, { query, page }),

  getMovieDetails: (apiKey, id) =>
    request(`/movie/${id}`, apiKey, { append_to_response: 'credits,videos' }),

  getTvDetails: (apiKey, id) =>
    request(`/tv/${id}`, apiKey, { append_to_response: 'credits,videos' }),

  getDetails: (apiKey, mediaType, id) =>
    mediaType === 'tv'
      ? tmdb.getTvDetails(apiKey, id)
      : tmdb.getMovieDetails(apiKey, id),

  validateKey: async (apiKey) => {
    try {
      await request('/configuration', apiKey);
      return true;
    } catch {
      return false;
    }
  },
};
