
import { Button } from "@/components/ui/button";
import { Play, Pause, Calendar, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { PodcastEpisode } from "@/hooks/usePodcastFeed";

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
        
        <div className="relative">
          {loadingEpisode === episode.enclosure.url && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
              <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
            </div>
          )}
          <Button
            onClick={onPlayEpisode}
            className="w-full sm:w-auto group relative z-10"
            size="lg"
            variant={currentAudio === episode.enclosure.url && isPlaying ? "secondary" : "default"}
            disabled={loadingEpisode === episode.enclosure.url || !hasValidUrl}
          >
            {currentAudio === episode.enclosure.url && isPlaying ? (
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
      </div>
    </div>
  );
};

export default PodcastContent;
