
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

const CHANNEL_ID = "UC6RtsClui6cA5msIiWWxTZQ";
const API_KEY = "AIzaSyAm1eWQTfpnRIPKIPw4HTZDOgWuciITktI"; // YouTube API Key

// Fallback videos to display when API quota is exceeded
const fallbackVideos = [
  {
    id: { videoId: "dQw4w9WgXcQ" },
    snippet: {
      title: "Reportage: Vie quotidienne à Goma",
      thumbnails: {
        high: {
          url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
        }
      },
      publishedAt: "2025-02-15T14:00:00Z"
    }
  },
  {
    id: { videoId: "GaWYl6dzj0I" },
    snippet: {
      title: "Musique et traditions du Nord-Kivu",
      thumbnails: {
        high: {
          url: "https://i.ytimg.com/vi/GaWYl6dzj0I/hqdefault.jpg"
        }
      },
      publishedAt: "2025-02-10T14:00:00Z"
    }
  },
  {
    id: { videoId: "M24K_7JR_TA" },
    snippet: {
      title: "Festival culturel: Richesses du Congo",
      thumbnails: {
        high: {
          url: "https://i.ytimg.com/vi/M24K_7JR_TA/hqdefault.jpg"
        }
      },
      publishedAt: "2025-02-05T14:00:00Z"
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
          const errorData = await response.json();
          console.error('YouTube API error:', errorData);
          
          // If quota exceeded, use fallback videos instead of throwing error
          if (errorData.error?.errors?.[0]?.reason === "quotaExceeded") {
            console.log("Using fallback videos due to quota exceeded");
            return fallbackVideos as YouTubeVideo[];
          }
          
          throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        return data.items as YouTubeVideo[];
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Erreur lors du chargement des vidéos');
        
        // Return fallback videos on any error
        console.log("Using fallback videos due to error");
        return fallbackVideos as YouTubeVideo[];
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-secondary/50 rounded-lg"></div>
                <div className="h-4 bg-secondary/50 rounded mt-4 w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render videos even if there was an error (we're using fallbacks)
  const displayedVideos = videos || fallbackVideos;

  return (
    <section className="py-16 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedVideos.map((video) => (
            <div
              key={video.id.videoId}
              className="group relative overflow-hidden rounded-lg bg-secondary/50 transition-transform hover:scale-105"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={cleanTitle(video.snippet.title)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback image if thumbnail fails to load
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
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
