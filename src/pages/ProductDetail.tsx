import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { useAuth } from '../AuthContext';
import { ArrowLeft, ShoppingCart, Tag } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [categoryName, setCategoryName] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const { addToCart } = useCart();
    const CAJAS_PERSONALIZADAS_ID = '9f4b7524-1d17-4755-8563-094fbd870840';

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
            setSelectedImage(data.image_url);
            if (data.categories) {
                // @ts-ignore
                setCategoryName(data.categories.name);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(product, quantity);
        alert('Producto agregado al carrito');
    };

    if (loading) return (
        <Layout>
            <div className="min-h-screen bg-brand-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
            </div>
        </Layout>
    );

    if (!product) return <Layout><div className="p-10 text-center">Producto no encontrado</div></Layout>;

    const isCajaPersonalizada = product.category_id === CAJAS_PERSONALIZADAS_ID;

    return (
        <Layout>
            <div className="bg-brand-50 min-h-screen py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/store" className="inline-flex items-center text-brand-600 hover:text-brand-800 mb-6 transition">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Volver a la tienda
                    </Link>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-100 flex flex-col md:flex-row">
                        <div className="md:w-1/2 flex flex-col bg-brand-50">
                            <div className="h-96 md:h-[500px] relative overflow-hidden">
                                <img
                                    src={selectedImage || "https://images.unsplash.com/photo-1549488344-c73885b45228?auto=format&fit=crop&q=80&w=1000"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                            </div>

                            {/* Galería de miniaturas */}
                            {(product.secondary_images && product.secondary_images.length > 0) && (
                                <div className="p-4 flex gap-2 overflow-x-auto bg-white border-t border-brand-100">
                                    <button
                                        onClick={() => setSelectedImage(product.image_url)}
                                        className={`w-20 h-20 flex-shrink-0 rounded-md border-2 transition ${selectedImage === product.image_url ? 'border-accent-500' : 'border-transparent'}`}
                                    >
                                        <img src={product.image_url} className="w-full h-full object-cover rounded" alt="" />
                                    </button>
                                    {product.secondary_images.map((img: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`w-20 h-20 flex-shrink-0 rounded-md border-2 transition ${selectedImage === img ? 'border-accent-500' : 'border-transparent'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover rounded" alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-8 md:w-1/2 flex flex-col">
                            <div className="mb-2 inline-flex items-center">
                                <Tag className="w-4 h-4 text-accent-500 mr-2" />
                                <span className="text-sm font-medium text-brand-500 uppercase tracking-wider">{categoryName || 'Chocolate'}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mb-4">{product.name}</h1>

                            <p className="text-brand-600 leading-relaxed mb-6 flex-grow whitespace-pre-line">{product.description}</p>

                            <div className="mb-8">
                                <span className="text-3xl font-bold text-accent-500">${product.price}</span>
                                {!isCajaPersonalizada && (
                                    product.stock > 0 ? (
                                        <span className="ml-4 text-sm text-green-600 font-medium">En Stock ({product.stock} disponibles)</span>
                                    ) : (
                                        <span className="ml-4 text-sm text-red-600 font-medium">Agotado</span>
                                    )
                                )}
                            </div>

                            <div className="border-t border-brand-100 pt-8 mt-auto">
                                {!isCajaPersonalizada ? (
                                    <>
                                        <div className="flex items-center space-x-6 mb-6">
                                            <span className="text-brand-900 font-medium">Cantidad:</span>
                                            <div className="flex items-center border border-brand-300 rounded-md">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="p-2 hover:bg-brand-50 transition"
                                                    disabled={product.stock <= 0}
                                                >
                                                    <ArrowLeft className="w-4 h-4 text-brand-600 rotate-90" />
                                                </button>
                                                <span className="px-4 py-2 font-semibold text-brand-900 min-w-[3rem] text-center">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                    className="p-2 hover:bg-brand-50 transition"
                                                    disabled={product.stock <= 0}
                                                >
                                                    <ArrowLeft className="w-4 h-4 text-brand-600 -rotate-90" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={product.stock <= 0}
                                                className="flex-1 bg-brand-800 text-white py-4 px-6 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ShoppingCart className="w-5 h-5 mr-3" />
                                                Agregar al Carrito
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-accent-50 p-4 rounded-xl border border-accent-100">
                                            <p className="text-accent-900 font-bold mb-1 flex items-center gap-2">
                                                <span>✨</span> ¡Personalizá tu regalo!
                                            </p>
                                            <p className="text-accent-700 text-sm">Podés elegir la frase, los colores y los bombones que más te gusten.</p>
                                        </div>

                                        <a
                                            href={`https://wa.me/5493876856022?text=Hola! Me interesa personalizar la ${product.name}. ¿Cómo podemos hacer?`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-5 rounded-xl transition-all font-bold text-lg shadow-xl hover:shadow-2xl active:scale-[0.98]"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.01c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            Chatear y Personalizar Mi Caja
                                        </a>
                                        <p className="text-sm text-center text-brand-500 italic mt-2">La respuesta más rápida la recibís por WhatsApp.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
