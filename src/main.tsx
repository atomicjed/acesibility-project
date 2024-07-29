import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from "./app/router";
import { SpeechProvider } from "./app/lib/context/speech.context.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SpeechProvider>
      <Router />
    </SpeechProvider>
  </React.StrictMode>,
)
