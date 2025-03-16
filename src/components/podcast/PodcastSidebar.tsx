
import { Button } from "@/components/ui/button";
import { Share2, MessageSquare } from "lucide-react";
import { PodcastEpisode } from "@/hooks/usePodcastFeed";

interface PodcastSidebarProps {
  episode: PodcastEpisode;
  onSocialAction: () => void;
}

const PodcastSidebar = ({ episode, onSocialAction }: PodcastSidebarProps) => {
  const episodeImage = episode.itunes?.image || '/placeholder.svg';
  
  return (
    <div className="md:col-span-4">
      <div className="bg-secondary/50 rounded-lg overflow-hidden">
        <img 
          src={episodeImage} 
          alt={episode.title} 
          className="w-full aspect-square object-cover"
        />
        <div className="p-4 bg-secondary/70">
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastSidebar;
