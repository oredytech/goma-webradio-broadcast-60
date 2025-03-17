
import { useNavigate } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useToast } from '@/components/ui/use-toast';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { getPodcastSlug } from '@/utils/podcastUtils';
import { stripHtml } from '@/utils/podcastUtils';

interface PodcastGridProps {
  episodes: PodcastEpisode[];
  onOpenPodcast: (episode: PodcastEpisode) => void;
}

const PodcastGrid = ({ episodes, onOpenPodcast }: PodcastGridProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <Carousel
      opts={{
        align: "start",
        loop: episodes.length > 4,
      }}
      className="w-full"
    >
      <CarouselContent>
        {episodes.map((episode, index) => (
          <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div 
              className="p-1 cursor-pointer"
              onClick={() => onOpenPodcast(episode)}
            >
              <Card className="bg-secondary/50 border-0 h-full hover:bg-secondary/70 transition-all">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={episode.itunes?.image || '/placeholder.svg'} 
                    alt={episode.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-white text-base line-clamp-2">{episode.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-300 text-sm line-clamp-2 mb-4">
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
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {episodes.length > 4 && (
        <>
          <CarouselPrevious className="left-1 sm:left-2 lg:-left-12 bg-primary text-white hover:bg-primary/80" />
          <CarouselNext className="right-1 sm:right-2 lg:-right-12 bg-primary text-white hover:bg-primary/80" />
        </>
      )}
    </Carousel>
  );
};

export default PodcastGrid;
