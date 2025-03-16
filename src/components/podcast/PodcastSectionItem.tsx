
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PodcastEpisode } from '@/hooks/usePodcastFeed';
import { createSlug } from '@/utils/articleUtils';
import PodcastPlayButton from './PodcastPlayButton';
import PodcastEpisodeMeta from './PodcastEpisodeMeta';

interface PodcastSectionItemProps {
  episode: PodcastEpisode;
  isPlaying: boolean;
  currentAudio: string | null;
  loadingEpisode: string | null;
  handlePlayEpisode: (episode: PodcastEpisode) => void;
}

const PodcastSectionItem = ({
  episode,
  isPlaying,
  currentAudio,
  loadingEpisode,
  handlePlayEpisode,
}: PodcastSectionItemProps) => {
  const episodeSlug = createSlug(episode.title);

  return (
    <div 
      className="bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 hover:border-primary/40 transition-all duration-300"
    >
      <Link to={`/podcast/${episodeSlug}`}>
        <img 
          src={episode.itunes?.image || '/placeholder.svg'} 
          alt={episode.title} 
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="p-6">
        <PodcastEpisodeMeta 
          pubDate={episode.pubDate} 
          duration={episode.itunes?.duration} 
        />
        
        <Link to={`/podcast/${episodeSlug}`}>
          <h3 className="text-xl font-bold text-white mb-2 hover:text-primary transition-colors">{episode.title}</h3>
        </Link>
        <p className="text-gray-300 mb-4 line-clamp-3">{episode.description}</p>
        <div className="flex gap-2">
          <PodcastPlayButton
            episode={episode}
            isPlaying={isPlaying}
            currentAudio={currentAudio}
            loadingEpisode={loadingEpisode}
            onPlay={handlePlayEpisode}
          />
          <Button
            variant="outline"
            className="bg-transparent text-white hover:bg-white/10"
            asChild
          >
            <Link to={`/podcast/${episodeSlug}`}>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PodcastSectionItem;
