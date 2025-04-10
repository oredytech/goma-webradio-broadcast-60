
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
import { 
  decodeHtmlTitle, 
  getArticleSlug, 
  getFeaturedImageUrl, 
  getTelegramArticleSlug 
} from "@/utils/articleUtils";

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
  const { data: wpArticles, isLoading: wpArticlesLoading } = useWordpressArticles();
  const { data: telegramArticles, isLoading: telegramArticlesLoading } = useTelegramArticles();
  const [articleId, setArticleId] = useState<number | null>(null);
  const [articleSource, setArticleSource] = useState<"wordpress" | "telegram" | null>(null);

  // Transform Telegram articles to include source property
  const transformedTelegramArticles = telegramArticles?.map(article => ({
    ...article,
    source: "telegram" as const
  })) || [];

  // Keep WordPress articles separate 
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
          
          // More flexible matching
          const normalizedSlug = slug.toLowerCase().replace(/-/g, '').trim();
          const normalizedArticleSlug = articleSlug.toLowerCase().replace(/-/g, '').trim();
          
          return normalizedSlug.includes(normalizedArticleSlug) || 
                 normalizedArticleSlug.includes(normalizedSlug) ||
                 normalizedSlug === normalizedArticleSlug;
        } else {
          // WordPress article
          const wpArticle = article as WordPressArticle;
          const articleTitle = decodeHtmlTitle(wpArticle.title.rendered).toLowerCase();
          const articleSlug = getArticleSlug(wpArticle);
          
          // Normalize slugs for more flexible matching
          const normalizedSlug = slug.toLowerCase().replace(/-/g, '').trim();
          const normalizedArticleSlug = articleSlug.toLowerCase().replace(/-/g, '').trim();
          
          // Check if the passed slug includes the article title words
          return normalizedSlug.includes(normalizedArticleSlug) || 
                 normalizedArticleSlug.includes(normalizedSlug) ||
                 articleTitle.includes(normalizedSlug.replace(/[^a-zA-Z0-9]/g, ' ')) ||
                 normalizedSlug === normalizedArticleSlug;
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

  // Redirect to canonical URL if needed
  useEffect(() => {
    if (!isLoading && article && articleSource === "wordpress") {
      const decodedTitle = decodeHtmlTitle((article as WordPressArticle).title.rendered);
      const articleSlug = getArticleSlug(article as WordPressArticle);
      
      if (id && !location.pathname.includes(articleSlug)) {
        navigate(`/article/${articleSlug}`, { replace: true });
        return;
      }
      
      if (id && slug && slug !== articleSlug) {
        navigate(`/article/${articleSlug}`, { replace: true });
        return;
      }
    } else if (!isLoading && article && articleSource === "telegram") {
      const telegramSlug = getTelegramArticleSlug(article as TelegramArticle);
      
      if (id && !location.pathname.includes(telegramSlug)) {
        navigate(`/article/${telegramSlug}`, { replace: true });
        return;
      }
      
      if (id && slug && slug !== telegramSlug) {
        navigate(`/article/${telegramSlug}`, { replace: true });
        return;
      }
    }
  }, [article, id, slug, location.pathname, navigate, articleSource, isLoading]);

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
