import { GoogleGenAI, Content, Type, Modality } from '@google/genai';

const API_KEY = import.meta.env.VITE_API_KEY;

// A consistent error message for missing API key.
const API_KEY_ERROR_MESSAGE = "A variável de ambiente VITE_API_KEY não foi configurada. Adicione-a nas configurações do seu site no Netlify.";

// Lazy initialization for the GoogleGenAI instance
let ai: GoogleGenAI | null = null;
const getAiInstance = () => {
    if (!API_KEY) {
        throw new Error(API_KEY_ERROR_MESSAGE);
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
};


const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error("Failed to read blob as base64 string."));
        }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

async function urlToGenerativePart(url: string, mimeType: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
    }
    const blob = await response.blob();
    const base64Data = await blobToBase64(blob);
    return {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
}


// Function for NicknameGenerator.tsx
export const generateNickname = async (traits: string): Promise<string> => {
    try {
        const aiInstance = getAiInstance();
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Baseado nos traços de personalidade de uma pessoa lendária chamada Eldin, gere um apelido engraçado e criativo para ele. Os traços são: ${traits}. O apelido deve ser curto e impactante. Retorne apenas o apelido, sem nenhuma outra formatação ou texto.`,
            config: {
                temperature: 0.9,
                maxOutputTokens: 20,
            }
        });
        return response.text.trim();
    } catch (error: any) {
        console.error("Error generating nickname:", error);
        if (error.message === API_KEY_ERROR_MESSAGE) throw error;
        throw new Error("A IA está muito ocupada rindo das lendas do Eldin para criar um apelido agora. Tente novamente.");
    }
};

// Function for MemeGenerator.tsx
export const generateImageWithReference = async (prompt: string, imageUrl: string): Promise<string> => {
     try {
        const aiInstance = getAiInstance();
        const imagePart = await urlToGenerativePart(imageUrl, 'image/jpeg');
        
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    imagePart,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response.candidates?.[0]?.content?.parts[0];
        if (firstPart && firstPart.inlineData) {
            const base64ImageBytes: string = firstPart.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("A IA não conseguiu gerar a imagem. Talvez a ideia seja lendária demais.");
    } catch (error: any) {
        console.error("Error generating image:", error);
        if (error.message === API_KEY_ERROR_MESSAGE) throw error;
        if (error.toString().includes('SAFETY')) {
             throw new Error("A IA se recusou a criar essa imagem por motivos de segurança. Tente uma zueira mais leve.");
        }
        throw new Error(error.message || "Falha ao gerar a imagem. A IA deve estar de ressaca.");
    }
};

export interface AdventureResponse {
    narrative: string;
    choices: string[];
    imagePrompt: string;
    isFinal: boolean;
}

const adventureSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: { type: Type.STRING, description: "A descrição da cena atual da aventura, narrando o que acontece com Eldin. Deve ser em português do Brasil." },
        choices: { type: Type.ARRAY, description: "Uma lista de 2 a 3 opções de ações que o jogador pode tomar. Devem ser curtas e diretas. Em português do Brasil.", items: { type: Type.STRING } },
        imagePrompt: { type: Type.STRING, description: "Um prompt em inglês, conciso e descritivo, para um modelo de IA gerar uma imagem que ilustra a 'narrativa'. Ex: 'A man in a dark party looking at two women, digital art'." },
        isFinal: { type: Type.BOOLEAN, description: "Um booleano que é 'true' se este for o final da aventura, e 'false' caso contrário." },
    },
    required: ["narrative", "choices", "imagePrompt", "isFinal"],
};

// Function for AdventureGame.tsx
export const generateAdventureStep = async (history: Content[]): Promise<AdventureResponse> => {
    try {
        const aiInstance = getAiInstance();
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: history,
            config: {
                systemInstruction: `Você é um mestre de RPG para um jogo de texto sobre um personagem lendário chamado Eldin, um engenheiro brasileiro conhecido por ser um "macho alfa reprodutor", festeiro, e engraçado. O tom do jogo é de comédia e zueira, baseado nas "lendas" de Eldin. A história deve ser contínua. Para cada passo, você deve fornecer uma narrativa, 2 ou 3 escolhas para o jogador, um prompt para gerar uma imagem, e um booleano indicando se a história terminou. Responda SEMPRE em JSON, seguindo o schema.`,
                responseMimeType: 'application/json',
                responseSchema: adventureSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AdventureResponse;
    } catch (error: any) {
        console.error("Error generating adventure step:", error);
        if (error.message === API_KEY_ERROR_MESSAGE) throw error;
        throw new Error("A aventura bugou. A lenda do Eldin foi tão épica que quebrou a IA. Tente de novo.");
    }
};

// Function for AdventureGame.tsx
export const generateAdventureImage = async (prompt: string): Promise<string> => {
    try {
        const aiInstance = getAiInstance();
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const firstPart = response.candidates?.[0]?.content?.parts[0];
        if (firstPart && firstPart.inlineData) {
            const base64ImageBytes: string = firstPart.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("A IA não conseguiu visualizar a cena. A imaginação dela não é tão fértil quanto a do Eldin.");
    } catch (error: any) {
        console.error("Error generating adventure image:", error);
        if (error.message === API_KEY_ERROR_MESSAGE) throw error;
        if (error.toString().includes('SAFETY')) {
             throw new Error("A IA se recusou a ilustrar essa cena por motivos de segurança. A aventura do Eldin é ousada demais.");
        }
        throw new Error(error.message || "Falha ao gerar a imagem da aventura.");
    }
};