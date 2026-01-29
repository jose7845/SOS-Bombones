import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../AuthContext';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    category_id?: string;
    secondary_images?: string[];
}

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const isCajaPersonalizada = product.category_id === '9f4b7524-1d17-4755-8563-094fbd870840';

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(product);
    };

    return (
        <div className={`group relative bg-white rounded-[2.5rem] transition-all duration-500 flex flex-col h-full overflow-hidden
            ${isCajaPersonalizada
                ? 'shadow-[0_15px_45px_0_rgba(189,137,104,0.15)] border-2 border-accent-200 ring-4 ring-accent-50/50'
                : 'shadow-[0_4px_20px_0_rgba(78,52,46,0.05)] hover:shadow-[0_20px_40px_0_rgba(78,52,46,0.12)] border border-brand-100/40 hover:border-brand-300/40'}`}>

            {/* Badge Principal */}
            <div className="absolute top-5 left-5 z-20">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border backdrop-blur-md
                    ${isCajaPersonalizada
                        ? 'bg-accent-500/90 text-white border-accent-400 animate-pulse'
                        : 'bg-white/80 text-brand-400 border-brand-100'}`}>
                    {isCajaPersonalizada ? '✨ Exclusivo' : 'Artesanal'}
                </div>
            </div>

            {/* Imagen con Hover Effect */}
            <div className="relative h-64 overflow-hidden bg-brand-50">
                <img
                    src={product.image_url || "https://images.unsplash.com/photo-1549488344-c73885b45228?auto=format&fit=crop&q=80&w=500"}
                    alt={product.name}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                />

                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-all duration-500 flex items-end p-6">
                    {product.stock <= 0 && !isCajaPersonalizada && (
                        <div className="w-full py-2 bg-red-500/90 backdrop-blur-sm text-white text-center font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            Sin Stock temporal
                        </div>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="p-8 flex flex-col flex-grow relative">
                <div className="flex-grow space-y-2">
                    <h3 className="text-2xl font-bold text-brand-900 leading-tight font-serif italic tracking-tight group-hover:text-accent-600 transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-brand-600 text-[13px] leading-relaxed line-clamp-3 border-b border-brand-50 pb-4 min-h-[3.5rem] italic">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-brand-50 gap-2">
                        <div className="flex flex-col flex-shrink-0">
                            <span className="text-[9px] text-brand-300 font-bold uppercase tracking-widest mb-0.5">Inversión</span>
                            <span className="text-xl font-bold text-brand-900 font-sans tracking-tight leading-none">
                                ${product.price.toLocaleString()}
                            </span>
                        </div>

                        {isCajaPersonalizada && (
                            <Link to={`/product/${product.id}`}
                                className="flex items-center gap-1.5 px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-full transition-all border border-brand-100 text-[10px] uppercase tracking-wide group/btn whitespace-nowrap"
                            >
                                <Eye className="w-3.5 h-3.5 text-brand-400 group-hover/btn:text-brand-600 transition-colors" />
                                <span>Ver detalle</span>
                            </Link>
                        )}

                        {!isCajaPersonalizada && (
                            <div className="flex items-center gap-1.5 text-accent-500 font-bold text-[9px] uppercase tracking-widest bg-accent-50/50 px-3 py-1.5 rounded-full border border-accent-100/50">
                                Artesanal
                            </div>
                        )}
                    </div>
                </div>

                {/* Acciones de Conversión */}
                <div className="mt-6 space-y-3">
                    {!isCajaPersonalizada ? (
                        <div className="flex items-center gap-2">
                            <Link to={`/product/${product.id}`}
                                className="flex-grow flex items-center justify-center gap-2 py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-2xl transition-all shadow-md active:scale-95 text-sm"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Ver Producto</span>
                            </Link>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="w-12 h-12 flex items-center justify-center bg-brand-900 hover:bg-brand-800 disabled:bg-brand-200 text-white rounded-2xl transition-all shadow-md active:scale-95 disabled:cursor-not-allowed group/cart"
                            >
                                <ShoppingCart className="w-5 h-5 transform group-hover/cart:-rotate-12 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1">
                            <a
                                href={`https://wa.me/5493876856022?text=Hola! Me gustaría personalizar mi ${product.name}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1fa851] text-white py-4 rounded-2xl transition-all font-bold text-base shadow-lg hover:shadow-[#25D366]/20 active:scale-[0.98] ring-4 ring-[#25D366]/5 group/wa"
                            >
                                <div className="bg-white/20 p-1.5 rounded-lg transition-transform group-hover/wa:rotate-12">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.01c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </div>
                                <span className="uppercase tracking-[0.1em] text-sm">Personalizar Ahora</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
