
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, signOut, isAdmin, profile } = useAuth();
    const { cartCount } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Efecto para cambiar estilo al hacer scroll (opcional, pero elegante)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        setUserMenuOpen(false);
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const isHome = location.pathname === '/';
    const isTransparent = isHome && !scrolled;

    const isDarkModeNavbar = isTransparent || scrolled;

    const navBgClass = isTransparent
        ? 'bg-transparent py-4'
        : scrolled
            ? 'bg-[#3E2723] shadow-md py-2'
            : 'bg-[#3E2723] py-4 shadow-sm';

    // Texto e íconos siempre blancos ya que el fondo será transparente (sobre img oscura) o marrón oscuro
    const textColorClass = 'text-white hover:text-accent-200 drop-shadow-sm';
    const iconColorClass = 'text-white hover:text-accent-200 drop-shadow-sm';

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${navBgClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <img
                            src="/logo.png"
                            alt="S.O.S Bombones Logo"
                            className={`h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${isDarkModeNavbar ? 'brightness-125 drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]' : ''}`}
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className={`hidden md:flex items-center space-x-8 font-sans font-medium text-sm tracking-widest uppercase transition-colors duration-300`}>
                        <Link to="/" className={`${textColorClass} transition-colors`}>Inicio</Link>
                        <Link to="/store" className={`${textColorClass} transition-colors`}>Tienda</Link>
                        <Link to="/about" className={`${textColorClass} transition-colors`}>Nosotros</Link>
                        <Link to="/contact" className={`${textColorClass} transition-colors`}>Contacto</Link>
                        {isAdmin && (
                            <Link to="/admin" className={`font-bold transition-colors ${isTransparent ? 'text-accent-300 hover:text-accent-100' : 'text-accent-600 hover:text-accent-700'}`}>Admin</Link>
                        )}
                    </div>

                    {/* Icons / Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/cart" className={`relative transition group ${iconColorClass}`}>
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white/20">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className={`flex items-center space-x-2 transition focus:outline-none group ${iconColorClass}`}
                                >
                                    <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors py-1 pl-4 pr-1.5 rounded-full border border-white/10 group-hover:border-white/30 backdrop-blur-sm">
                                        {profile?.username && (
                                            <span className="text-sm font-bold tracking-tight text-white drop-shadow-sm">
                                                {profile.username}
                                            </span>
                                        )}
                                        <div className="bg-accent-500 rounded-full p-1.5 shadow-inner">
                                            <UserIcon className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-4 w-56 bg-white text-brand-900 rounded-lg shadow-xl py-2 z-[100] border border-brand-100 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-brand-50">
                                            <p className="text-xs text-brand-400 font-medium uppercase tracking-wider">Conectado como</p>
                                            <p className="text-sm font-bold truncate text-brand-800">{user.email}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 hover:text-brand-900 mx-2 rounded font-medium"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Mi Perfil
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    className="block px-4 py-2 text-sm text-accent-600 font-bold hover:bg-brand-50 hover:text-accent-700 mx-2 rounded"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    Panel de Admin
                                                </Link>
                                            )}
                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 hover:text-brand-900 mx-2 rounded"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Mis Pedidos
                                            </Link>
                                        </div>

                                        <div className="border-t border-brand-50 mt-1 pt-1">
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center mx-2 rounded mb-1"
                                            >
                                                <LogOut className="w-3 h-3 mr-2" /> Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className={`text-sm font-bold uppercase tracking-widest transition ${textColorClass}`}>
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <Link to="/cart" className={`mr-6 relative ${iconColorClass}`}>
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)} className={`${iconColorClass}`}>
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-brand-100 shadow-lg absolute w-full animate-fade-in z-50">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <Link to="/" className="block px-3 py-3 rounded-md text-base font-bold text-brand-900 hover:bg-brand-50" onClick={() => setIsOpen(false)}>INICIO</Link>
                        <Link to="/store" className="block px-3 py-3 rounded-md text-base font-bold text-brand-900 hover:bg-brand-50" onClick={() => setIsOpen(false)}>TIENDA</Link>
                        <Link to="/about" className="block px-3 py-3 rounded-md text-base font-bold text-brand-900 hover:bg-brand-50" onClick={() => setIsOpen(false)}>NOSOTROS</Link>
                        <Link to="/contact" className="block px-3 py-3 rounded-md text-base font-bold text-brand-900 hover:bg-brand-50" onClick={() => setIsOpen(false)}>CONTACTO</Link>

                        {isAdmin && (
                            <Link to="/admin" className="block px-3 py-3 rounded-md text-base font-bold text-accent-600 bg-accent-50" onClick={() => setIsOpen(false)}>ADMINISTRACIÓN</Link>
                        )}

                        <div className="border-t border-brand-100 my-2 pt-2"></div>

                        {user ? (
                            <>
                                <div className="px-3 py-2 text-xs font-medium text-brand-400 uppercase tracking-wider">Cuenta</div>
                                <div className="px-3 text-sm text-brand-800 font-semibold mb-2">{user.email}</div>
                                <Link to="/profile" className="block px-3 py-3 rounded-md text-base font-medium text-brand-600 hover:bg-brand-50" onClick={() => setIsOpen(false)}>Mi Perfil</Link>
                                <Link to="/orders" className="block px-3 py-3 rounded-md text-base font-medium text-brand-600 hover:bg-brand-50" onClick={() => setIsOpen(false)}>Mis Pedidos</Link>
                                <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-500 hover:bg-red-50">Cerrar Sesión</button>
                            </>
                        ) : (
                            <Link to="/login" className="block w-full text-center mt-4 px-3 py-3 rounded-md bg-brand-900 text-white hover:bg-brand-800 font-bold tracking-widest uppercase transition" onClick={() => setIsOpen(false)}>INICIAR SESIÓN</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
