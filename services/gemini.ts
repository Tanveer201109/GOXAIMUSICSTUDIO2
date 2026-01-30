import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CHAT_MODEL, IMAGE_MODEL } from '../constants';
import { ImageSize } from '../types';

let genAIInstance: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  // Always create a new instance to ensure we pick up the latest env var if it changed
  // e.g. after a user selects a key.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Checks if a paid API key is selected (required for Pro Image features).
 * This logic handles the specific requirement for Veo/Pro Image models.
 */
export const ensureApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      try {
        await window.aistudio.openSelectKey();
        return await window.aistudio.hasSelectedApiKey();
      } catch (e) {
        console.error("Failed to select API key", e);
        return false;
      }
    }
    return true;
  }
  // Fallback for dev environments where window.aistudio might not exist,
  // we assume process.env.API_KEY is manually set or we can't force it.
  return !!process.env.API_KEY;
};

export const createChatStream = async function* (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  newMessage: string
) {
  const ai = getClient();
  const chat = ai.chats.create({
    model: CHAT_MODEL,
    history: history,
    config: {
        // Higher thinking budget for the pro model if needed, 
        // but default is usually sufficient for chat. 
        // We will stick to standard config for responsiveness.
    }
  });

  const result = await chat.sendMessageStream({ message: newMessage });

  for await (const chunk of result) {
    const c = chunk as GenerateContentResponse;
    if (c.text) {
      yield c.text;
    }
  }
};

export const generateProImage = async (
  prompt: string,
  size: ImageSize
): Promise<{ imageUrl: string; } | null> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: '1:1' // Defaulting to square for now, could be made configurable
        }
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return {
            imageUrl: `data:${mimeType};base64,${base64Data}`
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};