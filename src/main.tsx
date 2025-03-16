
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/metaService.ts' // Importer metaService pour l'initialisation

// Force l'initialisation des meta tags dès que possible
if (typeof window !== 'undefined' && window.metaService) {
  window.metaService.ensureMetaTags();
}

createRoot(document.getElementById("root")!).render(<App />);
