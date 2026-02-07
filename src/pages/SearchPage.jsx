import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { tmdb } from '../services/tmdb';
import { useApiKey } from '../context/ApiKeyContext';
import { useDebounce } from '../hooks/useDebounce';
import MediaCard from '../components/MediaCard';
import SkeletonCard from '../components/SkeletonCard';

export default function SearchPage({ onItemClick }) {
  const { apiKey } = useApiKey();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    tmdb.searchMulti(apiKey, debouncedQuery)
      .then((data) =>
        setResults(
          data.results?.filter((r) => r.media_type !== 'person' && r.poster_path) || []
        )
      )
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [apiKey, debouncedQuery]);

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies & TV shows..."
          className="w-full bg-gray-900/80 border border-gray-800 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <SkeletonCard count={12} />
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-xs text-gray-500 mb-4">{results.length} results found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((item) => (
              <MediaCard key={`${item.media_type}-${item.id}`} item={item} onClick={onItemClick} />
            ))}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-500">No results found for &ldquo;{debouncedQuery}&rdquo;</p>
          <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-gray-800 mb-4" />
          <p className="text-gray-600">Search for movies and TV shows</p>
          <p className="text-xs text-gray-700 mt-1">Results appear as you type</p>
        </div>
      )}
    </div>
  );
}
