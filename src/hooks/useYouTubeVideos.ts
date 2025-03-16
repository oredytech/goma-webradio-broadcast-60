
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// YouTube data types
export interface YouTubeVideo {
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

// Fallback videos to display when API quota is exceeded
export const fallbackVideos: YouTubeVideo[] = [
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

export const useYouTubeVideos = (channelId: string, apiKey: string) => {
  return useQuery({
    queryKey: ['youtube-videos', channelId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=3&order=date&type=video&key=${apiKey}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('YouTube API error:', errorData);
          
          // If quota exceeded, use fallback videos instead of throwing error
          if (errorData.error?.errors?.[0]?.reason === "quotaExceeded") {
            console.log("Using fallback videos due to quota exceeded");
            return fallbackVideos;
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
        return fallbackVideos;
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Helper function to clean video titles
export const cleanTitle = (title: string) => {
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
