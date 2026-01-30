/**
 * Backend para integración con Mercado Pago y Bot de IA
 * Adaptado para Vercel Serverless Functions (ES Modules)
 */

import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configurar Mercado Pago
const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

// Configurar Supabase
const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

/**
 * Mercado Pago: Crear Preferencia
 */
app.post('/api/create-preference', async (req, res) => {
    try {
        const { items, payer } = req.body;
        const FRONTEND_URL = process.env.FRONTEND_URL || 'https://sos-bombones.vercel.app';

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No hay productos' });
        }

        const mpItems = items.map((item, index) => ({
            id: String(item.id || index + 1),
            title: String(item.name),
            quantity: parseInt(item.quantity),
            unit_price: parseFloat(item.price),
            currency_id: 'ARS'
        }));

        const preference = new Preference(mpClient);
        const body = {
            items: mpItems,
            payer: payer?.email ? { email: payer.email } : undefined,
            back_urls: {
                success: `${FRONTEND_URL}/pago-exitoso`,
                failure: `${FRONTEND_URL}/pago-fallido`,
                pending: `${FRONTEND_URL}/pago-pendiente`
            },
            statement_descriptor: "SOS BOMBONES",
            external_reference: `order_${Date.now()}`
        };

        const result = await preference.create({ body });
        res.json({ id: result.id, init_point: result.init_point });

    } catch (error) {
        console.error('Error MP:', error);
        res.status(500).json({ error: 'Error al procesar pago', details: error.message });
    }
});

/**
 * Chatbot: Lógica de respuestas
 */
async function findLocalAnswer(message) {
    const normalize = (text) =>
        text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const msgNormalized = normalize(message);

    try {
        const { data: knowledge } = await supabase.from('chatbot_knowledge').select('*');
        if (!knowledge) return null;

        for (const item of knowledge) {
            const match = item.keywords.some(k => normalize(k) && msgNormalized.includes(normalize(k)));
            if (match) return item.answer;
        }
    } catch (e) {
        console.error('Error local answer:', e);
    }
    return null;
}

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        // 1. Respuesta Local
        const localAnswer = await findLocalAnswer(message);
        if (localAnswer) return res.json({ text: localAnswer });

        // 2. IA Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.json({ text: "Modo mantenimiento. Contactanos por WhatsApp. 🍬" });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let context = "Responde como BombónBot de 'SOS Bombones' en Salta (Ibazeta 580). Tono: Argentino cálido y corto.\n\n";
        if (history && Array.isArray(history)) {
            history.forEach(msg => {
                const role = msg.role === 'user' ? 'Usuario' : 'Bot';
                context += `${role}: ${msg.message}\n`;
            });
        }
        context += `Usuario: ${message}\nBot:`;

        const result = await model.generateContent(context);
        const response = await result.response;
        res.json({ text: response.text() });

    } catch (error) {
        console.error('Error Chatbot:', error);
        res.status(500).json({ text: "¡Ups! Escribinos al WhatsApp mientras arreglo esto. 🍫" });
    }
});

// Exportar para Vercel
export default app;
