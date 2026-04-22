// index.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider, Show, SignIn, useUser } from '@clerk/react';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key. Check your .env file for REACT_APP_ prefix.");
}

const AuthGate = () => {
    // 1. Pull user data from Clerk to check subscription status
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);

    // ✅ Using environment variables instead of hardcoded strings
    const MONTHLY_PRICE_ID = process.env.REACT_APP_STRIPE_PRICE_ID_MONTHLY;
    const YEARLY_PRICE_ID = process.env.REACT_APP_STRIPE_PRICE_ID_YEARLY;

    const handleSubscribe = async (priceId) => {
        if (!priceId) {
            console.error("Missing Stripe Price ID. Check your .env file.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, userId: user.id }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.assign(data.url); // Send to Stripe
            }
        } catch (err) {
            console.error('Checkout failed', err);
            setLoading(false);
        }
    };

    // Show black screen while Clerk loads to prevent flickering
    if (!isLoaded) return <div style={{ background: '#0a0a0a', height: '100vh' }} />;

    // 2. The Gate Logic
    const isPaid = user?.publicMetadata?.stripeStatus === 'active';

    return (
        <>
            {/* 🚪 User is Logged Out -> Show Login Screen */}
            <Show when="signed-out">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a' }}>
                    <SignIn routing="hash" />
                </div>
            </Show>

            {/* 🟢 User is Logged In -> Check Paywall */}
            <Show when="signed-in">
                {isPaid ? (
                    <App />
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#0a0a0a',
                        color: '#f0ece3',
                        fontFamily: "'DM Sans', sans-serif"
                    }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '32px',
                            marginBottom: '8px',
                            letterSpacing: '0.05em'
                        }}>
                            Unlock HANDLED.
                        </h1>
                        <p style={{
                            color: '#a09890',
                            fontSize: '14px',
                            marginBottom: '40px',
                            letterSpacing: '0.02em'
                        }}>
                            Subscribe to access the AI Coach and Syncing.
                        </p>

                        <div style={{ display: 'flex', gap: '16px', flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
                            {/* Monthly Option */}
                            <button
                                onClick={() => handleSubscribe(MONTHLY_PRICE_ID)}
                                disabled={loading}
                                style={{
                                    padding: '16px 32px',
                                    background: '#111111',
                                    color: '#f0ece3',
                                    border: '1px solid #1e1e1e',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease',
                                    minWidth: '220px'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#4a4540'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = '#1e1e1e'}
                            >
                                $14.99 / Monthly
                            </button>

                            {/* Yearly Option */}
                            <button
                                onClick={() => handleSubscribe(YEARLY_PRICE_ID)}
                                disabled={loading}
                                style={{
                                    padding: '16px 32px',
                                    background: '#f0ece3',
                                    color: '#0a0a0a',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    transition: 'all 0.2s ease',
                                    minWidth: '220px',
                                    boxShadow: '0 4px 14px rgba(240, 236, 227, 0.15)'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                $99.00 / Yearly <span style={{ fontSize: '11px', opacity: 0.8, marginLeft: '4px' }}>(Save 45%)</span>
                            </button>
                        </div>

                        <div style={{ height: '24px', marginTop: '16px' }}>
                            {loading && <p style={{ color: '#a09890', fontSize: '13px' }}>Loading secure checkout...</p>}
                        </div>

                        <div style={{ marginTop: '32px' }}>
                            <button
                                onClick={() => window.Clerk.signOut()}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#4a4540',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#a09890'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#4a4540'}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                )}
            </Show>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <AuthGate />
        </ClerkProvider>
    </React.StrictMode>
);