import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import ArticlesSlider from "@/components/ArticlesSlider";
import { Link } from "react-router-dom";
import { getArticleSlug } from "@/utils/articleUtils";
import { usePageSEO } from "@/hooks/useSEO";
import { useQuery } from "@tanstack/react-query";

// Même interface que tes articles WordPress
interface WordPressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  link: string;
  slug: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

interface NewsProps {
  filter?: string;
}

const News = ({ filter }: NewsProps) => {
  // 🔥 APPEL DIRECT à l’API WordPress, comme ton autre composant
  const { data: articles, isLoading, isError } = useQuery({
    queryKey: ["wordpress-news"],
    queryFn: async (): Promise<WordPressPost[]> => {
      const response = await fetch(
        "https://gomawebradio.com/news/wp-json/wp/v2/posts?_embed&per_page=30&orderby=date&order=desc"
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des articles");
      }

      return response.json();
    },

    staleTime: 0,
    gcTime: 0,
    refetchInterval: 120000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // SEO
  const pageTitle = filter ? `Actualités - ${filter}` : "Toutes les actualités";
  usePageSEO(
    pageTitle,
    "Retrouvez toutes les dernières actualités et informations sur GOMA WEBRADIO",
    "/GOWERA__3_-removebg-preview.png"
  );

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-red-500">
            Une erreur est survenue lors du chargement des articles.
          </p>
        </div>
      </div>
    );
  }

  // Normal Render
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
          {articles?.map((article) => (
            <Link
              key={article.id}
              to={`/${getArticleSlug({
                id: article.id,
                title: { rendered: article.title.rendered },
                _embedded: article._embedded
              })}`}
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
                  className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors"
                  dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                />
                <div
                  className="text-foreground/70 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
                />
                <div className="mt-4 text-xs text-muted-foreground">
                  {new Date(article.date).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
