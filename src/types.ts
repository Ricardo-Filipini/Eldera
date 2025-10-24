/// <reference types="vite/client" />

// FIX: Exported interfaces to convert this file into a module.
// This allows `declare global` to be used for augmenting global types
// and makes these interfaces importable in other files.
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface GuestbookEntry {
  name: string;
  message: string;
  timestamp: string;
}

export interface AdventureStep {
  text: string;
  imageUrl?: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }

  // Type definitions for Vite environment variables
  interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
