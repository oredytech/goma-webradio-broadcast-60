
import { Share2, Facebook, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { getArticleSlug, getTelegramArticleSlug } from '@/utils/articleUtils';
import { useWordpressArticles } from '@/hooks/useWordpressArticles';

interface ArticleSocialActionsProps {
  articleId: number;
  articleTitle?: string;
  isTelegram?: boolean;
}

const ArticleSocialActions = ({ articleId, articleTitle, isTelegram = false }: ArticleSocialActionsProps) => {
  const { toast } = useToast();
  const { data: articles } = useWordpressArticles();
  
  const getShareUrl = () => {
    const baseUrl = "https://gomawebradio.com";
    
    if (isTelegram) {
      // For Telegram articles
      return `${baseUrl}/telegram-${articleId}`;
    } else {
      // For WordPress articles
      const article = articles?.find(a => a.id === articleId);
      if (!article) return baseUrl;
      
      const slug = getArticleSlug(article);
      return `${baseUrl}/news/${slug}`;
    }
  };

  const handleFacebookShare = () => {
    const shareUrl = getShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const shareUrl = getShareUrl();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const shareUrl = getShareUrl();
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    const shareUrl = getShareUrl();
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Lien copié",
      description: "Le lien a été copié dans le presse-papier"
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleFacebookShare}
        className="gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-0"
      >
        <Facebook size={16} />
        <span>Facebook</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsAppShare}
        className="gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white border-0"
      >
        <MessageCircle size={16} />
        <span>WhatsApp</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitterShare}
        className="gap-2 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-0"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span>X</span>
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2"
      >
        <Share2 size={16} />
        <span>Copier le lien</span>
      </Button>
    </div>
  );
};

export default ArticleSocialActions;
