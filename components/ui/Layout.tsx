import React from 'react';
import { AppMode } from '../../types';
import { MessageSquare, Image as ImageIcon, Zap, Activity, Music } from 'lucide-react';

interface LayoutProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentMode, onModeChange, children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-gray-200">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 flex-shrink-0 border-r border-white/10 bg-[#0a0a0a] flex flex-col items-center md:items-stretch">
        <div className="p-6 flex items-center justify-center md:justify-start gap-3">
            <div className="w-8 h-8 rounded bg-[#39ff14] flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                <Zap className="text-black w-5 h-5" />
            </div>
            <span className="hidden md:block font-bold text-xl tracking-tighter text-white">
                GO <span className="text-[#39ff14]">XAI</span>
            </span>
        </div>

        <div className="flex-1 w-full px-3 space-y-2 mt-4">
            <button
                onClick={() => onModeChange(AppMode.CHAT)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                    currentMode === AppMode.CHAT 
                    ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
            >
                <MessageSquare className="w-5 h-5" />
                <span className="hidden md:block font-medium">Chat Studio</span>
            </button>

            <button
                onClick={() => onModeChange(AppMode.IMAGE)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                    currentMode === AppMode.IMAGE 
                    ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
            >
                <ImageIcon className="w-5 h-5" />
                <span className="hidden md:block font-medium">Visualizer</span>
            </button>
        </div>

        {/* Studio Status Decor */}
        <div className="p-4 hidden md:block">
            <div className="glass-panel p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-widest text-gray-500">System</span>
                    <Activity className="w-4 h-4 text-[#39ff14]" />
                </div>
                <div className="flex gap-1 h-8 items-end justify-between">
                    {[40, 70, 45, 90, 60, 80, 50, 70, 60, 40].map((h, i) => (
                        <div 
                            key={i} 
                            className="w-1 bg-[#39ff14]/40 rounded-t-sm"
                            style={{ height: `${h}%` }}
                        ></div>
                    ))}
                </div>
                <div className="mt-2 text-[10px] text-gray-500 font-mono text-center">
                    RADIUM CORE ACTIVE
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min