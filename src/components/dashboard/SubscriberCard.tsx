
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriberCardProps {
  count: string;
  growth: string;
}

const SubscriberCard = ({ count, growth }: SubscriberCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border border-border flex flex-col items-center text-center">
      <Mail className="w-10 h-10 text-primary mb-4" />
      <div className="text-3xl font-bold mb-1">{count}</div>
      <h3 className="text-lg font-medium mb-2">Abonnés</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Votre liste principale augmente de {growth} par mois
      </p>
      <Button variant="outline" size="sm">
        Gérer la liste
      </Button>
    </div>
  );
};

export default SubscriberCard;
