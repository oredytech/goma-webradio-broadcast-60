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
            <h3 className="text-xl font-bold text-white mb-4">Informations</h3>
            <div className="space-y-4 text-gray-300">
              <p>📍 Goma, Nord-Kivu, RDC</p>
              <p>📞 +243 000 000 000</p>
              <p>✉️ contact@gomawebradio.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;