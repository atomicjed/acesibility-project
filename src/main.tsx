import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from "./app/router";
import {AccessibilityProvider} from "./app/lib/context/accessibility.context.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <Router />
    </AccessibilityProvider>
  </React.StrictMode>,
)
