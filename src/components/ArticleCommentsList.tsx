
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Comment {
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}

interface ArticleCommentsListProps {
  articleId: number;
  commentsUpdated?: boolean;
}

const ArticleCommentsList = ({ articleId, commentsUpdated }: ArticleCommentsListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const articleRef = doc(db, 'articles', articleId.toString());
        const articleDoc = await getDoc(articleRef);
        
        if (articleDoc.exists()) {
          const data = articleDoc.data();
          setComments(data.commentsList || []);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commentaires:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [articleId, commentsUpdated]);

  if (isLoading) {
    return <div className="text-center p-4 text-white">Chargement des commentaires...</div>;
  }

  if (comments.length === 0) {
    return <div className="text-center p-4 text-white">Aucun commentaire pour le moment. Soyez le premier à commenter!</div>;
  }

  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-xl font-bold text-white">Commentaires ({comments.length})</h3>
      
      {comments.map((comment, index) => {
        // Parse the ISO date string
        const commentDate = new Date(comment.createdAt);
        const timeAgo = formatDistanceToNow(commentDate, { addSuffix: true, locale: fr });
        
        return (
          <div key={index} className="bg-white/10 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-bold text-white">{comment.userName}</div>
              <div className="text-xs text-gray-400">{timeAgo}</div>
            </div>
            <div className="text-gray-200">{comment.content}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ArticleCommentsList;
