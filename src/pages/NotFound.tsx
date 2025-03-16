
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useWordpressArticles, WordPressArticle } from "@/hooks/useWordpressArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import Article from "./Article";

const NotFound = () => {
  const location = useLocation();
  const { data: articles, isLoading } = useWordpressArticles();
  const [matchedArticle, setMatchedArticle] = useState<WordPressArticle | null>(null);

  useEffect(() => {
    if (!articles || isLoading) return;

    // Check if it's an article URL with slug
    const articleMatch = location.pathname.match(/\/article\/(.+)/);
    if (articleMatch) {
      const pathSegment = articleMatch[1];
      
      // First try to match by ID at path start (for backward compatibility)
      const idMatch = pathSegment.match(/^(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        const article = articles.find(a => a.id === id);
        if (article) {
          setMatchedArticle(article);
          return;
        }
      }
      
      // Try to match by title/slug
      const article = articles.find(a => {
        const decodedTitle = new DOMParser().parseFromString(a.title.rendered, 'text/html').body.textContent || a.title.rendered;
        const articleSlug = decodedTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        return pathSegment.includes(articleSlug) || 
               pathSegment.toLowerCase().includes(decodedTitle.toLowerCase()) ||
               decodedTitle.toLowerCase().includes(pathSegment.toLowerCase());
      });
      
      if (article) {
        setMatchedArticle(article);
      }
    }
  }, [articles, isLoading, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // If we matched an article, redirect to the proper article URL
  if (matchedArticle) {
    const decodedTitle = new DOMParser().parseFromString(matchedArticle.title.rendered, 'text/html').body.textContent || matchedArticle.title.rendered;
    const articleSlug = decodedTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    return <Navigate to={`/article/${matchedArticle.id}/${articleSlug}`} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Page non trouvée</h1>
          <p className="text-gray-300 text-lg mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
