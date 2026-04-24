// api/coach.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Basic CORS & Method check
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { text } = req.body;

    // 2. Critical Check: Is the key actually here?
    if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5',
                max_tokens: 1000,
                system: `You are an expert life insurance sales coach. A rep just heard an objection on a call. Give them a battle-tested response RIGHT NOW. Respond ONLY with valid JSON, no markdown:
{"category":"one of Price/Delay/Spouse/Trust/Skepticism/Urgency/Health/Confusion/Comparison/Process/Self-Reliance/Product/Objection","psychology":"2-3 sentences on the real reason behind this objection","response":"3-5 sentences the rep says out loud — warm, confident, conversational, first person","followup":"2-3 sentences of tactical advice if prospect pushes back"}`,
                messages: [
                    { role: 'user', content: `The prospect just said: "${text}"` },
                ],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Coach API Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}