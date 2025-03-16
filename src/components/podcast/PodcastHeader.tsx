
import { PodcastEpisode } from '@/hooks/usePodcastFeed';

interface PodcastHeaderProps {
  episode: PodcastEpisode;
}

const PodcastHeader = ({ episode }: PodcastHeaderProps) => {
  return (
    <div className="aspect-video md:aspect-auto md:h-[400px] relative">
      <img 
        src={episode.itunes?.image || '/placeholder.svg'} 
        alt={episode.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 line-clamp-2">
            {episode.title}
          </h1>
          <p className="text-gray-300 mb-4">
            {new Date(episode.pubDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PodcastHeader;
