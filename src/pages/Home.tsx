import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Mail, Truck, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Configuración del Carrusel de Fondo
    const heroImages = [
        "/hero-bg-1.jpg", // Foto subida 1: Caja de bombones y café
        "/hero-bg-2.jpg"  // Foto subida 2: Primer plano de bombones
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000); // Cambiar cada 5 segundos

        return () => clearInterval(interval);
    }, []);

    return (
        <Layout>
            {/* Hero Section - Estilo "Delicio" con Carrusel */}
            <div className="relative h-screen min-h-[600px] flex items-center justify-center bg-black text-white overflow-hidden">

                {/* Carrusel de Imágenes de Fondo */}
                <div className="absolute inset-0 z-0">
                    {heroImages.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                src={img}
                                alt={`Background slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                    {/* Overlay Global con Tinte Chocolate (Sepia/Marrón) */}
                    <div className="absolute inset-0 bg-brand-900/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-950/60 via-transparent to-brand-900/80"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-16">
                    <div className="mb-6 animate-fade-in">
                        <img
                            src="/logo.png"
                            alt="S.O.S Bombones"
                            className="h-40 md:h-72 mx-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Indicadores del Carrusel (Puntos) - Opcional, sutil */}
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 pointer-events-auto">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`h-2 rounded-full transition-all duration-500 shadow-md ${index === currentImageIndex ? 'bg-accent-400 w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`}
                                aria-label={`Ver imagen ${index + 1}`}
                            />
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight animate-slide-up text-white drop-shadow-lg">
                        <span className="italic text-accent-300">Dulzura Artesanal</span> <br />
                        para cada momento
                    </h1>

                    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link
                            to="/store"
                            className="inline-block px-10 py-4 bg-accent-400 hover:bg-accent-500 text-brand-950 font-sans font-bold uppercase tracking-widest text-sm rounded shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-accent-400/50"
                        >
                            Ver Tienda
                        </Link>
                    </div>
                </div>
            </div>

            {/* Info Bar - Gadget UX */}
            <div className="bg-white py-8 border-b border-brand-100 relative z-20 shadow-sm -mt-4 md:-mt-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-brand-100">
                        <InfoItem
                            icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.23-.298.344-.497.115-.198.058-.372-.029-.548-.087-.174-.784-1.884-1.074-2.574-.285-.685-.575-.591-.791-.602-.204-.011-.436-.011-.669-.011-.233 0-.61.086-.928.431-.318.343-1.214 1.185-1.214 2.891 0 1.706 1.24 3.354 1.413 3.585.174.23 2.443 3.733 5.92 5.234 2.378 1.026 2.859.818 3.385.766.526-.052 1.767-.721 2.016-1.418.25-.697.25-1.294.175-1.418-.074-.125-.272-.199-.572-.35zM12 21.75c-2.052 0-4.017-.55-5.748-1.486l-6.252 1.638 1.67-6.08C.682 14.1 0 12.095 0 10.038 0 4.493 5.373 0 12 0s12 5.373 12 10.875c0 5.502-5.373 10.875-12 10.875z" /></svg>}
                            title="Atención Personalizada"
                            desc="Por WhatsApp"
                        />
                        <InfoItem
                            icon={<Mail className="w-5 h-5" />}
                            title="Notificaciones por Correo"
                            desc="Estado de tu pedido"
                        />
                        <InfoItem
                            icon={<Truck className="w-5 h-5" />}
                            title="Envíos a Domicilio"
                            desc="A todo el país"
                        />
                    </div>
                </div>
            </div>

            {/* Popular Section */}
            <div className="py-24 bg-brand-50 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header estilo "Delicio" con logos de fondo sutiles si quisieras, aquí limpio */}
                    <div className="text-center mb-16">
                        <span className="text-accent-600 font-display text-2xl">Nuestra Selección</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-900 mt-2">
                            Populares en la Tienda
                        </h2>
                        <div className="w-24 h-1 bg-accent-400 mx-auto mt-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Promo Card Grande */}
                        <div className="lg:col-span-1 bg-brand-900 rounded-lg overflow-hidden relative group h-96 lg:h-auto shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800"
                                alt="Chocolate"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <h3 className="font-serif text-3xl mb-2">Lo Más <br />Vendido</h3>
                                <Link to="/store" className="text-accent-300 text-sm font-bold uppercase tracking-wider flex items-center hover:text-white transition">
                                    Ver Más <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>

                        {/* Product Cards */}
                        <ProductCardPreview
                            image="https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?auto=format&fit=crop&q=80&w=800"
                            title="Torta Mousse"
                            price="$15.000"
                        />
                        <ProductCardPreview
                            image="https://images.unsplash.com/photo-1606312619070-d48b706521bf?auto=format&fit=crop&q=80&w=800"
                            title="Bombones Surtidos"
                            price="$22.000"
                        />
                        <ProductCardPreview
                            image="https://images.unsplash.com/photo-1582294168067-c10a4a6e355b?auto=format&fit=crop&q=80&w=800"
                            title="Trufas de Cacao"
                            price="$18.500"
                        />
                    </div>

                    {/* Brands / Divider visual - Logos decorativos */}
                    <div className="mt-24 flex justify-center items-center space-x-8 md:space-x-16 opacity-30 grayscale saturate-0 pointer-events-none">
                        <span className="font-display text-4xl text-brand-800">Milka</span>
                        <span className="font-serif text-3xl text-brand-800 font-bold">Arcor</span>
                        <span className="font-display text-4xl text-brand-800">Ferrero</span>
                        <span className="font-serif text-3xl text-brand-800 font-bold">Lindt</span>
                    </div>

                </div>
            </div>


        </Layout>
    );
}

function InfoItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex items-center justify-center space-x-4 py-4 md:py-0 text-brand-800 group cursor-default">
            <div className="p-3 bg-brand-50 rounded-full group-hover:bg-brand-100 transition text-accent-600">
                {icon}
            </div>
            <div className="text-left">
                <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-brand-900">{title}</h4>
                <p className="text-xs text-brand-500 font-medium">{desc}</p>
            </div>
        </div>
    );
}

function ProductCardPreview({ image, title, price }: { image: string, title: string, price: string }) {
    return (
        <div className="bg-white group cursor-pointer border border-transparent hover:border-brand-100 hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2">
            <div className="relative aspect-square overflow-hidden bg-brand-100">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link to="/store" className="bg-white text-brand-900 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent-500 hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300">
                        Ver Detalles
                    </Link>
                </div>
            </div>
            <div className="p-6 text-center">
                <h3 className="font-serif text-xl text-brand-900 mb-2">{title}</h3>
                <span className="text-accent-600 font-bold font-sans">{price}</span>
            </div>
        </div>
    );
}
