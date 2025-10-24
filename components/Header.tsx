
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-50 py-4 shadow-lg shadow-purple-500/10">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Homenagem ao Lendário Eldin
        </h1>
        <p className="text-gray-400 mt-1">O Mito. A Lenda. O Engenheiro.</p>
      </div>
    </header>
  );
};
