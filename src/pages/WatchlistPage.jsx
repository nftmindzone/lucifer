import { useState } from 'react';
import { Bookmark, Eye, CheckCircle2, XCircle, Tv } from 'lucide-react';
import { useWatchList } from '../context/WatchListContext';
import MediaCard from '../components/MediaCard';
import EpisodeTracker from '../components/EpisodeTracker';

const TABS = [
  { key: 'plan_to_watch', label: 'Plan to Watch', icon: Bookmark, color: 'text-blue-400' },
  { key: 'watching', label: 'Watching', icon: Eye, color: 'text-green-400' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-purple-400' },
  { key: 'dropped', label: 'Dropped', icon: XCircle, color: 'text-red-400' },
];

export default function WatchlistPage({ onItemClick }) {
  const { getByStatus } = useWatchList();
  const [activeTab, setActiveTab] = useState('plan_to_watch');

  const items = getByStatus(activeTab);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Watchlist</h1>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map(({ key, label, icon: Icon, color }) => {
          const count = getByStatus(key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === key
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <Icon size={16} className={activeTab === key ? color : ''} />
              {label}
              {count > 0 && (
                <span className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded-full">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={`${item.media_type}-${item.id}`} className="space-y-2">
              <MediaCard
                item={item}
                onClick={() => onItemClick({ ...item, media_type: item.media_type })}
              />
              {activeTab === 'watching' && item.media_type === 'tv' && (
                <EpisodeTracker item={item} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Tv size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-500">Nothing here yet</p>
          <p className="text-xs text-gray-600 mt-1">
            Browse trending or search to add items
          </p>
        </div>
      )}
    </div>
  );
}
