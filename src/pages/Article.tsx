
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

  // Récupérer tous les articles pour trouver celui qui correspond au slug
  const { data: articles, isLoading: articlesLoading } = useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: async () => {
      const response = await fetch(
        "https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Trouver l'article qui correspond au slug
  const article = articles?.find(article => {
    const title = decodeHtmlTitle(article.title.rendered);
    return createSlug(title) === slug;
  });

  // Récupérer l'article par ID si on a trouvé une correspondance
  const { data: fullArticle, isLoading: articleLoading } = useQuery<WordPressArticle>({
    queryKey: ["article", article?.id],
    queryFn: async () => {
      if (!article?.id) throw new Error("Article not found");
      const response = await fetch(
        `https://totalementactus.net/wp-json/wp/v2/posts/${article.id}?_embed`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!article?.id,
  });

  // Redirection vers la page 404 si l'article n'est pas trouvé après le chargement
  useEffect(() => {
    if (!articlesLoading && !articleLoading && !fullArticle) {
      navigate("/404", { replace: true });
    }
  }, [articlesLoading, articleLoading, fullArticle, navigate]);

  const isLoading = articlesLoading || articleLoading;

  const handleCommentAdded = () => {
    setCommentsUpdated(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!fullArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black flex items-center justify-center">
        <div className="text-white">Article non trouvé</div>
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

      {/* Content Section with Right Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ArticleContent content={fullArticle.content.rendered} />
            
            {/* Article Social Actions */}
            <div className="my-8">
              <ArticleSocialActions articleId={fullArticle.id} />
            </div>

            {/* Comments Section */}
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
