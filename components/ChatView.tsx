import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic } from 'lucide-react';
import { createChatStream } from '../services/gemini';
import { ChatMessage } from '../types';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const stream = createChatStream(history, userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        isStreaming: true
      }]);

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: fullText }
            : msg
        ));
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Connection Error: Studio link disrupted. Please try again.',
        isStreaming: false
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-white/10 flex items-center px-6 glass-panel justify-between">
        <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse shadow-[0_0_8px_#39ff14]"></span>
            LYRIC STUDIO
        </h2>
        <div className="text-xs text-gray-500 font-mono">GEMINI-3-PRO</div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Bot className="w-8 h-8 text-[#39ff14]" />
                </div>
                <p className="text-sm tracking-widest uppercase">Studio Ready. Awaiting Input.</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-[#39ff14]" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-lg backdrop-blur-sm ${
                msg.role === 'user'
                  ? 'bg-[#39ff14] text-black rounded-tr-none font-medium'
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
              }`}
            >
              {msg.text}
              {msg.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-[#39ff14] animate-pulse align-middle" />
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 md:p-6 bg-gradient-to-t from-[#050505] to-transparent">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute inset-0 bg-[#39ff14]/5 rounded-xl blur-md transition-all group-hover:bg-[#39ff14]/10"></div>
          <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#39ff14]/50 transition-colors shadow-2xl">
            <button type="button" className="p-4 text-gray-500 hover:text-[#39ff14] transition-colors">
                <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your lyrics or prompt..."
              className="flex-1 bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 py-4 px-2"
              disabled={isStreaming}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className={`p-4 transition-all duration-200 ${
                  input.trim() && !isStreaming 
                  ? 'text-[#39ff14] hover:bg-[#39ff14]/10' 
                  : 'text-gray-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;