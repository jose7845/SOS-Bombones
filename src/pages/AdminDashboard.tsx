import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Edit, X, MessageSquare, Settings, Users, ShoppingBag, Info, Phone, Store, ChefHat, Heart, Coffee } from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users' | 'chatbot' | 'settings'>('products');
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [knowledge, setKnowledge] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [settings, setSettings] = useState<any[]>([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image_url: '',
        secondary_images: [] as string[],
        keywords: '',
        answer: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'products') {
                const { data: prodData } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
                const { data: catData } = await supabase.from('categories').select('*').order('name');
                if (prodData) setProducts(prodData);
                if (catData) setCategories(catData);
            } else if (activeTab === 'orders') {
                const { data: ordData } = await supabase
                    .from('orders')
                    .select('*, profiles(email)')
                    .order('created_at', { ascending: false });
                if (ordData) setOrders(ordData);
            } else if (activeTab === 'users') {
                const { data: userData } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (userData) setUsers(userData);
            } else if (activeTab === 'chatbot') {
                const { data: chatData } = await supabase
                    .from('chatbot_knowledge')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (chatData) setKnowledge(chatData);
            } else if (activeTab === 'settings') {
                const { data: settingsData } = await supabase.from('site_settings').select('*').order('key');
                if (settingsData) setSettings(settingsData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeTab === 'chatbot') {
                const payload = {
                    keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k !== ''),
                    answer: formData.answer
                };

                if (editingItem) {
                    const { error } = await supabase.from('chatbot_knowledge').update(payload).eq('id', editingItem.id);
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from('chatbot_knowledge').insert(payload);
                    if (error) throw error;
                }
            } else {
                const payload = {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    category_id: formData.category_id || null,
                    image_url: formData.image_url,
                    secondary_images: formData.secondary_images
                };

                if (editingItem) {
                    const { error } = await supabase.from('products').update(payload).eq('id', editingItem.id);
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from('products').insert(payload);
                    if (error) throw error;
                }
            }

            setShowModal(false);
            setEditingItem(null);
            resetForm();
            fetchData();
        } catch (error: any) {
            alert('Error al guardar: ' + error.message);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const { error } = await supabase.from('categories').insert([{ name: newCategoryName.trim() }]);
            if (error) throw error;
            setNewCategoryName('');
            fetchData();
        } catch (error: any) {
            alert('Error al crear categoría: ' + error.message);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return;
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error: any) {
            alert('Error al eliminar categoría: ' + error.message);
        }
    };

    const handleSaveSetting = async (key: string, value: string) => {
        try {
            const { error } = await supabase.from('site_settings').update({ value }).eq('key', key);
            if (error) throw error;
            fetchData();
        } catch (error: any) {
            alert('Error al guardar configuración: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            category_id: '',
            image_url: '',
            secondary_images: [],
            keywords: '',
            answer: ''
        });
    };

    const openEdit = (item: any) => {
        setEditingItem(item);
        if (activeTab === 'chatbot') {
            setFormData({
                ...formData,
                keywords: item.keywords.join(', '),
                answer: item.answer
            });
        } else {
            setFormData({
                name: item.name,
                description: item.description || '',
                price: item.price.toString(),
                stock: item.stock.toString(),
                category_id: item.category_id || '',
                image_url: item.image_url || '',
                secondary_images: item.secondary_images || [],
                keywords: '',
                answer: ''
            });
        }
        setShowModal(true);
    };

    const openNew = () => {
        setEditingItem(null);
        resetForm();
        setShowModal(true);
    };

    const settingsGroups = [
        {
            title: "Sobre Nosotros",
            icon: <Info className="w-5 h-5 text-accent-500" />,
            keys: ['about_hero_title', 'about_hero_subtitle', 'about_main_text_1', 'about_main_text_2', 'about_legacy_title', 'about_legacy_text']
        },
        {
            title: "Contacto & Redes",
            icon: <Phone className="w-5 h-5 text-green-500" />,
            keys: ['whatsapp_number', 'contact_address', 'contact_phone', 'contact_email']
        },
        {
            title: "Inicio & Eslogan",
            icon: <Store className="w-5 h-5 text-brand-500" />,
            keys: ['home_store_title', 'home_slogan']
        }
    ];

    return (
        <Layout>
            <div className="bg-brand-50 min-h-screen py-10 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-900 rounded-xl shadow-lg shadow-brand-900/20">
                                <ChefHat className="w-6 h-6 text-accent-400" />
                            </div>
                            <h1 className="text-3xl font-serif font-bold text-brand-900 tracking-tight">Panel <span className="text-accent-600">Gourmet</span></h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 bg-white/80 backdrop-blur-md rounded-2xl p-1.5 shadow-xl border border-brand-100/50">
                            <button onClick={() => setActiveTab('products')} className={`flex items-center px-4 py-2.5 rounded-xl font-black text-[10px] transition-all uppercase tracking-[0.15em] ${activeTab === 'products' ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/30' : 'text-brand-500 hover:bg-brand-50 hover:text-brand-900'}`}><ShoppingBag className="w-3.5 h-3.5 mr-2" /> Productos</button>
                            <button onClick={() => setActiveTab('orders')} className={`flex items-center px-4 py-2.5 rounded-xl font-black text-[10px] transition-all uppercase tracking-[0.15em] ${activeTab === 'orders' ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/30' : 'text-brand-500 hover:bg-brand-50 hover:text-brand-900'}`}><Store className="w-3.5 h-3.5 mr-2" /> Ventas</button>
                            <button onClick={() => setActiveTab('chatbot')} className={`flex items-center px-4 py-2.5 rounded-xl font-black text-[10px] transition-all uppercase tracking-[0.15em] ${activeTab === 'chatbot' ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/30' : 'text-brand-500 hover:bg-brand-50 hover:text-brand-900'}`}><MessageSquare className="w-3.5 h-3.5 mr-2" /> Bot</button>
                            <button onClick={() => setActiveTab('users')} className={`flex items-center px-4 py-2.5 rounded-xl font-black text-[10px] transition-all uppercase tracking-[0.15em] ${activeTab === 'users' ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/30' : 'text-brand-500 hover:bg-brand-50 hover:text-brand-900'}`}><Users className="w-3.5 h-3.5 mr-2" /> Usuarios</button>
                            <button onClick={() => setActiveTab('settings')} className={`flex items-center px-4 py-2.5 rounded-xl font-black text-[10px] transition-all uppercase tracking-[0.15em] ${activeTab === 'settings' ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/30' : 'text-brand-500 hover:bg-brand-50 hover:text-brand-900'}`}><Settings className="w-3.5 h-3.5 mr-2" /> Ajustes</button>
                            <div className="w-[1px] h-6 bg-brand-100 mx-1"></div>
                            <button onClick={() => setShowCategoryManager(true)} className="flex items-center px-4 py-2.5 rounded-xl font-black text-[10px] transition-all uppercase tracking-[0.15em] bg-accent-50 text-accent-700 hover:bg-accent-100 border border-accent-200/50 shadow-sm"><Store className="w-3.5 h-3.5 mr-2" /> Categorías</button>
                        </div>
                    </div>

                    {activeTab === 'products' ? (
                        <div className="animate-fade-in">
                            <div className="flex justify-end mb-6">
                                <button onClick={openNew} className="group flex items-center bg-brand-900 text-white px-8 py-3.5 rounded-2xl hover:bg-brand-800 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-900/20 active:scale-95">
                                    <div className="bg-brand-800 group-hover:bg-accent-500 p-1 rounded-lg mr-3 transition-colors">
                                        <Plus className="w-4 h-4 text-white" />
                                    </div>
                                    Añadir Nuevo Producto
                                </button>
                            </div>
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-900/5 overflow-hidden border border-brand-100/50 backdrop-blur-xl">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-brand-100">
                                        <thead className="bg-brand-50/30">
                                            <tr>
                                                <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Producto</th>
                                                <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Categoría</th>
                                                <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Precio</th>
                                                <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Stock</th>
                                                <th className="px-8 py-6 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-brand-50">
                                            {products.map(p => (
                                                <tr key={p.id} className="hover:bg-brand-50/20 transition-all group">
                                                    <td className="px-8 py-6 flex items-center">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-brand-900 rounded-2xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                                            <img src={p.image_url || "https://via.placeholder.com/40"} className="h-16 w-16 rounded-2xl object-cover mr-6 border border-brand-100 shadow-sm relative z-10" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-base font-bold text-brand-900">{p.name}</span>
                                                            <span className="text-[10px] text-brand-300 font-mono">#{p.id.slice(0, 8)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold border border-brand-100/50">{p.categories?.name || 'Sin categoría'}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-lg text-brand-900 font-black tracking-tight">${p.price}</td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-400' : p.stock > 0 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                                                            <span className="text-sm text-brand-700 font-bold">{p.stock} <span className="text-[10px] text-brand-300 font-normal ml-0.5">u.</span></span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right space-x-3">
                                                        <button onClick={() => openEdit(p)} className="p-3 text-brand-300 hover:text-brand-900 hover:bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-brand-100"><Edit className="w-5 h-5" /></button>
                                                        <button onClick={() => handleDeleteProduct(p.id)} className="p-3 text-brand-100 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'orders' ? (
                        <div className="grid grid-cols-1 gap-6 animate-fade-in">
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-900/5 overflow-hidden border border-brand-100/50">
                                <table className="min-w-full divide-y divide-brand-100">
                                    <thead className="bg-brand-50/30">
                                        <tr>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">ID Orden</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Cliente</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Total</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-brand-50">
                                        {orders.map(o => (
                                            <tr key={o.id} className="hover:bg-brand-50/20 transition-all">
                                                <td className="px-8 py-6 text-sm font-mono text-brand-400 font-bold">#{o.id.slice(0, 8)}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-black text-[10px]">{o.profiles?.email?.charAt(0).toUpperCase()}</div>
                                                        <span className="text-sm text-brand-900 font-bold">{o.profiles?.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-lg font-black text-brand-900 tracking-tight">${o.total}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center w-fit gap-2 ${o.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${o.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                                        {o.status === 'paid' ? 'Completado' : 'Pendiente'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'chatbot' ? (
                        <div className="animate-fade-in space-y-6">
                            <div className="flex justify-end">
                                <button onClick={openNew} className="flex items-center bg-brand-800 text-white px-8 py-3.5 rounded-2xl hover:bg-brand-700 transition font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-200">
                                    <Plus className="w-5 h-5 mr-3" /> Nuevo Entrenamiento
                                </button>
                            </div>
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-900/5 overflow-hidden border border-brand-100/50">
                                <table className="min-w-full divide-y divide-brand-100">
                                    <thead className="bg-brand-50/30">
                                        <tr>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Disparadores (Keywords)</th>
                                            <th className="px-8 py-6 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-brand-50">
                                        {knowledge.map(k => (
                                            <tr key={k.id} className="hover:bg-brand-50/20 transition-all">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-wrap gap-2">
                                                        {k.keywords.map((kw: string, i: number) => (
                                                            <span key={i} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-[10px] font-black border border-brand-100/50 uppercase tracking-tighter">{kw}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button onClick={() => openEdit(k)} className="p-3 text-brand-300 hover:text-brand-900 rounded-2xl bg-brand-50/50 hover:bg-white border border-transparent hover:border-brand-100 transition-all"><Edit className="w-5 h-5" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'users' ? (
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-900/5 overflow-hidden border border-brand-100/50 animate-fade-in">
                            <table className="min-w-full divide-y divide-brand-100">
                                <thead className="bg-brand-50/30">
                                    <tr>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Perfil de Usuario</th>
                                        <th className="px-8 py-6 text-left text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Rol</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-brand-50">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-brand-50/20 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-brand-100 text-brand-600'}`}>
                                                        {u.username?.charAt(0) || u.email?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-bold text-brand-900">{u.username || 'Usuario'}</span>
                                                        {u.role === 'admin' ? (
                                                            <span className="text-xs text-brand-400 font-mono tracking-tighter">{u.email}</span>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <X className="w-3 h-3 text-brand-200" />
                                                                <span className="text-[10px] text-brand-300 italic font-medium leading-none">Identidad protegida</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200' : 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'}`}>{u.role}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="space-y-12 animate-fade-in pb-20">
                            {settingsGroups.map((group, idx) => (
                                <div key={idx} className="bg-white rounded-[3rem] shadow-2xl shadow-brand-900/5 p-10 border border-brand-100/50 space-y-10 group/section transition-all hover:bg-brand-50/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-white rounded-3xl shadow-lg shadow-brand-900/5 border border-brand-50">
                                            {group.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-serif font-bold text-brand-900 tracking-tight">{group.title}</h2>
                                            <p className="text-[10px] text-brand-400 font-bold uppercase tracking-[0.2em] mt-1">Configuración del Sitio Web</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {settings.filter(s => group.keys.includes(s.key)).map(s => (
                                            <div key={s.key} className="space-y-3 group/field">
                                                <div className="flex items-center gap-2 pl-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-200 group-focus-within/field:bg-accent-500 transition-colors"></div>
                                                    <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest block transition-colors group-focus-within/field:text-brand-900">{s.key.replace(/_/g, ' ')}</label>
                                                </div>
                                                <div className="relative">
                                                    {s.key.includes('text') || s.key.includes('slogan') ? (
                                                        <textarea
                                                            className="w-full border-brand-100 rounded-3xl p-6 text-sm text-brand-800 focus:ring-[6px] focus:ring-accent-500/10 focus:border-accent-500 transition-all min-h-[140px] bg-white shadow-sm font-medium leading-relaxed"
                                                            defaultValue={s.value}
                                                            onBlur={e => handleSaveSetting(s.key, e.target.value)}
                                                        />
                                                    ) : (
                                                        <input
                                                            className="w-full border-brand-100 rounded-2xl p-5 text-sm text-brand-800 focus:ring-[6px] focus:ring-accent-500/10 focus:border-accent-500 transition-all bg-white shadow-sm font-bold"
                                                            defaultValue={s.value}
                                                            onBlur={e => handleSaveSetting(s.key, e.target.value)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Productos (Estilo Exageradamente Gourmet) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-2xl">
                    <div className="bg-white rounded-[4rem] max-w-3xl w-full shadow-[0_40px_100px_rgba(78,52,46,0.3)] relative animate-scale-up overflow-hidden border border-white/50">
                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-accent-400 via-brand-500 to-accent-500"></div>
                        <div className="p-12 overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <div className="flex items-center gap-2 text-accent-600 mb-2">
                                        <Coffee className="w-5 h-5" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Artesanía Salteña</span>
                                    </div>
                                    <h2 className="text-5xl font-serif font-bold text-brand-900 leading-tight">{editingItem ? 'Perfeccionar Receta' : 'Crear Obra de Arte'}</h2>
                                    <p className="text-brand-400 text-sm mt-2 font-medium">Cada detalle cuenta para una experiencia única</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-4 hover:bg-brand-50 rounded-[2rem] transition-all border border-brand-100 bg-white shadow-sm"><X className="w-8 h-8 text-brand-900" /></button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-12">
                                {activeTab === 'chatbot' ? (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-1">
                                                <MessageSquare className="w-4 h-4 text-accent-500" />
                                                <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Keywords de Activación</label>
                                            </div>
                                            <input type="text" placeholder="separadas por coma (ej: envios, domicilio)" value={formData.keywords} onChange={e => setFormData({ ...formData, keywords: e.target.value })} className="w-full border-brand-100 rounded-3xl p-6 text-sm font-bold focus:ring-8 focus:ring-accent-500/10 focus:border-accent-500 bg-brand-50/30" required />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-1">
                                                <ChefHat className="w-4 h-4 text-accent-500" />
                                                <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Respuesta del Bot</label>
                                            </div>
                                            <textarea placeholder="¿Cómo responderá el bot?" value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="w-full border-brand-100 rounded-[3rem] p-8 text-sm h-52 focus:ring-8 focus:ring-accent-500/10 focus:border-accent-500 resize-none bg-brand-50/30 font-medium leading-relaxed" required />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                                            {/* Foto Grande */}
                                            <div className="lg:col-span-2 space-y-4">
                                                <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest pl-2">Retrato del Producto</label>
                                                <div className="relative aspect-square group border-4 border-dashed border-brand-100 rounded-[3.5rem] overflow-hidden bg-brand-50/20 flex flex-col items-center justify-center transition-all hover:border-accent-200">
                                                    {formData.image_url ? (
                                                        <>
                                                            <img src={formData.image_url} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-brand-900/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                                                                <button type="button" onClick={() => setFormData({ ...formData, image_url: '' })} className="bg-red-500 text-white p-5 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform"><Trash2 className="w-8 h-8" /></button>
                                                                <p className="text-white text-[10px] font-black uppercase tracking-widest mt-4">Cambiar Imagen</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center p-8">
                                                            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-brand-50 flex items-center justify-center mx-auto mb-6">
                                                                <Plus className="w-10 h-10 text-accent-500" />
                                                            </div>
                                                            <input type="file" onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    setUploading(true);
                                                                    const name = `${Date.now()}_${file.name}`;
                                                                    await supabase.storage.from('products').upload(name, file);
                                                                    const { data } = supabase.storage.from('products').getPublicUrl(name);
                                                                    setFormData({ ...formData, image_url: data.publicUrl });
                                                                    setUploading(false);
                                                                }
                                                            }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                            <p className="text-xs text-brand-900 font-black uppercase tracking-widest">Subir Fotografía</p>
                                                            <p className="text-[10px] text-brand-300 mt-2">Formatos: JPG, PNG, WEBP (Máx 2MB)</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {uploading && (
                                                    <div className="flex items-center justify-center gap-3 py-2">
                                                        <div className="w-4 h-4 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                                                        <span className="text-[10px] text-accent-600 font-black uppercase tracking-[0.2em]">Cocinando píxeles...</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Detalles */}
                                            <div className="lg:col-span-3 space-y-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest pl-1">Nombre de la Creación</label>
                                                    <input type="text" placeholder="Ej: Corazón de Frutos Rojos" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-brand-100 rounded-2xl p-6 text-xl font-bold focus:ring-8 focus:ring-accent-500/10 focus:border-accent-500 bg-brand-50/30" required />
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest pl-1">Inversión (Precio)</label>
                                                        <div className="relative">
                                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-400 font-black text-xl">$</span>
                                                            <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full border-brand-100 rounded-3xl p-6 pl-12 text-2xl focus:ring-8 focus:ring-accent-500/10 focus:border-accent-500 font-black bg-brand-50/30" required />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest pl-1">Stock Disponible</label>
                                                        <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full border-brand-100 rounded-3xl p-6 text-2xl focus:ring-8 focus:ring-accent-500/10 focus:border-accent-500 bg-brand-50/30 font-black" required />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest pl-1">Seleccionar Sección</label>
                                                    <select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className="w-full border-brand-100 rounded-2xl p-6 text-base focus:ring-8 focus:ring-accent-500/10 focus:border-accent-500 bg-brand-50/30 font-black text-brand-700 appearance-none">
                                                        <option value="">Exclusivos (Sin Sección)</option>
                                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 pl-1">
                                                <Heart className="w-4 h-4 text-accent-500" />
                                                <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Nota de Cata / Descripción</label>
                                            </div>
                                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe el sabor, la textura y la magia de esta pieza..." className="w-full border-brand-100 rounded-[3rem] p-8 text-base h-40 focus:ring-8 focus:ring-accent-500/10 focus:border-accent-500 bg-brand-50/30 font-medium leading-relaxed" />
                                        </div>
                                    </div>
                                )}
                                <div className="pt-8">
                                    <button type="submit" disabled={uploading} className="w-full bg-brand-900 text-white p-8 rounded-[3rem] font-black uppercase tracking-[0.4em] text-sm hover:bg-brand-800 shadow-[0_25px_60px_rgba(45,34,31,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4">
                                        {uploading ? (
                                            <>
                                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Guardando Magia...</span>
                                            </>
                                        ) : (
                                            <>{editingItem ? 'Actualizar Creación' : 'Lanzar Delicia al Mundo'}</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Administrador de Categorías (Spacious & Premium) */}
            {showCategoryManager && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-brand-950/80 backdrop-blur-md overflow-hidden">
                    <div className="bg-white rounded-[3.5rem] max-w-lg w-full shadow-2xl relative animate-scale-up border border-white/20 flex flex-col max-h-[85vh] overflow-hidden">
                        {/* Header Fijo */}
                        <div className="bg-brand-900 p-10 text-white relative text-center flex-shrink-0">
                            <button onClick={() => setShowCategoryManager(false)} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                            <h3 className="text-4xl font-serif font-bold italic tracking-tight">Categorías</h3>
                        </div>

                        {/* Contenido Desplazable */}
                        <div className="p-10 space-y-10 overflow-y-auto no-scrollbar flex-1">
                            {/* Lista de Categorías */}
                            <div className="space-y-4">
                                {categories.length === 0 ? (
                                    <div className="text-center py-12 bg-brand-50/50 rounded-3xl border border-brand-100 border-dashed">
                                        <p className="text-brand-300 font-bold text-sm uppercase tracking-widest">Sin secciones definidas</p>
                                    </div>
                                ) : (
                                    categories.map(cat => (
                                        <div key={cat.id} className="flex justify-between items-center p-6 bg-brand-50/30 rounded-3xl group hover:bg-white hover:shadow-xl hover:shadow-brand-900/5 transition-all border border-brand-100/50 transform hover:-translate-y-1">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_10px_rgba(212,175,55,0.4)]"></div>
                                                <span className="font-bold text-brand-900 text-lg tracking-tight">{cat.name}</span>
                                            </div>
                                            <button onClick={() => handleDeleteCategory(cat.id)} className="p-3 text-brand-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 transform scale-90"><Trash2 className="w-6 h-6" /></button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Agregar Nueva */}
                            <div className="pt-10 border-t border-brand-50">
                                <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest block mb-4 pl-1">Añadir Nueva Sección</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Ej: Bombones Macizos..."
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        className="flex-1 border-brand-100 rounded-3xl p-6 text-base font-bold focus:ring-8 focus:ring-accent-500/10 focus:border-accent-500 bg-brand-50/30 shadow-inner"
                                    />
                                    <button onClick={handleCreateCategory} className="bg-accent-500 text-white p-6 rounded-3xl hover:bg-accent-400 shadow-xl shadow-accent-200/40 transition-all active:scale-95">
                                        <Plus className="w-8 h-8" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Fijo */}
                        <div className="p-10 bg-white border-t border-brand-50 flex-shrink-0">
                            <button onClick={() => setShowCategoryManager(false)} className="w-full bg-brand-900 text-white p-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-800 transition-all transform active:scale-95 shadow-2xl shadow-brand-900/20">Terminar Gestión</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
