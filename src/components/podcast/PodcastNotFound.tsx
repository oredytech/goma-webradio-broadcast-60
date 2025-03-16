
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PodcastNotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-white text-xl">Podcast non trouvé</div>
      </div>
      <Footer />
    </div>
  );
};

export default PodcastNotFound;
