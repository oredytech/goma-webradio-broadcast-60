
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useYouTubeVideos, fallbackVideos } from "@/hooks/useYouTubeVideos";
import VideoCard from "@/components/VideoCard";

const CHANNEL_ID = "UC6RtsClui6cA5msIiWWxTZQ";
const API_KEY = "AIzaSyAm1eWQTfpnRIPKIPw4HTZDOgWuciITktI"; // YouTube API Key

const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const { data: videos, isLoading } = useYouTubeVideos(CHANNEL_ID, API_KEY);

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

  // Render videos (using fallbacks if needed)
  const displayedVideos = videos || fallbackVideos;

  return (
    <section className="py-16 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedVideos.map((video) => (
            <VideoCard 
              key={video.id.videoId}
              video={video}
              onClick={(videoId) => setSelectedVideo(videoId)}
            />
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
