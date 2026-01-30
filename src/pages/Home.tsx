import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Mail, Truck, Phone, MapPin, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard';
import Chatbot from '../components/Chatbot';

interface Category {
    id: string;
    name: string;
}

export default function Home() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Store State
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [loadingStore, setLoadingStore] = useState(true);
    const [settings, setSettings] = useState<Record<string, string>>({});

    const heroImages = [
        "/hero-bg-1.jpg",
        "/hero-bg-2.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch Store Data
    useEffect(() => {
        const fetchStoreData = async () => {
            setLoadingStore(true);
            try {
                const { data: catData } = await supabase.from('categories').select('*');
                if (catData) setCategories(catData);

                let query = supabase.from('products').select('*, categories(name)');
                if (selectedCategory !== 'all') {
                    query = query.eq('category_id', selectedCategory);
                }

                const { data: prodData, error } = await query;
                if (error) throw error;
                setProducts(prodData || []);
            } catch (error) {
                console.error('Error fetching store data:', error);
            } finally {
                setLoadingStore(false);
            }
        };
        fetchStoreData();
    }, [selectedCategory]);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from('site_settings').select('key, value');
            if (data) {
                const settingsMap = data.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
                setSettings(settingsMap);
            }
        };
        fetchSettings();
    }, []);

    return (
        <Layout>
            {/* 1. HERO SECTION */}
            <div className="relative h-screen min-h-[600px] flex items-center justify-center bg-black text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {heroImages.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-brand-900/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-950/60 via-transparent to-brand-900/80"></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6"
                    >
                        <img src="/logo.png" alt="S.O.S Bombones" className="h-40 md:h-72 mx-auto object-contain drop-shadow-2xl" />
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight text-white drop-shadow-lg">
                        <span className="italic text-accent-300">Dulzura Artesanal</span> <br />
                        para cada momento
                    </h1>

                    <div className="flex justify-center space-x-4">
                        <a href="#store" className="px-10 py-4 bg-accent-400 hover:bg-accent-500 text-brand-950 font-sans font-bold uppercase tracking-widest text-sm rounded shadow-lg transition-all transform hover:scale-105">
                            Ver Productos
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. INFO BAR */}
            <div className="bg-white py-12 border-b border-brand-100 relative z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <InfoItem
                            icon={<MessageSquare className="w-5 h-5" />}
                            title="Atención WhatsApp"
                            desc="Respuesta al instante"
                        />
                        <InfoItem
                            icon={<Truck className="w-5 h-5" />}
                            title="Envíos a Domicilio"
                            desc="Llegamos a toda la ciudad"
                        />
                        <InfoItem
                            icon={<Mail className="w-5 h-5" />}
                            title="Seguimiento Premium"
                            desc="Aviso por cada paso"
                        />
                    </div>
                </div>
            </div>

            {/* 3. STORE SECTION FULL */}
            <section id="store" className="py-24 bg-brand-50 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center mb-16 space-y-4">
                        <span className="text-accent-500 font-display text-4xl transform -rotate-3 block">Puro Chocolate Artesanal</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-900 tracking-tight">{settings.home_store_title || 'Nuestra Colección'}</h2>
                        <div className="w-24 h-1 bg-accent-200 rounded-full mx-auto"></div>

                        {/* Filtros */}
                        <div className="flex items-center justify-center space-x-2 overflow-x-auto py-6 w-full no-scrollbar">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all border ${selectedCategory === 'all' ? 'bg-brand-900 text-white border-brand-900 shadow-lg' : 'bg-white text-brand-600 border-brand-100 hover:border-brand-300'}`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all border ${selectedCategory === cat.id ? 'bg-brand-900 text-white border-brand-900 shadow-lg' : 'bg-white text-brand-600 border-brand-100 hover:border-brand-300'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loadingStore ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <div key={n} className="bg-white rounded-[2rem] h-[450px] animate-pulse border border-brand-100"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 4. ABOUT SECTION FULL */}
            <section id="about" className="bg-white py-24 md:py-32 overflow-hidden relative">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-accent-600 font-bold uppercase tracking-[0.3em] text-xs">{settings.about_hero_subtitle || 'Puro Corazón Artesanal'}</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-900 italic tracking-tight">{settings.about_hero_title || 'Nuestra Historia'}</h2>
                        <div className="w-24 h-1 bg-accent-200 mx-auto rounded-full mt-6"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5 space-y-8">
                            <div className="relative">
                                <span className="text-8xl font-serif text-brand-100 absolute -top-10 -left-6 select-none z-0">"</span>
                                <p className="text-xl leading-relaxed text-brand-800 font-medium relative z-10">
                                    {settings.about_main_text_1 || 'S.O.S Bombones nació en 2024 de una pasión compartida por el chocolate.'}
                                </p>
                            </div>
                            <p className="text-lg leading-relaxed text-brand-600">
                                {settings.about_main_text_2 || 'Lo que comenzó como un pequeño experimento en nuestra cocina familiar, rápidamente se transformó en un emprendimiento dedicado a endulzar la vida de nuestros clientes.'}
                            </p>
                            <div className="bg-brand-50 p-8 rounded-[2rem] border border-brand-100 space-y-4">
                                <h3 className="text-2xl font-serif font-bold text-brand-900 italic">{settings.about_legacy_title || 'Nuestro Legado'}</h3>
                                <p className="text-brand-600 leading-relaxed text-sm">
                                    {settings.about_legacy_text || 'Creemos en lo hecho a mano. Cada bombón es pintado, rellenado y desmoldado con cuidado artesanal.'}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-7 relative group">
                            <div className="absolute -inset-4 border-2 border-accent-200 rounded-[3.5rem] transform rotate-2"></div>
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-brand-100">
                                <img src="/nosotros.jpg" alt="Equipo S.O.S Bombones" className="w-full h-auto object-cover" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-accent-500 text-white p-6 rounded-3xl shadow-2xl transform -rotate-3">
                                <p className="text-center font-serif italic text-2xl leading-none">Hecho con Amor</p>
                                <p className="text-[10px] uppercase tracking-widest text-white/80 mt-1 text-center font-bold">Artesanías Salteñas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CONTACT SECTION FULL */}
            <section id="contact" className="bg-brand-50/50 py-24 scroll-mt-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-serif font-bold text-brand-900 mb-2">Hablemos 💬</h2>
                        <p className="text-brand-800 text-xl font-medium">Respondemos rápido y con amor 💛</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-8">
                            <a href={`https://wa.me/${settings.whatsapp_number || '5493876856022'}`} target="_blank" rel="noreferrer" className="block rounded-3xl shadow-lg group overflow-hidden">
                                <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-8 text-center transition-colors">
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        <span className="font-bold text-xl">Pedí por WhatsApp</span>
                                    </div>
                                </div>
                            </a>

                            <div className="bg-white p-10 rounded-3xl shadow-sm border border-brand-100 space-y-10">
                                <div className="flex items-start group">
                                    <div className="bg-brand-50 p-4 rounded-2xl mr-5 border border-brand-100">
                                        <MapPin className="w-7 h-7 text-brand-800" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-brand-900 text-xl mb-1">Ubicación</h3>
                                        <p className="text-brand-600">{settings.contact_address || 'Ibazeta 580, Salta'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start group">
                                    <div className="bg-brand-50 p-4 rounded-2xl mr-5 border border-brand-100">
                                        <Phone className="w-7 h-7 text-brand-800" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-brand-900 text-xl mb-1">Teléfono</h3>
                                        <p className="text-brand-600">{settings.contact_phone || '3876856022'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-[600px] shadow-2xl rounded-3xl overflow-hidden shadow-brand-900/10">
                            <Chatbot />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Final */}
            <footer className="py-20 text-center bg-brand-900 text-white">
                <img src="/logo.png" className="h-24 mx-auto mb-6 opacity-80" alt="" />
                <p className="font-serif italic text-2xl mb-4">"{settings.home_slogan || 'Tu salvación dulce en cada bocado'}"</p>
                <div className="w-12 h-0.5 bg-accent-500 mx-auto"></div>
            </footer>
        </Layout>
    );
}

function InfoItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex items-center justify-center space-x-4">
            <div className="p-3 bg-brand-50 rounded-2xl text-accent-600">{icon}</div>
            <div className="text-left">
                <h4 className="font-bold text-sm uppercase tracking-wider text-brand-900">{title}</h4>
                <p className="text-xs text-brand-500">{desc}</p>
            </div>
        </div>
    );
}
