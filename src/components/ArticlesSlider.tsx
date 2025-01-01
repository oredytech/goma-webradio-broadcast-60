import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const ArticlesSlider = () => {
  const { data: articles, isLoading, error } = useWordpressArticles();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!articles?.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 6000); // 6 seconds

    return () => clearInterval(interval);
  }, [articles]);

  if (isLoading) return <div className="text-center py-8">Chargement des articles...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Erreur de chargement des articles</div>;
  if (!articles?.length) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative overflow-hidden bg-secondary/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Derniers Articles</h2>
        <div className="relative">
          <div className="flex items-center justify-between absolute top-1/2 transform -translate-y-1/2 w-full z-10 px-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={prevSlide}
              className="rounded-full opacity-70 hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={nextSlide}
              className="rounded-full opacity-70 hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <div className="relative bg-secondary/50 rounded-lg overflow-hidden">
            <div className="relative w-full h-[400px] transition-transform duration-700 ease-out">
              <img
                src={currentArticle._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                alt={currentArticle.title.rendered}
                className="w-full h-[400px] object-cover transform transition-all duration-700 ease-out scale-105 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-700">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-500 ease-out">
                  <Link
                    to={`/article/${currentArticle.id}`}
                    className="text-2xl font-bold text-white hover:text-primary transition-colors inline-block"
                    dangerouslySetInnerHTML={{ __html: currentArticle.title.rendered }}
                  />
                  <div
                    className="text-gray-300 mt-2 line-clamp-2 transform transition-all duration-500"
                    dangerouslySetInnerHTML={{ __html: currentArticle.excerpt.rendered }}
                  />
                  <Link to={`/article/${currentArticle.id}`}>
                    <Button className="mt-4 transform hover:scale-105 transition-transform">Lire Plus</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesSlider;