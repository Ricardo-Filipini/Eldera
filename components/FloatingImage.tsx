
import React from 'react';

interface FloatingImageProps {
  src: string;
  index: number;
}

export const FloatingImage: React.FC<FloatingImageProps> = ({ src, index }) => {
  const styles: React.CSSProperties[] = [
    { top: '10vh', left: '5vw', width: '80px', animationDuration: '18s' },
    { top: '20vh', left: '85vw', width: '100px', animationDuration: '14s' },
    { top: '70vh', left: '15vw', width: '60px', animationDuration: '20s' },
    { top: '80vh', left: '90vw', width: '120px', animationDuration: '16s' },
    { top: '40vh', left: '50vw', width: '70px', animationDuration: '22s' },
  ];

  const style = styles[index % styles.length];

  return (
    <img
      src={src}
      alt="Eldin's floating face"
      className="floating absolute rounded-full opacity-20 pointer-events-none"
      style={style}
    />
  );
};
