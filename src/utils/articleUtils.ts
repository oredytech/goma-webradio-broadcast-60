
// Fonction pour créer un slug à partir d'un titre
export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Extraire une description pour les meta tags Open Graph
export const extractMetaDescription = (htmlContent: string): string => {
  // Créer un élément div temporaire
  const div = document.createElement('div');
  div.innerHTML = htmlContent;
  
  // Obtenir le texte brut et supprimer les espaces inutiles
  let description = div.textContent?.trim() || "Lisez cet article sur notre site";
  
  // Limiter à 160 caractères pour les meta descriptions
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return description;
};

// Decoder le titre HTML
export const decodeHtmlTitle = (htmlTitle: string): string => {
  return new DOMParser().parseFromString(htmlTitle, 'text/html').body.textContent || htmlTitle;
};
