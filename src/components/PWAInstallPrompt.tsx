import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, Download } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useToast } from './ui/use-toast';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isInstallable, promptInstall } = usePWAInstall();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    
    // Show prompt after 3 seconds if installable and not dismissed
    if (isInstallable && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      toast({
        title: "Installation réussie",
        description: "GOMA WEBRADIO a été installé sur votre appareil",
      });
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <Card className="p-4 shadow-lg border-2">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
            <img 
              src="/pwa-192x192.png" 
              alt="GOMA WEBRADIO" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">
              Installer GOMA WEBRADIO
            </h3>
            <p className="text-xs text-muted-foreground">
              Accédez rapidement à toutes nos actualités et podcasts
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Installer
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