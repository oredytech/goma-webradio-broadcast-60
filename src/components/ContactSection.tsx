const ContactSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-secondary/50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">Nous contacter</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nom</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md bg-secondary/30 border border-primary/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md bg-secondary/30 border border-primary/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md bg-secondary/30 border border-primary/20 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Envoyer
              </button>
            </form>
          </div>
          <div className="bg-secondary/50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">Nos coordonnées</h3>
            <div className="space-y-4 text-gray-300">
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
                  <p>+243 975 043 313</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary">✉️</span>
                <a href="mailto:contact@gomawebradio.com" className="hover:text-primary transition-colors">
                  contact@gomawebradio.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;