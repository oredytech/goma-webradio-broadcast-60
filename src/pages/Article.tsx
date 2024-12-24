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

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden mt-16">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/5ae4e570-d67b-4af1-934b-7e4050e720c9.png')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            {article.title.rendered}
          </h1>
          <div className="text-lg text-gray-300" dangerouslySetInnerHTML={{ __html: article.content.rendered }} />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-4">Laissez un commentaire</h2>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Input
            type="text"
            placeholder="Votre nom"
            value={comment.name}
            onChange={(e) => setComment({ ...comment, name: e.target.value })}
            className="bg-white text-black"
          />
          <Input
            type="email"
            placeholder="Votre email"
            value={comment.email}
            onChange={(e) => setComment({ ...comment, email: e.target.value })}
            className="bg-white text-black"
          />
          <Textarea
            placeholder="Votre commentaire"
            value={comment.content}
            onChange={(e) => setComment({ ...comment, content: e.target.value })}
            className="bg-white text-black"
          />
          <Button type="submit" className="bg-primary text-white">Soumettre</Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Article;
