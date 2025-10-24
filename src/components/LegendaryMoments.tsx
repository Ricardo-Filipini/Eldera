
import React from 'react';
import { SectionWrapper } from './SectionWrapper';
import { legendaryMomentsMedia } from '../media';

export const LegendaryMoments: React.FC = () => {
  return (
    <SectionWrapper title="Galeria de Lendas" subtitle="Alguns momentos que cimentaram o mito.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {legendaryMomentsMedia.map((media, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
            {media.type === 'image' && (
              <img src={media.src} alt={media.caption} className="w-full h-64 object-cover" />
            )}
            {/* Can add video support here if needed */}
            <div className="absolute inset-0 bg-black/70 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm font-semibold">{media.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};