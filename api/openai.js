const OpenAI = require('openai');

module.exports = async function handler(req, res) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        return;
    }

    // Only process POST requests
    if (req.method !== 'POST') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(405).json({ error: `${req.method} method not allowed` });
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const messages = req.body; // Vercel auto-parses JSON body
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4.1-2025-04-14',
            messages: messages,
            temperature: 1.1,
            presence_penalty: 0,
            frequency_penalty: 0
        });
        const response = chatCompletion.choices[0].message;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).json(response);
    } catch (error) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(500).json({ error: error.message });
    }
};