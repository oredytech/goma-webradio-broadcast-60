
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Article from "./pages/Article";
import News from "./pages/News";
import About from "./pages/About";
import Podcasts from "./pages/Podcasts";
import PodcastFeedEpisodes from "./pages/PodcastFeedEpisodes";
import PodcastPlayer from "./pages/PodcastPlayer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import RadioPlayer from "./components/radio/RadioPlayer";
import { usePageSEO } from "./hooks/useSEO";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

// Wrapper component to conditionally render header, footer, and player
const AppLayout = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState("Goma Webradio Live");
  const [currentArtist, setCurrentArtist] = useState("");
  const location = useLocation();
  
  // Don't show header, footer, or player on dashboard
  const isDashboard = location.pathname.includes('/dashboard');

  usePageSEO(
    "GOMA WEBRADIO",
    "La voix de Goma - Actualités, Podcasts et Émissions en direct",
    "/GOWERA__3_-removebg-preview.png"
  );

  return (
    <>
      {!isDashboard && <Header />}
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
        {/* Routes for articles - support both formats */}
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
        {/* News routes */}
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
          path="/podcasts/:feedId" 
          element={
            <PodcastFeedEpisodes 
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentAudio={currentAudio}
              setCurrentAudio={setCurrentAudio}
            />
          } 
        />
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
        <Route path="/recherche" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isDashboard && <Footer />}
      {!isDashboard && (
        <RadioPlayer
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentAudio={currentAudio}
          setCurrentAudio={setCurrentAudio}
        />
      )}
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
