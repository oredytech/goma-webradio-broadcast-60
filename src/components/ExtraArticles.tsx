import { useWordpressArticles } from "@/hooks/useWordpressArticles";
import { Link } from "react-router-dom";

const ExtraArticles = () => {
  const { data: articles, isLoading, error } = useWordpressArticles();

  if (isLoading) return <div className="text-center py-8">Chargement des articles...</div>;
  if (error) return null;
  if (!articles?.length) return null;

  // Get 3 random articles
  const randomArticles = [...articles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {randomArticles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="group relative overflow-hidden rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden">
                {article._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                  <img
                    src={article._embedded["wp:featuredmedia"][0].source_url}
                    alt={article.title.rendered}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                />
                <div
                  className="text-gray-300 mt-2 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraArticles;