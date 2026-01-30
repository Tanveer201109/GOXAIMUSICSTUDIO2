import React from 'react';
import { AppMode } from '../../types';
import { MessageSquare, Image as ImageIcon, Zap, Activity } from 'lucide-react';

interface LayoutProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentMode, onModeChange, children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-gray-200 font-sans selection:bg-[#39ff14] selection:text-black">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 flex-shrink-0 border-r border-white/10 bg-[#0a0a0a] flex flex-col items-center md:items-stretch z-20 relative">
        <div className="p-6 flex items-center justify-center md:justify-start gap-3">
            <div className="w-8 h-8 rounded bg-[#39ff14] flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                <Zap className="text-black w-5 h-5 fill-current" />
            </div>
            <span className="hidden md:block font-bold text-xl tracking-tighter text-white font-display">
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
            <div className="glass-panel p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">System Load</span>
                    <Activity className="w-3 h-3 text-[#39ff14] animate-pulse" />
                </div>
                <div className="flex gap-1 h-8 items-end justify-between opacity-80">
                    {[40, 70, 45, 90, 60, 80, 50, 70, 60, 40].map((h, i) => (
                        <div 
                            key={i} 
                            className="w-1 bg-[#39ff14] rounded-t-sm transition-all duration-300"
                            style={{ 
                                height: `${h}%`,
                                opacity: i % 2 === 0 ? 0.8 : 0.4
                            }}
                        ></div>
                    ))}
                </div>
                <div className="mt-2 text-[10px] text-[#39ff14]/70 font-mono text-center tracking-wider">
                    RADIUM CORE ONLINE
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,20,20,1),_rgba(5,5,5,1))] relative">
         {/* Background Grid Mesh */}
         <div className="absolute inset-0 z-0 pointer-events-none" 
              style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
              }}>
         </div>
         
         <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
            {children}
         </div>
      </main>
    </div>
  );
};

export default Layout;