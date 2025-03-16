
import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createSlug, decodeHtmlTitle } from "@/utils/articleUtils";
import { useToast } from "@/hooks/use-toast";

const ArticlesSlider = () => {
  const { data: articles, isLoading, error, refetch } = useWordpressArticles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { toast } = useToast();

  // Effect to handle auto-retry if there's an error or no articles
  useEffect(() => {
    if (!isLoading && (!articles || articles.length === 0)) {
      const timer = setTimeout(() => {
        refetch();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [articles, isLoading, refetch]);

  // Effect to rotate articles
  useEffect(() => {
    if (!articles?.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
      setIsImageLoaded(false); // Reset image loaded state for the next article
    }, 6000);

    return () => clearInterval(interval);
  }, [articles]);

  // Handle retry
  const handleRetry = () => {
    toast({
      title: "Actualisation en cours",
      description: "Chargement des derniers articles...",
    });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Derniers Articles</h2>
          <div className="bg-secondary/50 rounded-lg p-6 h-[400px] animate-pulse flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
            <span className="text-white">Chargement des articles...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Derniers Articles</h2>
          <div className="bg-secondary/50 rounded-lg p-6 h-[400px] flex flex-col items-center justify-center">
            <p className="text-red-400 mb-4">Impossible de charger les articles. Veuillez réessayer.</p>
            <Button onClick={handleRetry} variant="secondary">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!articles?.length) {
    return (
      <div className="relative overflow-hidden py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Derniers Articles</h2>
          <div className="bg-secondary/50 rounded-lg p-6 h-[400px] flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-4">Aucun article disponible pour le moment.</p>
            <Button onClick={handleRetry} variant="secondary">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setIsImageLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setIsImageLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const currentArticle = articles[currentIndex];
  const decodedTitle = decodeHtmlTitle(currentArticle.title.rendered);
  const articleSlug = createSlug(decodedTitle);
  const featuredImageUrl = currentArticle._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/placeholder.svg';

  return (
    <div className="relative overflow-hidden py-16">
      {/* Background Image with loading state */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isImageLoaded ? 'opacity-20' : 'opacity-0'}`}
        style={{
          backgroundImage: `url(${featuredImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.3)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Placeholder background while loading */}
      <div className={`absolute inset-0 w-full h-full bg-secondary transition-opacity duration-500 ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`} />
      
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
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/70">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}
              <img
                src={featuredImageUrl}
                alt={decodedTitle}
                className={`w-full h-[400px] object-cover transform transition-all duration-700 ease-out scale-105 hover:scale-100 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)} // Show UI even if image fails
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
