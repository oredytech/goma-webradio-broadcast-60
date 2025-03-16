
import { useParams } from 'react-router-dom';
import { usePodcastFeed } from '@/hooks/usePodcastFeed';
import { useState, useEffect } from 'react';
import { createSlug } from '@/utils/articleUtils';
import { useToast } from '@/hooks/use-toast';
import { usePodcastPlayback } from '@/hooks/usePodcastPlayback';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PodcastLoading from '@/components/podcast/PodcastLoading';
import PodcastNotFound from '@/components/podcast/PodcastNotFound';
import PodcastContent from '@/components/podcast/PodcastContent';
import PodcastSidebar from '@/components/podcast/PodcastSidebar';

interface PodcastEpisodeProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const PodcastEpisode = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: PodcastEpisodeProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: episodes, isLoading } = usePodcastFeed();
  const [episodeNotFound, setEpisodeNotFound] = useState(false);
  const { toast } = useToast();
  
  const episode = episodes && slug ? episodes.find(ep => createSlug(ep.title) === slug) : undefined;
  
  const { loadingEpisode, handlePlayEpisode } = usePodcastPlayback({
    isPlaying,
    setIsPlaying,
    currentAudio,
    setCurrentAudio
  });
  
  useEffect(() => {
    if (!isLoading && !episode && episodes && episodes.length > 0 && slug) {
      setEpisodeNotFound(true);
    }
  }, [episode, isLoading, episodes, slug]);

  const handleSocialError = () => {
    toast({
      title: "Fonctionnalité limitée",
      description: "Les interactions sociales sont temporairement indisponibles",
      variant: "destructive",
    });
  };

  if (episodeNotFound) {
    return <PodcastNotFound />;
  }

  if (isLoading || !episode) {
    return <PodcastLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <PodcastSidebar 
            episode={episode} 
            onSocialAction={handleSocialError} 
          />
          
          <PodcastContent 
            episode={episode}
            isPlaying={isPlaying}
            currentAudio={currentAudio}
            loadingEpisode={loadingEpisode}
            onPlayEpisode={() => handlePlayEpisode(episode)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PodcastEpisode;
