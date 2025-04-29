
import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black dark:from-secondary dark:to-black">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-primary/5 -skew-y-6 transform origin-top-left" />
            
            {/* Content */}
            <div className="relative bg-secondary/50 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-xl border border-primary/20">
              <h1 className="text-4xl font-bold text-foreground dark:text-white mb-8">À propos de Goma Webradio</h1>
              
              <div className="space-y-6 text-foreground dark:text-gray-300 leading-relaxed">
                <p className="text-lg">
                  Créée en 2020 par Oredy Musanda, un technicien radio passionné, Goma Webradio est une station en ligne basée à Goma, en République Démocratique du Congo. Véritable vitrine de la richesse et de la diversité de la culture congolaise, notre radio s'engage à promouvoir les traditions, les talents, et les sonorités qui font vibrer le cœur du Congo.
                </p>
                
                <p className="text-lg">
                  À travers une programmation variée mêlant musique, débats culturels et émissions interactives, Goma Webradio offre un espace unique d'expression et de partage pour les artistes et les passionnés de culture. Notre mission est de connecter les Congolais et les amis du Congo, où qu'ils soient, tout en mettant en lumière les histoires et les valeurs qui nous rassemblent.
                </p>
                
                <p className="text-lg font-medium text-primary">
                  Rejoignez-nous et plongez au cœur de la culture congolaise avec Goma Webradio : la voix de Goma qui résonne au-delà des frontières.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer est déjà inclus globalement dans App.tsx */}
    </div>
  );
};

export default About;
