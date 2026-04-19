// src/hooks/useSync.js
import { createClient } from '@supabase/supabase-js';
import { useAuth } from "@clerk/react";
import { useMemo } from 'react';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

export const useSync = () => {
    const { getToken, userId } = useAuth();

    // Create the client once
    const supabase = useMemo(() => createClient(supabaseUrl, supabaseKey), []);

    const syncFavorite = async (id, isAdding) => {
        if (!userId) return;
        const token = await getToken();

        // ✅ FORCE INTEGER: Prevents 400 type-mismatch errors
        const numericId = parseInt(id, 10);

        supabase.rest.headers = {
            ...supabase.rest.headers,
            Authorization: `Bearer ${token}`,
        };

        if (isAdding) {
            await supabase
                .from('favorites')
                .upsert(
                    { user_id: userId, objection_id: numericId },
                    { onConflict: 'user_id,objection_id' }
                );
        } else {
            await supabase
                .from('favorites')
                .delete()
                .match({ user_id: userId, objection_id: numericId });
        }
    };

    const syncNote = async (id, text, isDeleting = false) => {
        const token = await getToken();
        const numericId = parseInt(id, 10); // ✅ FORCE INTEGER

        supabase.rest.headers = {
            ...supabase.rest.headers,
            Authorization: `Bearer ${token}`
        };

        if (isDeleting) {
            await supabase.from('notes').delete().match({ user_id: userId, objection_id: numericId });
        } else {
            await supabase.from('notes').upsert(
                { user_id: userId, objection_id: numericId, content: text },
                { onConflict: 'user_id,objection_id' }
            );
        }
    };

    return { syncFavorite, syncNote };
};