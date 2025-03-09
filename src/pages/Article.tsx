
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import type { WordPressArticle } from "@/hooks/useWordpressArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import ExtraArticles from "@/components/ExtraArticles";

interface ArticleProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

// Fonction pour créer un slug à partir d'un titre
export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const Article = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: ArticleProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState({ name: "", email: "", content: "" });

  // Récupérer tous les articles pour trouver celui qui correspond au slug
  const { data: articles, isLoading: articlesLoading } = useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: async () => {
      const response = await fetch(
        "https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Trouver l'article qui correspond au slug
  const article = articles?.find(article => {
    const title = new DOMParser().parseFromString(article.title.rendered, 'text/html').body.textContent || article.title.rendered;
    return createSlug(title) === slug;
  });

  // Récupérer l'article par ID si on a trouvé une correspondance
  const { data: fullArticle, isLoading: articleLoading } = useQuery<WordPressArticle>({
    queryKey: ["article", article?.id],
    queryFn: async () => {
      if (!article?.id) throw new Error("Article not found");
      const response = await fetch(
        `https://totalementactus.net/wp-json/wp/v2/posts/${article.id}?_embed`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!article?.id,
  });

  // Redirection vers la page 404 si l'article n'est pas trouvé après le chargement
  useEffect(() => {
    if (!articlesLoading && !articleLoading && !fullArticle) {
      navigate("/404", { replace: true });
    }
  }, [articlesLoading, articleLoading, fullArticle, navigate]);

  const isLoading = articlesLoading || articleLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!fullArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black flex items-center justify-center">
        <div className="text-white">Article non trouvé</div>
      </div>
    );
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Commentaire soumis:", comment);
    setComment({ name: "", email: "", content: "" });
  };

  const featuredImageUrl = fullArticle._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/placeholder.svg';
  
  const decodedTitle = new DOMParser().parseFromString(fullArticle.title.rendered, 'text/html').body.textContent || fullArticle.title.rendered;
  
  // Extraire une description pour les meta tags Open Graph
  const getMetaDescription = () => {
    const div = document.createElement('div');
    div.innerHTML = fullArticle.excerpt.rendered;
    return div.textContent?.trim() || "Lisez cet article sur notre site";
  };

  const metaDescription = getMetaDescription();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      {/* Open Graph Meta Tags */}
      <Helmet>
        <title>{decodedTitle} | GOMA WEBRADIO</title>
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={decodedTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={featuredImageUrl} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={decodedTitle} />
        <meta property="twitter:description" content={metaDescription} />
        <meta property="twitter:image" content={featuredImageUrl} />
      </Helmet>
      
      <Header />
      
      {/* Hero Section with Featured Image */}
      <div className="pt-16">
        <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featuredImageUrl})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
            <div className="max-w-3xl text-center mt-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {decodedTitle}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with Right Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-8">
            {/* Article Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: fullArticle.content.rendered }}
            />

            {/* Comment Form */}
            <div className="bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Laissez un commentaire</h2>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Votre nom"
                  value={comment.name}
                  onChange={(e) => setComment({ ...comment, name: e.target.value })}
                  className="bg-white/10 border-primary/20 text-white placeholder:text-white/50"
                />
                <Input
                  type="email"
                  placeholder="Votre email"
                  value={comment.email}
                  onChange={(e) => setComment({ ...comment, email: e.target.value })}
                  className="bg-white/10 border-primary/20 text-white placeholder:text-white/50"
                />
                <Textarea
                  placeholder="Votre commentaire"
                  value={comment.content}
                  onChange={(e) => setComment({ ...comment, content: e.target.value })}
                  className="bg-white/10 border-primary/20 text-white placeholder:text-white/50 min-h-[150px]"
                />
                <Button type="submit" className="w-full sm:w-auto">
                  Soumettre
                </Button>
              </form>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Recent Comments Section */}
            <div className="bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Derniers commentaires</h3>
              <div className="space-y-4">
                <div className="border-b border-primary/20 pb-4">
                  <p className="text-white/80 text-sm">Pas encore de commentaires</p>
                </div>
              </div>
            </div>

            {/* Advertisement Section */}
            <div className="bg-secondary/50 rounded-lg p-6 backdrop-blur-sm sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Publicité</h3>
              <div className="rounded-lg flex items-center justify-center">
                <a 
                  href="https://affiliation.lws-hosting.com/statistics/click/248/872316963" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img 
                    src="https://affiliation.lws-hosting.com/banners/viewbanner/248/872316963" 
                    alt="LWS Hosting" 
                    className="w-full h-auto" 
                    style={{ maxWidth: "100%" }}
                  />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Articles supplémentaires */}
      <ExtraArticles />

      <Footer />
    </div>
  );
};

export default Article;
