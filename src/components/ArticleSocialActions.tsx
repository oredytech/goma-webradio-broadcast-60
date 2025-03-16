
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface ArticleSocialActionsProps {
  articleId: number;
}

const ArticleSocialActions = ({ articleId }: ArticleSocialActionsProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    // Generate an article slug (simplified version)
    // In a real scenario, you might want to fetch the actual article title
    const shareUrl = `${window.location.origin}/article/${articleId}`;
    
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
