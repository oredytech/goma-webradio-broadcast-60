import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, Bell } from 'lucide-react';

export default function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and not already granted/denied
    if ('Notification' in window && Notification.permission === 'default') {
      const dismissed = localStorage.getItem('notification-permission-dismissed');
      
      if (!dismissed) {
        // Show prompt after 5 seconds
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAllow = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('🔔 Notifications activées', {
        body: 'Vous recevrez une notification pour chaque nouvel article',
        icon: '/pwa-192x192.png',
      });
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('notification-permission-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 animate-in slide-in-from-top-4">
      <Card className="p-4 shadow-lg border-2">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-primary/10 flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">
              Activer les notifications
            </h3>
            <p className="text-xs text-muted-foreground">
              Recevez une notification à chaque nouvel article publié
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAllow}
            size="sm"
            className="flex-1"
          >
            <Bell className="w-4 h-4 mr-2" />
            Activer
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
          >
            Plus tard
          </Button>
        </div>
      </Card>
    </div>
  );
}
