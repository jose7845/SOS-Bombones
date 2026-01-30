import { useState } from 'react';
import Chatbot from './Chatbot';
import { Sparkles, X } from 'lucide-react';

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[75vh] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out border border-brand-100 backdrop-blur-sm">
                    <Chatbot />
                </div>
            )}

            {/* Floating Bubble Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    group relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500
                    ${isOpen
                        ? 'bg-white text-brand-900 border-2 border-brand-100 rotate-90 scale-90'
                        : 'bg-[#4E342E] text-white hover:bg-[#3E2723] scale-100 hover:scale-110'
                    }
                `}
                aria-label="Abrir chat"
            >
                {/* Micro-animación de brillo cuando está cerrado */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-accent-500 opacity-20 pointer-events-none"></span>
                )}

                {isOpen ? (
                    <X className="w-8 h-8" />
                ) : (
                    <div className="relative">
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#4E342E]"></div>
                    </div>
                )}

            </button>
        </div>
    );
}
