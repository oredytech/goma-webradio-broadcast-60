import { useMultiSourceArticles, type WordPressArticle, sources } from "@/hooks/useMultiSourceArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlesSlider from "@/components/ArticlesSlider";
import { Link } from "react-router-dom";

interface NewsProps {
  filter?: string;
}

const News = ({ filter }: NewsProps) => {
  const results = useMultiSourceArticles();

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black flex items-center justify-center">
        <Header />
        <div className="text-white">Chargement des articles...</div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black flex items-center justify-center">
        <Header />
        <div className="text-white">Erreur lors du chargement des articles.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      
      {/* Hero Section with Slider */}
      <div className="pt-16 pb-12">
        <ArticlesSlider />
      </div>

      {/* Articles Grid Section */}
      <div className="container mx-auto px-4 py-12">
        {sources.map((source, sourceIndex) => (
          <div key={source.id} className="mb-16">
            <h2 className="text-2xl font-semibold text-white">{source.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results[sourceIndex].data?.map((article: WordPressArticle) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}/${source.id}`}
                  className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 group animate-fade-in"
                >
                  {article._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={article._embedded["wp:featuredmedia"][0].source_url}
                        alt=""
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3
                      className="text-xl font-semibold text-white mb-4"
                      dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                    />
                    <div
                      className="text-white/80 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default News;