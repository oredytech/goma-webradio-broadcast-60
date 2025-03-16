
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { WordPressArticle } from "@/hooks/useWordpressArticles";
import { createSlug, decodeHtmlTitle } from "@/utils/articleUtils";
import { Button } from "@/components/ui/button";
import ArticleLoading from "@/components/article/ArticleLoading";
import ArticleError from "@/components/article/ArticleError";
import ArticleNotFound from "@/components/article/ArticleNotFound";
import ArticleMainContent from "@/components/article/ArticleMainContent";

interface ArticleProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const Article = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: ArticleProps) => {
  const { slug } = useParams<{ slug: string }>();
  const [commentsUpdated, setCommentsUpdated] = useState(false);
  const [articleNotFound, setArticleNotFound] = useState(false);

  // Liste de proxies CORS à essayer dans l'ordre (synchronisée avec useWordpressArticles)
  const CORS_PROXIES = [
    "https://api.allorigins.win/raw?url=",
    "https://cors-anywhere.herokuapp.com/",
    "https://crossorigin.me/",
    "https://crosscors.shop/",
    "https://proxy.cors.sh/",
  ];

  const { data: articles, isLoading: articlesLoading, error: articlesError, refetch } = useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: async () => {
      try {
        const apiUrl = encodeURIComponent("https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30");
        
        // Essayer chaque proxy dans l'ordre jusqu'à ce qu'un fonctionne
        let response = null;
        let error = null;
        
        for (const proxy of CORS_PROXIES) {
          try {
            console.log(`Article page trying proxy: ${proxy}`);
            response = await fetch(`${proxy}${apiUrl}`);
            
            if (response.ok) {
              break; // Si la requête réussit, sortir de la boucle
            }
          } catch (err) {
            error = err;
            console.warn(`Article page proxy ${proxy} failed:`, err);
            // Continuer avec le prochain proxy
          }
        }
        
        // Si aucun proxy n'a fonctionné
        if (!response || !response.ok) {
          console.error("All proxies failed in article page");
          throw error || new Error("All proxies failed");
        }
        
        const data = await response.json();
        console.log("Articles récupérés avec succès:", data.length);
        return data;
      } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
        throw error;
      }
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const article = articles?.find(article => {
    const title = decodeHtmlTitle(article.title.rendered);
    return createSlug(title) === slug;
  });

  const { data: fullArticle, isLoading: articleLoading } = useQuery<WordPressArticle>({
    queryKey: ["article", article?.id],
    queryFn: async () => {
      if (!article?.id) throw new Error("Article not found");
      
      try {
        const apiUrl = encodeURIComponent(`https://totalementactus.net/wp-json/wp/v2/posts/${article.id}?_embed`);
        
        // Essayer chaque proxy dans l'ordre jusqu'à ce qu'un fonctionne
        let response = null;
        let error = null;
        
        for (const proxy of CORS_PROXIES) {
          try {
            response = await fetch(`${proxy}${apiUrl}`);
            
            if (response.ok) {
              break; // Si la requête réussit, sortir de la boucle
            }
          } catch (err) {
            error = err;
            // Continuer avec le prochain proxy
          }
        }
        
        // Si aucun proxy n'a fonctionné
        if (!response || !response.ok) {
          throw error || new Error("All proxies failed for full article");
        }
        
        return response.json();
      } catch (error) {
        console.error("Erreur lors de la récupération de l'article complet:", error);
        throw error;
      }
    },
    enabled: !!article?.id,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!articlesLoading && !articles?.length) {
      console.log("Aucun article n'a été trouvé");
      setArticleNotFound(true);
    } else if (!articlesLoading && articles?.length && slug) {
      const matchingArticle = articles.find(article => {
        const title = decodeHtmlTitle(article.title.rendered);
        return createSlug(title) === slug;
      });
      
      if (!matchingArticle) {
        console.log(`Aucun article ne correspond au slug: ${slug}`);
        setArticleNotFound(true);
      }
    }
  }, [articlesLoading, articles, slug]);

  const isLoading = articlesLoading || articleLoading;

  const handleCommentAdded = () => {
    setCommentsUpdated(prev => !prev);
  };

  const handleRetry = () => {
    refetch();
  };

  if (articlesError) {
    return <ArticleError onRetry={handleRetry} />;
  }

  if (articleNotFound) {
    return <ArticleNotFound />;
  }

  if (isLoading) {
    return <ArticleLoading />;
  }

  if (!fullArticle) {
    return <ArticleLoading message="Veuillez patienter pendant que nous récupérons le contenu..." />;
  }

  return (
    <ArticleMainContent 
      article={fullArticle}
      commentsUpdated={commentsUpdated}
      onCommentAdded={handleCommentAdded}
    />
  );
};

export default Article;
