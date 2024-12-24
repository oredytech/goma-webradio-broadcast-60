import RadioPlayer from "@/components/RadioPlayer";
import ProgramCard from "@/components/ProgramCard";
import Header from "@/components/Header";
import NewsSection from "@/components/NewsSection";
import PodcastSection from "@/components/PodcastSection";
import VideoSection from "@/components/VideoSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ArticlesSlider from "@/components/ArticlesSlider";
import { Play, Pause } from "lucide-react";

interface IndexProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
}

const Index = ({ isPlaying, setIsPlaying, currentAudio, setCurrentAudio }: IndexProps) => {
  const toggleRadioPlay = () => {
    if (currentAudio) {
      setCurrentAudio(null);
    }
    setIsPlaying(!isPlaying);
  };

  const programs = [
    {
      title: "Morning Vibes",
      description: "Start your day with the best music and positive energy",
      image: "/lovable-uploads/adebaece-85e2-451f-b4da-a21242258331.png",
      time: "6:00 AM - 9:00 AM"
    },
    {
      title: "Afternoon Mix",
      description: "The perfect blend of hits to keep you going through the day",
      image: "/lovable-uploads/adebaece-85e2-451f-b4da-a21242258331.png",
      time: "2:00 PM - 5:00 PM"
    },
    {
      title: "Evening Groove",
      description: "Wind down with smooth beats and relaxing tunes",
      image: "/lovable-uploads/adebaece-85e2-451f-b4da-a21242258331.png",
      time: "7:00 PM - 10:00 PM"
    }
  ];

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
              Your digital destination for the best music, news, and entertainment
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

      {/* Programs Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <ProgramCard key={index} {...program} />
          ))}
        </div>
      </section>

      {/* News Section */}
      <NewsSection />

      {/* Podcast Section */}
      <PodcastSection
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentAudio={currentAudio}
        setCurrentAudio={setCurrentAudio}
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
