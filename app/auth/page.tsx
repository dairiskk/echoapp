"use client";

import { useState } from "react";
import { getSupabaseClient } from "../../lib/supabase";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSent(false);
        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            setSent(true);
        } catch (err: any) {
            setError("Failed to send magic link. Try again.");
        }
    }

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', color: 'var(--foreground)' }}>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: 'var(--background)', color: 'var(--foreground)' }}>
                <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>Sign in to Today</h1>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Email address</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #444', marginBottom: 16, outline: 'none', background: 'var(--background)', color: 'var(--foreground)' }}
                    placeholder="you@example.com"
                />
                <button
                    type="submit"
                    style={{ width: '100%', padding: '10px 0', background: '#222', color: '#ededed', borderRadius: 6, fontWeight: 500, border: 'none', cursor: sent ? 'not-allowed' : 'pointer', opacity: sent ? 0.7 : 1, transition: 'background 0.2s' }}
                    disabled={sent}
                >
                    {sent ? "Check your email" : "Send magic link"}
                </button>
                {error && <p style={{ color: '#f87171', marginTop: 8, fontSize: 14 }}>{error}</p>}
                {sent && <p style={{ color: '#4ade80', marginTop: 8, fontSize: 14 }}>Magic link sent! Check your inbox.</p>}
            </form>
        </main>
    );
}
