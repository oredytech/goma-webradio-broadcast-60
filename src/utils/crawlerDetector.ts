
/**
 * Liste des user agents communs pour les bots de réseaux sociaux
 */
const SOCIAL_BOTS = [
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'whatsapp',
  'linkedinbot',
  'pinterest',
  'slackbot',
  'telegram',
  'discordbot',
  'googlebot',
  'bingbot',
  'yandexbot',
  'redditbot',
  'msnbot',
  'baiduspider',
  'duckduckbot',
];

/**
 * Vérifie si le user agent correspond à un bot connu
 */
export const isSocialMediaBot = (): boolean => {
  // Récupérer le user agent
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Vérifier si c'est un bot connu
  return SOCIAL_BOTS.some(bot => userAgent.includes(bot.toLowerCase()));
};

/**
 * Précharge les données d'un article pour les bots
 * Cette fonction aide à améliorer le SEO en s'assurant que les métadonnées 
 * sont disponibles avant que les crawlers ne les cherchent
 */
export const prefetchArticleData = async (articleId: number): Promise<void> => {
  if (!isSocialMediaBot()) return;
  
  try {
    // Précharger les données de l'article
    const response = await fetch(
      `https://totalementactus.net/wp-json/wp/v2/posts/${articleId}?_embed`
    );
    
    if (!response.ok) {
      console.error('Erreur lors du préchargement des données de l\'article');
      return;
    }
    
    const article = await response.json();
    
    // Ajouter un délai pour s'assurer que les métadonnées sont bien appliquées
    setTimeout(() => {
      console.log('Article préchargé pour les bots:', article.title.rendered);
    }, 500);
  } catch (error) {
    console.error('Erreur lors du préchargement des données de l\'article:', error);
  }
};

/**
 * Optimisations spécifiques pour les crawlers
 */
export const setupCrawlerOptimizations = (): void => {
  if (isSocialMediaBot()) {
    console.log('Bot détecté, application des optimisations...');
    
    // Ajouter une meta tag spécifique pour indiquer que la page est optimisée pour les bots
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'max-image-preview:large';
    document.head.appendChild(meta);
    
    // Désactiver temporairement les transitions pour accélérer le rendu
    document.documentElement.classList.add('bot-view');
    
    // Forcer un rendu plus rapide
    window.setTimeout(() => {
      const event = new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
    }, 100);
  }
};

// Exécuter automatiquement les optimisations pour les crawlers
if (typeof window !== 'undefined') {
  setupCrawlerOptimizations();
}
