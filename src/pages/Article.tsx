
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";
import { useTelegramArticles } from "@/hooks/useTelegramArticles";
import { TelegramArticle } from "@/services/telegramService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExtraArticles from "@/components/ExtraArticles";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import ArticleLoading from "@/components/article/ArticleLoading";
import ArticleNotFound from "@/components/article/ArticleNotFound";
import { decodeHtmlTitle, getArticleSlug, getFeaturedImageUrl } from "@/utils/articleUtils";

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
  const { data: wpArticles } = useWordpressArticles();
  const { data: telegramArticles } = useTelegramArticles();
  const [articleId, setArticleId] = useState<number | null>(null);
  const [articleSource, setArticleSource] = useState<"wordpress" | "telegram" | null>(null);

  // Combine articles from both sources
  const allArticles = [
    ...(wpArticles || []), 
    ...(telegramArticles?.map(article => {
      return {
        ...article,
        source: "telegram" as const
      };
    }) || [])
  ];

  useEffect(() => {
    if (!id && slug && allArticles) {
      // Try to find article by slug
      const foundArticle = allArticles.find(article => {
        let articleTitle = "";
        let articleSlug = "";
        
        if ('title' in article && typeof article.title === 'object' && article.title.rendered) {
          // WordPress article
          articleTitle = decodeHtmlTitle(article.title.rendered);
          articleSlug = getArticleSlug(article);
        } else if ('title' in article && typeof article.title === 'string') {
          // Telegram article
          articleTitle = article.title;
          articleSlug = articleTitle
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
        }
        
        return slug === articleSlug || 
               slug.includes(articleSlug) || 
               articleSlug.includes(slug);
      });
      
      if (foundArticle) {
        setArticleId(foundArticle.id);
        // Determine source
        if ('source' in foundArticle && foundArticle.source === 'telegram') {
          setArticleSource("telegram");
        } else {
          setArticleSource("wordpress");
        }
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
  }, [id, slug, wpArticles, telegramArticles, allArticles]);

  // Fetch WordPress article if needed
  const { 
    data: wpArticle, 
    isLoading: isLoadingWP 
  } = useQuery<WordPressArticle>({
    queryKey: ["article", articleId, "wordpress"],
    queryFn: async () => {
      if (!articleId || articleSource !== "wordpress") throw new Error("No WordPress article ID found");
      
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
                    (!telegramArticle && articleSource === "telegram");

  // Determine the article to display
  const article = articleSource === "wordpress" ? wpArticle : telegramArticle;

  useEffect(() => {
    if (article && articleSource === "wordpress") {
      const decodedTitle = decodeHtmlTitle((article as WordPressArticle).title.rendered);
      const articleSlug = getArticleSlug(article as WordPressArticle);
      
      if (id && !location.pathname.includes(articleSlug)) {
        navigate(`/article/${articleSlug}`, { replace: true });
        return;
      }
      
      if (id && slug) {
        navigate(`/article/${articleSlug}`, { replace: true });
        return;
      }
    } else if (article && articleSource === "telegram") {
      const telegramSlug = (article as TelegramArticle).title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      if (id && !location.pathname.includes(telegramSlug)) {
        navigate(`/article/${telegramSlug}`, { replace: true });
        return;
      }
      
      if (id && slug) {
        navigate(`/article/${telegramSlug}`, { replace: true });
        return;
      }
    }
  }, [article, id, slug, location.pathname, navigate, articleSource]);

  if (isLoading) {
    return <ArticleLoading />;
  }

  if (!article && !isLoading) {
    return <ArticleNotFound />;
  }

  if (!article) return null;

  // Handle different article types
  let title = "";
  let content = "";
  let featuredImageUrl = "";
  let description = "";
  let publishedDate = "";

  if (articleSource === "wordpress") {
    const wpArticleData = article as WordPressArticle;
    title = decodeHtmlTitle(wpArticleData.title.rendered);
    content = wpArticleData.content.rendered;
    featuredImageUrl = getFeaturedImageUrl(wpArticleData);
    description = decodeHtmlTitle(wpArticleData.excerpt.rendered);
    publishedDate = wpArticleData.date;
  } else {
    const telegramArticleData = article as TelegramArticle;
    title = telegramArticleData.title;
    content = telegramArticleData.content;
    featuredImageUrl = telegramArticleData.featuredImage || '/GOWERA__3_-removebg-preview.png';
    description = telegramArticleData.excerpt;
    publishedDate = telegramArticleData.date;
  }

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
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
      
      <Header />
      
      <ArticleHero 
        title={title} 
        featuredImageUrl={featuredImageUrl}
        description={description}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {articleSource === "wordpress" ? (
            <ArticleContent article={article as WordPressArticle} />
          ) : (
            <div className="lg:col-span-8">
              <div className="prose prose-lg max-w-none mb-12 dark:prose-invert">
                {content.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              
              <div className="bg-secondary/50 dark:bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-foreground mb-6">À propos de l'article</h2>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="mt-1 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Publié le {new Date(publishedDate).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Source: <span className="text-primary">Telegram Bot</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <ArticleSidebar />
        </div>
      </div>

      <ExtraArticles />
      <Footer />
    </div>
  );
};

export default Article;
