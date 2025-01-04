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
import RadioPlayer from "./components/RadioPlayer";

const queryClient = new QueryClient();

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  // Initialize theme
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.add(theme);
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