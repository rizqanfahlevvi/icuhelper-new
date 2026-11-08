import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initPatientContextSync } from './store/patientContextSync';

// Konteks pasien: ganti/tutup pasien tanpa kebocoran data + simpan otomatis ke pasien aktif.
initPatientContextSync();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
