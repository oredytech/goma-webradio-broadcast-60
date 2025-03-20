
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  handleSeek: (value: number) => void;
  showProgress: boolean;
}

const ProgressBar = ({ progress, handleSeek, showProgress }: ProgressBarProps) => {
  if (!showProgress) return null;
  
  return (
    <Progress 
      value={progress} 
      onSeek={handleSeek}
      className="h-2 bg-gray-600 mb-2" 
    />
  );
};

export default ProgressBar;
