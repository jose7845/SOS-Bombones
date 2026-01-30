const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const normalize = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

async function testKnowledge() {
    const { data: knowledge, error } = await supabase
        .from('chatbot_knowledge')
        .select('*');

    if (error) {
        console.error('Error fetching knowledge:', error);
        return;
    }

    console.log('--- Probando Lógica de Normalización ---');

    // Casos que antes fallaban
    const testMessages = ['envios', 'ubicacion', 'hacer pedido', 'PAGOS'];

    for (const msg of testMessages) {
        const msgNormalized = normalize(msg);
        let found = false;
        for (const item of knowledge) {
            const match = item.keywords.some(k => {
                const kNormalized = normalize(k);
                return msgNormalized.includes(kNormalized);
            });

            if (match) {
                console.log(`✅ MATCH [${msg}]: Coincide con [${item.keywords[0]}...]`);
                found = true;
                break;
            }
        }
        if (!found) console.log(`❌ NO MATCH [${msg}]`);
    }
}

testKnowledge();
