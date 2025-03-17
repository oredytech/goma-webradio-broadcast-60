
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { getPodcastSlug, stripHtml } from '@/utils/podcastUtils';

interface PodcastListProps {
  episodes: PodcastEpisode[];
  onOpenPodcast: (episode: PodcastEpisode) => void;
}

const PodcastList = ({ episodes, onOpenPodcast }: PodcastListProps) => {
  const { toast } = useToast();

  const handleShare = (episode: PodcastEpisode, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const slug = getPodcastSlug(episode.title);
    const shareUrl = `${window.location.origin}/podcast/${slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: episode.title,
        text: episode.description,
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Podcast thumbnail failed to load");
    // Set fallback image
    (e.target as HTMLImageElement).src = "/placeholder.svg";
  };

  return (
    <div className="space-y-4">
      {episodes.map((episode, index) => (
        <div 
          key={index}
          className="bg-secondary/50 border-0 rounded-lg hover:bg-secondary/70 transition-all cursor-pointer"
          onClick={() => onOpenPodcast(episode)}
        >
          <div className="flex flex-col sm:flex-row items-start">
            <div className="sm:w-1/4 w-full">
              <div className="aspect-video sm:aspect-square overflow-hidden rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none">
                <img 
                  src={episode.itunes?.image || '/placeholder.svg'} 
                  alt={episode.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="sm:w-3/4 w-full p-4">
              <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">{episode.title}</h3>
              <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                {episode.description ? stripHtml(episode.description) : ''}
              </p>
              <div className="flex justify-end">
                <Button
                  onClick={(e) => handleShare(episode, e)}
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodcastList;
