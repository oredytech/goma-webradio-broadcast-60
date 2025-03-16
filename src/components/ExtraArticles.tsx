
import { useWordpressArticles } from "@/hooks/useWordpressArticles";
import { Link } from "react-router-dom";
import ArticleSocialActions from "./ArticleSocialActions";
import { createSlug, decodeHtmlTitle } from "@/utils/articleUtils";
import { Loader2 } from "lucide-react";

const ExtraArticles = () => {
  const { data: articles, isLoading, error } = useWordpressArticles();

  if (isLoading) {
    return (
      <div className="text-center py-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
        <span>Chargement des articles...</span>
      </div>
    );
  }

  if (error) {
    console.error("Erreur lors du chargement des articles:", error);
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des articles. Veuillez réessayer plus tard.
      </div>
    );
  }

  if (!articles?.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        Aucun article disponible pour le moment.
      </div>
    );
  }

  // Get 6 random articles instead of 3
  const randomArticles = [...articles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {randomArticles.map((article) => {
            const decodedTitle = decodeHtmlTitle(article.title.rendered);
            const articleSlug = createSlug(decodedTitle);
            
            return (
              <div
                key={article.id}
                className="group relative overflow-hidden rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-all duration-300 flex flex-col h-full"
              >
                <Link
                  to={`/article/${articleSlug}`}
                  className="block flex-1"
                >
                  <div className="aspect-video overflow-hidden">
                    {article._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                      <img
                        src={article._embedded["wp:featuredmedia"][0].source_url}
                        alt={article.title.rendered}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <h3
                      className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2"
                      dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                    />
                    <div
                      className="text-gray-300 mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
                    />
                  </div>
                </Link>
                <div className="px-6 pb-6 mt-auto">
                  <ArticleSocialActions articleId={article.id} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExtraArticles;
