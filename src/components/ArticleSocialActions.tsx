
import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
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
    try {
      const articleRef = doc(db, 'articles', articleId.toString());
      
      const unsubscribe = onSnapshot(articleRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setLikes(data.likes || 0);
          setDislikes(data.dislikes || 0);
          setComments(data.comments || 0);
        }
      }, (error) => {
        console.error("Snapshot listener error:", error);
      });

      // Vérifier si l'utilisateur a déjà liké/disliké
      if (auth.currentUser) {
        const userInteractionRef = doc(db, 'userInteractions', `${auth.currentUser.uid}_${articleId}`);
        getDoc(userInteractionRef).then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setUserLiked(data.liked || false);
            setUserDisliked(data.disliked || false);
          }
        }).catch(error => {
          console.error("Failed to get user interaction:", error);
        });
      }

      return () => unsubscribe();
    } catch (error) {
      console.error("Error in useEffect:", error);
      return () => {};
    }
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

      if (!userLiked) {
        // Update UI optimistically
        setUserLiked(true);
        setUserDisliked(false);
        
        try {
          await setDoc(articleRef, { likes: increment(1) }, { merge: true });
          if (userDisliked) {
            await setDoc(articleRef, { dislikes: increment(-1) }, { merge: true });
          }
          await setDoc(userInteractionRef, { 
            liked: true,
            disliked: false,
            userId: auth.currentUser.uid,
            articleId
          });
        } catch (error) {
          // Rollback UI on error
          console.error("Error updating likes:", error);
          setUserLiked(false);
          setUserDisliked(userDisliked);
          throw error;
        }
      } else {
        // Update UI optimistically
        setUserLiked(false);
        
        try {
          await setDoc(articleRef, { likes: increment(-1) }, { merge: true });
          await setDoc(userInteractionRef, { liked: false }, { merge: true });
        } catch (error) {
          // Rollback UI on error
          console.error("Error updating likes:", error);
          setUserLiked(true);
          throw error;
        }
      }
    } catch (error) {
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

      if (!userDisliked) {
        // Update UI optimistically
        setUserDisliked(true);
        setUserLiked(false);
        
        try {
          await setDoc(articleRef, { dislikes: increment(1) }, { merge: true });
          if (userLiked) {
            await setDoc(articleRef, { likes: increment(-1) }, { merge: true });
          }
          await setDoc(userInteractionRef, {
            liked: false,
            disliked: true,
            userId: auth.currentUser.uid,
            articleId
          });
        } catch (error) {
          // Rollback UI on error
          console.error("Error updating dislikes:", error);
          setUserDisliked(false);
          setUserLiked(userLiked);
          throw error;
        }
      } else {
        // Update UI optimistically
        setUserDisliked(false);
        
        try {
          await setDoc(articleRef, { dislikes: increment(-1) }, { merge: true });
          await setDoc(userInteractionRef, { disliked: false }, { merge: true });
        } catch (error) {
          // Rollback UI on error
          console.error("Error updating dislikes:", error);
          setUserDisliked(true);
          throw error;
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'interaction",
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
    </div>
  );
};

export default ArticleSocialActions;
