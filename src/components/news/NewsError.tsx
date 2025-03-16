
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface NewsErrorProps {
  onRetry: () => void;
}

const NewsError = ({ onRetry }: NewsErrorProps) => {
  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <div className="pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Une erreur est survenue lors du chargement des articles.</p>
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsError;
