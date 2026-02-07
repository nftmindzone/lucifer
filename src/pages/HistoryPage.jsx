import { Clock, Trash2 } from 'lucide-react';
import { useWatchList } from '../context/WatchListContext';
import MediaCard from '../components/MediaCard';

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function HistoryPage({ onItemClick }) {
  const { history } = useWatchList();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">View History</h1>
        {history.length > 0 && (
          <span className="text-xs text-gray-500">{history.length} items</span>
        )}
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {history.map((item, idx) => (
            <div key={`${item.media_type}-${item.id}-${idx}`}>
              <MediaCard item={item} onClick={onItemClick} />
              <p className="text-[10px] text-gray-600 mt-1 px-0.5">{timeAgo(item.viewedAt)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Clock size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-500">No viewing history yet</p>
          <p className="text-xs text-gray-600 mt-1">Items you view will appear here</p>
        </div>
      )}
    </div>
  );
}
