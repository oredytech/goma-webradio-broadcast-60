
import { Helmet } from 'react-helmet-async';

interface PodcastMetaTagsProps {
  title: string;
  description: string;
  imageUrl: string;
  currentUrl: string;
}

const PodcastMetaTags = ({ title, description, imageUrl, currentUrl }: PodcastMetaTagsProps) => {
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={stripHtml(description)} />
      
      <meta property="og:type" content="article" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={stripHtml(description)} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="GOMA WEBRADIO" />
      <meta property="og:locale" content="fr_FR" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={stripHtml(description)} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default PodcastMetaTags;
