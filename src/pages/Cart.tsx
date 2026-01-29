
import { useState } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';

// URL del backend - cambiar en producción
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function Cart() {
    const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleMercadoPago = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Iniciando pago con Mercado Pago...');
            console.log('Backend URL:', BACKEND_URL);
            console.log('Items:', items);

            // Llamar al backend para crear la preferencia de pago
            const response = await fetch(`${BACKEND_URL}/create-preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image_url: item.image_url
                    })),
                    payer: {
                        email: user.email
                    }
                }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                throw new Error(errorData.error || errorData.details || 'Error al crear el pago');
            }

            const data = await response.json();
            console.log('Respuesta de MP:', data);

            // Redirigir al checkout de Mercado Pago
            const checkoutUrl = data.init_point;

            if (checkoutUrl) {
                console.log('Redirigiendo a:', checkoutUrl);
                window.location.href = checkoutUrl;
            } else {
                throw new Error('No se recibió la URL de checkout');
            }

        } catch (err: any) {
            console.error('Error al procesar pago:', err);
            if (err.message === 'Failed to fetch') {
                setError('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
            } else {
                setError(err.message || 'Error al conectar con Mercado Pago');
            }
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-full shadow-lg mb-6 border border-brand-100">
                        <ShoppingBag className="w-16 h-16 text-brand-300" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-brand-900 mb-2">Tu carrito está vacío</h2>
                    <p className="text-brand-600 mb-8 max-w-md text-center">Descubre nuestra selección de bombones artesanales y endulza tu día.</p>
                    <Link to="/store" className="bg-brand-900 text-white px-8 py-3 rounded-full hover:bg-brand-800 transition-all transform hover:scale-105 font-bold shadow-lg shadow-brand-900/20">
                        Explorar la Tienda
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-brand-50 min-h-screen py-10 animate-fade-in">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-serif font-bold text-brand-900 mb-8 flex items-center">
                        <ShoppingBag className="w-8 h-8 mr-4 text-accent-500" />
                        Tu Selección
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Lista de Productos */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-100">
                                <ul className="divide-y divide-brand-100">
                                    {items.map((item) => (
                                        <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center hover:bg-brand-50/50 transition duration-300">
                                            <div className="relative group overflow-hidden rounded-lg shadow-md mb-4 sm:mb-0">
                                                <img
                                                    src={item.image_url || "https://images.unsplash.com/photo-1549488344-c73885b45228?auto=format&fit=crop&q=80&w=200"}
                                                    alt={item.name}
                                                    className="w-24 h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>

                                            <div className="sm:ml-6 flex-1 text-center sm:text-left">
                                                <h3 className="text-xl font-serif font-bold text-brand-900">{item.name}</h3>
                                                <p className="text-accent-600 font-bold mt-1 text-lg">${item.price.toLocaleString()}</p>
                                            </div>

                                            <div className="flex items-center space-x-6 mt-4 sm:mt-0 bg-white p-2 rounded-full border border-brand-100 shadow-sm">
                                                <select
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                    className="bg-transparent border-none text-brand-900 font-bold focus:ring-0 cursor-pointer text-center text-lg pl-3"
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                        <option key={n} value={n}>{n}</option>
                                                    ))}
                                                </select>
                                                <div className="h-6 w-px bg-brand-200"></div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-brand-400 hover:text-red-500 transition-colors p-1"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Resumen de Compra */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-xl shadow-xl p-8 border border-brand-100 sticky top-32">
                                <h2 className="text-2xl font-serif font-bold text-brand-900 mb-6 border-b border-brand-100 pb-4">
                                    Resumen del Pedido
                                </h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-brand-700">
                                        <span>Productos ({items.length})</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-brand-700">
                                        <span>Envío</span>
                                        <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full text-sm">Gratis</span>
                                    </div>
                                </div>

                                <div className="border-t-2 border-dashed border-brand-100 pt-6 mb-8 flex justify-between items-center bg-brand-50/50 -mx-8 px-8 py-6 mt-6">
                                    <span className="text-xl font-bold text-brand-900">Total</span>
                                    <span className="text-3xl font-serif font-bold text-brand-800">${cartTotal.toFixed(2)}</span>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-start">
                                        <span className="mr-2">⚠️</span>
                                        {error}
                                    </div>
                                )}

                                {/* Botón de Mercado Pago Estilizado */}
                                <button
                                    onClick={handleMercadoPago}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#009ee3] to-[#007eb5] hover:from-[#008ac6] hover:to-[#006e9e] text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12 -translate-x-full"></div>
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <CreditCard className="w-6 h-6 mr-2" />
                                            <span className="text-lg">Pagar con Mercado Pago</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-400 mt-3 mb-6">
                                    Procesado de forma segura por Mercado Pago
                                </p>

                                {/* Logos de métodos de pago en escala de grises para elegancia */}
                                <div className="flex justify-center items-center gap-3 mb-6 opacity-60 hover:opacity-100 transition-opacity">
                                    <img src="https://www.mercadopago.com/org-img/MP3/API/logos/visa.gif" alt="Visa" className="h-5" />
                                    <img src="https://www.mercadopago.com/org-img/MP3/API/logos/master.gif" alt="Mastercard" className="h-5" />
                                    <img src="https://www.mercadopago.com/org-img/MP3/API/logos/amex.gif" alt="Amex" className="h-5" />
                                </div>

                                <div className="text-center">
                                    <Link to="/store" className="inline-block text-brand-600 hover:text-brand-900 font-semibold hover:underline decoration-brand-300 underline-offset-4 transition-all">
                                        ← Continuar comprando
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
