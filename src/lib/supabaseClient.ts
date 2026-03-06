
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL o Anon Key no encontradas en las variables de entorno.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'sb-lldmrodeo-auth-token',
        // Bypass navigator.locks to prevent LockManager timeout errors
        // This is needed when multiple tabs may be open or on Smart TV browsers
        lock: async (name: string, acquireTimeout: number, callback: () => Promise<any>) => {
            return await callback();
        },
    }
});
