import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Mail, Phone, MapPin } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import { supabase } from '../lib/supabaseClient';

export default function Contact() {
    const [settings, setSettings] = useState<Record<string, string>>({});

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
            <div className="bg-brand-50 min-h-screen py-10 animate-fade-in">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-serif font-bold text-brand-900 mb-2 flex items-center justify-center gap-3">
                            Hablemos <span className="text-4xl filter drop-shadow-sm">💬</span>
                        </h1>
                        <p className="text-brand-800 text-xl font-medium mb-1">
                            Respondemos rápido y con amor <span className="text-yellow-500 filter drop-shadow-sm">💛</span>
                        </p>
                        <p className="text-brand-600 text-md">
                            Consultas, pedidos especiales y regalos personalizados.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-8">
                            <a
                                href={`https://wa.me/${settings.whatsapp_number || '5493876856022'}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-8 text-center transition-colors">
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        <span className="font-bold text-xl">Pedí por WhatsApp</span>
                                    </div>
                                    <p className="text-green-50 text-sm font-medium opacity-90">Respondemos en el acto</p>
                                </div>
                            </a>

                            <div className="bg-white p-10 rounded-3xl shadow-sm border border-brand-100">
                                <h2 className="text-3xl font-serif font-bold text-brand-900 mb-8 items-center flex gap-2">Información</h2>
                                <div className="space-y-10">
                                    <div className="flex items-start group">
                                        <div className="bg-brand-50 p-4 rounded-2xl mr-5 group-hover:bg-brand-100 transition-colors border border-brand-100">
                                            <MapPin className="w-7 h-7 text-brand-800" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif font-bold text-brand-900 text-xl mb-1">Ubicación</h3>
                                            <p className="text-brand-600 text-lg">{settings.contact_address || 'Ibazeta 580, Salta'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start group">
                                        <div className="bg-brand-50 p-4 rounded-2xl mr-5 group-hover:bg-brand-100 transition-colors border border-brand-100">
                                            <Phone className="w-7 h-7 text-brand-800" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif font-bold text-brand-900 text-xl mb-1">Teléfono</h3>
                                            <p className="text-brand-600 text-lg font-medium">{settings.contact_phone || '3876856022'}</p>
                                            <p className="text-brand-400 text-sm">Lunes a Sábado · 9 a 20 hs</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start group">
                                        <div className="bg-brand-50 p-4 rounded-2xl mr-5 group-hover:bg-brand-100 transition-colors border border-brand-100">
                                            <Mail className="w-7 h-7 text-brand-800" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif font-bold text-brand-900 text-xl mb-1">Email</h3>
                                            <a href={`mailto:${settings.contact_email || 'sosbombones.salta@gmail.com'}`} className="text-brand-600 text-lg hover:text-brand-800 transition-colors">
                                                {settings.contact_email || 'sosbombones.salta@gmail.com'}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-[600px] sticky top-24 shadow-2xl rounded-3xl overflow-hidden animate-fade-in-up">
                            <Chatbot />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
