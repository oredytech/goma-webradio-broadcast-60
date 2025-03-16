
import { Button } from "@/components/ui/button";
import { Share2, MessageSquare, Download } from "lucide-react";
import { PodcastEpisode } from "@/hooks/usePodcastFeed";
import { toast } from "sonner";

interface PodcastSidebarProps {
  episode: PodcastEpisode;
  onSocialAction: () => void;
}

const PodcastSidebar = ({ episode, onSocialAction }: PodcastSidebarProps) => {
  const episodeImage = episode.itunes?.image || '/placeholder.svg';
  
  const handleDownload = () => {
    if (episode.enclosure?.url) {
      // Créer un lien temporaire pour télécharger le fichier
      const link = document.createElement('a');
      link.href = episode.enclosure.url;
      link.download = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Téléchargement démarré");
    } else {
      toast.error("Impossible de télécharger cet épisode");
    }
  };
  
  return (
    <div className="md:col-span-4">
      <div className="bg-secondary/50 rounded-lg overflow-hidden">
        <img 
          src={episodeImage} 
          alt={episode.title} 
          className="w-full aspect-square object-cover"
        />
        <div className="p-4 bg-secondary/70">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onSocialAction}
              className="gap-2"
            >
              <MessageSquare className="text-gray-300" />
              <span>Commenter</span>
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onSocialAction}
              className="gap-2"
            >
              <Share2 className="text-gray-300" />
              <span>Partager</span>
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
              disabled={!episode.enclosure?.url}
            >
              <Download className="text-gray-300" />
              <span>Télécharger</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastSidebar;
