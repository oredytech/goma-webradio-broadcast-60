import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const CHANNEL_ID = "UC6RtsClui6cA5msIiWWxTZQ";
const API_KEY = "AIzaSyDXBQDXzsBpu3M4KuQqPqz5-yfr4J9VWs0"; // Clé API publique YouTube

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
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['youtube-videos'],
    queryFn: async () => {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=3&order=date&type=video&key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      return data.items as YouTubeVideo[];
    },
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

  if (error) {
    console.error('Error fetching videos:', error);
    return (
      <section className="py-16 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
          <p className="text-red-500">Erreur lors du chargement des vidéos</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos?.map((video) => (
            <a
              key={video.id.videoId}
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-lg bg-secondary/50 transition-transform hover:scale-105"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-lg font-bold text-white line-clamp-2">
                    {video.snippet.title}
                  </h3>
                  <p className="text-sm text-primary mt-1">
                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;