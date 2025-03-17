
import { useEffect } from 'react';
import RadioPlayer from "@/components/RadioPlayer";
import Header from "@/components/Header";
import PodcastSection from "@/components/PodcastSection";
import VideoSection from "@/components/VideoSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ArticlesSlider from "@/components/ArticlesSlider";
import ExtraArticles from "@/components/ExtraArticles";
import { Play, Pause } from "lucide-react";

interface IndexProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const Index = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: IndexProps) => {
  // Set up SEO for the homepage
  useEffect(() => {
    // Titre de la page
    document.title = "GOMA WEBRADIO";
    
    // Mise à jour des méta-tags pour SEO et Open Graph
    // Balises standards
    updateMetaTag('description', "La voix de Goma - Actualités, Podcasts et Émissions en direct. Fasi ya Ndule na ma infos za palet");
    
    // Balises Open Graph
    updateMetaTag('og:title', "GOMA WEBRADIO");
    updateMetaTag('og:description', "La voix de Goma - Actualités, Podcasts et Émissions en direct. Fasi ya Ndule na ma infos za palet");
    updateMetaTag('og:image', `${window.location.origin}/GOWERA__3_-removebg-preview.png`);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'website');
    
    // Balises Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', "GOMA WEBRADIO");
    updateMetaTag('twitter:description', "La voix de Goma - Actualités, Podcasts et Émissions en direct. Fasi ya Ndule na ma infos za palet");
    updateMetaTag('twitter:image', `${window.location.origin}/GOWERA__3_-removebg-preview.png`);
  }, []);
  
  const toggleRadioPlay = () => {
    if (currentAudio) {
      setCurrentAudio(null);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      
      {/* Hero Section with Play Button */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/5ae4e570-d67b-4af1-934b-7e4050e720c9.png')] opacity-20 bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in space-y-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Goma Webradio
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
             Fasi ya Ndule na ma infos za palet
            </p>
            
            {/* Large Play Button */}
            <div className="flex justify-center mt-12">
              <button
                onClick={toggleRadioPlay}
                className="group relative bg-primary hover:bg-primary/80 transition-all duration-300 rounded-full p-12 hover:scale-105"
              >
                <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping group-hover:animate-none"></div>
                {isPlaying && !currentAudio ? 
                  <Pause className="w-20 h-20 text-white" /> : 
                  <Play className="w-20 h-20 text-white ml-2" />
                }
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary to-transparent" />
      </div>

      {/* Articles Slider */}
      <ArticlesSlider />

      {/* Extra Articles Section */}
      <ExtraArticles />

      {/* Podcast Section */}
      <PodcastSection
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentAudio={currentAudio}
        setCurrentAudio={setCurrentAudio}
        setCurrentTrack={(title: string) => {
          if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: title,
            });
          }
        }}
        setCurrentArtist={(artist: string) => {
          if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              artist: artist,
            });
          }
        }}
      />

      {/* Video Section */}
      <VideoSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Helper function to mettre à jour les balises meta
function updateMetaTag(name: string, content: string) {
  // Vérifier s'il s'agit d'une propriété Open Graph ou d'un nom standard
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  const attribute = isProperty ? 'property' : 'name';
  
  // Chercher la balise existante
  let tag = document.querySelector(selector) as HTMLMetaElement;
  
  // Créer la balise si elle n'existe pas
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  // Mettre à jour le contenu
  tag.setAttribute('content', content);
}

export default Index;
