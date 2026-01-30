import React, { useState } from 'react';
import { Image as ImageIcon, Zap, Maximize2, Download, AlertCircle, Loader2 } from 'lucide-react';
import { generateProImage, ensureApiKey } from '../services/gemini';
import { ImageSize } from '../types';

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
        const hasKey = await ensureApiKey();
        if (!hasKey) {
            setError("Billing required: Please select a paid API key Project to use high-fidelity visualization.");
            setIsLoading(false);
            return;
        }

        const result = await generateProImage(prompt, size);
        if (result) {
            setGeneratedImage(result.imageUrl);
        } else {
            setError("No image generated. Please try a different prompt.");
        }
    } catch (err: any) {
        console.error(err);
        setError("Generation failed. " + (err.message || "Unknown error"));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-16 border-b border-white/10 flex items-center px-6 glass-panel justify-between z-10">
            <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse shadow-[0_0_8px_#39ff14]"></span>
                VISUALIZER CORE
            </h2>
            <div className="flex items-center gap-2">
                 <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-gray-400 font-mono">
                    GEMINI-3-PRO-IMAGE
                 </span>
            </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Viewport */}
            <div className="flex-1 bg-[#050505] relative flex items-center justify-center p-8 overflow-hidden">
                 {/* Grid Background */}
                 <div className="absolute inset-0 z-0 opacity-20" 
                      style={{
                          backgroundImage: `radial-gradient(#39ff14 1px, transparent 1px)`,
                          backgroundSize: '30px 30px'
                      }}>
                 </div>

                 <div className="relative z-10 w-full max-w-3xl aspect-square flex items-center justify-center">
                    {generatedImage ? (
                        <div className="relative group w-full h-full animate-in fade-in zoom-in duration-500">
                             <img 
                                src={generatedImage} 
                                alt={prompt}
                                className="w-full h-full object-contain rounded-lg shadow-[0_0_50px_rgba(57,255,20,0.1)] border border-white/10 bg-black"
                             />
                             <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a 
                                    href={generatedImage} 
                                    download={`xai-visual-${Date.now()}.png`}
                                    className="p-2 bg-black/80 backdrop-blur text-white rounded-lg hover:bg-[#39ff14] hover:text-black transition-colors border border-white/20"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 opacity-30">
                            <div className="w-32 h-32 mx-auto border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center">
                                <ImageIcon className="w-12 h-12" />
                            </div>
                            <p className="font-mono text-sm tracking-widest">NO SIGNAL INPUT</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg border border-[#39ff14]/20">
                            <Loader2 className="w-12 h-12 text-[#39ff14] animate-spin mb-4" />
                            <div className="text-[#39ff14] font-mono text-xs tracking-[0.2em] animate-pulse">RENDERING</div>
                        </div>
                    )}
                 </div>
            </div>

            {/* Controls Panel */}
            <div className="w-full md:w-96 bg-[#0a0a0a] border-l border-white/10 p-6 flex flex-col gap-8 overflow-y-auto z-20">
                <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Input Signal (Prompt)</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your album cover or visual scene..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] outline-none resize-none h-32 transition-all"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Resolution Output</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[ImageSize.SIZE_1K, ImageSize.SIZE_2K, ImageSize.SIZE_4K].map((s) => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`py-3 rounded-lg text-sm font-mono border transition-all ${
                                    size === s 
                                    ? 'bg-[#39ff14]/10 border-[#39ff14] text-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.2)]' 
                                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-400 text-sm items-start">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="mt-auto">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group ${
                            isLoading || !prompt.trim()
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-[#39ff14] text-black hover:shadow-[0_0_20px_#39ff14] hover:scale-[1.02]'
                        }`}
                    >
                        <Zap className={`w-5 h-5 ${isLoading ? '' : 'fill-current'}`} />
                        {isLoading ? 'Processing...' : 'Generate Visual'}
                    </button>
                    <p className="text-[10px] text-center text-gray-600 mt-3 font-mono">
                        POWERED BY IMAGEN 3 PRO ENGINE
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ImageView;