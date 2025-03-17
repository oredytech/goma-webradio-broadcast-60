
import { Grid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ViewToggleProps {
  viewMode: string;
  onViewChange: (value: string) => void;
}

const ViewToggle = ({ viewMode, onViewChange }: ViewToggleProps) => {
  return (
    <ToggleGroup 
      type="single" 
      defaultValue="grid" 
      value={viewMode}
      onValueChange={(value) => value && onViewChange(value)}
      className="bg-secondary/70 rounded-md p-1"
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
