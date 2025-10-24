import { GoogleGenAI, Content, Modality, Type } from "@google/genai";

// FIX: Initialize the GoogleGenAI client with the API key from environment variables.
// For Vite apps, environment variables are accessed via `import.meta.env`.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

// Helper to convert Blob to Base64 string
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            // remove the data URL prefix e.g. "data:image/png;base64,"
            resolve(base64data.substring(base64data.indexOf(',') + 1));
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Helper to convert an image URL to a Part object for the Gemini API
async function urlToGenerativePart(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Falha ao buscar a imagem de ${url}: ${response.statusText}`);
    }
    const blob = await response.blob();
    const base64Data = await blobToBase64(blob);
    
    return {
        inlineData: {
            data: base64Data,
            mimeType: blob.type,
        },
    };
}

export const generateNickname = async (traits: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Você é um especialista em criar apelidos engraçados e criativos. Crie um apelido para uma pessoa com as seguintes características: "${traits}". O apelido deve ser curto, impactante e engraçado. Retorne apenas o apelido, sem nenhuma outra formatação ou texto.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        return response.text.trim().replace(/"/g, ''); // Remove quotes if any
    } catch (error) {
        console.error("Error generating nickname:", error);
        throw new Error("Não foi possível gerar um apelido. A IA está de folga.");
    }
};

export const generateImageWithReference = async (prompt: string, referenceImageUrl: string): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    try {
        const imagePart = await urlToGenerativePart(referenceImageUrl);
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, textPart] },
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
        throw new Error("A IA não retornou uma imagem. Tente ser mais criativo.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Falha ao gerar a imagem. A IA deve estar ocupada criando outras lendas.");
    }
};

export interface AdventureResponse {
    narrative: string;
    imagePrompt: string;
    choices: string[];
    isFinal: boolean;
}

export const generateAdventureStep = async (history: Content[]): Promise<AdventureResponse> => {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `Você é um mestre de jogo para uma aventura de texto interativa e bem-humorada sobre um personagem chamado Eldin, um engenheiro 'pegador' lendário.
O tom deve ser engraçado, exagerado e cheio de gírias e referências da cultura de festas universitárias brasileiras.
Cada passo da história deve apresentar uma narrativa, um prompt de imagem que descreva a cena vividamente para uma IA de geração de imagem, 2 a 3 opções de escolha para o jogador, e um booleano 'isFinal' que indica se a aventura terminou.
A aventura termina se Eldin tiver sucesso em sua 'caça' ou se ele falhar miseravelmente.
Sempre retorne a resposta no formato JSON especificado.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            narrative: { type: Type.STRING, description: 'A descrição da cena atual da aventura.' },
            imagePrompt: { type: Type.STRING, description: 'Um prompt detalhado para gerar uma imagem que ilustre a narrativa. Ex: "Eldin em uma boate escura, um sorriso confiante, conversando com uma garota bonita, luzes de neon ao fundo, estilo de pintura a óleo."' },
            choices: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Uma lista de 2 a 3 opções de escolha para o jogador.' },
            isFinal: { type: Type.BOOLEAN, description: 'Verdadeiro se este for o último passo da aventura, falso caso contrário.' },
        },
        required: ['narrative', 'imagePrompt', 'choices', 'isFinal'],
    };
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: history,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema,
            }
        });

        const jsonText = response.text.trim();
        const cleanedJson = jsonText.replace(/^```json\s*/, '').replace(/```$/, '');
        return JSON.parse(cleanedJson);
    } catch (error) {
        console.error("Error generating adventure step:", error);
        throw new Error("A aventura bugou! Parece que a IA bebeu demais.");
    }
};

export const generateAdventureImage = async (prompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            }
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("A IA não conseguiu desenhar a cena. Tente outra escolha.");
    } catch (error) {
        console.error("Error generating adventure image:", error);
        throw new Error("Falha ao criar a imagem da aventura. A imaginação da IA está em manutenção.");
    }
};
