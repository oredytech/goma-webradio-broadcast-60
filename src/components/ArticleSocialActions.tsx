
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { getArticleSlug } from '@/utils/articleUtils';
import { useWordpressArticles } from '@/hooks/useWordpressArticles';

interface ArticleSocialActionsProps {
  articleId: number;
}

const ArticleSocialActions = ({ articleId }: ArticleSocialActionsProps) => {
  const { toast } = useToast();
  const { data: articles } = useWordpressArticles();
  
  const handleShare = async () => {
    // Find the article by ID to get its slug
    const article = articles?.find(a => a.id === articleId);
    if (!article) return;
    
    const slug = getArticleSlug(article);
    const shareUrl = `${window.location.origin}/article/${slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: "GOMA WEBRADIO - Article",
        text: "Découvrez cet article sur GOMA WEBRADIO",
        url: shareUrl,
      }).catch(error => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier"
      });
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleShare}
        className="gap-2"
      >
        <Share2 className="text-gray-500" />
        <span>Partager</span>
      </Button>
    </div>
  );
};

export default ArticleSocialActions;
