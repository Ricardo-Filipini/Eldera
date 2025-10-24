/// <reference types="vite/client" />

// FIX: Removed exports to treat this file as an ambient declaration file.
// This allows /// <reference types="vite/client" /> to work correctly.
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface GuestbookEntry {
  name: string;
  message: string;
  timestamp: string;
}

interface AdventureStep {
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

  // Add type definitions for Vite environment variables
  interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// FIX: Module declarations for image assets are now handled by the `/// <reference types="vite/client" />` directive above.
// This prevents "Invalid module name in augmentation" errors that occur when `declare module` with wildcards is used in a file that is already a module (due to `export` statements).