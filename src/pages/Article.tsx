
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExtraArticles from "@/components/ExtraArticles";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import ArticleLoading from "@/components/article/ArticleLoading";
import ArticleNotFound from "@/components/article/ArticleNotFound";
import { decodeHtmlTitle, getArticleSlug, getFeaturedImageUrl } from "@/utils/articleUtils";
import { useArticleSEO } from "@/hooks/useSEO";

interface ArticleProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const Article = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: ArticleProps) => {
  const { id, slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: allArticles } = useWordpressArticles();
  const [articleId, setArticleId] = useState<number | null>(null);

  // Find article ID if we only have slug
  useEffect(() => {
    if (!id && slug && allArticles) {
      const foundArticle = allArticles.find(article => {
        const decodedTitle = decodeHtmlTitle(article.title.rendered);
        const articleSlug = getArticleSlug(article);
        
        return slug === articleSlug || 
               slug.includes(articleSlug) || 
               articleSlug.includes(slug);
      });
      
      if (foundArticle) {
        setArticleId(foundArticle.id);
      }
    } else if (id) {
      // If we have an ID, use it directly
      setArticleId(parseInt(id));
    }
  }, [id, slug, allArticles]);

  const { data: article, isLoading } = useQuery<WordPressArticle>({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (!articleId) throw new Error("No article ID found");
      
      const response = await fetch(
        `https://totalementactus.net/wp-json/wp/v2/posts/${articleId}?_embed`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!articleId,
  });

  useEffect(() => {
    if (article) {
      const decodedTitle = decodeHtmlTitle(article.title.rendered);
      const articleSlug = getArticleSlug(article);
      
      // Si l'URL contient un ID mais pas le slug moderne, rediriger
      if (id && !location.pathname.includes(articleSlug)) {
        navigate(`/article/${articleSlug}`, { replace: true });
        return;
      }
      
      // Si l'URL utilise le vieux format avec ID/slug, rediriger vers le nouveau format
      if (id && slug) {
        navigate(`/article/${articleSlug}`, { replace: true });
        return;
      }
    }
  }, [article, id, slug, location.pathname, navigate]);

  // Configurer le SEO pour l'article quand il est chargé
  useEffect(() => {
    if (article) {
      const featuredImageUrl = getFeaturedImageUrl(article);
      const decodedTitle = decodeHtmlTitle(article.title.rendered);
      const description = decodeHtmlTitle(article.excerpt.rendered);
      const publishedDate = article.date;
      
      useArticleSEO(decodedTitle, description, featuredImageUrl, publishedDate);
    }
  }, [article]);

  if (isLoading || (!article && articleId)) {
    return <ArticleLoading />;
  }

  if (!article && !isLoading) {
    return <ArticleNotFound />;
  }

  // For TS safety, early return if article is undefined
  if (!article) return null;

  const featuredImageUrl = getFeaturedImageUrl(article);
  const decodedTitle = decodeHtmlTitle(article.title.rendered);
  const description = decodeHtmlTitle(article.excerpt.rendered);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      
      <ArticleHero 
        title={decodedTitle} 
        featuredImageUrl={featuredImageUrl}
        description={description}
      />

      {/* Content Section with Right Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ArticleContent article={article} />
          <ArticleSidebar />
        </div>
      </div>

      <ExtraArticles />
      <Footer />
    </div>
  );
};

export default Article;
