import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard';

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
        "/hero-bg-2.jpg",
        "/hero-bg-3.jpg",
        "/hero-bg-4.jpg"
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

            {/* 2. STORE SECTION FULL - Gourmet Slider */}
            <section id="store" className="py-24 bg-brand-50 scroll-mt-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center mb-12 space-y-4">
                        <span className="text-accent-500 font-display text-4xl transform -rotate-3 block">Puro Chocolate Artesanal</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-brand-900 tracking-tight">{settings.home_store_title || 'Nuestra Colección'}</h2>
                        <div className="w-24 h-1 bg-accent-200 rounded-full mx-auto"></div>
                    </div>

                    {/* Filtros Gourmet */}
                    <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-10 w-full no-scrollbar">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all border ${selectedCategory === 'all' ? 'bg-brand-900 text-white border-brand-900 shadow-xl shadow-brand-900/20 scale-105' : 'bg-white text-brand-600 border-brand-100 hover:border-brand-300 transform hover:-translate-y-1'}`}
                        >
                            Todos
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all border ${selectedCategory === cat.id ? 'bg-brand-900 text-white border-brand-900 shadow-xl shadow-brand-900/20 scale-105' : 'bg-white text-brand-600 border-brand-100 hover:border-brand-300 transform hover:-translate-y-1'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        {loadingStore ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="bg-white rounded-[3rem] h-[550px] animate-pulse border border-brand-100/50 shadow-sm"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative">
                                {products.length === 0 ? (
                                    <div className="w-full py-24 text-center bg-white rounded-[3.5rem] border-2 border-brand-100 border-dashed shadow-inner">
                                        <p className="font-serif italic text-3xl text-brand-300">Pronto llegarán más tesoros a esta sección...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                                        {products.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                className="w-full flex justify-center"
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-50px" }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                            >
                                                <div className="w-full max-w-[400px]">
                                                    <ProductCard product={product} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
