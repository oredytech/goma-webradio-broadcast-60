
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Article from "./pages/Article";
import News from "./pages/News";
import About from "./pages/About";
import Podcasts from "./pages/Podcasts";
import PodcastPlayer from "./pages/PodcastPlayer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import RadioPlayer from "./components/RadioPlayer";
import { usePageSEO } from "./hooks/useSEO";

const queryClient = new QueryClient();

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState("Goma Webradio Live");
  const [currentArtist, setCurrentArtist] = useState("");

  // Définir les meta tags par défaut pour le site entier
  usePageSEO(
    "GOMA WEBRADIO",
    "La voix de Goma - Actualités, Podcasts et Émissions en direct",
    "/GOWERA__3_-removebg-preview.png"
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <Index 
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                />
              } 
            />
            {/* Routes d'articles avec et sans ID (pour compatibilité) */}
            <Route 
              path="/article/:id/:slug" 
              element={
                <Article 
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                />
              } 
            />
            <Route 
              path="/article/:slug" 
              element={
                <Article 
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                />
              } 
            />
            <Route path="/actualites/*" element={<News />} />
            <Route path="/actualites/politique" element={<News filter="politique" />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/podcasts" 
              element={
                <Podcasts 
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                />
              } 
            />
            {/* Routes pour podcasts avec et sans ID pour compatibilité */}
            <Route 
              path="/podcast/:episodeId/:slug" 
              element={
                <PodcastPlayer 
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                />
              } 
            />
            <Route 
              path="/podcast/:slug" 
              element={
                <PodcastPlayer 
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                />
              } 
            />
            {/* Page 404 qui tente de trouver des correspondances */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <RadioPlayer
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentAudio={currentAudio}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
