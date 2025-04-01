
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PodcastDetails from '@/components/podcast/PodcastDetails';
import PodcastLoading from '@/components/podcast/PodcastLoading';
import PodcastNotFound from '@/components/podcast/PodcastNotFound';
import SimilarPodcasts from '@/components/podcast/SimilarPodcasts';

// New refactored components
import PodcastHero from './podcast/PodcastHero';
import EpisodeNavigation from './podcast/EpisodeNavigation';
import PodcastMetaTags from './podcast/PodcastMetaTags';
import { useEpisodeFinder } from './podcast/useEpisodeFinder';
import { useEpisodeNavigation } from './podcast/useEpisodeNavigation';
import PodcastHeader from '@/components/podcast/PodcastHeader';

interface PodcastPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const PodcastPlayer = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: PodcastPlayerProps) => {
  const navigate = useNavigate();
  const { podcastData, isLoading, foundEpisode, foundIndex } = useEpisodeFinder();
  
  const { 
    hasPrevious, 
    hasNext, 
    previousTitle, 
    nextTitle, 
    navigateToPreviousEpisode, 
    navigateToNextEpisode 
  } = useEpisodeNavigation({
    foundIndex,
    podcastData,
    setCurrentAudio,
    setIsPlaying
  });

  const handlePlayEpisode = () => {
    if (foundEpisode) {
      if (currentAudio === foundEpisode.enclosure.url) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentAudio(foundEpisode.enclosure.url);
        setIsPlaying(true);
      }
    }
  };

  if (isLoading) {
    return <PodcastLoading />;
  }

  if (!foundEpisode) {
    return <PodcastNotFound />;
  }

  const podcastImage = foundEpisode.itunes?.image || "/GOWERA__3_-removebg-preview.png";
  const podcastTitle = foundEpisode.title;
  const podcastDescription = foundEpisode.description || "Écoutez ce podcast sur GOMA WEBRADIO";
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black text-white">
      <PodcastMetaTags 
        title={podcastTitle}
        description={podcastDescription}
        imageUrl={podcastImage}
        currentUrl={currentUrl}
      />
      
      <Header />
      
      <PodcastHero 
        title={podcastTitle}
        description={podcastDescription}
        imageUrl={podcastImage}
        episode={foundEpisode}
        onPlayClick={handlePlayEpisode}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          
          <EpisodeNavigation 
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            navigateToPreviousEpisode={navigateToPreviousEpisode}
            navigateToNextEpisode={navigateToNextEpisode}
            previousTitle={previousTitle}
            nextTitle={nextTitle}
          />
        </div>
        
        <PodcastHeader 
          episode={foundEpisode}
          onPlayClick={handlePlayEpisode}
        />
        
        <div className="mb-12">
          <PodcastDetails 
            episode={foundEpisode}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentAudio={currentAudio}
            setCurrentAudio={setCurrentAudio}
          />
        </div>

        {podcastData && podcastData.allEpisodes.length > 1 && (
          <div className="mt-12">
            <SimilarPodcasts 
              currentEpisode={foundEpisode} 
              episodes={podcastData.allEpisodes}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentAudio={currentAudio}
              setCurrentAudio={setCurrentAudio}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PodcastPlayer;
