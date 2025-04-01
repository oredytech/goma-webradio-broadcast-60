
import { useEffect } from 'react';
import { useMultiSourceArticles, sources, WordPressArticle } from "@/hooks/useMultiSourceArticles";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlesSlider from "@/components/ArticlesSlider";
import { Link } from "react-router-dom";
import { getArticleSlug } from "@/utils/articleUtils";
import { usePageSEO } from "@/hooks/useSEO";

interface NewsProps {
  filter?: string;
}

const News = ({ filter }: NewsProps) => {
  const results = useMultiSourceArticles();
  
  // Setup SEO for the news page
  const pageTitle = filter ? `Actualités - ${filter}` : "Toutes les actualités";
  usePageSEO(
    pageTitle,
    "Retrouvez toutes les dernières actualités et informations sur GOMA WEBRADIO",
    "/GOWERA__3_-removebg-preview.png"
  );

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
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
        <Footer />
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
        <h1 className="text-3xl font-bold text-white mb-12">
          {filter ? `Actualités - ${filter}` : "Toutes les actualités"}
        </h1>
        
        <div className="space-y-16">
          {sources.map((source, sourceIndex) => (
            <div key={source.id} className="space-y-8">
              <h2 className="text-2xl font-semibold text-white">{source.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results[sourceIndex].data?.map((article: WordPressArticle) => (
                  <Link
                    key={article.id}
                    to={`/article/${getArticleSlug(article)}`}
                    className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 group animate-fade-in"
                  >
                    {article._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article._embedded["wp:featuredmedia"][0].source_url}
                          alt={article.title.rendered}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3
                        className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors"
                        dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                      />
                      <div
                        className="text-gray-300 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default News;
