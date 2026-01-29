const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Testing with API Key:', apiKey?.substring(0, 5) + '...' + apiKey?.substring(apiKey?.length - 4));
    if (!apiKey) {
        console.error('No API Key found');
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    try {
        const result = await model.generateContent("Hola");
        const response = await result.response;
        console.log('SUCCESS:', response.text());
    } catch (e) {
        console.error('FULL ERROR:', e);
    }
}
test();
