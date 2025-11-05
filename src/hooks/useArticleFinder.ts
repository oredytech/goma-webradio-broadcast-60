
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMultiSourceArticles, WordPressArticle } from "@/hooks/useMultiSourceArticles";
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
  const wpResults = useMultiSourceArticles();
  const { data: telegramArticles, isLoading: telegramArticlesLoading } = useTelegramArticles();
  const [articleId, setArticleId] = useState<number | null>(null);
  const [articleSource, setArticleSource] = useState<ArticleSource>(null);
  const [wpSourceUrl, setWpSourceUrl] = useState<string>("");

  // Check if any WordPress source is loading
  const wpArticlesLoading = wpResults.some(result => result.isLoading);

  // Combine all WordPress articles from all sources
  const wpArticles: WordPressArticle[] = [];
  wpResults.forEach((result, index) => {
    if (result.data) {
      wpArticles.push(...(result.data as WordPressArticle[]));
    }
  });

  // Transform Telegram articles to include source property
  const transformedTelegramArticles = telegramArticles?.map(article => ({
    ...article,
    source: "telegram" as const
  })) || [];

  // Combine all articles
  const allArticles = [
    ...wpArticles, 
    ...transformedTelegramArticles
  ];

  // First try to find article by slug (more flexible approach)
  useEffect(() => {
    if (!id && slug && allArticles.length > 0 && !wpArticlesLoading && !telegramArticlesLoading) {
      console.log("Searching for article by slug:", slug);
      
      // Check for Telegram article format: telegram-ID
      if (slug.startsWith('telegram-')) {
        const telegramId = parseInt(slug.replace('telegram-', ''));
        const telegramArticle = telegramArticles?.find(article => article.id === telegramId);
        
        if (telegramArticle) {
          console.log("Found Telegram article by ID:", telegramArticle);
          setArticleId(telegramId);
          setArticleSource("telegram");
          return;
        }
      }
      
      // Extract ID from slug for WordPress articles (format: title-123)
      const slugParts = slug.split('-');
      const lastPart = slugParts[slugParts.length - 1];
      const possibleId = parseInt(lastPart);
      
      if (!isNaN(possibleId)) {
        // Try to find WordPress article by ID (most reliable)
        const wpArticle = wpArticles.find(article => article.id === possibleId);
        
        if (wpArticle) {
          console.log("Found WordPress article by ID:", wpArticle);
          setArticleId(possibleId);
          setArticleSource("wordpress");
          
          // Store the source URL for fetching
          wpResults.forEach((result, index) => {
            if (result.data && (result.data as WordPressArticle[]).some(a => a.id === possibleId)) {
              const sources = [
                { id: "totalementactus", url: "https://totalementactus.net/wp-json/wp/v2/posts" },
                { id: "gomawebradio", url: "https://gomawebradio.com/news/wp-json/wp/v2/posts" }
              ];
              setWpSourceUrl(sources[index].url);
            }
          });
          return;
        }
      }
      
      // Fallback: Try to find article by slug matching
      const foundArticle = allArticles.find(article => {
        if ('source' in article && article.source === "telegram") {
          const telegramArticle = article as (TelegramArticle & { source: "telegram" });
          const articleSlug = getTelegramArticleSlug(telegramArticle);
          return areSlugsRelated(slug, articleSlug);
        } else {
          const wpArticle = article as WordPressArticle;
          const articleSlug = getArticleSlug(wpArticle);
          return areSlugsRelated(slug, articleSlug);
        }
      });
      
      if (foundArticle) {
        console.log("Found article by slug matching:", foundArticle);
        setArticleId(foundArticle.id);
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
    queryKey: ["article", articleId, "wordpress", wpSourceUrl],
    queryFn: async () => {
      if (!articleId || articleSource !== "wordpress") throw new Error("No WordPress article ID found");
      
      // Try to fetch from the correct source
      const sources = [
        { id: "totalementactus", url: "https://totalementactus.net/wp-json/wp/v2/posts" },
        { id: "gomawebradio", url: "https://gomawebradio.com/news/wp-json/wp/v2/posts" }
      ];
      
      // Try each source
      for (const source of sources) {
        try {
          console.log(`Fetching WordPress article ${articleId} from ${source.id}`);
          const response = await fetch(`${source.url}/${articleId}?_embed`);
          if (response.ok) {
            return response.json();
          }
        } catch (error) {
          console.log(`Failed to fetch from ${source.id}:`, error);
        }
      }
      
      throw new Error("Article not found in any source");
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
