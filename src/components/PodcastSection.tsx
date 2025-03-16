
import { useState, useEffect } from 'react';
import { usePodcastFeed, PodcastEpisode } from '@/hooks/usePodcastFeed';
import { useToast } from '@/hooks/use-toast';
import PodcastSectionHeader from './podcast/PodcastSectionHeader';
import PodcastSectionItem from './podcast/PodcastSectionItem';
import PodcastSectionLoading from './podcast/PodcastSectionLoading';
import PodcastSectionEmpty from './podcast/PodcastSectionEmpty';
import PodcastSectionFooter from './podcast/PodcastSectionFooter';

interface PodcastSectionProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
  setCurrentTrack?: (title: string) => void;
  setCurrentArtist?: (artist: string) => void;
}

const PodcastSection = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
  setCurrentTrack,
  setCurrentArtist,
}: PodcastSectionProps) => {
  const { data: episodes, isLoading, refetch } = usePodcastFeed();
  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Only display the 3 most recent episodes
  const recentEpisodes = episodes ? episodes.slice(0, 3) : [];

  // Effect to auto-retry loading if no episodes are loaded
  useEffect(() => {
    if (!isLoading && (!episodes || episodes.length === 0)) {
      const timer = setTimeout(() => {
        refetch();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [episodes, isLoading, refetch]);

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    if (currentAudio === episode.enclosure.url) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    setLoadingEpisode(episode.enclosure.url);
    setCurrentAudio(episode.enclosure.url);
    setIsPlaying(true);

    // Set track and artist information for media session if provided
    if (setCurrentTrack) {
      setCurrentTrack(episode.title);
    }
    
    if (setCurrentArtist) {
      setCurrentArtist("Goma Webradio");
    }

    // Create a new audio element to preload content, but with error handling
    const audio = new Audio();
    
    // Handle errors during loading
    audio.onerror = () => {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger l'audio. Veuillez réessayer.",
        variant: "destructive",
      });
      setLoadingEpisode(null);
    };
    
    // Handle successful loading
    audio.oncanplay = () => {
      setLoadingEpisode(null);
    };
    
    // Set timeout to avoid infinite loading state
    const loadingTimeout = setTimeout(() => {
      if (loadingEpisode === episode.enclosure.url) {
        setLoadingEpisode(null);
      }
    }, 10000);
    
    // Clean up timeout if component unmounts
    audio.src = episode.enclosure.url;
    audio.load();
    
    return () => clearTimeout(loadingTimeout);
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PodcastSectionHeader />

        {isLoading ? (
          <PodcastSectionLoading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentEpisodes.length > 0 ? (
              recentEpisodes.map((episode, index) => (
                <PodcastSectionItem
                  key={index}
                  episode={episode}
                  isPlaying={isPlaying}
                  currentAudio={currentAudio}
                  loadingEpisode={loadingEpisode}
                  handlePlayEpisode={handlePlayEpisode}
                />
              ))
            ) : (
              <PodcastSectionEmpty onRetry={refetch} />
            )}
          </div>
        )}
        
        <PodcastSectionFooter />
      </div>
    </section>
  );
};

export default PodcastSection;
