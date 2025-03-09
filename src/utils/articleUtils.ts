
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
  const div = document.createElement('div');
  div.innerHTML = htmlContent;
  return div.textContent?.trim() || "Lisez cet article sur notre site";
};

// Decoder le titre HTML
export const decodeHtmlTitle = (htmlTitle: string): string => {
  return new DOMParser().parseFromString(htmlTitle, 'text/html').body.textContent || htmlTitle;
};
