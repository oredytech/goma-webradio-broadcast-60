
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface VolumeControlProps {
  volume: number;
  handleVolumeChange: (value: number[]) => void;
}

const VolumeControl = ({ volume, handleVolumeChange }: VolumeControlProps) => {
  const isMuted = volume === 0;
  
  const toggleMute = () => {
    handleVolumeChange(isMuted ? [50] : [0]);
  };
  
  return (
    <div className="hidden sm:flex items-center gap-4 w-48">
      <Button 
        onClick={toggleMute}
        variant="ghost" 
        size="icon" 
        className="hover:bg-primary/20"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </Button>
      <Slider
        value={[volume]}
        onValueChange={handleVolumeChange}
        max={100}
        step={1}
        className="w-full"
      />
    </div>
  );
};

export default VolumeControl;
