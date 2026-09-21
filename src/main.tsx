import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/700.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/animations.css';
import App from './ui/App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

