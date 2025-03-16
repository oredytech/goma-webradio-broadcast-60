
import { useState } from 'react';
import { usePodcastFeed, PodcastEpisode } from '@/hooks/usePodcastFeed';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PodcastGrid from '@/components/podcast/PodcastGrid';
import PodcastsLoading from '@/components/podcast/PodcastsLoading';

interface PodcastsProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (url: string | null) => void;
}

const Podcasts = ({
  isPlaying,
  setIsPlaying,
  currentAudio,
  setCurrentAudio,
}: PodcastsProps) => {
  const { data: episodes, isLoading } = usePodcastFeed();
  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    if (currentAudio === episode.enclosure.url) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    setLoadingEpisode(episode.enclosure.url);
    setCurrentAudio(episode.enclosure.url);
    setIsPlaying(true);

    // Simuler la fin du chargement lorsque l'audio commence à jouer
    const audio = new Audio(episode.enclosure.url);
    audio.addEventListener('canplay', () => {
      setLoadingEpisode(null);
    });
  };

  if (isLoading) {
    return <PodcastsLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-12">Tous les épisodes</h1>
        {episodes && (
          <PodcastGrid
            episodes={episodes}
            isPlaying={isPlaying}
            currentAudio={currentAudio}
            loadingEpisode={loadingEpisode}
            onPlayEpisode={handlePlayEpisode}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Podcasts;
