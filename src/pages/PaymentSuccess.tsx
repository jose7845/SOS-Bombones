
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();

    // Obtener datos de la URL que Mercado Pago envía
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');

    useEffect(() => {
        // Limpiar el carrito al llegar a esta página
        clearCart();
    }, []);

    return (
        <Layout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-brand-50 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-green-100">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 rounded-full p-4">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-brand-900 mb-4">
                        ¡Gracias por tu compra!
                    </h1>

                    <p className="text-brand-600 mb-6">
                        Tu pago ha sido procesado exitosamente. Recibirás un email de confirmación con los detalles de tu pedido.
                    </p>

                    {paymentId && (
                        <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-green-700">
                                <span className="font-semibold">ID de Pago:</span> {paymentId}
                            </p>
                            {externalReference && (
                                <p className="text-sm text-green-700 mt-1">
                                    <span className="font-semibold">Referencia:</span> {externalReference}
                                </p>
                            )}
                            <p className="text-sm text-green-700 mt-1">
                                <span className="font-semibold">Estado:</span> {status === 'approved' ? 'Aprobado ✓' : status}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link
                            to="/orders"
                            className="w-full bg-brand-800 text-white py-3 px-6 rounded-lg font-bold hover:bg-brand-700 transition flex items-center justify-center"
                        >
                            Ver mis pedidos
                        </Link>
                        <Link
                            to="/store"
                            className="w-full bg-brand-100 text-brand-800 py-3 px-6 rounded-lg font-bold hover:bg-brand-200 transition flex items-center justify-center"
                        >
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
