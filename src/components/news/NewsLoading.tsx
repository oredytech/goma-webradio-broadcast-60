
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NewsLoading = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <div className="pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
      <Footer />
    </div>
  );
};

export default NewsLoading;
