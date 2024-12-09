const VideoSection = () => {
  const videos = [
    {
      title: "Festival de Goma 2023",
      duration: "15:30",
      thumbnail: "/lovable-uploads/adebaece-85e2-451f-b4da-a21242258331.png"
    },
    {
      title: "Concert Live",
      duration: "25:45",
      thumbnail: "/lovable-uploads/adebaece-85e2-451f-b4da-a21242258331.png"
    }
  ];

  return (
    <section className="py-16 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Vidéos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg bg-secondary/50">
              <div className="aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">{video.title}</h3>
                  <span className="text-primary text-sm">{video.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;