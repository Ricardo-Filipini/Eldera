import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { LoadingSpinner } from './LoadingSpinner';
import { generateAdventureStep, generateAdventureImage, AdventureResponse } from '../services/geminiService';
import { Content } from '@google/genai';
// FIX: Import AdventureStep type as types.ts is now a module.
import type { AdventureStep } from '../types';

export const AdventureGame: React.FC = () => {
    const [uiHistory, setUiHistory] = useState<AdventureStep[]>([]);
    const [apiHistory, setApiHistory] = useState<Content[]>([]);
    const [choices, setChoices] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialPrompt: Content = {
        role: 'user',
        parts: [{ text: "Comece a aventura. Eldin está em uma festa lotada, pronto para a caça. Qual é a primeira cena e quais são minhas primeiras escolhas?" }]
    };

    const processResponse = async (adventureData: AdventureResponse) => {
        const imageUrl = await generateAdventureImage(adventureData.imagePrompt);
        setUiHistory(prev => [...prev, { text: adventureData.narrative, imageUrl }]);
        setApiHistory(prev => [...prev, { role: 'model', parts: [{ text: JSON.stringify(adventureData) }] }]);
        
        if (adventureData.isFinal) {
            setIsGameOver(true);
            setChoices([]);
        } else {
            setChoices(adventureData.choices);
        }
    };

    const startGame = async () => {
        setUiHistory([]);
        setApiHistory([initialPrompt]);
        setChoices([]);
        setIsGameOver(false);
        setGameStarted(true);
        setError(null);
        setIsLoading(true);

        try {
            const adventureData = await generateAdventureStep([initialPrompt]);
            await processResponse(adventureData);
        } catch (e: any) {
            setError(e.message || "Falha ao iniciar a aventura.");
            setGameStarted(false);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleChoice = async (choice: string) => {
        setError(null);
        setIsLoading(true);
        
        setUiHistory(prev => [...prev, { text: `> ${choice}` }]);
        setChoices([]);

        const userChoicePrompt: Content = { role: 'user', parts: [{ text: `Eu escolho: "${choice}". O que acontece agora?` }] };
        const newApiHistory = [...apiHistory, userChoicePrompt];
        setApiHistory(newApiHistory);

        try {
            const adventureData = await generateAdventureStep(newApiHistory);
            await processResponse(adventureData);
        } catch (e: any) {
            setError(e.message || "A história tomou um rumo inesperado e bugou.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SectionWrapper title="A Conquista de Eldin" subtitle="Uma aventura de escolhas onde você guia a lenda.">
            {!gameStarted ? (
                <div className="text-center">
                    <p className="mb-4">Ajude Eldin a navegar pelos perigos da vida noturna e cumprir seu destino de macho alfa reprodutor. Suas escolhas definem a lenda.</p>
                    <button onClick={startGame} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                        Começar Aventura
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {uiHistory.map((step, index) => (
                        <div key={index} className="bg-gray-900/50 p-4 rounded-lg animate-fade-in">
                            {step.imageUrl && (
                                <img src={step.imageUrl} alt={`Ilustração da cena ${index + 1}`} className="w-full h-auto max-h-80 object-contain rounded-lg mb-4" />
                            )}
                            <p className="text-gray-300 whitespace-pre-wrap">{step.text}</p>
                        </div>
                    ))}

                    {isLoading && <div className="flex justify-center p-6"><LoadingSpinner message="A lenda está pensando..." /></div>}
                    
                    {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}

                    {!isLoading && !isGameOver && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {choices.map((choice, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleChoice(choice)}
                                    className="p-4 rounded-lg text-left transition-all duration-200 bg-teal-600 hover:bg-teal-500 text-white font-semibold disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {choice}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {isGameOver && !isLoading && (
                        <div className="text-center pt-6 animate-fade-in">
                            <h4 className="text-2xl font-bold text-yellow-300">FIM DA AVENTURA!</h4>
                             <button onClick={startGame} className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg">
                                Jogar Novamente
                            </button>
                        </div>
                    )}
                </div>
            )}
        </SectionWrapper>
    );
};