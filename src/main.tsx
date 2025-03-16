
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/metaService.ts' // Importer metaService pour l'initialisation

createRoot(document.getElementById("root")!).render(<App />);
