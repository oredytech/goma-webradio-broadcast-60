
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticleLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-accent">
      <Header />
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
      <Footer />
    </div>
  );
};

export default ArticleLoading;
