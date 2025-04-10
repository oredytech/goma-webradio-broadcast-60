
import { Helmet } from "react-helmet-async";
import { WordPressArticle } from "@/hooks/useWordpressArticles";
import { TelegramArticle } from "@/services/telegramService";
import { decodeHtmlTitle, getFeaturedImageUrl } from "@/utils/articleUtils";
import { ArticleSource } from "@/hooks/useArticleFinder";

interface ArticleMetaTagsProps {
  article: WordPressArticle | TelegramArticle;
  articleSource: ArticleSource;
}

const ArticleMetaTags = ({ article, articleSource }: ArticleMetaTagsProps) => {
  if (!article) return null;

  // Handle different article types
  let title = "";
  let description = "";
  let featuredImageUrl = "";
  let publishedDate = "";

  if (articleSource === "wordpress") {
    const wpArticle = article as WordPressArticle;
    title = decodeHtmlTitle(wpArticle.title.rendered);
    description = decodeHtmlTitle(wpArticle.excerpt.rendered);
    featuredImageUrl = getFeaturedImageUrl(wpArticle);
    publishedDate = wpArticle.date;
  } else {
    const telegramArticle = article as TelegramArticle;
    title = telegramArticle.title;
    description = telegramArticle.excerpt;
    featuredImageUrl = telegramArticle.featuredImage || '/GOWERA__3_-removebg-preview.png';
    publishedDate = telegramArticle.date;
  }

  const currentUrl = window.location.href;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      <meta property="og:type" content="article" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={featuredImageUrl} />
      <meta property="og:site_name" content="GOMA WEBRADIO" />
      <meta property="og:locale" content="fr_FR" />
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={featuredImageUrl} />
    </Helmet>
  );
};

export default ArticleMetaTags;
