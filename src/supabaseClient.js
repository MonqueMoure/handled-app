import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

export const getSupabaseClient = async (getToken) => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase URL or Anon Key is missing. Check your .env file and restart the server.");
    }

    // ✅ FIX: Do NOT pass { template: 'supabase' } here anymore.
    // The Native Integration expects the standard Clerk session token.
    const token = await getToken();

    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
};