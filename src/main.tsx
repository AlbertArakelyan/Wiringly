import React from 'react';
import ReactDOM from 'react-dom/client';
import 'wtk-ui-react/styles.css';

import App from './App';
import AppStateProvider from './contexts/AppStateProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>,
);
