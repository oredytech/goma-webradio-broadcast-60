
import { Button } from "@/components/ui/button";
import { Play, Pause, Calendar, Clock, ArrowLeft, Loader2, Share2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { PodcastEpisode } from "@/hooks/usePodcastFeed";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

interface PodcastContentProps {
  episode: PodcastEpisode;
  isPlaying: boolean;
  currentAudio: string | null;
  loadingEpisode: string | null;
  onPlayEpisode: () => void;
}

const PodcastContent = ({ 
  episode, 
  isPlaying, 
  currentAudio, 
  loadingEpisode, 
  onPlayEpisode 
}: PodcastContentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  // Vérification de la validité de l'URL
  const hasValidUrl = Boolean(episode.enclosure?.url && episode.enclosure.url.startsWith('http'));

  const handleSocialAction = () => {
    toast({
      title: "Fonctionnalité limitée",
      description: "Les interactions sociales sont temporairement indisponibles",
      variant: "destructive",
    });
  };

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      
      if (navigator.share) {
        await navigator.share({
          title: episode.title,
          url: shareUrl
        });
        sonnerToast.success('Partagé avec succès!');
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        await navigator.clipboard.writeText(shareUrl);
        sonnerToast.success('Lien copié dans le presse-papier!');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast({
        title: "Erreur de partage",
        description: "Une erreur est survenue lors du partage",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="md:col-span-8">
      <Button 
        variant="ghost" 
        className="text-white mb-8 hover:bg-white/10"
        onClick={() => navigate('/podcasts')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux podcasts
      </Button>

      <div className="bg-secondary/30 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-4">{episode.title}</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(episode.pubDate)}</span>
          </div>
          {episode.itunes?.duration && (
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              <span>{episode.itunes.duration}</span>
            </div>
          )}
        </div>
        
        <div className="prose prose-invert max-w-none mb-8" 
          dangerouslySetInnerHTML={{ __html: episode.description || '' }} 
        />
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            {loadingEpisode === episode.enclosure?.url && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
                <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
              </div>
            )}
            <Button
              onClick={onPlayEpisode}
              className="w-full sm:w-auto group relative z-10"
              size="lg"
              variant={currentAudio === episode.enclosure?.url && isPlaying ? "secondary" : "default"}
              disabled={loadingEpisode === episode.enclosure?.url || !hasValidUrl}
            >
              {currentAudio === episode.enclosure?.url && isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Mettre en pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Écouter l'épisode
                </>
              )}
            </Button>
          </div>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleSocialAction}
            className="gap-2"
          >
            <MessageSquare className="text-gray-300 w-5 h-5" />
            <span>Commenter</span>
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="text-gray-300 w-5 h-5" />
            <span>Partager</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PodcastContent;
