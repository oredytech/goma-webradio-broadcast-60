
interface ArticleHeroProps {
  title: string;
  imageUrl: string;
}

const ArticleHero = ({ title, imageUrl }: ArticleHeroProps) => {
  return (
    <div className="pt-16">
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="max-w-3xl text-center mt-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleHero;
