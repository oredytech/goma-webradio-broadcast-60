
import { useParams, useLocation, useNavigate, useEffect } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { WordPressArticle } from "@/hooks/useWordpressArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { updateMetaTags } from "@/utils/metaService";
import ExtraArticles from "@/components/ExtraArticles";

interface ArticleProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const Article = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: ArticleProps) => {
  const { id } = useParams();
  const [comment, setComment] = useState({ name: "", email: "", content: "" });
  const location = useLocation();
  const navigate = useNavigate();

  const { data: article, isLoading } = useQuery<WordPressArticle>({
    queryKey: ["article", id],
    queryFn: async () => {
      const response = await fetch(
        `https://totalementactus.net/wp-json/wp/v2/posts/${id}?_embed`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (article) {
      const decodedTitle = new DOMParser().parseFromString(article.title.rendered, 'text/html').body.textContent || article.title.rendered;
      const articleSlug = decodedTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      // Si l'URL ne contient pas le slug, mettre à jour pour SEO
      if (!location.pathname.includes(articleSlug) && location.pathname.match(/\/article\/\d+$/)) {
        navigate(`/article/${id}/${articleSlug}`, { replace: true });
      }
      
      // Mise à jour des meta tags
      const featuredImageUrl = article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/GOWERA__3_-removebg-preview.png';
      const excerpt = new DOMParser().parseFromString(article.excerpt.rendered, 'text/html').body.textContent || '';
      
      updateMetaTags({
        title: decodedTitle,
        description: excerpt.substring(0, 160),
        image: featuredImageUrl,
        type: 'article',
        url: window.location.href
      });
    }
  }, [article, id, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-black flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!article) {
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

  const featuredImageUrl = article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || '/placeholder.svg';
  
  const decodedTitle = new DOMParser().parseFromString(article.title.rendered, 'text/html').body.textContent || article.title.rendered;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
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
              dangerouslySetInnerHTML={{ __html: article.content.rendered }}
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

      <ExtraArticles />
      <Footer />
    </div>
  );
};

export default Article;
