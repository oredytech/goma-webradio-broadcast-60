const PodcastSection = () => {
  const podcasts = [
    {
      title: "Culture et Tradition",
      duration: "45 min",
      description: "Exploration de la richesse culturelle de Goma"
    },
    {
      title: "Musique Live",
      duration: "30 min",
      description: "Sessions live avec des artistes locaux"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Podcasts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {podcasts.map((podcast, index) => (
            <div key={index} className="bg-secondary/50 rounded-lg p-6 hover:bg-secondary/70 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{podcast.title}</h3>
                <span className="text-primary text-sm">{podcast.duration}</span>
              </div>
              <p className="text-gray-300">{podcast.description}</p>
              <button className="mt-4 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-full transition-colors">
                Écouter
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;