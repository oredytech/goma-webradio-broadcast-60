
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { doc, updateDoc, arrayUnion, increment, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ArticleCommentFormProps {
  articleId: number;
  onCommentAdded?: () => void;
}

const ArticleCommentForm = ({ articleId, onCommentAdded }: ArticleCommentFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Commentaire vide",
        description: "Veuillez entrer un commentaire",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Assurons-nous que le document article existe
      const articleRef = doc(db, 'articles', articleId.toString());
      const articleDoc = await getDoc(articleRef);
      
      if (!articleDoc.exists()) {
        // Créer le document s'il n'existe pas
        await setDoc(articleRef, {
          likes: 0,
          dislikes: 0,
          comments: 0,
          commentsList: []
        });
      }

      // Ajouter le commentaire
      const commentData = {
        content,
        userId: user.uid,
        userName: user.displayName || 'Utilisateur',
        createdAt: new Date().toISOString(),
      };

      await updateDoc(articleRef, {
        commentsList: arrayUnion(commentData),
        comments: increment(1)
      });

      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès"
      });

      setContent("");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du commentaire",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary/50 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white mb-6">
        {user ? "Laissez un commentaire" : "Connectez-vous pour commenter"}
      </h2>
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder={user ? "Votre commentaire" : "Connectez-vous pour commenter..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-white/10 border-primary/20 text-white placeholder:text-white/50 min-h-[150px]"
          disabled={!user || isSubmitting}
        />
        <Button 
          type="submit" 
          className="w-full sm:w-auto"
          disabled={!user || isSubmitting}
        >
          {isSubmitting ? "Envoi en cours..." : "Soumettre"}
        </Button>
      </form>
    </div>
  );
};

export default ArticleCommentForm;
