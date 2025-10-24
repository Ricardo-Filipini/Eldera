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

// NOTE: This window interface is extended to include aistudio for Veo API key selection
declare global {
  // FIX: Define the AIStudio interface globally to resolve the type conflict.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }

  // FIX: Add types for Vite environment variables to resolve 'import.meta.env' error.
  interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
