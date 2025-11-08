import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";
import { 
  getArticleSlug, 
  areSlugsRelated,
} from "@/utils/articleUtils";

export type ArticleSource = "wordpress";

export function useArticleFinder() {
  const { id, slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: wpArticles, isLoading: wpArticlesLoading } = useWordpressArticles();
  const [articleId, setArticleId] = useState<number | null>(null);

  // Find article by slug
  useEffect(() => {
    if (!id && slug && wpArticles && wpArticles.length > 0 && !wpArticlesLoading) {
      console.log("Searching for article by slug:", slug);
      
      // Extract ID from slug (format: title-123)
      const slugParts = slug.split('-');
      const lastPart = slugParts[slugParts.length - 1];
      const possibleId = parseInt(lastPart);
      
      if (!isNaN(possibleId)) {
        const wpArticle = wpArticles.find(article => article.id === possibleId);
        
        if (wpArticle) {
          console.log("Found WordPress article by ID:", wpArticle);
          setArticleId(possibleId);
          return;
        }
      }
      
      // Fallback: Find by slug matching
      const foundArticle = wpArticles.find(article => {
        const articleSlug = getArticleSlug(article);
        return areSlugsRelated(slug, articleSlug);
      });
      
      if (foundArticle) {
        console.log("Found article by slug matching:", foundArticle);
        setArticleId(foundArticle.id);
      } else {
        console.log("No article found for slug:", slug);
      }
    } else if (id) {
      setArticleId(parseInt(id));
    }
  }, [id, slug, wpArticles, wpArticlesLoading]);

  // Fetch WordPress article
  const { 
    data: wpArticle, 
    isLoading: isLoadingWP 
  } = useQuery({
    queryKey: ["article", articleId, "wordpress"],
    queryFn: async () => {
      if (!articleId) throw new Error("No WordPress article ID found");
      
      console.log(`Fetching WordPress article ${articleId}`);
      const response = await fetch(`https://gomawebradio.com/news/wp-json/wp/v2/posts/${articleId}?_embed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch article");
      return response.json();
    },
    enabled: !!articleId,
  });

  const isLoading = isLoadingWP || wpArticlesLoading;
  const article = wpArticle;
  const articleSource: ArticleSource = "wordpress";

  // Handle redirects to canonical URL if needed
  useEffect(() => {
    if (!isLoading && article) {
      const articleSlug = getArticleSlug(article);
      
      if (id && !location.pathname.includes(articleSlug)) {
        navigate(`/${articleSlug}`, { replace: true });
        return;
      }
      
      if (id && slug && slug !== articleSlug) {
        navigate(`/${articleSlug}`, { replace: true });
        return;
      }
    }
  }, [article, id, slug, location.pathname, navigate, isLoading]);

  return {
    article,
    articleSource,
    isLoading
  };
}
