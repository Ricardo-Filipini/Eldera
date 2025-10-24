
import React, { useState } from 'react';
import { generateNickname } from '../services/geminiService';
import { SectionWrapper } from './SectionWrapper';
import { LoadingSpinner } from './LoadingSpinner';

export const NicknameGenerator: React.FC = () => {
  const [nickname, setNickname] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setNickname('');
    const newNickname = await generateNickname();
    setNickname(newNickname);
    setIsLoading(false);
  };

  return (
    <SectionWrapper title="Gerador de Apelidos" subtitle="Descubra a sua próxima alcunha lendária.">
      <div className="flex flex-col items-center justify-center min-h-[150px]">
        {isLoading && <LoadingSpinner message="Consultando os astros..." />}
        {nickname && !isLoading && (
          <p className="text-3xl font-bold text-center text-yellow-300 animate-pulse">{nickname}</p>
        )}
        {!nickname && !isLoading && (
            <p className="text-gray-500">Clique no botão para gerar um apelido.</p>
        )}
      </div>
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        {isLoading ? 'Gerando...' : 'Nova alcunha!'}
      </button>
    </SectionWrapper>
  );
};
