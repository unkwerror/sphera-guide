import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/theme.css';
import './styles/base.css';
import './styles/utilities.css';
import './styles/design-system.css';
import './styles/glyphs.css';
import './styles/motion.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
