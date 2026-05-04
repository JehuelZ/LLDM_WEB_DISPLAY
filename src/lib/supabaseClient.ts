
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL o Anon Key no encontradas en las variables de entorno.');
}

// Fix: Prevent Navigator LockManager timeout errors that block all cloud saves
// This happens when multiple tabs compete for the auth token lock, or on Smart TV browsers
if (typeof globalThis !== 'undefined' && typeof globalThis.navigator !== 'undefined') {
    const nav = globalThis.navigator as any;
    if (nav.locks && nav.locks.request) {
        const originalRequest = nav.locks.request.bind(nav.locks);
        nav.locks.request = async (name: string, optionsOrCallback: any, maybeCallback?: any) => {
            const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback;
            const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};

            // Supabase auth lock bypass for problematic environments (Smart TVs / Multiple Tabs)
            if (name && name.includes('sb-') && name.includes('auth-token')) {
                if (typeof callback === 'function') {
                    console.log('[SUPABASE] Bypassing lock for:', name);
                    try {
                        return await callback({ name, mode: options.mode || 'exclusive' });
                    } catch (e) {
                        console.error('[SUPABASE] Lock bypass error:', e);
                        throw e;
                    }
                }
            }
            return originalRequest(name, optionsOrCallback, maybeCallback);
        };
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
});
