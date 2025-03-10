
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LikeButtonProps {
  likes: number;
  isActive: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

const LikeButton = ({ likes, isActive, onClick, isDisabled }: LikeButtonProps) => {
  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      onClick={onClick}
      className="gap-2"
      disabled={isDisabled}
    >
      <ThumbsUp className={isActive ? "text-white" : "text-gray-500"} />
      <span>{likes}</span>
    </Button>
  );
};

export default LikeButton;
