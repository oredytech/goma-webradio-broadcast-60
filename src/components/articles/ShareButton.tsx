
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonProps {
  onClick?: () => void;
  title?: string;
  url?: string;
}

const ShareButton = ({ onClick, title = "Article GOMA WEBRADIO", url }: ShareButtonProps) => {
  const handleShare = async () => {
    // Si l'utilisateur a fourni une fonction onClick personnalisée, utilisez-la
    if (onClick) {
      onClick();
      return;
    }

    // Sinon, utilisez l'API Web Share si disponible, ou copiez l'URL
    try {
      const shareUrl = url || window.location.href;
      
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: shareUrl
        });
        toast.success('Partagé avec succès!');
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Lien copié dans le presse-papier!');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast.error('Une erreur est survenue lors du partage');
    }
  };

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="gap-2"
      onClick={handleShare}
    >
      <Share2 className="text-gray-500" />
      <span>Partager</span>
    </Button>
  );
};

export default ShareButton;
