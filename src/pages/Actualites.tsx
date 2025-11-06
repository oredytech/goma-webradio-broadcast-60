
import { useAllArticles } from "@/hooks/useAllArticles";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getArticleSlug, getTelegramArticleSlug } from "@/utils/articleUtils";
import { usePageSEO } from "@/hooks/useSEO";

const Actualites = () => {
  const { articles, isLoading, isError } = useAllArticles();

  // Setup SEO for the page
  usePageSEO(
    "Actualités - GOMA WEBRADIO",
    "Toutes les dernières actualités de GOMA WEBRADIO",
    "/GOWERA__3_-removebg-preview.png"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-red-500">Une erreur est survenue lors du chargement des articles.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-12">Actualités</h1>
        
        {/* All Articles Mixed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={article.source === 'telegram' 
                ? `/telegram-${article.sourceId}` 
                : `/${getArticleSlug({ 
                    id: article.sourceId as number, 
                    title: { rendered: article.title },
                    _embedded: article._embedded 
                  })}`
              }
              className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-primary/10"
            >
              {article.featuredImage && (
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${article.featuredImage})`
                  }}
                />
              )}
              <div className="p-4">
                <h3 
                  className="text-lg font-semibold text-foreground mb-2"
                  dangerouslySetInnerHTML={{ __html: article.title }}
                />
                <div 
                  className="text-foreground/70 text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: article.excerpt }}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Actualites;
