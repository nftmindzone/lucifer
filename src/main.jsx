import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApiKeyProvider } from './context/ApiKeyContext';
import { WatchListProvider } from './context/WatchListContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ApiKeyProvider>
        <WatchListProvider>
          <App />
        </WatchListProvider>
      </ApiKeyProvider>
    </BrowserRouter>
  </StrictMode>,
);
