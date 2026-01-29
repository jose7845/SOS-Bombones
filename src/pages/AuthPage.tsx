import { useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, User as UserIcon } from 'lucide-react';

interface AuthPageProps {
    isRegister?: boolean;
}

export default function AuthPage({ isRegister = false }: AuthPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Nuevo campo
    const [verificationCode, setVerificationCode] = useState(''); // Para el código OTP
    const [showVerification, setShowVerification] = useState(false); // Switch de vista
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isRegister) {
                // Registro con metadatos de username
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username,
                        }
                    }
                });
                if (error) throw error;

                // Si el registro es exitoso, mostramos el campo para el código
                setShowVerification(true);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: verificationCode,
                type: 'signup'
            });

            if (error) throw error;

            alert('¡Email verificado con éxito! Ya puedes iniciar sesión.');
            navigate('/login');
            setShowVerification(false);
        } catch (err: any) {
            setError(err.message || 'Código inválido o expirado');
        } finally {
            setLoading(false);
        }
    };

    if (showVerification) {
        return (
            <Layout>
                <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-50">
                    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-brand-100 animate-fade-in">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-accent-100">
                                <Mail className="h-6 w-6 text-accent-600" />
                            </div>
                            <h2 className="mt-4 text-3xl font-serif font-bold text-brand-900">Verifica tu cuenta</h2>
                            <p className="mt-2 text-sm text-brand-600">
                                Hemos enviado un código de confirmación a <br />
                                <span className="font-bold text-brand-900">{email}</span>
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    {error}
                                </div>
                            )}
                            <input
                                type="text"
                                required
                                placeholder="Ingresa el código de 6 dígitos"
                                className="appearance-none relative block w-full px-3 py-3 border border-brand-300 placeholder-brand-400 text-brand-900 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-center tracking-[1em] font-mono text-xl"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-700 hover:bg-brand-600 transition"
                            >
                                {loading ? 'Verificando...' : 'Verificar Cuenta'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowVerification(false)}
                                className="w-full text-sm text-brand-500 hover:text-brand-700"
                            >
                                Volver al registro
                            </button>
                        </form>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-50">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-brand-100">
                    <div>
                        <h2 className="mt-2 text-center text-3xl font-serif font-bold text-brand-900">
                            {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
                        </h2>
                        <p className="mt-2 text-center text-sm text-brand-600">
                            {isRegister ? 'Únete a nuestra comunidad dulce' : 'Bienvenido de nuevo'}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        )}

                        <div className="rounded-md shadow-sm space-y-4">
                            {isRegister && (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-brand-400" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="appearance-none relative block w-full px-3 py-3 pl-10 border border-brand-300 placeholder-brand-400 text-brand-900 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                                        placeholder="Nombre de usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-brand-400" />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-brand-300 placeholder-brand-400 text-brand-900 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-brand-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-brand-300 placeholder-brand-400 text-brand-900 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-700 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition disabled:opacity-70"
                            >
                                {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Ingresar')}
                            </button>
                        </div>

                        <div className="text-center text-sm">
                            {isRegister ? (
                                <p className="text-brand-600">
                                    ¿Ya tienes cuenta? <a href="/login" className="font-medium text-accent-600 hover:text-accent-500">Inicia sesión</a>
                                </p>
                            ) : (
                                <p className="text-brand-600">
                                    ¿No tienes cuenta? <a href="/register" className="font-medium text-accent-600 hover:text-accent-500">Regístrate</a>
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
