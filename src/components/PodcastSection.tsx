
import { useNavigate } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { Button } from '@/components/ui/button';
import { Share2, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getPodcastSlug } from '@/utils/podcastUtils';
import { Badge } from '@/components/ui/badge';

interface PodcastSectionProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
  setCurrentTrack: (title: string) => void;
  setCurrentArtist: (artist: string) => void;
}

const PodcastSection = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
  setCurrentTrack,
  setCurrentArtist
}: PodcastSectionProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = usePodcastFeed();
  const { toast } = useToast();

  const handleOpenPodcast = (episode: any) => {
    // Create a slug from the episode title
    const slug = getPodcastSlug(episode.title);
    
    // Navigate to the podcast player page with slug only
    navigate(`/podcast/${slug}`);
  };

  const handleShare = (episode: any, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Create a slug from the episode title
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

  // Function to strip HTML tags from text
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Podcasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-secondary/50 rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-secondary/70 rounded-lg mb-4"></div>
                <div className="h-6 bg-secondary/70 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary/70 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data || !data.feedEpisodes) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Podcasts</h2>
          <Button
            variant="outline"
            onClick={() => navigate('/podcasts')}
            className="bg-primary text-white hover:bg-primary/80 hover:text-white transition-colors"
          >
            Voir plus
          </Button>
        </div>

        {/* Render each feed separately */}
        {Object.entries(data.feedEpisodes).map(([feedId, { name, episodes }]) => (
          <div key={feedId} className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white border-l-4 border-primary pl-4">{name}</h3>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                onClick={() => navigate(`/podcasts/${feedId}`)}
              >
                Les épisodes
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {episodes.slice(0, 3).map((episode, index) => (
                <div 
                  key={`${feedId}-${index}`} 
                  className="bg-secondary/50 rounded-lg overflow-hidden hover:bg-secondary/70 transition-all duration-300 cursor-pointer"
                  onClick={() => handleOpenPodcast(episode)}
                >
                  <img
                    src={episode.itunes?.image || '/placeholder.svg'}
                    alt={episode.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <Badge variant="outline" className="mb-2 bg-primary/20 text-primary border-primary/30">
                      {episode.feedSource}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2">{episode.title}</h3>
                    <p className="text-gray-300 line-clamp-2 mb-4">
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PodcastSection;
