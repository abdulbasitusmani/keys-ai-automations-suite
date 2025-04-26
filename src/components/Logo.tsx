
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'h-6',
    default: 'h-8',
    large: 'h-12'
  };
  
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="flex items-center justify-center bg-primary rounded-md p-1">
        <span className={`font-bold text-white ${size === 'small' ? 'text-lg' : size === 'large' ? 'text-3xl' : 'text-2xl'}`}>K</span>
      </div>
      <span className={`font-semibold ${size === 'small' ? 'text-lg' : size === 'large' ? 'text-3xl' : 'text-2xl'}`}>
        <span className="text-primary">KEYS</span>-<span className="text-primary">AI</span>
      </span>
    </Link>
  );
};

export default Logo;
