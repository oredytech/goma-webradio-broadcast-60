
/// <reference types="vite/client" />

interface MetaServiceInterface {
  updateMetaTags: (metadata: import("./utils/metaService").MetaData) => void;
  resetMetaTags: () => void;
  ensureMetaTags: () => void;
}

interface Window {
  metaService?: MetaServiceInterface;
  initMetaTags?: () => void;
}
