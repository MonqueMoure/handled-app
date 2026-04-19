// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider, Show, SignIn } from '@clerk/react';
// ✅ This is the CRA way to access variables
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key. Check your .env file for REACT_APP_ prefix.");
}
// This wrapper handles the "Gate" without touching App.jsx UI
const AuthGate = () => {
    return (
        <>
            {/* Replaces <SignedOut> */}
            <Show when="signed-out">
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10vh' }}>
                    <SignIn />
                </div>
            </Show>

            {/* Replaces <SignedIn> */}
            <Show when="signed-in">
                <App />
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
