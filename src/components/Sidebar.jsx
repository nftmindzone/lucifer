import { NavLink } from 'react-router-dom';
import { Home, Search, Bookmark, Clock, Film, Key, X, Menu } from 'lucide-react';
import { useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/watchlist', icon: Bookmark, label: 'Watchlist' },
  { to: '/history', icon: Clock, label: 'History' },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isValid, clearKey } = useApiKey();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-800/80 backdrop-blur p-2 rounded-lg text-gray-300 hover:text-white"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Film size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">CineTrack</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Personal IMDb</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* API key status */}
        <div className="p-4 border-t border-gray-800/50">
          {isValid ? (
            <button
              onClick={clearKey}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors w-full"
            >
              <Key size={14} />
              <span>API Key Active</span>
              <span className="ml-auto text-[10px] text-gray-600">Change</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-500/70">
              <Key size={14} />
              <span>No API Key</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
