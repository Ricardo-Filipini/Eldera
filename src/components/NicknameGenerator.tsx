import React, { useState } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { generateNickname } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

export const NicknameGenerator: React.FC = () => {
    const [traits, setTraits] = useState('');
    const [nickname, setNickname] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setNickname(null);

        try {
            const result = await generateNickname(traits);
            setNickname(result);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRandomTraits = () => {
        const randomTraits = [
            'macho alfa reprodutor',
            'filósofo de boteco',
            'rei da zueira',
            'engenheiro e maconheiro',
            'inimigo de gordas comunistas',
            'artilheiro do InterUFG',
            'especialista em relacionamentos quantitativos'
        ];
        // get 3 random traits
        const selected = randomTraits.sort(() => 0.5 - Math.random()).slice(0, 3);
        setTraits(selected.join(', '));
    };

    return (
        <SectionWrapper title="Gerador de Apelidos" subtitle="Descubra um novo apelido para a lenda com base em suas qualidades.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="traits" className="block mb-2 text-sm font-medium text-gray-300">
                        Descreva as qualidades ou um momento do Eldin:
                    </label>
                    <div className="flex space-x-2">
                        <input
                            id="traits"
                            type="text"
                            value={traits}
                            onChange={(e) => setTraits(e.target.value)}
                            placeholder="Ex: pegador, inteligente, engraçado"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                         <button type="button" onClick={handleRandomTraits} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">
                            🎲
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Criando Apelido...' : 'Gerar Apelido!'}
                </button>
            </form>

            {isLoading && <div className="mt-6 flex justify-center"><LoadingSpinner /></div>}
            {error && <p className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
            
            {nickname && (
                <div className="mt-6 text-center">
                    <h4 className="text-gray-400">O novo apelido lendário é:</h4>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 py-2">
                        {nickname}
                    </p>
                </div>
            )}
        </SectionWrapper>
    );
};
