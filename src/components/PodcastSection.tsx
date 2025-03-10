
import { useState } from 'react';
import { Play, Pause, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createSlug } from '@/utils/articleUtils';

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
  const [episodes, setEpisodes] = useState([
    {
      title: "Guide du Retour au Travail après le COVID-19",
      description: "Dans cet épisode, nous discutons des défis du retour au travail après la pandémie et partageons des conseils pratiques pour une transition en douceur.",
      image: "https://images.unsplash.com/photo-1596720426673-e4e14290f0cc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y292aWQlMjBvZmZpY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      date: "22 Avril 2023",
      duration: "45:12",
      enclosure: {
        url: "https://ia800407.us.archive.org/29/items/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3",
      }
    },
    {
      title: "L'Avenir du Journalisme en République Démocratique du Congo",
      description: "Exploration des défis et opportunités pour les journalistes congolais à l'ère numérique. Comment la presse peut-elle rester pertinente et viable?",
      image: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "15 Mars 2023",
      duration: "38:45",
      enclosure: {
        url: "https://ia800407.us.archive.org/29/items/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3",
      }
    },
    {
      title: "Impact des Réseaux Sociaux sur la Jeunesse de Goma",
      description: "Discussion sur l'influence croissante des plateformes sociales parmi les jeunes de Goma, avec des témoignages et analyses d'experts en sciences sociales.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80",
      date: "28 Février 2023",
      duration: "42:18",
      enclosure: {
        url: "https://ia800407.us.archive.org/29/items/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3",
      }
    },
  ]);

  const [loadingEpisode, setLoadingEpisode] = useState<string | null>(null);

  const handlePlayEpisode = (episode: any) => {
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

    // Simuler la fin du chargement lorsque l'audio commence à jouer
    const audio = new Audio(episode.enclosure.url);
    audio.addEventListener('canplay', () => {
      setLoadingEpisode(null);
    });
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Nos Podcasts</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Découvrez nos podcasts sur des sujets d'actualité, interviews exclusives et analyses approfondies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {episodes.map((episode, index) => {
            const episodeSlug = createSlug(episode.title);
            return (
              <div 
                key={index} 
                className="bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <Link to={`/podcast/${episodeSlug}`}>
                  <img 
                    src={episode.image} 
                    alt={episode.title} 
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">{episode.date}</span>
                    <span className="text-sm text-gray-400">{episode.duration}</span>
                  </div>
                  <Link to={`/podcast/${episodeSlug}`}>
                    <h3 className="text-xl font-bold text-white mb-2 hover:text-primary transition-colors">{episode.title}</h3>
                  </Link>
                  <p className="text-gray-300 mb-4 line-clamp-3">{episode.description}</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      {loadingEpisode === episode.enclosure.url && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="absolute inset-0 bg-primary/30 rounded-md animate-ping"></div>
                          <Loader2 className="w-6 h-6 text-primary animate-spin absolute" />
                        </div>
                      )}
                      <Button
                        onClick={() => handlePlayEpisode(episode)}
                        className="w-full group relative z-10"
                        variant={currentAudio === episode.enclosure.url && isPlaying ? "secondary" : "default"}
                        disabled={loadingEpisode === episode.enclosure.url}
                      >
                        {currentAudio === episode.enclosure.url && isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            En lecture
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Écouter
                          </>
                        )}
                      </Button>
                    </div>
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
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="secondary" className="px-8 py-6 text-lg">
            <Link to="/podcasts">
              Voir tous nos podcasts
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
