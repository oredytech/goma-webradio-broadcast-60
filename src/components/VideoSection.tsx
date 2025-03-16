
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Play, AlertCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CHANNEL_ID = "UC6RtsClui6cA5msIiWWxTZQ";
const API_KEY = "AIzaSyAm1eWQTfpnRIPKIPw4HTZDOgWuciITktI"; // Clé API YouTube

// Vidéos de secours au cas où l'API échoue
const FALLBACK_VIDEOS = [
  {
    id: { videoId: "3tR6mKcBbT4" },
    snippet: {
      title: "Goma WebRadio - Débat sur la Culture",
      thumbnails: { 
        high: { url: "https://i.ytimg.com/vi/3tR6mKcBbT4/hqdefault.jpg" } 
      },
      publishedAt: "2025-01-15T14:30:00Z"
    }
  },
  {
    id: { videoId: "7kPMG4aCNXg" },
    snippet: {
      title: "Journal de 19h - Actualités de Goma",
      thumbnails: { 
        high: { url: "https://i.ytimg.com/vi/7kPMG4aCNXg/hqdefault.jpg" } 
      },
      publishedAt: "2025-01-20T19:00:00Z"
    }
  },
  {
    id: { videoId: "dQw4w9WgXcQ" },
    snippet: {
      title: "Événement Musical à Goma - Spectacle en direct",
      thumbnails: { 
        high: { url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" } 
      },
      publishedAt: "2025-01-25T20:30:00Z"
    }
  }
];

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [apiError, setApiError] = useState<boolean>(false);

  const cleanTitle = (title: string) => {
    return title
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .trim();
  };

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['youtube-videos'],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=3&order=date&type=video&key=${API_KEY}`
        );
        
        if (!response.ok) {
          // Si l'API renvoie une erreur, on utilise nos vidéos de secours
          console.error('YouTube API error:', await response.json());
          setApiError(true);
          return FALLBACK_VIDEOS as YouTubeVideo[];
        }
        
        const data = await response.json();
        return data.items as YouTubeVideo[];
      } catch (error) {
        console.error('Error fetching videos:', error);
        setApiError(true);
        // En cas d'erreur, on utilise nos vidéos de secours
        return FALLBACK_VIDEOS as YouTubeVideo[];
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const handleTryAgain = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-secondary/50 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary/50 animate-spin" />
                </div>
                <div className="h-4 bg-secondary/50 rounded mt-4 w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && !videos) {
    return (
      <section className="py-16 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
          <div className="bg-secondary/20 p-8 rounded-lg text-center">
            <AlertCircle className="mx-auto w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-400 mb-4">Erreur lors du chargement des vidéos</p>
            <Button onClick={handleTryAgain} variant="default">
              Réessayer
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Vidéos</h2>
          {apiError && (
            <span className="text-sm text-amber-400 flex items-center gap-2">
              <AlertCircle size={16} />
              Service limité
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos?.map((video) => (
            <div
              key={video.id.videoId}
              className="group relative overflow-hidden rounded-lg bg-secondary/50 transition-transform hover:scale-105"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={cleanTitle(video.snippet.title)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Gérer l'erreur de chargement d'image
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <button
                  onClick={() => setSelectedVideo(video.id.videoId)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-16 h-16 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-lg font-bold text-white line-clamp-2">
                    {cleanTitle(video.snippet.title)}
                  </h3>
                  <p className="text-sm text-primary mt-1">
                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoSection;
