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
// Insert a sentence into the 'posts' table
export async function postSentence(sentence: string, user_id?: string) {
    const supabase = getSupabaseClient();
    const payload: any = { sentence };
    if (user_id) payload.user_id = user_id;
    const { data, error } = await supabase.from('posts').insert([payload]);
    return { data, error };
}

export function getSupabaseClient(): SupabaseClient {
    if (!supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
    }
    return supabase;
}
