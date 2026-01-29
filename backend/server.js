/**
 * Backend para integración con Mercado Pago Checkout Pro
 * S.O.S Bombones - Argentina
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Configuración
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware CORS flexible
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// Configurar Supabase para el Backend
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY // Usamos la anon key ya que tenemos política de lectura pública
);

/**
 * POST /create-preference
 * Crea una preferencia de pago en Mercado Pago
 * 
 * Body esperado:
 * {
 *   items: [{ id, name, quantity, price, image_url }],
 *   payer: { email }
 * }
 */
app.post('/create-preference', async (req, res) => {
    try {
        const { items, payer } = req.body;

        console.log('Recibido:', JSON.stringify({ items, payer }, null, 2));

        // Validar que hay items
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No hay productos en el carrito' });
        }

        // Formatear items para Mercado Pago
        const mpItems = items.map((item, index) => ({
            id: String(item.id || index + 1),
            title: String(item.name || 'Producto'),
            quantity: parseInt(item.quantity) || 1,
            unit_price: parseFloat(item.price) || 0,
            currency_id: 'ARS'
        }));

        console.log('Items formateados para MP:', JSON.stringify(mpItems, null, 2));

        // Crear la preferencia
        const preference = new Preference(client);

        // Crear la preferencia con estructura explícita para evitar errores
        const body = {
            items: mpItems,
            payer: payer && payer.email ? { email: payer.email } : undefined,
            back_urls: {
                success: `${FRONTEND_URL}/pago-exitoso`,
                failure: `${FRONTEND_URL}/pago-fallido`,
                pending: `${FRONTEND_URL}/pago-pendiente`
            },
            // auto_return: "approved", // Deshabilitado temporalmente por error de validación
            statement_descriptor: "SOS BOMBONES",
            external_reference: `order_${Date.now()}`
        };

        console.log('Enviando body a MP:', JSON.stringify(body, null, 2));

        const result = await preference.create({ body });

        console.log('Preferencia creada:', result.id);

        res.json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point
        });

    } catch (error) {
        console.error('------- ERROR MERCADO PAGO -------');
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
        if (error.cause) console.error('Causa:', JSON.stringify(error.cause, null, 2));
        console.error('----------------------------------');

        res.status(500).json({
            error: 'Error al procesar el pago',
            details: error.message,
            full_error: error
        });
    }
});

process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR (Uncaught):', err);
});

/**
 * POST /webhook
 * Recibe notificaciones de Mercado Pago (IPN)
 * Aquí puedes actualizar el estado de la orden en tu base de datos
 */
app.post('/webhook', async (req, res) => {
    const { type, data } = req.body;

    console.log('Webhook recibido:', type, data);

    // Aquí puedes procesar las notificaciones
    // Por ejemplo: si type === 'payment', verificar el estado del pago
    // y actualizar tu orden en Supabase

    res.sendStatus(200);
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function findLocalAnswer(message) {
    const msg = message.toLowerCase();
    try {
        // Traemos todo el conocimiento de la tabla
        const { data: knowledge } = await supabase
            .from('chatbot_knowledge')
            .select('*');

        if (!knowledge) return null;

        for (const item of knowledge) {
            // item.keywords es un array de strings almacenado en Supabase
            if (item.keywords.some(k => msg.includes(k.toLowerCase()))) {
                return item.answer;
            }
        }
    } catch (e) {
        console.error('Error buscando respuesta local:', e);
    }
    return null;
}

/**
 * POST /chat
 * Endpoint para interactuar con Gemini AI
 */
app.post('/chat', async (req, res) => {
    const { message } = req.body;
    console.log('🤖 Chat Request:', message);

    // 1. Intentar respuesta local (Supabase Entrenamiento)
    const localAnswer = await findLocalAnswer(message);
    if (localAnswer) {
        console.log('✅ Local Answer Found');
        return res.json({ text: localAnswer });
    }

    // 2. Si no hay respuesta local, intentar con IA
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.json({
                text: "¡Hola! Estoy en modo mantenimiento. Por favor contactanos por WhatsApp al 3876856022. 🍬",
                error: "missing_api_key"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prompt simple para evitar errores de historial
        const prompt = `Responde como BombónBot, asistente de 'SOS Bombones' en Salta (Ibazeta 580). 
        Tono: Argentino cálido y corto. 
        Usuario: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });

    } catch (error) {
        console.error('Error detallado en Gemini:', error);
        res.status(500).json({
            error: 'ai_error',
            text: "¡Ups! No pude procesar tu mensaje. ¿Me podrías preguntar de otra forma o escribirnos al WhatsApp? 🍫"
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
🚀 Backend de Mercado Pago iniciado
📍 Puerto: ${PORT}
🌐 Frontend URL: ${FRONTEND_URL}
💳 Endpoint: POST /create-preference
    `);
});
