
import React, { useState, useEffect, useCallback } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { generateImage, editImage, generateVideo, checkVideoStatus, getVideoUrl } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { Operation } from '@google/genai';
import { veoLoadingMessages } from '../constants';

type GenerationMode = 'create-image' | 'edit-image' | 'create-video';
type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
type VideoAspectRatio = "16:9" | "9:16";

export const MemeGenerator: React.FC = () => {
    const [mode, setMode] = useState<GenerationMode>('create-image');
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [videoAspectRatio, setVideoAspectRatio] = useState<VideoAspectRatio>('16:9');
    
    const [hasApiKey, setHasApiKey] = useState(false);
    const [videoLoadingMessage, setVideoLoadingMessage] = useState(veoLoadingMessages[0]);


    const checkApiKey = useCallback(async () => {
        if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
            setHasApiKey(true);
        } else {
            setHasApiKey(false);
        }
    }, []);

    useEffect(() => {
        if (mode === 'create-video') {
            checkApiKey();
        }
    }, [mode, checkApiKey]);

    useEffect(() => {
        let interval: number;
        if (isLoading && mode === 'create-video') {
            interval = window.setInterval(() => {
                setVideoLoadingMessage(prev => {
                    const currentIndex = veoLoadingMessages.indexOf(prev);
                    return veoLoadingMessages[(currentIndex + 1) % veoLoadingMessages.length];
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading, mode]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
    const handleOpenSelectKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Assume success and re-check, which will update the state
            await checkApiKey();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            if (mode === 'create-image') {
                const res = await generateImage(prompt, aspectRatio);
                setResult(res);
            } else if (mode === 'edit-image' && imageFile) {
                const res = await editImage(prompt, imageFile);
                setResult(res);
            } else if (mode === 'create-video') {
                 if (!hasApiKey) {
                    setError("Por favor, selecione uma API Key para gerar vídeos.");
                    setIsLoading(false);
                    return;
                }
                let operation: Operation = await generateVideo(prompt, videoAspectRatio, imageFile);
                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    try {
                      operation = await checkVideoStatus(operation);
                    } catch (e: any) {
                       if (e.message.includes("Requested entity was not found")) {
                           setError("A API Key parece inválida. Por favor, selecione outra.");
                           setHasApiKey(false); // Reset key state
                           setIsLoading(false);
                           return;
                       }
                       throw e;
                    }
                }
                const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
                if(downloadLink){
                    const videoUrl = await getVideoUrl(downloadLink);
                    setResult(videoUrl);
                } else {
                    throw new Error("Falha na geração do vídeo.");
                }
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SectionWrapper title="Gerador de Memes IA" subtitle="Crie a próxima pérola do Eldin com o poder da Inteligência Artificial.">
            <div className="flex justify-center space-x-2 mb-6 border-b border-gray-700 pb-4">
                <button onClick={() => setMode('create-image')} className={`px-4 py-2 rounded-lg font-semibold ${mode === 'create-image' ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}>Criar Imagem</button>
                <button onClick={() => setMode('edit-image')} className={`px-4 py-2 rounded-lg font-semibold ${mode === 'edit-image' ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}>Editar Imagem</button>
                <button onClick={() => setMode('create-video')} className={`px-4 py-2 rounded-lg font-semibold ${mode === 'create-video' ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}>Criar Vídeo</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {(mode === 'edit-image' || (mode === 'create-video')) && (
                     <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg text-center">
                        <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                        <label htmlFor="file-upload" className="cursor-pointer text-blue-400 hover:text-blue-300">
                           {previewUrl ? 'Trocar imagem' : (mode === 'edit-image' ? 'Selecione uma imagem para editar' : 'Selecione uma imagem inicial (opcional)')}
                        </label>
                        {previewUrl && <img src={previewUrl} alt="Preview" className="mt-4 mx-auto max-h-48 rounded-lg"/>}
                    </div>
                )}
                
                <div>
                    <label htmlFor="prompt" className="block mb-2 text-sm font-medium text-gray-300">Prompt Mágico:</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={
                            mode === 'create-image' ? 'Ex: Eldin como um imperador romano, comendo pizza' :
                            mode === 'edit-image' ? 'Ex: Adicione um chapéu de pirata nele' :
                            'Ex: Eldin surfando em um cometa no espaço'
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        required
                    />
                </div>

                {mode === 'create-image' && (
                    <div>
                        <label htmlFor="aspect-ratio" className="block mb-2 text-sm font-medium text-gray-300">Proporção:</label>
                        <select id="aspect-ratio" value={aspectRatio} onChange={e => setAspectRatio(e.target.value as AspectRatio)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white">
                            <option value="1:1">Quadrado (1:1)</option>
                            <option value="16:9">Paisagem (16:9)</option>
                            <option value="9:16">Retrato (9:16)</option>
                            <option value="4:3">Paisagem Clássica (4:3)</option>
                            <option value="3:4">Retrato Clássico (3:4)</option>
                        </select>
                    </div>
                )}

                 {mode === 'create-video' && (
                    <div>
                        <label htmlFor="video-aspect-ratio" className="block mb-2 text-sm font-medium text-gray-300">Proporção do Vídeo:</label>
                        <select id="video-aspect-ratio" value={videoAspectRatio} onChange={e => setVideoAspectRatio(e.target.value as VideoAspectRatio)} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white">
                            <option value="16:9">Paisagem (16:9)</option>
                            <option value="9:16">Retrato (9:16)</option>
                        </select>
                    </div>
                )}

                {mode === 'create-video' && !hasApiKey && (
                    <div className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg text-center">
                        <p className="mb-2">A geração de vídeo com Veo requer uma API Key do Google AI Studio.</p>
                        <p className="text-sm mb-3">Isso é necessário para cobrir os custos de processamento. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Saiba mais sobre cobrança.</a></p>
                        <button type="button" onClick={handleOpenSelectKey} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Selecionar API Key</button>
                    </div>
                )}

                <button type="submit" disabled={isLoading || (mode === 'edit-image' && !imageFile)} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Gerando Mágica...' : 'Gerar!'}
                </button>
            </form>

            {isLoading && <div className="mt-6 flex justify-center"><LoadingSpinner message={mode === 'create-video' ? videoLoadingMessage : 'Processando...'} /></div>}
            {error && <p className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
            
            {result && (
                <div className="mt-6">
                    <h4 className="text-xl font-bold text-center mb-4">Resultado:</h4>
                    {result.startsWith('data:image') && <img src={result} alt="Generated Meme" className="mx-auto max-w-full rounded-lg shadow-lg"/>}
                    {result.startsWith('blob:') && <video src={result} controls autoPlay loop className="mx-auto max-w-full rounded-lg shadow-lg"/>}
                </div>
            )}
        </SectionWrapper>
    );
};
