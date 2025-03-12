
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Article from "./pages/Article";
import News from "./pages/News";
import About from "./pages/About";
import Podcasts from "./pages/Podcasts";
import PodcastEpisode from "./pages/PodcastEpisode";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RadioPlayer from "./components/RadioPlayer";

// Google Analytics tracking
const trackPageView = () => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
};

const queryClient = new QueryClient();

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(true);

  useEffect(() => {
    // Track initial page view
    trackPageView();
    
    // Hide player on dashboard route
    const checkRoute = () => {
      const pathname = window.location.pathname;
      setShowPlayer(!pathname.includes('/dashboard'));
      
      // Track page views on route change
      trackPageView();
    };
    
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    
    return () => {
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
              <Route 
                path="/podcast/:slug" 
                element={
                  <PodcastEpisode 
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    currentAudio={currentAudio}
                    setCurrentAudio={setCurrentAudio}
                  />
                } 
              />
              {/* Route de secours pour la compatibilité avec les anciens liens */}
              <Route 
                path="/article/id/:id" 
                element={
                  <Article 
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    currentAudio={currentAudio}
                    setCurrentAudio={setCurrentAudio}
                  />
                } 
              />
            </Routes>
            {showPlayer && (
              <RadioPlayer
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentAudio={currentAudio}
              />
            )}
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
