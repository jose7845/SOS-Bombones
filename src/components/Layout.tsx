import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import FloatingChatbot from './FloatingChatbot';
import SocialFloatingButtons from './SocialFloatingButtons';

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen bg-brand-50 text-brand-900 font-sans">
            <Navbar />
            {/* Añadimos padding-top si no estamos en la home para evitar que el navbar tape contenido */}
            <main className={`flex-grow ${!isHome ? 'pt-24' : ''}`}>
                {children}
            </main>
            <Footer />
            <SocialFloatingButtons />
            <FloatingChatbot />
        </div>
    );
}

