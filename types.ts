export enum AppMode {
  CHAT = 'CHAT',
  IMAGE = 'IMAGE'
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  size: ImageSize;
  createdAt: number;
}

// Window interface extension for AI Studio key selection
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}