
import { Play } from "lucide-react";
import { cleanTitle, type YouTubeVideo } from "@/hooks/useYouTubeVideos";

interface VideoCardProps {
  video: YouTubeVideo;
  onClick: (videoId: string) => void;
}

const VideoCard = ({ video, onClick }: VideoCardProps) => {
  return (
    <div
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
          onClick={() => onClick(video.id.videoId)}
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
  );
};

export default VideoCard;
