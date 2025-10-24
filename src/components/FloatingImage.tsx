import React, { useState, CSSProperties } from 'react';

interface FloatingImageProps {
  src: string;
  index: number;
}

const createRandomStyle = (seed: number): CSSProperties => {
  const size = 60 + (seed % 7) * 10; // 60px to 120px
  return {
    top: `${10 + (seed % 81)}vh`, // 10% to 90%
    left: `${5 + (seed % 91)}vw`, // 5% to 95%
    width: `${size}px`,
    animationDuration: `${14 + (seed % 10)}s`,
    zIndex: 10,
  };
};

export const FloatingImage: React.FC<FloatingImageProps> = ({ src, index }) => {
  const [style, setStyle] = useState<CSSProperties>(() => createRandomStyle(index));
  const [isPopped, setIsPopped] = useState(false);

  const handleClick = () => {
    setIsPopped(true);
    setTimeout(() => {
      setIsPopped(false);
      // Use Date.now() for more randomness on subsequent clicks
      setStyle(createRandomStyle(Date.now() + index)); 
    }, 300); // duration of the pop animation
  };

  return (
    <img
      src={src}
      alt="Eldin's floating face"
      className={`floating fixed rounded-full opacity-25 cursor-pointer transition-all duration-500 ${isPopped ? 'popping' : ''}`}
      style={style}
      onClick={handleClick}
    />
  );
};