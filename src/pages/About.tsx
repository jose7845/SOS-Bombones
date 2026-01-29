import Layout from '../components/Layout';

export default function About() {
    return (
        <Layout>
            <div className="bg-brand-50 min-h-screen py-16 md:py-24 overflow-hidden relative">
                {/* Elementos decorativos de fondo */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-accent-100 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-brand-200 rounded-full blur-[100px] opacity-20"></div>

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    {/* Encabezado con estilo */}
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-accent-600 font-bold uppercase tracking-[0.3em] text-xs">Puro Corazón Artesanal</span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-900 italic tracking-tight">Nuestra Historia</h1>
                        <div className="w-24 h-1 bg-accent-200 mx-auto rounded-full mt-6"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Texto de Historia */}
                        <div className="lg:col-span-5 space-y-8 animate-fade-in">
                            <div className="relative">
                                <span className="text-8xl font-serif text-brand-100 absolute -top-10 -left-6 select-none z-0">"</span>
                                <p className="text-xl leading-relaxed text-brand-800 font-medium relative z-10">
                                    S.O.S Bombones nació en 2024 de una pasión compartida por el chocolate y el arte de regalar.
                                </p>
                            </div>

                            <p className="text-lg leading-relaxed text-brand-600">
                                Lo que comenzó como un pequeño experimento en nuestra cocina familiar, rápidamente se transformó en
                                un emprendimiento dedicado a endulzar la vida de nuestros clientes. Cada pieza que sale de nuestro taller
                                lleva consigo el aroma de la dedicación y el sabor de lo auténtico.
                            </p>

                            <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(78,52,46,0.08)] border border-brand-100 space-y-4">
                                <h3 className="text-2xl font-serif font-bold text-brand-900 italic">Nuestro Legado</h3>
                                <p className="text-brand-600 leading-relaxed">
                                    Creemos en lo hecho a mano. Cada bombón es pintado, rellenado y desmoldado con cuidado artesanal,
                                    utilizando únicamente cacaos de origen ético y rellenos naturales sin conservantes.
                                </p>
                            </div>
                        </div>

                        {/* Imagen Protagonista (Foto del Stand) */}
                        <div className="lg:col-span-7 relative group animate-slide-up">
                            {/* Marco Decorativo */}
                            <div className="absolute -inset-4 border-2 border-accent-200 rounded-[3.5rem] transform rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>

                            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_30px_70px_rgba(78,52,46,0.2)] bg-brand-100">
                                <img
                                    src="/nosotros.jpg"
                                    alt="Equipo S.O.S Bombones en su stand artesanal"
                                    className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000"
                                />
                                {/* Overlay sutil */}
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>

                            {/* Detalle decorativo */}
                            <div className="absolute -bottom-6 -right-6 bg-accent-500 text-white p-6 rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-500 z-20">
                                <p className="text-center font-serif italic text-2xl leading-none">Hecho con Amigo</p>
                                <p className="text-[10px] uppercase tracking-widest text-white/80 mt-1 text-center font-bold">Artesanías Salteñas</p>
                            </div>
                        </div>
                    </div>

                    {/* Misión final */}
                    <div className="mt-24 text-center max-w-2xl mx-auto space-y-8 pb-12">
                        <div className="inline-block px-6 py-2 bg-brand-100 rounded-full text-brand-800 text-sm font-bold uppercase tracking-widest">
                            ¿Por qué S.O.S?
                        </div>
                        <p className="text-2xl md:text-3xl font-serif text-brand-900 italic leading-relaxed">
                            "Ser tu salvación cuando necesitas un regalo perfecto o simplemente un momento de indulgencia personal."
                        </p>
                        <div className="w-16 h-0.5 bg-brand-200 mx-auto"></div>
                        <p className="text-brand-500 font-medium">¡Gracias por dejar que S.O.S sea parte de tus momentos especiales!</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
