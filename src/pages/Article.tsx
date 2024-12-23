import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Share2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { WordPressArticle } from "@/hooks/useWordpressArticles";

const Article = () => {
  const { id } = useParams();
  const [comment, setComment] = useState({ name: "", email: "", content: "" });

  const { data: article, isLoading } = useQuery<WordPressArticle>({
    queryKey: ["article", id],
    queryFn: async () => {
      const response = await fetch(
        `https://totalementactus.net/wp-json/wp/v2/posts/${id}?_embed`
      );
      if (!response.ok) throw new Error("Article non trouvé");
      return response.json();
    },
  });

  if (isLoading) return <div className="text-center py-8">Chargement...</div>;
  if (!article) return <div className="text-center py-8">Article non trouvé</div>;

  const shareUrl = window.location.href;

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(article.title.rendered);
    const url = encodeURIComponent(shareUrl);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez implémenter la logique d'envoi des commentaires
    console.log("Commentaire soumis:", comment);
    setComment({ name: "", email: "", content: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={article._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
            alt={article.title.rendered}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h1
              className="text-4xl sm:text-6xl font-bold text-white mb-6"
              dangerouslySetInnerHTML={{ __html: article.title.rendered }}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content.rendered }} />
            </article>

            {/* Social Share */}
            <div className="flex gap-4 mt-8">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleShare("whatsapp")}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Comments Form */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-white mb-6">
                Laisser un commentaire
              </h3>
              <form onSubmit={handleSubmitComment} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Nom"
                    value={comment.name}
                    onChange={(e) =>
                      setComment({ ...comment, name: e.target.value })
                    }
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={comment.email}
                    onChange={(e) =>
                      setComment({ ...comment, email: e.target.value })
                    }
                  />
                </div>
                <Textarea
                  placeholder="Votre commentaire"
                  value={comment.content}
                  onChange={(e) =>
                    setComment({ ...comment, content: e.target.value })
                  }
                  className="h-32"
                />
                <Button type="submit">Envoyer</Button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-secondary/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Derniers commentaires
              </h3>
              <div className="space-y-4">
                {/* Placeholder pour les commentaires */}
                <p className="text-gray-300">Aucun commentaire pour le moment</p>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Publicité</h3>
              <div className="bg-gray-700 h-64 rounded flex items-center justify-center">
                <p className="text-gray-400">Espace publicitaire</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Article;