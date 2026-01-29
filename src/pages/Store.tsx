
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard';

interface Category {
    id: string;
    name: string;
}

export default function Store() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [selectedCategory]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Categories
            const { data: catData } = await supabase.from('categories').select('*');
            if (catData) setCategories(catData);

            // Fetch Products
            let query = supabase.from('products').select('*');

            if (selectedCategory !== 'all') {
                query = query.eq('category_id', selectedCategory);
            }

            const { data: prodData, error } = await query;
            if (error) throw error;
            setProducts(prodData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="bg-brand-50 min-h-screen py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center mb-16 space-y-4">
                        <span className="text-accent-500 font-display text-4xl transform -rotate-3 block animate-fade-in">Puro Chocolate Artesanal</span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-900 tracking-tight">Nuestra Colección</h1>
                        <div className="w-24 h-1 bg-accent-200 rounded-full mx-auto"></div>

                        <div className="flex items-center justify-center space-x-2 overflow-x-auto py-6 w-full no-scrollbar">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${selectedCategory === 'all' ? 'bg-brand-900 text-white border-brand-900 shadow-lg' : 'bg-white text-brand-600 border-brand-100 hover:border-brand-300 shadow-sm'}`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${selectedCategory === cat.id ? 'bg-brand-900 text-white border-brand-900 shadow-lg' : 'bg-white text-brand-600 border-brand-100 hover:border-brand-300 shadow-sm'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <div key={n} className="bg-white rounded-[2rem] h-[450px] animate-pulse border border-brand-100"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {products.length === 0 ? (
                                <div className="text-center py-24">
                                    <div className="text-brand-200 text-6xl mb-4">🍫</div>
                                    <p className="text-brand-400 font-serif text-xl italic">No hay chocolates en esta categoría aún...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 animate-fade-in">
                                    {products.map((product, idx) => (
                                        <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
