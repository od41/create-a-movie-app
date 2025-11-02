import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }): JSX.Element => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl opacity-90">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
