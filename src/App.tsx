
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
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RadioPlayer from "./components/RadioPlayer";

// Google Analytics
const addGoogleAnalytics = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-ZJFRKKGTTS";
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', 'G-ZJFRKKGTTS');
};

const queryClient = new QueryClient();

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(true);

  useEffect(() => {
    // Initialize Google Analytics
    addGoogleAnalytics();
    
    // Hide player on dashboard route
    const checkRoute = () => {
      const pathname = window.location.pathname;
      setShowPlayer(!pathname.includes('/dashboard'));
    };
    
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    
    return () => {
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

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
            <Route 
              path="/article/:id" 
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
    </QueryClientProvider>
  );
};

export default App;
