
import React, { useState, useEffect } from 'react';
import { SectionWrapper } from './SectionWrapper';
import { GuestbookEntry } from '../types';

const GUESTBOOK_STORAGE_KEY = 'eldin_guestbook';

export const Guestbook: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem(GUESTBOOK_STORAGE_KEY);
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error("Failed to load guestbook entries from localStorage", error);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      const newEntry: GuestbookEntry = {
        name,
        message,
        timestamp: new Date().toLocaleString('pt-BR'),
      };
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(updatedEntries));
      setName('');
      setMessage('');
    }
  };

  return (
    <SectionWrapper title="Mural de Recados" subtitle="Deixe sua mensagem para a lenda.">
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Sua mensagem..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
          />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
          Enviar Mensagem
        </button>
      </form>
      <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div key={index} className="bg-gray-900/70 p-4 rounded-lg border-l-4 border-cyan-500">
              <p className="text-gray-200">"{entry.message}"</p>
              <div className="text-right text-sm text-gray-400 mt-2">
                - <span className="font-semibold text-cyan-400">{entry.name}</span> em {entry.timestamp}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Seja o primeiro a deixar uma mensagem!</p>
        )}
      </div>
    </SectionWrapper>
  );
};
