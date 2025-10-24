
import React from 'react';
import { eldinHeroImage } from '../media';

export const Hero: React.FC = () => {
  return (
    <section className="text-center my-16">
      <img 
        src={eldinHeroImage} 
        alt="A Lenda, Eldin" 
        className="w-48 h-48 md:w-64 md:h-64 rounded-full mx-auto mb-6 border-4 border-purple-500 shadow-lg shadow-purple-500/50 object-cover"
      />
      <h2 className="text-4xl md:text-6xl font-bold mb-2">Parabéns, Eldin!</h2>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        Hoje celebramos o homem que transformou a engenharia em uma arte, a festa em uma ciência e a zueira em uma religião. Prepare-se para uma viagem pelas suas lendas.
      </p>
    </section>
  );
};
