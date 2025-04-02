
import { useMultiSourceArticles, sources, WordPressArticle } from "@/hooks/useMultiSourceArticles";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getArticleSlug } from "@/utils/articleUtils";

const Actualites = () => {
  const results = useMultiSourceArticles();

  const isLoading = results.some((result) => result.isLoading);
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
        
        {sources.map((source, sourceIndex) => (
          <div key={source.id} className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">{source.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(results[sourceIndex].data as WordPressArticle[])?.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${getArticleSlug(article)}`}
                  className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300"
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
