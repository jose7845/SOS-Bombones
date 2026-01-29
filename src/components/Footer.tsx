
import { Facebook, Instagram, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-brand-900 text-brand-100 py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <h3 className="text-xl font-serif font-bold text-brand-50 mb-4">S.O.S Bombones</h3>
                    <p className="text-sm leading-relaxed mb-4">
                        Dedicados a crear momentos dulces con chocolates artesanales hechos con amor y los mejores ingredientes.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-accent-500 transition"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-accent-500 transition"><Facebook className="w-5 h-5" /></a>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-brand-50 mb-4">Enlaces Rápidos</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/store" className="hover:text-white transition">Tienda</Link></li>
                        <li><Link to="/about" className="hover:text-white transition">Nuestra Historia</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition">Contacto</Link></li>
                        <li><Link to="/login" className="hover:text-white transition">Mi Cuenta</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-brand-50 mb-4 font-serif">Contacto</h3>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start group">
                            <MapPin className="w-5 h-5 mr-3 shrink-0 text-accent-500 group-hover:scale-110 transition-transform" />
                            <a
                                href="https://maps.app.goo.gl/a3JTcf7BYRLCDgtV6"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-white transition"
                            >
                                Ibazeta 580,<br />Salta, Argentina
                            </a>
                        </li>
                        <li className="flex items-center group">
                            <div className="w-5 h-5 mr-3 shrink-0 text-accent-500 group-hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.23-.298.344-.497.115-.198.058-.372-.029-.548-.087-.174-.784-1.884-1.074-2.574-.285-.685-.575-.591-.791-.602-.204-.011-.436-.011-.669-.011-.233 0-.61.086-.928.431-.318.343-1.214 1.185-1.214 2.891 0 1.706 1.24 3.354 1.413 3.585.174.23 2.443 3.733 5.92 5.234 2.378 1.026 2.859.818 3.385.766.526-.052 1.767-.721 2.016-1.418.25-.697.25-1.294.175-1.418-.074-.125-.272-.199-.572-.35zM12 21.75c-2.052 0-4.017-.55-5.748-1.486l-6.252 1.638 1.67-6.08C.682 14.1 0 12.095 0 10.038 0 4.493 5.373 0 12 0s12 5.373 12 10.875c0 5.502-5.373 10.875-12 10.875z" /></svg>
                            </div>
                            <a href="https://wa.me/5493876856022" target="_blank" rel="noreferrer" className="hover:text-white transition">
                                3876856022
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-brand-800 text-center text-xs text-brand-400">
                &copy; {new Date().getFullYear()} S.O.S Bombones. Todos los derechos reservados.
            </div>
        </footer>
    );
}
