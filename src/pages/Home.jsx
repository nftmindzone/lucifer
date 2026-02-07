import { useEffect, useState } from 'react';
import { TrendingUp, Play } from 'lucide-react';
import { tmdb, getBackdropUrl } from '../services/tmdb';
import { useApiKey } from '../context/ApiKeyContext';
import { useWatchList } from '../context/WatchListContext';
import MediaCard from '../components/MediaCard';
import SkeletonCard from '../components/SkeletonCard';
import EpisodeTracker from '../components/EpisodeTracker';

export default function Home({ onItemClick }) {
  const { apiKey } = useApiKey();
  const { getByStatus } = useWatchList();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  const watching = getByStatus('watching');

  useEffect(() => {
    setLoading(true);
    tmdb.getTrending(apiKey)
      .then((data) => setTrending(data.results?.filter((r) => r.media_type !== 'person').slice(0, 12) || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiKey]);

  // Pick a random trending item for the hero
  const hero = trending[0];

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      {hero && (
        <div
          className="relative -mx-4 sm:-mx-6 -mt-6 h-64 sm:h-80 rounded-b-2xl overflow-hidden cursor-pointer"
          onClick={() => onItemClick(hero)}
        >
          <img
            src={getBackdropUrl(hero.backdrop_path)}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="gradient-overlay absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">Trending Now</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {hero.title || hero.name}
            </h2>
            <p className="text-sm text-gray-300 mt-1 line-clamp-2 max-w-xl">{hero.overview}</p>
          </div>
        </div>
      )}

      {/* Currently Watching */}
      {watching.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Play size={18} className="text-green-400" />
            <h2 className="text-lg font-semibold text-white">Currently Watching</h2>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{watching.length}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {watching.map((item) => (
              <div key={`${item.media_type}-${item.id}`} className="space-y-2">
                <MediaCard
                  item={item}
                  onClick={() => onItemClick({ ...item, media_type: item.media_type })}
                />
                {item.media_type === 'tv' && <EpisodeTracker item={item} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Trending This Week</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            <SkeletonCard count={12} />
          ) : (
            trending.map((item) => (
              <MediaCard key={`${item.media_type}-${item.id}`} item={item} onClick={onItemClick} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
