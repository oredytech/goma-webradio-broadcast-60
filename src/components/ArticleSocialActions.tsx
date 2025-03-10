
import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, increment, onSnapshot } from 'firebase/firestore';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface ArticleSocialActionsProps {
  articleId: number;
}

const ArticleSocialActions = ({ articleId }: ArticleSocialActionsProps) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe = () => {};
    
    const setupListeners = async () => {
      try {
        // Create article document if it doesn't exist yet
        const articleRef = doc(db, 'articles', articleId.toString());
        const articleDoc = await getDoc(articleRef);
        
        if (!articleDoc.exists()) {
          await setDoc(articleRef, { 
            likes: 0, 
            dislikes: 0, 
            comments: 0 
          });
        }
        
        // Setup listener for article changes
        unsubscribe = onSnapshot(articleRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setLikes(data.likes || 0);
            setDislikes(data.dislikes || 0);
            setComments(data.comments || 0);
          }
        }, (error) => {
          console.error("Snapshot listener error:", error);
        });

        // Check if user has already liked/disliked
        if (auth.currentUser) {
          const userInteractionRef = doc(db, 'userInteractions', `${auth.currentUser.uid}_${articleId}`);
          const userDoc = await getDoc(userInteractionRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserLiked(data.liked || false);
            setUserDisliked(data.disliked || false);
          }
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };
    
    setupListeners();
    
    return () => unsubscribe();
  }, [articleId]);

  const handleLike = async () => {
    if (!auth.currentUser) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour aimer un article",
        variant: "destructive"
      });
      return;
    }

    try {
      const articleRef = doc(db, 'articles', articleId.toString());
      const userInteractionRef = doc(db, 'userInteractions', `${auth.currentUser.uid}_${articleId}`);

      // Get the current values
      const previousLiked = userLiked;
      const previousDisliked = userDisliked;

      if (!userLiked) {
        // Update UI optimistically
        setUserLiked(true);
        if (userDisliked) setUserDisliked(false);
        
        try {
          // Update Firestore
          await setDoc(articleRef, { likes: increment(1) }, { merge: true });
          if (userDisliked) {
            await setDoc(articleRef, { dislikes: increment(-1) }, { merge: true });
          }
          await setDoc(userInteractionRef, { 
            liked: true,
            disliked: false,
            userId: auth.currentUser.uid,
            articleId
          }, { merge: true });
        } catch (error) {
          // Rollback UI on error
          console.error("Error updating likes:", error);
          setUserLiked(previousLiked);
          setUserDisliked(previousDisliked);
          
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'interaction",
            variant: "destructive"
          });
        }
      } else {
        // Update UI optimistically
        setUserLiked(false);
        
        try {
          // Update Firestore
          await setDoc(articleRef, { likes: increment(-1) }, { merge: true });
          await setDoc(userInteractionRef, { liked: false }, { merge: true });
        } catch (error) {
          // Rollback UI on error
          console.error("Error updating likes:", error);
          setUserLiked(previousLiked);
          
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'interaction",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error in handleLike:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'interaction",
        variant: "destructive"
      });
    }
  };

  const handleDislike = async () => {
    if (!auth.currentUser) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ne pas aimer un article",
        variant: "destructive"
      });
      return;
    }

    try {
      const articleRef = doc(db, 'articles', articleId.toString());
      const userInteractionRef = doc(db, 'userInteractions', `${auth.currentUser.uid}_${articleId}`);

      // Get the current values
      const previousLiked = userLiked;
      const previousDisliked = userDisliked;

      if (!userDisliked) {
        // Update UI optimistically
        setUserDisliked(true);
        if (userLiked) setUserLiked(false);
        
        try {
          // Update Firestore
          await setDoc(articleRef, { dislikes: increment(1) }, { merge: true });
          if (userLiked) {
            await setDoc(articleRef, { likes: increment(-1) }, { merge: true });
          }
          await setDoc(userInteractionRef, {
            liked: false,
            disliked: true,
            userId: auth.currentUser.uid,
            articleId
          }, { merge: true });
        } catch (error) {
          // Rollback UI on error
          console.error("Error updating dislikes:", error);
          setUserDisliked(previousDisliked);
          setUserLiked(previousLiked);
          
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'interaction",
            variant: "destructive"
          });
        }
      } else {
        // Update UI optimistically
        setUserDisliked(false);
        
        try {
          // Update Firestore
          await setDoc(articleRef, { dislikes: increment(-1) }, { merge: true });
          await setDoc(userInteractionRef, { disliked: false }, { merge: true });
        } catch (error) {
          // Rollback UI on error
          console.error("Error updating dislikes:", error);
          setUserDisliked(previousDisliked);
          
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'interaction",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error in handleDislike:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'interaction",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Partager cet article',
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papier",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du partage",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <Button
        variant={userLiked ? "default" : "secondary"}
        size="sm"
        onClick={handleLike}
        className="gap-2"
      >
        <ThumbsUp className={userLiked ? "text-white" : "text-gray-500"} />
        <span>{likes}</span>
      </Button>
      
      <Button
        variant={userDisliked ? "default" : "secondary"}
        size="sm"
        onClick={handleDislike}
        className="gap-2"
      >
        <ThumbsDown className={userDisliked ? "text-white" : "text-gray-500"} />
        <span>{dislikes}</span>
      </Button>

      <Button variant="secondary" size="sm" className="gap-2">
        <MessageSquare className="text-gray-500" />
        <span>{comments}</span>
      </Button>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="gap-2"
        onClick={handleShare}
      >
        <Share2 className="text-gray-500" />
        <span>Partager</span>
      </Button>
    </div>
  );
};

export default ArticleSocialActions;
