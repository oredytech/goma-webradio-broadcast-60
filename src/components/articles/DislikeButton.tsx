
import { ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DislikeButtonProps {
  dislikes: number;
  isActive: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

const DislikeButton = ({ dislikes, isActive, onClick, isDisabled }: DislikeButtonProps) => {
  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      onClick={onClick}
      className="gap-2"
      disabled={isDisabled}
    >
      <ThumbsDown className={isActive ? "text-white" : "text-gray-500"} />
      <span>{dislikes}</span>
    </Button>
  );
};

export default DislikeButton;
