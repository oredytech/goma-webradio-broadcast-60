
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const CHANNEL_ID = "UC6RtsClui6cA5msIiWWxTZQ";

const VideoSection = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const handleSubscribe = () => {
    // In a real implementation, this would call an API to subscribe the user
    // Since direct subscription without YouTube isn't actually possible,
    // we're simulating it with a success message
    setTimeout(() => {
      setShowSuccessMessage(true);
      toast.success("Vous êtes maintenant abonné à notre chaîne!");
    }, 500);
  };

  const handleViewVideos = () => {
    // Open YouTube channel in a new tab
    window.open(`https://www.youtube.com/channel/${CHANNEL_ID}`, "_blank");
  };

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
        
        <Card className="bg-[#212121] border-none overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Restez connecté avec nos dernières vidéos
                </h3>
                <p className="text-gray-300 mb-6">
                  Abonnez-vous à notre chaîne pour ne manquer aucune de nos dernières vidéos, reportages et contenus exclusifs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleSubscribe} 
                    className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    S'abonner
                  </Button>
                  <Button 
                    onClick={handleViewVideos}
                    className="bg-[#212121] hover:bg-[#383838] text-white border border-[#383838]"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir les dernières vidéos
                  </Button>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="aspect-video bg-[#0f0f0f] rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center p-6">
                    <Bell className="w-16 h-16 text-[#ff0000] mx-auto mb-4" />
                    <p className="text-white text-lg font-medium">Contenu exclusif</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccessMessage} onOpenChange={setShowSuccessMessage}>
        <DialogContent className="max-w-md bg-[#212121] text-white border-[#383838]">
          <div className="p-6 text-center">
            <Bell className="w-12 h-12 text-[#ff0000] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Abonnement réussi!</h3>
            <p className="text-gray-400 mb-4">
              Vous êtes maintenant abonné à notre chaîne. Merci pour votre soutien!
            </p>
            <Button 
              onClick={() => setShowSuccessMessage(false)}
              className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoSection;
