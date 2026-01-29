import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Edit, X, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users' | 'chatbot'>('products');
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [knowledge, setKnowledge] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null); // renamed from editingProduct
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image_url: '',
        secondary_images: [] as string[],
        // Chatbot fields
        keywords: '',
        answer: ''
    });

    const CAJAS_PERSONALIZADAS_ID = '9f4b7524-1d17-4755-8563-094fbd870840';

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'products') {
                const { data: prodData } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
                const { data: catData } = await supabase.from('categories').select('*');
                if (prodData) setProducts(prodData);
                if (catData) setCategories(catData);
            } else if (activeTab === 'orders') {
                const { data: ordData } = await supabase
                    .from('orders')
                    .select('*, profiles(email), order_items(*)')
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
        if (activeTab === 'products') {
            setFormData(prev => ({ ...prev, category_id: categories[0]?.id || '' }));
        }
        setShowModal(true);
    };

    return (
        <Layout>
            <div className="bg-brand-50 min-h-screen py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-brand-900">Panel de Administración</h1>
                        <div className="flex space-x-2 bg-white/70 backdrop-blur rounded p-1 shadow-sm overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`px-4 py-2 rounded-md font-medium text-sm transition whitespace-nowrap ${activeTab === 'products' ? 'bg-brand-900 text-white shadow' : 'text-brand-600 hover:bg-brand-100'}`}
                            >
                                Productos
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`px-4 py-2 rounded-md font-medium text-sm transition whitespace-nowrap ${activeTab === 'orders' ? 'bg-brand-900 text-white shadow' : 'text-brand-600 hover:bg-brand-100'}`}
                            >
                                Ventas
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-4 py-2 rounded-md font-medium text-sm transition whitespace-nowrap ${activeTab === 'users' ? 'bg-brand-900 text-white shadow' : 'text-brand-600 hover:bg-brand-100'}`}
                            >
                                Usuarios
                            </button>
                            <button
                                onClick={() => setActiveTab('chatbot')}
                                className={`px-4 py-2 rounded-md font-medium text-sm transition whitespace-nowrap ${activeTab === 'chatbot' ? 'bg-brand-900 text-white shadow' : 'text-brand-600 hover:bg-brand-100'}`}
                            >
                                IA Chatbot
                            </button>
                        </div>
                    </div>

                    {activeTab === 'products' ? (
                        <div>
                            <div className="flex justify-end mb-4">
                                <button onClick={openNew} className="flex items-center bg-accent-500 text-white px-4 py-2 rounded-md hover:bg-accent-400 transition font-bold shadow-md">
                                    <Plus className="w-5 h-5 mr-2" /> Nuevo Producto
                                </button>
                            </div>

                            <div className="bg-white rounded-lg shadow overflow-hidden border border-brand-100 animate-fade-in">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-brand-200">
                                        <thead className="bg-brand-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Producto</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Categoría</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Precio</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-500 uppercase tracking-wider">Stock</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-brand-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-brand-100">
                                            {products.map(product => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded-full object-cover" src={product.image_url || "https://via.placeholder.com/40"} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-brand-900">{product.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">
                                                        {product.categories?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-900 font-bold">
                                                        ${product.price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">
                                                        {product.stock}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => openEdit(product)} className="text-brand-600 hover:text-brand-900 mr-4"><Edit className="w-5 h-5" /></button>
                                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'orders' ? (
                        <div className="bg-white rounded-lg shadow overflow-hidden border border-brand-100 animate-fade-in">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-brand-200">
                                    <thead className="bg-brand-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">ID Orden</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Cliente</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-brand-100">
                                        {orders.map(order => (
                                            <tr key={order.id} className="hover:bg-brand-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-900 font-mono">
                                                    #{order.id.slice(0, 8)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">
                                                    {order.profiles?.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-900 font-bold">
                                                    ${order.total}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${order.status === 'paid' || order.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status === 'paid' ? 'Pagado' : order.status === 'approved' ? 'Pagado' : 'Pendiente'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'users' ? (
                        <div className="bg-white rounded-lg shadow overflow-hidden border border-brand-100 animate-fade-in">
                            <div className="px-6 py-4 border-b border-brand-100 bg-brand-50/50">
                                <h3 className="text-lg font-serif font-bold text-brand-900">Usuarios Registrados</h3>
                                <p className="text-sm text-brand-500">Lista completa de clientes y administradores</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-brand-200">
                                    <thead className="bg-brand-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Rol</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Fecha Registro</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">ID</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-brand-100">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-brand-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                                                            {u.username?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            {u.role === 'admin' ? (
                                                                <div className="text-sm font-medium text-brand-900">{u.email}</div>
                                                            ) : (
                                                                <div className="text-sm font-medium text-brand-400 italic">Privado (Cliente)</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-700 font-bold">
                                                    {u.username || <span className="text-brand-300 font-normal italic">Sin nombre</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-brand-400 font-mono">
                                                    {u.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {u.role !== 'admin' ? (
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm(`¿Estás seguro de eliminar permanentemente al usuario ${u.username || u.email}? Se borrará su cuenta y todos sus datos de forma inmediata.`)) {
                                                                    try {
                                                                        // Llamamos a la función segura en Postgres que borra de auth.users
                                                                        const { error } = await supabase.rpc('delete_user_by_admin', {
                                                                            target_user_id: u.id
                                                                        });

                                                                        if (error) throw error;
                                                                        fetchData();
                                                                    } catch (error: any) {
                                                                        alert('Error al eliminar: ' + error.message);
                                                                    }
                                                                }
                                                            }}
                                                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                                                            title="Eliminar usuario permanentemente"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-brand-200 cursor-not-allowed p-2" title="No puedes eliminar administradores">
                                                            <Trash2 className="w-5 h-5 opacity-30" />
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-end mb-4">
                                <button onClick={openNew} className="flex items-center bg-brand-800 text-white px-4 py-2 rounded-md hover:bg-brand-700 transition font-bold shadow-md">
                                    <Plus className="w-5 h-5 mr-2" /> Nuevo Conocimiento
                                </button>
                            </div>
                            <div className="bg-white rounded-lg shadow overflow-hidden border border-brand-100 animate-fade-in">
                                <div className="px-6 py-4 border-b border-brand-100 bg-brand-50/50">
                                    <h3 className="text-lg font-serif font-bold text-brand-900 items-center flex gap-2">
                                        <MessageSquare className="w-5 h-5 text-brand-600" />
                                        Entrenamiento del Chatbot
                                    </h3>
                                    <p className="text-sm text-brand-500">Configura respuestas automáticas para palabras clave específicas</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-brand-200">
                                        <thead className="bg-brand-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Palabras Clave</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Respuesta</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-brand-500 uppercase tracking-wider font-sans">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-brand-100">
                                            {knowledge.map(item => (
                                                <tr key={item.id} className="hover:bg-brand-50 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {item.keywords.map((k: string, i: number) => (
                                                                <span key={i} className="px-2 py-0.5 bg-brand-100 text-brand-700 rounded text-xs font-medium border border-brand-200">
                                                                    {k}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-brand-700 max-w-md">
                                                        <div className="truncate">{item.answer}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button onClick={() => openEdit(item)} className="text-brand-600 hover:text-brand-900 mr-4"><Edit className="w-5 h-5" /></button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('¿Eliminar respuesta?')) {
                                                                    await supabase.from('chatbot_knowledge').delete().eq('id', item.id);
                                                                    fetchData();
                                                                }
                                                            }}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {knowledge.length === 0 && (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-10 text-center text-brand-400 italic">
                                                        No hay conocimientos cargados. ¡Agregá el primero!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Único Mejorado */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-brand-900">
                                        {activeTab === 'chatbot'
                                            ? (editingItem ? 'Editar Conocimiento Bot' : 'Nuevo Conocimiento Bot')
                                            : (editingItem ? 'Editar Producto' : 'Nuevo Producto')
                                        }
                                    </h3>
                                    <button onClick={() => setShowModal(false)} className="text-brand-400 hover:text-brand-600"><X /></button>
                                </div>

                                <form onSubmit={handleSave} className="space-y-4">
                                    {activeTab === 'chatbot' ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-brand-700">Palabras Clave (separadas por coma)</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="ej: envíos, domicilio, llega"
                                                    value={formData.keywords}
                                                    onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                                    className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500"
                                                />
                                                <p className="text-[10px] text-brand-400 mt-1">El bot responderá si el mensaje contiene alguna de estas palabras.</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-brand-700">Respuesta Literal</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    placeholder="Escribí la respuesta exacta que debe dar el bot..."
                                                    value={formData.answer}
                                                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                                    className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 resize-none"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-brand-700">Nombre</label>
                                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-brand-700">Descripción</label>
                                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-brand-700">Precio</label>
                                                    <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-brand-700">Stock</label>
                                                    <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-brand-700">Categoría</label>
                                                <select required value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500">
                                                    <option value="">Seleccionar</option>
                                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                                </select>
                                            </div>

                                            {formData.category_id === CAJAS_PERSONALIZADAS_ID && (
                                                <div className="bg-brand-50 p-3 rounded-lg border border-brand-200 space-y-3">
                                                    <p className="text-xs font-bold text-brand-800 uppercase tracking-wider">Configuración Especial: Caja Personalizada</p>
                                                    <div>
                                                        <label className="block text-sm font-medium text-brand-700">Fotos Secundarias (Galería)</label>
                                                        <div className="grid grid-cols-4 gap-2 mt-2">
                                                            {formData.secondary_images.map((img, idx) => (
                                                                <div key={idx} className="relative group aspect-square">
                                                                    <img src={img} className="w-full h-full object-cover rounded border border-brand-200" alt="" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setFormData({ ...formData, secondary_images: formData.secondary_images.filter((_, i) => i !== idx) })}
                                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                const files = Array.from(e.target.files || []);
                                                                if (files.length === 0) return;
                                                                setUploading(true);
                                                                try {
                                                                    const newUrls = [...formData.secondary_images];
                                                                    for (const file of files) {
                                                                        const fileExt = file.name.split('.').pop();
                                                                        const fileName = `secondary_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                                                                        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
                                                                        if (uploadError) throw uploadError;
                                                                        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
                                                                        newUrls.push(data.publicUrl);
                                                                    }
                                                                    setFormData({ ...formData, secondary_images: newUrls });
                                                                } catch (error: any) {
                                                                    alert('Error: ' + error.message);
                                                                } finally {
                                                                    setUploading(false);
                                                                }
                                                            }}
                                                            className="mt-2 block w-full text-[10px] text-brand-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-brand-100 file:text-brand-700 hover:file:bg-brand-200"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-brand-700">Imagen Principal</label>
                                                <div className="mt-1 flex items-center space-x-4">
                                                    {formData.image_url && (
                                                        <img src={formData.image_url} alt="Vista previa" className="h-20 w-20 object-cover rounded-md border border-brand-200" />
                                                    )}
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                if (file.size > 2 * 1024 * 1024) {
                                                                    alert('La imagen no debe pesar más de 2MB');
                                                                    return;
                                                                }
                                                                setUploading(true);
                                                                try {
                                                                    const fileExt = file.name.split('.').pop();
                                                                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                                                                    const filePath = `${fileName}`;
                                                                    const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
                                                                    if (uploadError) throw uploadError;
                                                                    const { data } = supabase.storage.from('products').getPublicUrl(filePath);
                                                                    setFormData({ ...formData, image_url: data.publicUrl });
                                                                } catch (error: any) {
                                                                    alert('Error al subir la imagen: ' + error.message);
                                                                } finally {
                                                                    setUploading(false);
                                                                }
                                                            }}
                                                            className="block w-full text-sm text-brand-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                                                            disabled={uploading}
                                                        />
                                                        {uploading && <p className="text-xs text-brand-500 mt-1">Subiendo...</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="w-full bg-brand-800 text-white py-2 px-4 rounded-md hover:bg-brand-700 font-bold transition disabled:opacity-50"
                                        >
                                            {editingItem ? 'Actualizar' : 'Guardar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
