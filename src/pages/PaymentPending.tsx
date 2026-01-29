
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Clock, ShoppingBag } from 'lucide-react';

export default function PaymentPending() {
    const [searchParams] = useSearchParams();

    const paymentId = searchParams.get('payment_id');
    const externalReference = searchParams.get('external_reference');

    return (
        <Layout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-brand-50 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-yellow-100">
                    <div className="flex justify-center mb-6">
                        <div className="bg-yellow-100 rounded-full p-4">
                            <Clock className="w-16 h-16 text-yellow-500" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-brand-900 mb-4">
                        Pago pendiente
                    </h1>

                    <p className="text-brand-600 mb-6">
                        Tu pago está siendo procesado. Esto puede tomar unos minutos.
                        Te notificaremos por email cuando se confirme.
                    </p>

                    {paymentId && (
                        <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-yellow-700">
                                <span className="font-semibold">ID de Pago:</span> {paymentId}
                            </p>
                            {externalReference && (
                                <p className="text-sm text-yellow-700 mt-1">
                                    <span className="font-semibold">Referencia:</span> {externalReference}
                                </p>
                            )}
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
