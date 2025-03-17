
interface ProgramCardProps {
  title: string;
  description: string;
  image: string;
  time: string;
}

const ProgramCard = ({ title, description, image, time }: ProgramCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Program image failed to load:", image);
    // Set fallback image
    (e.target as HTMLImageElement).src = "/placeholder.svg";
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-all duration-300">
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <span className="text-primary text-sm font-medium">{time}</span>
        <h3 className="text-xl font-bold text-white mt-2">{title}</h3>
        <p className="text-gray-300 mt-2 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default ProgramCard;
