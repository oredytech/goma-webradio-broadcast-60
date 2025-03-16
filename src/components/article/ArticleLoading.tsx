
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ArticleLoadingProps {
  message?: string;
}

const ArticleLoading = ({ message = "Chargement de l'article..." }: ArticleLoadingProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <div className="text-xl text-white">{message}</div>
      </div>
      <Footer />
    </div>
  );
};

export default ArticleLoading;
