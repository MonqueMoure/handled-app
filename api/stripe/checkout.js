import Stripe from 'stripe';

// Ensure STRIPE_SECRET_KEY is set in ENV
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { priceId, userId } = req.body;

    if (!priceId || !userId) {
        return res.status(400).json({ error: 'Missing priceId or userId' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            // 🔥 CRITICAL: We attach the Clerk User ID here so the webhook knows who paid
            client_reference_id: userId,
            success_url: `${req.headers.origin}/dashboard`,
            cancel_url: `${req.headers.origin}/`,
            metadata: {
                userId: userId
            }
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return res.status(500).json({ error: error.message });
    }
}