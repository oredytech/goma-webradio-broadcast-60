import { useMultiSourceArticles, sources, WordPressArticle } from "@/hooks/useMultiSourceArticles";
import { useTelegramArticles } from "@/hooks/useTelegramArticles";
import { TelegramArticle } from "@/services/telegramService";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getArticleSlug, getTelegramArticleSlug } from "@/utils/articleUtils";

const Actualites = () => {
  const results = useMultiSourceArticles();
  const { data: telegramArticles, isLoading: isLoadingTelegram } = useTelegramArticles();

  const isLoading = results.some((result) => result.isLoading) || isLoadingTelegram;
  const isError = results.some((result) => result.isError);

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
        
        {/* Telegram Articles */}
        {telegramArticles && telegramArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Articles Telegram</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {telegramArticles.map((article) => (
                <Link
                  key={`telegram-${article.id}`}
                  to={`/article/${getTelegramArticleSlug(article)}`}
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
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {article.title}
                    </h3>
                    <div className="text-foreground/70 text-sm line-clamp-3">
                      {article.excerpt}
                    </div>
                    <div className="mt-2 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
                        Telegram
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {new Date(article.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* WordPress Articles */}
        {sources.map((source, sourceIndex) => (
          <div key={source.id} className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">{source.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(results[sourceIndex].data as WordPressArticle[])?.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${getArticleSlug(article)}`}
                  className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-primary/10"
                >
                  {article._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${article._embedded["wp:featuredmedia"][0].source_url})`
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h3 
                      className="text-lg font-semibold text-foreground mb-2"
                      dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                    />
                    <div 
                      className="text-foreground/70 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
                    />
                    <div className="mt-2 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
                        WordPress
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {new Date(article.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Actualites;
