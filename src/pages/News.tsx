import { useMultiSourceArticles, sources, WordPressArticle } from "@/hooks/useMultiSourceArticles";

const News = () => {
  const results = useMultiSourceArticles();

  const isLoading = results.some((result) => result.isLoading);
  const hasError = results.some((result) => result.isError);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Chargement des articles...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Une erreur est survenue lors du chargement des articles.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-12">Actualités</h1>
        
        <div className="space-y-16">
          {sources.map((source, sourceIndex) => (
            <div key={source.id} className="space-y-8">
              <h2 className="text-2xl font-semibold text-white">{source.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results[sourceIndex].data?.map((article: WordPressArticle) => (
                  <a
                    key={article.id}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300"
                  >
                    {article._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                      <img
                        src={article._embedded["wp:featuredmedia"][0].source_url}
                        alt={article.title.rendered}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3
                        className="text-xl font-bold text-white mb-4"
                        dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                      />
                      <div
                        className="text-gray-300 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;