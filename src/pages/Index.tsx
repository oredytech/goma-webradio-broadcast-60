
import React from "react";
import RadioPlayer from "@/components/radio/RadioPlayer";
import Header from "@/components/Header";
import PodcastSection from "@/components/PodcastSection";
import VideoSection from "@/components/VideoSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ArticlesSlider from "@/components/ArticlesSlider";
import ExtraArticles from "@/components/ExtraArticles";
import { Play, Pause } from "lucide-react";
import { usePageSEO } from "@/hooks/useSEO";

interface IndexProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const Index = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: IndexProps) => {
  // Configurer le SEO pour la page d'accueil
  usePageSEO(
    "GOMA WEBRADIO", 
    "La voix de Goma - Actualités, Podcasts et Émissions en direct. Fasi ya Ndule na ma infos za palet",
    "/GOWERA__3_-removebg-preview.png"
  );
  
  const toggleRadioPlay = () => {
    if (currentAudio) {
      setCurrentAudio(null);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-accent dark:from-secondary dark:to-accent">
      <Header />
      
      {/* Hero Section with Play Button */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/5ae4e570-d67b-4af1-934b-7e4050e720c9.png')] opacity-20 bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in space-y-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground dark:text-white mb-6">
              Goma Webradio
            </h1>
            <p className="text-xl text-foreground dark:text-gray-200 max-w-2xl mx-auto">
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

export default Index;
