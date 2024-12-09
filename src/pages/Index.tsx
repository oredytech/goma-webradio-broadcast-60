import RadioPlayer from "@/components/RadioPlayer";
import ProgramCard from "@/components/ProgramCard";

const Index = () => {
  const programs = [
    {
      title: "Morning Vibes",
      description: "Start your day with the best music and positive energy",
      image: "/lovable-uploads/adebaece-85e2-451f-b4da-a21242258331.png",
      time: "6:00 AM - 9:00 AM"
    },
    {
      title: "Afternoon Mix",
      description: "The perfect blend of hits to keep you going through the day",
      image: "/lovable-uploads/adebaece-85e2-451f-b4da-a21242258331.png",
      time: "2:00 PM - 5:00 PM"
    },
    {
      title: "Evening Groove",
      description: "Wind down with smooth beats and relaxing tunes",
      image: "/lovable-uploads/adebaece-85e2-451f-b4da-a21242258331.png",
      time: "7:00 PM - 10:00 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/adebaece-85e2-451f-b4da-a21242258331.png')] opacity-20 bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Goma Webradio
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your digital destination for the best music, news, and entertainment
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary to-transparent" />
      </div>

      {/* Programs Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <ProgramCard key={index} {...program} />
          ))}
        </div>
      </section>

      {/* What's Next Section */}
      <section className="bg-primary/5 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">What's Next</h2>
          <div className="bg-secondary/50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Coming Up</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary font-medium">10:00 PM - 12:00 AM</p>
                  <h4 className="text-white text-lg">Late Night Jazz</h4>
                </div>
                <button className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-full transition-colors">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Radio Player */}
      <RadioPlayer />
    </div>
  );
};

export default Index;