import { GoogleGenAI, GenerateContentResponse, Modality, Type, Content } from "@google/genai";

const getGenAI = () => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
        throw new Error("VITE_API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
}

const imageUrlToGenerativePart = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}`);
    }
    const blob = await response.blob();
    const base64data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
    return {
        inlineData: { data: base64data, mimeType: blob.type },
    };
};

export const generateNickname = async (): Promise<string> => {
  try {
    const ai = getGenAI();
    const prompt = "Gere um apelido engraçado e lendário para um amigo chamado Eldin. Ele é um engenheiro mecânico festeiro, inteligente, pegador, maconheiro gente boa, e pai de dois filhos. Pense em algo no estilo 'O Monstro do InterUFG'. Seja criativo e use humor. Retorne apenas o apelido, sem mais texto.";
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating nickname:", error);
    return "O Cérebro de Gênio Travou";
  }
};

export const generateImageWithReference = async (prompt: string, imageUrl: string): Promise<string> => {
    const ai = getGenAI();
    const imagePart = await imageUrlToGenerativePart(imageUrl);
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error("Nenhuma imagem gerada.");
};


// Adventure Game Logic
export interface AdventureResponse {
    narrative: string;
    choices: string[];
    isFinal: boolean;
    imagePrompt: string;
}

const adventureGameSystemInstruction = `Você é um mestre de jogo sarcástico e bem-humorado, criando uma aventura de 'escolha seu caminho' para o lendário Eldin. O objetivo: 'Ajudar Eldin a conquistar uma garota na balada'. O tom é de comédia adulta, zueira pesada, e alinhado com a persona de Eldin: o 'Monstro do InterUFG', pegador (quantidade > qualidade), engenheiro, maconheiro e macho alfa. As situações devem ser absurdas e as escolhas, hilárias. A história deve terminar de forma cômica e inesperada. Responda SEMPRE em JSON, seguindo o schema.`;

export const generateAdventureStep = async (history: Content[]): Promise<AdventureResponse> => {
    const ai = getGenAI();
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: history,
        config: {
            systemInstruction: adventureGameSystemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    narrative: { type: Type.STRING, description: "O próximo parágrafo da história." },
                    choices: { type: Type.ARRAY, items: { type: Type.STRING }, description: "De 2 a 3 opções de escolha para o jogador." },
                    isFinal: { type: Type.BOOLEAN, description: "Verdadeiro se este for o final da história." },
                    imagePrompt: { type: Type.STRING, description: "Um prompt curto e visual para gerar uma ilustração para a cena. Estilo cartoon/HQ." }
                },
                required: ["narrative", "choices", "isFinal", "imagePrompt"],
            }
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as AdventureResponse;
    } catch (e) {
        console.error("Failed to parse adventure step JSON:", jsonText, e);
        throw new Error("A IA retornou uma resposta inválida. Tente novamente.");
    }
}

export const generateAdventureImage = async (prompt: string): Promise<string> => {
    const ai = getGenAI();
    const fullPrompt = `${prompt}, in a vibrant comic book art style, funny`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: fullPrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error("Nenhuma imagem de aventura foi gerada.");
};