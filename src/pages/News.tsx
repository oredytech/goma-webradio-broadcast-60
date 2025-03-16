
import { useMultiSourceArticles, sources } from "@/hooks/useMultiSourceArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlesSlider from "@/components/ArticlesSlider";
import NewsLoading from "@/components/news/NewsLoading";
import NewsError from "@/components/news/NewsError";
import NewsSourceSection from "@/components/news/NewsSourceSection";

interface NewsProps {
  filter?: string;
}

const News = ({ filter }: NewsProps) => {
  const results = useMultiSourceArticles();

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  
  const handleRetry = () => {
    results.forEach((result) => result.refetch());
  };

  if (isLoading) {
    return <NewsLoading />;
  }

  if (isError) {
    return <NewsError onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <Header />
      <div className="pt-16">
        <ArticlesSlider />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        <h1 className="text-3xl font-bold text-white mb-12">
          {filter ? `Actualités - ${filter}` : "Toutes les actualités"}
        </h1>
        
        <div className="space-y-16">
          {sources.map((source, sourceIndex) => (
            <NewsSourceSection
              key={source.id}
              sourceName={source.name}
              articles={results[sourceIndex].data || []}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default News;
