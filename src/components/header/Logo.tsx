import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-xl sm:text-2xl font-bold text-primary">Goma</span>
      <span className="text-xl sm:text-2xl font-light text-white">Webradio</span>
    </Link>
  );
};

export default Logo;