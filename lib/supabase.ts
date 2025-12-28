// Fetch posts from the 'posts' table, ordered by created_at descending
export async function fetchPosts() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
}
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

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
        from: () => ({
            insert: async (values: any) => {
                // Simulate network delay
                await new Promise(res => setTimeout(res, 300));
                return { data: values, error: null };
            },
        }),
        // ...other SupabaseClient properties/methods can be mocked as needed
    } as unknown as SupabaseClient;
}
// Insert a sentence into the 'posts' table
export async function postSentence(sentence: string, user_id?: string) {
    const supabase = getSupabaseClient();
    // Optionally, you can pass user_id if you want to associate posts with users
    const payload: any = { sentence };
    if (user_id) payload.user_id = user_id;
    const { data, error } = await supabase.from('posts').insert([payload]);
    return { data, error };
}

export function getSupabaseClient(): SupabaseClient {
    if (process.env.NEXT_PUBLIC_SUPABASE_MOCK === '1') {
        return getMockSupabaseClient();
    }
    if (!supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
    }
    return supabase;
}
