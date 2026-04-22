import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🚨 Keep this! It prevents Vercel production from parsing the body.
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let event;
    const sig = req.headers['stripe-signature'];

    try {
        // 1. Use Vercel's official 'micro' buffer to guarantee the raw stream
        const rawBody = await buffer(req);

        // 2. Verify the signature
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`💥 Signature Verification Failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 🎯 If the payment was successful
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (userId) {
            try {
                // Tell Clerk to unlock the app for this user
                await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        public_metadata: { stripeStatus: 'active' }
                    })
                });
                console.log(`✅ User ${userId} upgraded to Active!`);
            } catch (error) {
                console.error('❌ Error updating Clerk:', error);
            }
        } else {
            console.warn('⚠️ No userId found in Stripe metadata.');
        }
    }

    res.json({ received: true });
}
