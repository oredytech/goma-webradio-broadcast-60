
const NewsSection = () => {
  const news = [
    {
      title: "Nouveau programme musical",
      date: "9 Dec 2023",
      description: "Découvrez notre nouvelle émission dédiée à la musique congolaise moderne."
    },
    {
      title: "Interview exclusive",
      date: "8 Dec 2023",
      description: "Rencontre avec les artistes locaux de Goma."
    }
  ];

  return (
    <section className="py-16 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">Actualités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map((item, index) => (
            <div key={index} className="bg-accent/50 rounded-lg p-6 hover:bg-accent/70 transition-all duration-300">
              <span className="text-primary text-sm">{item.date}</span>
              <h3 className="text-xl font-bold text-foreground mt-2">{item.title}</h3>
              <p className="text-foreground mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
