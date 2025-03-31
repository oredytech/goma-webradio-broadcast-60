
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t border-border py-8 pb-24 dark:bg-accent/80 dark:border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-foreground dark:text-white mb-4">Goma Webradio</h3>
            <p className="text-muted-foreground dark:text-gray-200">
              Votre radio en ligne dédiée à la musique et à la culture de Goma.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground dark:text-white mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary">Accueil</Link></li>
              <li><Link to="/actualites" className="text-muted-foreground hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary">Actualités</Link></li>
              <li><Link to="/a-propos" className="text-muted-foreground hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary">À propos</Link></li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-muted-foreground hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary">
                      Contacts
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-card dark:bg-secondary/95 backdrop-blur-sm text-card-foreground dark:text-white border border-border dark:border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-foreground dark:text-white">Nos coordonnées</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-muted-foreground dark:text-gray-200 mt-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-primary">📍</span>
                        <p>RDCongo, Province du Nord-Kivu<br />
                          Ville de Goma/Commune de KARISIMBI</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">📞</span>
                        <div>
                          <p className="font-medium">Rédaction :</p>
                          <p>+243 851 006 476</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">📞</span>
                        <div>
                          <p className="font-medium">Direction :</p>
                          <p>+243 996886079</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-primary">✉️</span>
                        <a href="mailto:contact@gomawebradio.com" className="hover:text-primary transition-colors">
                          contact@gomawebradio.com
                        </a>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground dark:text-white mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary">Facebook</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border dark:border-primary/20 text-center text-muted-foreground dark:text-gray-200">
          <p>&copy; {new Date().getFullYear()} Goma Webradio. Tous droits réservés.</p>
          <p className="mt-2">Fièrement conçu par Oredy TECHNOLOGIES</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
