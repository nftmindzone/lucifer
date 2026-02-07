import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApiKey } from './context/ApiKeyContext';
import Sidebar from './components/Sidebar';
import ApiKeySetup from './components/ApiKeySetup';
import DetailsModal from './components/DetailsModal';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import WatchlistPage from './pages/WatchlistPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  const { isValid } = useApiKey();
  const [selectedItem, setSelectedItem] = useState(null);

  if (!isValid) return <ApiKeySetup />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-16 lg:pt-6">
          <Routes>
            <Route path="/" element={<Home onItemClick={setSelectedItem} />} />
            <Route path="/search" element={<SearchPage onItemClick={setSelectedItem} />} />
            <Route path="/watchlist" element={<WatchlistPage onItemClick={setSelectedItem} />} />
            <Route path="/history" element={<HistoryPage onItemClick={setSelectedItem} />} />
          </Routes>
        </div>
      </main>

      {/* Details Modal */}
      {selectedItem && (
        <DetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
