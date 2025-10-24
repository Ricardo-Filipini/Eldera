import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Quiz } from './components/Quiz';
import { MemeGenerator } from './components/MemeGenerator';
import { Guestbook } from './components/Guestbook';
import { NicknameGenerator } from './components/NicknameGenerator';
import { LegendaryMoments } from './components/LegendaryMoments';
import { FloatingImage } from './components/FloatingImage';
import { AdventureGame } from './components/AdventureGame';
import { eldinFloatingImages } from './media';

const App: React.FC = () => {
  const [showFloatingImages, setShowFloatingImages] = useState(false);

  useEffect(() => {
    // Delay showing images to let the page load
    const timer = setTimeout(() => setShowFloatingImages(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-x-hidden font-sans bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-slate-800 via-gray-900 to-black">
      {showFloatingImages && eldinFloatingImages.map((src, index) => (
        <FloatingImage key={index} src={src} index={index} />
      ))}
      
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Hero />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-12">
            <NicknameGenerator />
            <Quiz />
          </div>
          
          <AdventureGame />

          <MemeGenerator />
          
          <LegendaryMoments />

          <Guestbook />
        </main>
        
        <footer className="text-center py-8 text-gray-500">
          <p>Feito com zueira e admiração para a lenda viva, Eldin.</p>
          <p>&copy; {new Date().getFullYear()} Os Amigos do Monstro.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;