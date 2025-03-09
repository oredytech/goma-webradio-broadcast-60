
import { Helmet } from "react-helmet";

interface ArticleMetaTagsProps {
  title: string;
  description: string;
  imageUrl: string;
  siteName?: string;
  url?: string;
}

const ArticleMetaTags = ({ 
  title, 
  description, 
  imageUrl,
  siteName = "GOMA WEBRADIO",
  url
}: ArticleMetaTagsProps) => {
  // URL absolue pour le partage
  const absoluteUrl = url || window.location.origin + window.location.pathname;
  
  // URL absolue pour l'image
  const absoluteImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : window.location.origin + imageUrl;

  // Nettoyage de la description (suppression des balises HTML)
  const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, "").trim();

  return (
    <Helmet>
      <title>{title} | {siteName}</title>
      <meta name="description" content={cleanDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={absoluteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={cleanDescription} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      
      {/* Autres métadonnées importantes */}
      <link rel="canonical" href={absoluteUrl} />
    </Helmet>
  );
};

export default ArticleMetaTags;
