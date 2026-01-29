
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { XCircle, RefreshCw, ShoppingCart } from 'lucide-react';

export default function PaymentFailure() {
    const [searchParams] = useSearchParams();

    // Obtener datos de la URL que Mercado Pago envía
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');

    return (
        <Layout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-brand-50 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-red-100">
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-100 rounded-full p-4">
                            <XCircle className="w-16 h-16 text-red-500" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-brand-900 mb-4">
                        Error en el pago
                    </h1>

                    <p className="text-brand-600 mb-6">
                        No pudimos procesar tu pago. No te preocupes, no se realizó ningún cargo.
                        Puedes intentar nuevamente o elegir otro método de pago.
                    </p>

                    {paymentId && (
                        <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-red-700">
                                <span className="font-semibold">Estado:</span> {status || 'Rechazado'}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link
                            to="/cart"
                            className="w-full bg-brand-800 text-white py-3 px-6 rounded-lg font-bold hover:bg-brand-700 transition flex items-center justify-center"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Intentar nuevamente
                        </Link>
                        <Link
                            to="/store"
                            className="w-full bg-brand-100 text-brand-800 py-3 px-6 rounded-lg font-bold hover:bg-brand-200 transition flex items-center justify-center"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Volver a la tienda
                        </Link>
                    </div>

                    <p className="text-xs text-brand-400 mt-6">
                        Si el problema persiste, contáctanos por WhatsApp o email.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
