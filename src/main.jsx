import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'react-datepicker/dist/react-datepicker.css';
import { NewsProvider } from './context/NewsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NewsProvider>
      <App />
    </NewsProvider>
  </React.StrictMode>,
);