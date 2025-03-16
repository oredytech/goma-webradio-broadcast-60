
import { Link, LinkProps } from "react-router-dom";
import React from "react";

export interface NavigationLinkProps extends LinkProps {
  children: React.ReactNode;
  to: string;
  className?: string;
  onClick?: () => void | Promise<void>;
}

const NavigationLink = ({ 
  children, 
  to, 
  className = "", 
  onClick,
  ...props 
}: NavigationLinkProps) => {
  const handleClick = async (e: React.MouseEvent) => {
    if (onClick) {
      await onClick();
    }
  };

  return (
    <Link
      to={to}
      className={`text-white hover:text-primary transition-colors duration-200 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavigationLink;
