import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../AuthContext';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function Profile() {
    const { user, profile: authProfile, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });

    useEffect(() => {
        if (authProfile) {
            setFormData({
                username: authProfile.username || '',
                email: authProfile.email || ''
            });
        }
    }, [authProfile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: formData.username
                })
                .eq('id', user.id);

            if (error) throw error;

            // Refrescar el contexto global para que el cambio se vea en el Navbar, etc.
            if (refreshProfile) await refreshProfile();

            setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Error al actualizar: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="bg-brand-50 min-h-[calc(100vh-80px)] py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-100 animate-fade-in">
                        {/* Header decorativo */}
                        <div className="bg-brand-900 h-32 relative">
                            <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full shadow-lg">
                                <div className="w-24 h-24 bg-accent-100 rounded-full flex items-center justify-center text-accent-700 text-3xl font-bold border-4 border-white">
                                    {formData.username?.charAt(0).toUpperCase() || formData.email?.charAt(0).toUpperCase() || '?'}
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 px-8 pb-10">
                            <div className="mb-8">
                                <h1 className="text-3xl font-serif font-bold text-brand-900">Mi Perfil</h1>
                                <p className="text-brand-500">Gestioná tu información personal y preferencias</p>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                {message && (
                                    <div className={`p-4 rounded-lg flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        <span className="text-sm font-medium">{message.text}</span>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-brand-700 mb-1 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-brand-400" />
                                            Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            disabled
                                            value={formData.email}
                                            className="w-full px-4 py-3 bg-brand-50 border border-brand-200 rounded-xl text-brand-400 cursor-not-allowed font-medium"
                                        />
                                        <p className="text-[10px] text-brand-400 mt-1 uppercase tracking-wider font-bold">El email no puede ser modificado</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-brand-700 mb-1 flex items-center gap-2">
                                            <User className="w-4 h-4 text-brand-400" />
                                            Nombre de Usuario
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="Tu nombre o apodo"
                                            className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all text-brand-900 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 bg-brand-800 text-white py-4 rounded-xl hover:bg-brand-700 transition-all font-bold shadow-lg shadow-brand-900/10 disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Guardando cambios...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
