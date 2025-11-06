
import { useEffect } from 'react';
import { useAllArticles } from "@/hooks/useAllArticles";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import ArticlesSlider from "@/components/ArticlesSlider";
import { Link } from "react-router-dom";
import { getArticleSlug } from "@/utils/articleUtils";
import { usePageSEO } from "@/hooks/useSEO";

interface NewsProps {
  filter?: string;
}

const News = ({ filter }: NewsProps) => {
  const { articles, isLoading, isError } = useAllArticles();
  
  // Setup SEO for the news page
  const pageTitle = filter ? `Actualités - ${filter}` : "Toutes les actualités";
  usePageSEO(
    pageTitle,
    "Retrouvez toutes les dernières actualités et informations sur GOMA WEBRADIO",
    "/GOWERA__3_-removebg-preview.png"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        {/* Footer est déjà inclus globalement dans App.tsx */}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-red-500">Une erreur est survenue lors du chargement des articles.</p>
        </div>
        {/* Footer est déjà inclus globalement dans App.tsx */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <Header />
      <div className="pt-16">
        <ArticlesSlider />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        <h1 className="text-3xl font-bold text-foreground mb-12">
          {filter ? `Actualités - ${filter}` : "Toutes les actualités"}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={article.source === 'telegram' 
                ? `/telegram-${article.sourceId}` 
                : `/${getArticleSlug({ 
                    id: article.sourceId as number, 
                    title: { rendered: article.title },
                    _embedded: article._embedded 
                  })}`
              }
              className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 group animate-fade-in"
            >
              {article.featuredImage && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors"
                  dangerouslySetInnerHTML={{ __html: article.title }}
                />
                <div
                  className="text-foreground/70 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: article.excerpt }}
                />
                <div className="mt-4 text-xs text-muted-foreground">
                  {new Date(article.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Footer est déjà inclus globalement dans App.tsx */}
    </div>
  );
};

export default News;
