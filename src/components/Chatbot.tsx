import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, User, Bot } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "¡Hola! Soy BombónBot 🍫. ¿En qué puedo ayudarte hoy? Consultame sobre chocolates, envíos o regalos.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: isFirstRender.current ? 'auto' : 'smooth'
            });
        }
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');

        // Agregar mensaje del usuario
        const newMessage: Message = { id: Date.now(), text: userMessage, sender: 'user' };
        setMessages(prev => [...prev, newMessage]);
        setLoading(true);

        try {
            console.log('📡 Llamando al Backend:', `${BACKEND_URL}/chat`);
            const history = messages.slice(-10).map(m => ({
                role: m.sender,
                message: m.text
            }));

            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: history
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.text || `Error del servidor (${response.status})`);
            }

            const data = await response.json();

            if (data.text) {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: data.text, sender: 'bot' }]);
            } else {
                throw new Error('Respuesta vacía del servidor');
            }

        } catch (error: any) {
            console.error('Error detallado en Chatbot:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: `Lo siento, hubo un problema: ${error.message}`,
                sender: 'bot'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white rounded-2xl overflow-hidden border border-brand-100">
            {/* Header */}
            <div className="bg-brand-900 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
                    <Sparkles className="text-white w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-white font-bold leading-none">BombónBot</h3>
                    <p className="text-brand-200 text-xs mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        En línea ahora
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-50/30"
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    >
                        <div className={`flex gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${message.sender === 'user' ? 'bg-brand-700' : 'bg-white border border-brand-200'
                                }`}>
                                {message.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-brand-900" />}
                            </div>
                            <div
                                className={`p-3 rounded-2xl shadow-sm text-sm ${message.sender === 'user'
                                    ? 'bg-brand-800 text-white rounded-tr-none'
                                    : 'bg-white text-brand-900 border border-brand-100 rounded-tl-none'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
                            >
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="flex gap-2 bg-white p-3 rounded-2xl border border-brand-100 shadow-sm">
                            <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                            <span className="text-xs text-brand-500 font-medium">BombónBot está escribiendo...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-brand-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribí tu consulta sobre chocolates..."
                    className="flex-1 bg-brand-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 transition"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="bg-brand-800 text-white p-2 rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:grayscale transition shadow-md hover:shadow-lg active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
            <div className="bg-brand-50/50 py-2 text-[10px] text-center text-brand-400">
                IA impulsada por Gemini ✨. Puede cometer errores.
            </div>
        </div>
    );
}
