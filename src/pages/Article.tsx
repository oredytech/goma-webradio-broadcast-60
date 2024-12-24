import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { WordPressArticle } from "@/hooks/useWordpressArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ArticleProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const Article = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: ArticleProps) => {
  const { id } = useParams();
  const [comment, setComment] = useState({ name: "", email: "", content: "" });

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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {article.title.rendered}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
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
            <div className="bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Publicité</h3>
              <div className="aspect-square bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-white/50">Espace publicitaire</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Article;