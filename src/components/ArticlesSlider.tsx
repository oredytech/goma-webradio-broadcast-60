
import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createSlug, decodeHtmlTitle } from "@/utils/articleUtils";

const ArticlesSlider = () => {
  const { data: articles, isLoading, error } = useWordpressArticles();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!articles?.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [articles]);

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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const currentArticle = articles[currentIndex];
  const decodedTitle = decodeHtmlTitle(currentArticle.title.rendered);
  const articleSlug = createSlug(decodedTitle);
  const featuredImageUrl = currentArticle._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/placeholder.svg';

  return (
    <div className="relative overflow-hidden py-16">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${featuredImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.3)',
          transform: 'scale(1.1)',
          transition: 'all 0.7s ease-in-out'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          <div className="relative bg-secondary/50 rounded-lg overflow-hidden backdrop-blur-sm">
            <div className="relative w-full h-[400px] transition-transform duration-700 ease-out">
              <img
                src={featuredImageUrl}
                alt={decodedTitle}
                className="w-full h-[400px] object-cover transform transition-all duration-700 ease-out scale-105 hover:scale-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-700">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-500 ease-out">
                  <Link
                    to={`/article/${articleSlug}`}
                    className="text-2xl font-bold text-white hover:text-primary transition-colors inline-block"
                    dangerouslySetInnerHTML={{ __html: currentArticle.title.rendered }}
                  />
                  <div
                    className="text-gray-300 mt-2 line-clamp-2 transform transition-all duration-500"
                    dangerouslySetInnerHTML={{ __html: currentArticle.excerpt.rendered }}
                  />
                  <Link to={`/article/${articleSlug}`}>
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
