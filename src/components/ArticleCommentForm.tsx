
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ArticleCommentForm = () => {
  const [comment, setComment] = useState({ name: "", email: "", content: "" });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Commentaire soumis:", comment);
    setComment({ name: "", email: "", content: "" });
  };

  return (
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
  );
};

export default ArticleCommentForm;
