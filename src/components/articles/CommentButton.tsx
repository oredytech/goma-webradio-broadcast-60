
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommentButtonProps {
  comments: number;
}

const CommentButton = ({ comments }: CommentButtonProps) => {
  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="gap-2"
    >
      <MessageSquare className="text-gray-500" />
      <span>{comments}</span>
    </Button>
  );
};

export default CommentButton;
