import { useEffect, useState } from 'react';
import { Facebook, Instagram, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Footer() {
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

    const whatsappLink = `https://wa.me/${settings.whatsapp_number || '5493876856022'}`;
    const mapsLink = "https://maps.app.goo.gl/CUySEjNxqB8KPv8C7";

    return (
        <footer className="bg-brand-950 text-brand-100 pt-20 pb-10 mt-auto border-t-[3px] border-brand-900 relative overflow-hidden">
            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

                    {/* Brand Section */}
                    <div className="md:col-span-5 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-serif font-black text-white tracking-tight italic">S.O.S <span className="text-accent-400">Bombones</span></h3>
                            <p className="text-sm leading-relaxed text-brand-300 max-w-md font-medium">
                                {settings.about_hero_subtitle || 'Dedicados a crear momentos dulces con chocolates artesanales hechos con amor y los mejores ingredientes en Salta.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href={settings.instagram_url || "https://instagram.com/sos_bombones_salta"} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110 active:scale-95 group">
                                <Instagram className="w-6 h-6 group-hover:text-accent-400 transition-colors" />
                            </a>
                            <a href={settings.facebook_url || "https://facebook.com/sosbombones.salta"} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110 active:scale-95 group">
                                <Facebook className="w-6 h-6 group-hover:text-accent-400 transition-colors" />
                            </a>
                            <a href={settings.tiktok_url || "https://www.tiktok.com/@s.o.s.bombones"} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110 active:scale-95 group">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current group-hover:text-accent-400 transition-colors" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.82-.74-3.89-1.73-.09-.08-.18-.17-.27-.26V13.5c0 2.2-.51 4.39-1.83 6.16-1.49 2.12-4.04 3.55-6.61 3.73-2.3.16-4.73-.25-6.67-1.59-2.31-1.55-3.66-4.46-3.23-7.24.28-2.22 1.48-4.32 3.33-5.59 1.75-1.2 3.94-1.66 6-1.25.07.02.14.05.21.08V12c-1.41-.45-3.07-.11-4.08.97-1.12 1.2-1.2 3.14-.13 4.41.97 1.2 2.78 1.62 4.16 1.01.99-.44 1.58-1.47 1.59-2.54V0z" />
                                </svg>
                            </a>
                            <a href={whatsappLink} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 transition-all hover:scale-110 active:scale-95 group">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current group-hover:text-[#25D366] transition-colors" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.23-.298.344-.497.115-.198.058-.372-.029-.548-.087-.174-.784-1.884-1.074-2.574-.285-.685-.575-.591-.791-.602-.204-.011-.436-.011-.669-.011-.233 0-.61.086-.928.431-.318.343-1.214 1.185-1.214 2.891 0 1.706 1.24 3.354 1.413 3.585.174.23 2.443 3.733 5.92 5.234 2.378 1.026 2.859.818 3.385.766.526-.052 1.767-.721 2.016-1.418.25-.697.25-1.294.175-1.418-.074-.125-.272-.199-.572-.35zM12 21.75c-2.052 0-4.017-.55-5.748-1.486l-6.252 1.638 1.67-6.08C.682 14.1 0 12.095 0 10.038 0 4.493 5.373 0 12 0s12 5.373 12 10.875c0 5.502-5.373 10.875-12 10.875z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent-500">Navegación</h3>
                        <ul className="space-y-4 font-bold text-sm">
                            <li><Link to="/store" className="text-brand-300 hover:text-white transition-colors flex items-center group"><div className="w-1.5 h-1.5 bg-accent-500/0 group-hover:bg-accent-500 rounded-full mr-0 group-hover:mr-3 transition-all duration-300"></div>Tienda Online</Link></li>
                            <li><Link to="/about" className="text-brand-300 hover:text-white transition-colors flex items-center group"><div className="w-1.5 h-1.5 bg-accent-500/0 group-hover:bg-accent-500 rounded-full mr-0 group-hover:mr-3 transition-all duration-300"></div>Nuestra Historia</Link></li>
                            <li><Link to="/contact" className="text-brand-300 hover:text-white transition-colors flex items-center group"><div className="w-1.5 h-1.5 bg-accent-500/0 group-hover:bg-accent-500 rounded-full mr-0 group-hover:mr-3 transition-all duration-300"></div>Contacto</Link></li>
                            <li><Link to="/profile" className="text-brand-300 hover:text-white transition-colors flex items-center group"><div className="w-1.5 h-1.5 bg-accent-500/0 group-hover:bg-accent-500 rounded-full mr-0 group-hover:mr-3 transition-all duration-300"></div>Mi Cuenta</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent-500">Contacto Gourmet</h3>
                        <div className="space-y-6">
                            <a href={mapsLink} target="_blank" rel="noreferrer" className="flex items-start group p-4 -ml-4 rounded-3xl hover:bg-white/5 transition-colors">
                                <div className="p-3 bg-brand-900 rounded-2xl mr-4 group-hover:bg-accent-500/10 transition-colors border border-white/5">
                                    <MapPin className="w-5 h-5 text-accent-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm flex items-center gap-2">Ibazeta 580, Salta <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50" /></p>
                                    <p className="text-brand-400 text-xs mt-1">Argentina · Horarios: 9 a 20 hs</p>
                                </div>
                            </a>
                            <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-start group p-4 -ml-4 rounded-3xl hover:bg-white/5 transition-colors">
                                <div className="p-3 bg-brand-900 rounded-2xl mr-4 group-hover:bg-[#25D366]/10 transition-colors border border-white/5">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-accent-400 group-hover:fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.23-.298.344-.497.115-.198.058-.372-.029-.548-.087-.174-.784-1.884-1.074-2.574-.285-.685-.575-.591-.791-.602-.204-.011-.436-.011-.669-.011-.233 0-.61.086-.928.431-.318.343-1.214 1.185-1.214 2.891 0 1.706 1.24 3.354 1.413 3.585.174.23 2.443 3.733 5.92 5.234 2.378 1.026 2.859.818 3.385.766.526-.052 1.767-.721 2.016-1.418.25-.697.25-1.294.175-1.418-.074-.125-.272-.199-.572-.35zM12 21.75c-2.052 0-4.017-.55-5.748-1.486l-6.252 1.638 1.67-6.08C.682 14.1 0 12.095 0 10.038 0 4.493 5.373 0 12 0s12 5.373 12 10.875c0 5.502-5.373 10.875-12 10.875z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{settings.contact_phone || '3876856022'}</p>
                                    <p className="text-brand-400 text-xs mt-1">Consultas y Pedidos Directos</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-brand-500 uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} S.O.S Bombones. Salta, Argentina.</p>
                    <div className="flex gap-8">
                        <Link to="/legal" className="hover:text-white transition-colors">Términos</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
