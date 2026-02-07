import { Star, Tv, Film, Plus, Check } from 'lucide-react';
import { getPosterUrl } from '../services/tmdb';
import { useWatchList } from '../context/WatchListContext';

export default function MediaCard({ item, onClick }) {
  const { getItemStatus, addItem, removeItem } = useWatchList();
  const status = getItemStatus(item.id, item.media_type);

  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const poster = getPosterUrl(item.poster_path);
  const rating = item.vote_average?.toFixed(1);
  const isTV = item.media_type === 'tv';

  const handleListToggle = (e) => {
    e.stopPropagation();
    if (status) {
      removeItem(item.id, item.media_type);
    } else {
      addItem(item, 'plan_to_watch');
    }
  };

  return (
    <div
      onClick={() => onClick?.(item)}
      className="group cursor-pointer card-hover relative"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            {isTV ? <Tv size={40} /> : <Film size={40} />}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick-add button */}
        <button
          onClick={handleListToggle}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 ${
            status
              ? 'bg-indigo-500 text-white opacity-100'
              : 'bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-indigo-500'
          }`}
        >
          {status ? <Check size={14} /> : <Plus size={14} />}
        </button>

        {/* Rating badge */}
        {rating && rating !== '0.0' && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <Star size={10} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-white">{rating}</span>
          </div>
        )}

        {/* Media type badge */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] uppercase tracking-wider bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-gray-300 font-medium">
            {isTV ? 'TV Series' : 'Movie'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
          {title}
        </h3>
        {year && <p className="text-xs text-gray-500 mt-0.5">{year}</p>}
      </div>
    </div>
  );
}
