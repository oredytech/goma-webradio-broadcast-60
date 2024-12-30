const Footer = () => {
  return (
    <footer className="bg-secondary/80 backdrop-blur-sm border-t border-primary/20 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Goma Webradio</h3>
            <p className="text-gray-300">
              Votre radio en ligne dédiée à la musique et à la culture de Goma.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-primary transition-colors">Accueil</a></li>
              <li><a href="/programmes" className="text-gray-300 hover:text-primary transition-colors">Programmes</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary/20 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Goma Webradio. Tous droits réservés.</p>
          <p className="mt-2">Fièrement conçu par Oredy TECHNOLOGIES</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;