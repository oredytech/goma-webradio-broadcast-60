import { Helmet } from "react-helmet-async";
import { WordPressArticle } from "@/hooks/useWordpressArticles";
import { decodeHtmlTitle, getFeaturedImageUrl } from "@/utils/articleUtils";

interface ArticleMetaTagsProps {
  article: WordPressArticle;
  articleSource?: "wordpress";
}

const ArticleMetaTags = ({ article }: ArticleMetaTagsProps) => {
  if (!article) return null;

  const title = decodeHtmlTitle(article.title.rendered);
  const description = decodeHtmlTitle(article.excerpt.rendered);
  const featuredImageUrl = getFeaturedImageUrl(article);
  const publishedDate = article.date;

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
