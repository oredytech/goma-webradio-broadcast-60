
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";
import { useTelegramArticles } from "@/hooks/useTelegramArticles";
import { TelegramArticle } from "@/services/telegram";
import { 
  decodeHtmlTitle, 
  getArticleSlug, 
  getTelegramArticleSlug, 
  areSlugsRelated,
  normalizeSlug
} from "@/utils/articleUtils";

export type ArticleSource = "wordpress" | "telegram" | null;

/**
 * Custom hook to find an article based on URL parameters
 */
export function useArticleFinder() {
  const { id, slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: wpArticles, isLoading: wpArticlesLoading } = useWordpressArticles();
  const { data: telegramArticles, isLoading: telegramArticlesLoading } = useTelegramArticles();
  const [articleId, setArticleId] = useState<number | null>(null);
  const [articleSource, setArticleSource] = useState<ArticleSource>(null);

  // Transform Telegram articles to include source property
  const transformedTelegramArticles = telegramArticles?.map(article => ({
    ...article,
    source: "telegram" as const
  })) || [];

  // Combine all articles
  const allArticles = [
    ...(wpArticles || []), 
    ...transformedTelegramArticles
  ];

  // First try to find article by slug (more flexible approach)
  useEffect(() => {
    if (!id && slug && allArticles.length > 0 && !wpArticlesLoading && !telegramArticlesLoading) {
      console.log("Searching for article by slug:", slug);
      
      // Try to find article by slug with more flexible matching
      const foundArticle = allArticles.find(article => {
        if ('source' in article && article.source === "telegram") {
          // Telegram article
          const telegramArticle = article as (TelegramArticle & { source: "telegram" });
          const articleSlug = getTelegramArticleSlug(telegramArticle);
          
          return areSlugsRelated(slug, articleSlug);
        } else {
          // WordPress article
          const wpArticle = article as WordPressArticle;
          const articleTitle = decodeHtmlTitle(wpArticle.title.rendered).toLowerCase();
          const articleSlug = getArticleSlug(wpArticle);
          
          // Check if the passed slug includes the article title words
          return areSlugsRelated(slug, articleSlug) || 
                 articleTitle.includes(normalizeSlug(slug).replace(/[^a-zA-Z0-9]/g, ' '));
        }
      });
      
      if (foundArticle) {
        console.log("Found article by slug:", foundArticle);
        setArticleId(foundArticle.id);
        // Determine source
        if ('source' in foundArticle && foundArticle.source === 'telegram') {
          setArticleSource("telegram");
        } else {
          setArticleSource("wordpress");
        }
      } else {
        console.log("No article found for slug:", slug);
      }
    } else if (id) {
      setArticleId(parseInt(id));
      // Try to determine source from ID
      const telegramArticle = telegramArticles?.find(article => article.id === parseInt(id));
      if (telegramArticle) {
        setArticleSource("telegram");
      } else {
        setArticleSource("wordpress");
      }
    }
  }, [id, slug, wpArticles, telegramArticles, allArticles, wpArticlesLoading, telegramArticlesLoading]);

  // Fetch WordPress article if needed
  const { 
    data: wpArticle, 
    isLoading: isLoadingWP 
  } = useQuery({
    queryKey: ["article", articleId, "wordpress"],
    queryFn: async () => {
      if (!articleId || articleSource !== "wordpress") throw new Error("No WordPress article ID found");
      
      console.log("Fetching WordPress article with ID:", articleId);
      const response = await fetch(
        `https://totalementactus.net/wp-json/wp/v2/posts/${articleId}?_embed`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!articleId && articleSource === "wordpress",
  });

  // Find Telegram article from cache
  const telegramArticle = articleSource === "telegram" && articleId 
    ? telegramArticles?.find(article => article.id === articleId) || null
    : null;

  // Combined loading state
  const isLoading = (articleSource === "wordpress" && isLoadingWP) || 
                    (!telegramArticle && articleSource === "telegram") ||
                    wpArticlesLoading || telegramArticlesLoading;

  // Determine the article to display
  const article = articleSource === "wordpress" ? wpArticle : telegramArticle;

  // Handle redirects to canonical URL if needed
  useEffect(() => {
    if (!isLoading && article && articleSource === "wordpress") {
      const articleSlug = getArticleSlug(article as WordPressArticle);
      
      if (id && !location.pathname.includes(articleSlug)) {
        navigate(`/news/${articleSlug}`, { replace: true });
        return;
      }
      
      if (id && slug && slug !== articleSlug) {
        navigate(`/news/${articleSlug}`, { replace: true });
        return;
      }
    } else if (!isLoading && article && articleSource === "telegram") {
      const telegramSlug = getTelegramArticleSlug(article as TelegramArticle);
      
      if (id && !location.pathname.includes(telegramSlug)) {
        navigate(`/news/${telegramSlug}`, { replace: true });
        return;
      }
      
      if (id && slug && slug !== telegramSlug) {
        navigate(`/news/${telegramSlug}`, { replace: true });
        return;
      }
    }
  }, [article, id, slug, location.pathname, navigate, articleSource, isLoading]);

  return {
    article,
    articleSource,
    isLoading
  };
}
