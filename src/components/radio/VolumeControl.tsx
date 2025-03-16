
import { Volume2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="hidden sm:flex items-center gap-4 w-48">
      <Volume2 className="w-5 h-5 text-white" />
      <Slider
        value={[volume]}
        onValueChange={onVolumeChange}
        max={100}
        step={1}
        className="w-full"
      />
    </div>
  );
};

export default VolumeControl;
