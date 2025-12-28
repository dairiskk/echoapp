import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

// Mock client for development/testing
function getMockSupabaseClient(): SupabaseClient {
    return {
        auth: {
            signInWithOtp: async ({ email }: { email: string }) => {
                // Simulate network delay
                await new Promise(res => setTimeout(res, 500));
                if (!email.includes('@')) {
                    return { error: { message: 'Invalid email' } };
                }
                return { error: null };
            },
            // ...other auth methods can be mocked as needed
        },
        // ...other SupabaseClient properties/methods can be mocked as needed
    } as unknown as SupabaseClient;
}

export function getSupabaseClient(): SupabaseClient {
    if (process.env.NEXT_PUBLIC_SUPABASE_MOCK === '1') {
        return getMockSupabaseClient();
    }
    if (!supabase) {
        const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
        const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabase;
}
