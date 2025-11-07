import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Smartphone, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                <Smartphone className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                Installer GOMA WEBRADIO
              </h1>
              <p className="text-muted-foreground">
                Installez notre application pour une expérience optimale et un accès rapide
              </p>
            </div>

            {isInstalled ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Application installée !</h2>
                <p className="text-muted-foreground">
                  Vous pouvez maintenant accéder à GOMA WEBRADIO depuis votre écran d'accueil
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-semibold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Accès instantané</h3>
                      <p className="text-sm text-muted-foreground">
                        Lancez l'application directement depuis votre écran d'accueil
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-semibold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Mode hors ligne</h3>
                      <p className="text-sm text-muted-foreground">
                        Consultez vos articles préférés même sans connexion
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-semibold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Recevez les dernières actualités en temps réel
                      </p>
                    </div>
                  </div>
                </div>

                {isInstallable ? (
                  <Button
                    onClick={handleInstall}
                    size="lg"
                    className="w-full"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Installer l'application
                  </Button>
                ) : (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      {window.matchMedia('(display-mode: standalone)').matches
                        ? "L'application est déjà installée"
                        : "Pour installer l'application, utilisez le menu de votre navigateur (⋮) et sélectionnez 'Installer l'application' ou 'Ajouter à l'écran d'accueil'"}
                    </p>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}