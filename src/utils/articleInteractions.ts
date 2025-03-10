
import { doc, setDoc, increment } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

export async function handleArticleLike(
  articleId: number, 
  userLiked: boolean, 
  userDisliked: boolean,
  onSuccess: (newLiked: boolean, newDisliked: boolean) => void,
  onError: () => void
) {
  if (!auth.currentUser) {
    return false;
  }

  try {
    const articleRef = doc(db, 'articles', articleId.toString());
    const userInteractionRef = doc(db, 'userInteractions', `${auth.currentUser.uid}_${articleId}`);

    if (!userLiked) {
      // Like the article
      await setDoc(articleRef, { likes: increment(1) }, { merge: true });
      
      if (userDisliked) {
        // Remove dislike if it exists
        await setDoc(articleRef, { dislikes: increment(-1) }, { merge: true });
      }
      
      await setDoc(userInteractionRef, { 
        liked: true,
        disliked: false,
        userId: auth.currentUser.uid,
        articleId
      }, { merge: true });
      
      onSuccess(true, false);
    } else {
      // Unlike the article
      await setDoc(articleRef, { likes: increment(-1) }, { merge: true });
      await setDoc(userInteractionRef, { liked: false }, { merge: true });
      
      onSuccess(false, userDisliked);
    }
    
    return true;
  } catch (error) {
    console.error("Error in handleLike:", error);
    onError();
    return false;
  }
}

export async function handleArticleDislike(
  articleId: number, 
  userLiked: boolean, 
  userDisliked: boolean,
  onSuccess: (newLiked: boolean, newDisliked: boolean) => void,
  onError: () => void
) {
  if (!auth.currentUser) {
    return false;
  }

  try {
    const articleRef = doc(db, 'articles', articleId.toString());
    const userInteractionRef = doc(db, 'userInteractions', `${auth.currentUser.uid}_${articleId}`);

    if (!userDisliked) {
      // Dislike the article
      await setDoc(articleRef, { dislikes: increment(1) }, { merge: true });
      
      if (userLiked) {
        // Remove like if it exists
        await setDoc(articleRef, { likes: increment(-1) }, { merge: true });
      }
      
      await setDoc(userInteractionRef, {
        liked: false,
        disliked: true,
        userId: auth.currentUser.uid,
        articleId
      }, { merge: true });
      
      onSuccess(false, true);
    } else {
      // Remove dislike
      await setDoc(articleRef, { dislikes: increment(-1) }, { merge: true });
      await setDoc(userInteractionRef, { disliked: false }, { merge: true });
      
      onSuccess(userLiked, false);
    }
    
    return true;
  } catch (error) {
    console.error("Error in handleDislike:", error);
    onError();
    return false;
  }
}

export function handleArticleShare() {
  try {
    if (navigator.share) {
      navigator.share({
        title: 'Partager cet article',
        url: window.location.href,
      });
      return true;
    } else {
      navigator.clipboard.writeText(window.location.href);
      return true;
    }
  } catch (error) {
    console.error("Error sharing:", error);
    return false;
  }
}
