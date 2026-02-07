import { Minus, Plus } from 'lucide-react';
import { useWatchList } from '../context/WatchListContext';

export default function EpisodeTracker({ item }) {
  const { updateEpisodeProgress, getProgress } = useWatchList();

  if (item.media_type !== 'tv') return null;

  const progress = getProgress(item);
  const seasonEpisodes = item.episodesPerSeason?.[item.currentSeason] || 0;

  const increment = (type) => {
    let s = item.currentSeason;
    let e = item.currentEpisode;

    if (type === 'episode') {
      e += 1;
      if (seasonEpisodes && e > seasonEpisodes) {
        s += 1;
        e = 1;
      }
    } else {
      s += 1;
      e = 1;
    }

    if (item.totalSeasons && s > item.totalSeasons) return;
    updateEpisodeProgress(item.id, item.media_type, s, e);
  };

  const decrement = (type) => {
    let s = item.currentSeason;
    let e = item.currentEpisode;

    if (type === 'episode') {
      e -= 1;
      if (e < 1) {
        if (s > 1) {
          s -= 1;
          e = item.episodesPerSeason?.[s] || 1;
        } else {
          e = 1;
        }
      }
    } else {
      s = Math.max(1, s - 1);
      e = 1;
    }

    updateEpisodeProgress(item.id, item.media_type, s, e);
  };

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      {item.totalEpisodes > 0 && (
        <div>
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Season & Episode counters */}
      <div className="flex gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 w-5">S{item.currentSeason}</span>
          <button
            onClick={() => decrement('season')}
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => increment('season')}
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 w-5">E{item.currentEpisode}</span>
          <button
            onClick={() => decrement('episode')}
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => increment('episode')}
            className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
