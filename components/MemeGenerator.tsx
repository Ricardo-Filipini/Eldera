import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { generateImageWithReference } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { eldinHeroImage, editableImages } from '../media';

type GenerationMode = 'create-image' | 'edit-image';

export const MemeGenerator: React.FC = () => {
    const [mode, setMode] = useState<GenerationMode>('create-image');
    const [prompt, setPrompt] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'edit-image' && !selectedImage) {
            setError("Por favor, selecione uma imagem para editar.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const referenceImageUrl = mode === 'create-image' ? eldinHeroImage : selectedImage!;
            const res = await generateImageWithReference(prompt, referenceImageUrl);
            setResult(res);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleModeChange = (newMode: GenerationMode) => {
        setMode(newMode);
        setError(null);
        setResult(null);
        setSelectedImage(null);
        setPrompt('');
    }

    return (
        <SectionWrapper title="Gerador de Memes IA" subtitle="Crie a próxima pérola do Eldin com o poder da Inteligência Artificial.">
            <div className="flex justify-center space-x-2 mb-6 border-b border-gray-700 pb-4">
                <button onClick={() => handleModeChange('create-image')} className={`px-4 py-2 rounded-lg font-semibold ${mode === 'create-image' ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}>Criar Imagem</button>
                <button onClick={() => handleModeChange('edit-image')} className={`px-4 py-2 rounded-lg font-semibold ${mode === 'edit-image' ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}>Editar Imagem</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'edit-image' && (
                     <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">Selecione uma imagem para editar:</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-900/50 rounded-lg">
                            {editableImages.map(imageSrc => (
                                <button
                                    type="button"
                                    key={imageSrc}
                                    onClick={() => setSelectedImage(imageSrc)}
                                    className={`rounded-lg overflow-hidden border-2 transition-all ${selectedImage === imageSrc ? 'border-purple-500 scale-105' : 'border-transparent hover:border-gray-500'}`}
                                >
                                    <img src={imageSrc} alt="Selecionável" className="w-full h-full object-cover"/>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                <div>
                    <label htmlFor="prompt" className="block mb-2 text-sm font-medium text-gray-300">
                        {mode === 'create-image' ? 'Descreva a cena (IA usará a foto do Eldin como referência):' : 'Descreva a edição que você quer fazer:'}
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={
                            mode === 'create-image' ? 'Ex: Eldin como um imperador romano, comendo pizza' :
                            'Ex: Adicione um chapéu de pirata nele'
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading || (mode === 'edit-image' && !selectedImage)} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Gerando Mágica...' : 'Gerar!'}
                </button>
            </form>

            {isLoading && <div className="mt-6 flex justify-center"><LoadingSpinner message={'Processando com a IA...'} /></div>}
            {error && <p className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
            
            {result && (
                <div className="mt-6">
                    <h4 className="text-xl font-bold text-center mb-4">Resultado:</h4>
                    <img src={result} alt="Generated Meme" className="mx-auto max-w-full rounded-lg shadow-lg"/>
                </div>
            )}
        </SectionWrapper>
    );
};