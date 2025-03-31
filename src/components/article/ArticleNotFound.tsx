
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticleNotFound = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-b dark:from-secondary dark:to-accent">
      <Header />
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="text-foreground dark:text-white text-xl">Article non trouvé</div>
      </div>
      <Footer />
    </div>
  );
};

export default ArticleNotFound;
