
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PodcastsLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-12">Tous les épisodes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="bg-secondary/50 rounded-lg p-6 animate-pulse">
              <div className="h-48 bg-secondary/70 rounded-lg mb-4"></div>
              <div className="h-6 bg-secondary/70 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-secondary/70 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PodcastsLoading;
