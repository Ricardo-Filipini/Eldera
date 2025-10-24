import { GoogleGenAI, Operation, GenerateContentResponse, Modality, Type, Content } from "@google/genai";

const getGenAI = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
}

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
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

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const ai = getGenAI();
    const fullPrompt = `${prompt}, digital art, high quality, vibrant colors`;
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const editImage = async (prompt: string, image: File): Promise<string> => {
    const ai = getGenAI();
    const imagePart = await fileToGenerativePart(image);
    
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
    throw new Error("No image generated from edit.");
};

export const generateVideo = async (prompt: string, aspectRatio: "16:9" | "9:16", image?: File): Promise<Operation> => {
    const ai = getGenAI();
    
    let imagePayload;
    if (image) {
        const imagePart = await fileToGenerativePart(image);
        imagePayload = {
            imageBytes: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType,
        };
    }
    
    const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        image: imagePayload,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio,
        }
    });
    return operation;
};

export const checkVideoStatus = async (operation: Operation): Promise<Operation> => {
    const ai = getGenAI();
    return await ai.operations.getVideosOperation({ operation });
};

export const getVideoUrl = async (downloadLink: string): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set for video fetch");
    }
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
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