
import { Helmet } from "react-helmet";

interface ArticleMetaTagsProps {
  title: string;
  description: string;
  imageUrl: string;
  siteName?: string;
}

const ArticleMetaTags = ({ 
  title, 
  description, 
  imageUrl,
  siteName = "GOMA WEBRADIO"
}: ArticleMetaTagsProps) => {
  // URL absolue pour le partage
  const absoluteUrl = window.location.origin + window.location.pathname;
  
  // URL absolue pour l'image
  const absoluteImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : window.location.origin + imageUrl;

  return (
    <Helmet>
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={absoluteUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={absoluteImageUrl} />
    </Helmet>
  );
};

export default ArticleMetaTags;
