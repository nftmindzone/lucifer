import { useEffect, useState } from 'react';
import { X, Star, Calendar, Clock, Play, Plus, Check, ChevronDown } from 'lucide-react';
import { tmdb, getBackdropUrl, getProfileUrl } from '../services/tmdb';
import { useApiKey } from '../context/ApiKeyContext';
import { useWatchList } from '../context/WatchListContext';

const STATUS_LABELS = {
  plan_to_watch: 'Plan to Watch',
  watching: 'Watching',
  completed: 'Completed',
  dropped: 'Dropped',
};

export default function DetailsModal({ item, onClose }) {
  const { apiKey } = useApiKey();
  const { getItemStatus, addItem, updateStatus, addToHistory } = useWatchList();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const currentStatus = getItemStatus(item.id, mediaType);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setLoading(true);
    tmdb.getDetails(apiKey, mediaType, item.id)
      .then((data) => {
        setDetails(data);
        addToHistory({ ...item, media_type: mediaType });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => { document.body.style.overflow = ''; };
  }, [apiKey, item.id, mediaType, addToHistory, item]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleStatusChange = (status) => {
    if (currentStatus) {
      updateStatus(item.id, mediaType, status);
    } else {
      addItem({ ...item, ...(details || {}), media_type: mediaType }, status);
    }
    setShowStatusMenu(false);
  };

  const title = details?.title || details?.name || item.title || item.name;
  const backdrop = getBackdropUrl(details?.backdrop_path || item.backdrop_path);
  const rating = (details?.vote_average || item.vote_average)?.toFixed(1);
  const year = (details?.release_date || details?.first_air_date || '').slice(0, 4);
  const runtime = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const genres = details?.genres?.map((g) => g.name).join(', ');
  const cast = details?.credits?.cast?.slice(0, 8) || [];
  const trailer = details?.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
  const seasons = details?.number_of_seasons;
  const episodes = details?.number_of_episodes;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 my-8 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur p-2 rounded-full text-gray-300 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-80 bg-gray-800" />
            <div className="p-6 space-y-4">
              <div className="h-7 bg-gray-800 rounded w-2/3" />
              <div className="h-4 bg-gray-800 rounded w-1/3" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-800 rounded w-4/5" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Backdrop image */}
            <div className="relative h-72 sm:h-80">
              {backdrop ? (
                <img src={backdrop} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800" />
              )}
              <div className="gradient-overlay absolute inset-0" />

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{title}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-300">
                  {rating && rating !== '0.0' && (
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      {rating}
                    </span>
                  )}
                  {year && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {year}
                    </span>
                  )}
                  {runtime && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {runtime}
                    </span>
                  )}
                  {seasons && (
                    <span>{seasons} Season{seasons > 1 ? 's' : ''} &middot; {episodes} Episodes</span>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      currentStatus
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                  >
                    {currentStatus ? <Check size={16} /> : <Plus size={16} />}
                    {currentStatus ? STATUS_LABELS[currentStatus] : 'Add to List'}
                    <ChevronDown size={14} />
                  </button>

                  {showStatusMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
                      <div className="absolute top-full left-0 mt-1 z-20 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl min-w-[160px]">
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => handleStatusChange(key)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                              currentStatus === key ? 'text-indigo-400 bg-gray-700/50' : 'text-gray-300'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 text-sm font-medium transition-all"
                  >
                    <Play size={16} /> Trailer
                  </a>
                )}
              </div>

              {/* Genres */}
              {genres && (
                <div className="flex flex-wrap gap-2">
                  {details.genres.map((g) => (
                    <span key={g.id} className="px-3 py-1 bg-gray-800/80 rounded-full text-xs text-gray-400 font-medium">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              {details?.overview && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Overview</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{details.overview}</p>
                </div>
              )}

              {/* Cast */}
              {cast.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Cast</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {cast.map((person) => (
                      <div key={person.id} className="flex-shrink-0 text-center w-16">
                        <div className="w-14 h-14 mx-auto rounded-full overflow-hidden bg-gray-800">
                          {getProfileUrl(person.profile_path) ? (
                            <img
                              src={getProfileUrl(person.profile_path)}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg font-bold">
                              {person.name?.[0]}
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-300 mt-1.5 truncate">{person.name}</p>
                        <p className="text-[10px] text-gray-600 truncate">{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
