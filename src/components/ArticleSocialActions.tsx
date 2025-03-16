
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './ui/use-toast';
import { useArticleInteractions } from '@/hooks/useArticleInteractions';
import { handleArticleLike, handleArticleDislike, handleArticleShare } from '@/utils/articleInteractions';
import LikeButton from './articles/LikeButton';
import DislikeButton from './articles/DislikeButton';
import CommentButton from './articles/CommentButton';
import ShareButton from './articles/ShareButton';
import { useNavigate } from 'react-router-dom';

interface ArticleSocialActionsProps {
  articleId: number;
}

const ArticleSocialActions = ({ articleId }: ArticleSocialActionsProps) => {
  const { likes, dislikes, comments, userLiked, userDisliked, isLoading } = useArticleInteractions(articleId);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const redirectToLogin = () => {
    toast({
      title: "Connexion requise",
      description: "Vous devez être connecté pour interagir avec les articles",
      variant: "destructive"
    });
    navigate('/login');
  };

  const handleLike = async () => {
    if (!user) {
      redirectToLogin();
      return;
    }

    setIsProcessing(true);
    
    // Store previous states for rollback if needed
    const previousLiked = userLiked;
    const previousDisliked = userDisliked;
    
    // Optimistic UI update
    const newLiked = !userLiked;
    const newDisliked = newLiked ? false : userDisliked;
    
    const success = await handleArticleLike(
      articleId,
      userLiked,
      userDisliked,
      () => {}, // We're using optimistic updates, so no need for callback
      () => {
        // Error handling - show toast and restore previous values
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'interaction",
          variant: "destructive"
        });
      }
    );
    
    if (!success) {
      // Reset to previous state if the operation failed
      // Note: the hook will automatically update the state from Firestore
    }
    
    setIsProcessing(false);
  };

  const handleDislike = async () => {
    if (!user) {
      redirectToLogin();
      return;
    }

    setIsProcessing(true);
    
    // Store previous states for rollback if needed
    const previousLiked = userLiked;
    const previousDisliked = userDisliked;
    
    // Optimistic UI update
    const newDisliked = !userDisliked;
    const newLiked = newDisliked ? false : userLiked;
    
    const success = await handleArticleDislike(
      articleId,
      userLiked,
      userDisliked,
      () => {}, // We're using optimistic updates, so no need for callback
      () => {
        // Error handling - show toast
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'interaction",
          variant: "destructive"
        });
      }
    );
    
    if (!success) {
      // Reset to previous state if the operation failed
      // Note: the hook will automatically update the state from Firestore
    }
    
    setIsProcessing(false);
  };

  const handleShare = () => {
    const success = handleArticleShare();
    
    if (success) {
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du partage",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center flex-wrap gap-3">
      <LikeButton 
        likes={likes} 
        isActive={userLiked} 
        onClick={handleLike}
        isDisabled={isLoading || isProcessing}
      />
      
      <DislikeButton 
        dislikes={dislikes} 
        isActive={userDisliked} 
        onClick={handleDislike}
        isDisabled={isLoading || isProcessing}
      />

      <CommentButton comments={comments} />
      
      <ShareButton onClick={handleShare} />
    </div>
  );
};

export default ArticleSocialActions;
