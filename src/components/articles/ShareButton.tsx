
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  onClick: () => void;
}

const ShareButton = ({ onClick }: ShareButtonProps) => {
  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="gap-2"
      onClick={onClick}
    >
      <Share2 className="text-gray-500" />
      <span>Partager</span>
    </Button>
  );
};

export default ShareButton;
