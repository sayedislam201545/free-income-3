
window.addEventListener('error', (e) => {
  document.body.innerHTML += '<div style="color:red; background:black; padding:20px; z-index:999999; position:fixed; top:0; left:0; width:100%;">' + e.error.message + '<br/>' + e.error.stack + '</div>';
});
window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML += '<div style="color:red; background:black; padding:20px; z-index:999999; position:fixed; top:0; left:0; width:100%;">Unhandled Promise Rejection: ' + e.reason + '</div>';
});
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './lib/i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
