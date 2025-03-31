
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ContactDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={cn(
          "group inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-white hover:bg-primary/80"
        )}>
          <Mail className="mr-2 h-4 w-4" />
          Contacts
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card dark:bg-secondary/95 backdrop-blur-sm text-card-foreground border border-border dark:border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Nos coordonnées</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-muted-foreground mt-4">
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
  );
};

export default ContactDialog;
