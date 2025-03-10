
import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export function useArticleInteractions(articleId: number) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    
    const setupListeners = async () => {
      try {
        setIsLoading(true);
        // Create article document if it doesn't exist yet
        const articleRef = doc(db, 'articles', articleId.toString());
        const articleDoc = await getDoc(articleRef);
        
        if (!articleDoc.exists()) {
          try {
            // Create a new document only if it doesn't exist
            // We'll handle this in the interaction handlers instead to avoid permission issues
          } catch (error) {
            console.error("Error creating article document:", error);
          }
        }
        
        // Setup listener for article changes
        unsubscribe = onSnapshot(articleRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setLikes(data.likes || 0);
            setDislikes(data.dislikes || 0);
            setComments(data.comments || 0);
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Snapshot listener error:", error);
          setIsLoading(false);
        });

        // Check if user has already liked/disliked
        if (auth.currentUser) {
          try {
            const userInteractionRef = doc(db, 'userInteractions', `${auth.currentUser.uid}_${articleId}`);
            const userDoc = await getDoc(userInteractionRef);
            
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserLiked(data.liked || false);
              setUserDisliked(data.disliked || false);
            }
          } catch (error) {
            console.error("Error checking user interaction:", error);
          }
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
        setIsLoading(false);
      }
    };
    
    setupListeners();
    
    return () => unsubscribe();
  }, [articleId]);

  return {
    likes,
    dislikes,
    comments,
    userLiked,
    userDisliked,
    isLoading
  };
}
