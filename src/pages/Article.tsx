import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { WordPressArticle } from "@/hooks/useWordpressArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExtraArticles from "@/components/ExtraArticles";
import ArticleMetaTags from "@/components/ArticleMetaTags";
import ArticleHero from "@/components/ArticleHero";
import ArticleContent from "@/components/ArticleContent";
import ArticleSidebar from "@/components/ArticleSidebar";
import ArticleSocialActions from "@/components/ArticleSocialActions";
import ArticleCommentForm from "@/components/ArticleCommentForm";
import ArticleCommentsList from "@/components/ArticleCommentsList";
import { createSlug, extractMetaDescription, decodeHtmlTitle } from "@/utils/articleUtils";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const Article = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: ArticleProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [commentsUpdated, setCommentsUpdated] = useState(false);
  const [articleNotFound, setArticleNotFound] = useState(false);

  const { data: articles, isLoading: articlesLoading, error: articlesError } = useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: async () => {
      try {
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = encodeURIComponent("https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30");
        
        const response = await fetch(`${proxyUrl}${apiUrl}`);
        
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
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
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const apiUrl = encodeURIComponent(`https://totalementactus.net/wp-json/wp/v2/posts/${article.id}?_embed`);
        
        const response = await fetch(`${proxyUrl}${apiUrl}`);
        
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
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

  if (articlesError) {
    console.error("Erreur lors du chargement des articles:", articlesError);
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Erreur de chargement</h1>
          <p className="text-lg text-gray-300">Impossible de charger les articles. Veuillez réessayer ultérieurement.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-8"
          >
            Réessayer
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (articleNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article non trouvé</h1>
          <p className="text-lg text-gray-300">L'article que vous recherchez n'existe pas ou a été déplacé.</p>
          <Button 
            onClick={() => navigate("/actualites")}
            className="mt-8"
          >
            Voir tous les articles
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <div className="text-xl text-white">Chargement de l'article...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!fullArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article en cours de chargement</h1>
          <p className="text-lg text-gray-300">Veuillez patienter pendant que nous récupérons le contenu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const featuredImageUrl = fullArticle._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/placeholder.svg';
  const decodedTitle = decodeHtmlTitle(fullArticle.title.rendered);
  const metaDescription = extractMetaDescription(fullArticle.excerpt.rendered);
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <ArticleMetaTags 
        title={decodedTitle}
        description={metaDescription}
        imageUrl={featuredImageUrl}
        url={currentUrl}
      />
      
      <Header />
      <ArticleHero title={decodedTitle} imageUrl={featuredImageUrl} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ArticleContent content={fullArticle.content.rendered} articleId={fullArticle.id} />
            
            <div className="my-8">
              <ArticleSocialActions articleId={fullArticle.id} />
            </div>

            <div className="mt-12">
              <ArticleCommentForm 
                articleId={fullArticle.id} 
                onCommentAdded={handleCommentAdded}
              />
              <ArticleCommentsList 
                articleId={fullArticle.id}
                commentsUpdated={commentsUpdated}
              />
            </div>
          </div>
          <ArticleSidebar />
        </div>
      </div>

      <ExtraArticles />
      <Footer />
    </div>
  );
};

export default Article;
