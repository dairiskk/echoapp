"use client";

import React, { useState } from "react";
import { getSupabaseClient } from "../../lib/supabase";

//console.log("ENV VARS (process.env):", process.env);

export default function AuthPage() {
    console.log('RENDER');
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstall, setShowInstall] = useState(false);

    // Listen for beforeinstallprompt event
    React.useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstall(true);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    // Handle install button click
    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            setDeferredPrompt(null);
            setShowInstall(false);
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSent(false);
        try {
            const supabase = getSupabaseClient();
            console.log("Supabase client:", supabase);
            console.log("Email submitted:", email);
            const payload = { email };
            console.log("Sending to Supabase:", payload);
            const response = await supabase.auth.signInWithOtp(payload);
            console.log("Supabase signInWithOtp response:", response);
            if (response.error) throw response.error;
            setSent(true);
        } catch (err: any) {
            console.error("Magic link error:", err);
            setError("Failed to send magic link. Try again.");
        }
    }

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', color: 'var(--foreground)', position: 'relative' }}>
            {showInstall && (
                <button
                    onClick={handleInstallClick}
                    style={{
                        position: "fixed",
                        top: 18,
                        right: 18,
                        zIndex: 1000,
                        padding: "12px 20px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 16,
                        boxShadow: "0 2px 8px 0 rgba(37,99,235,0.12)",
                        cursor: "pointer",
                    }}
                >
                    Install App
                </button>
            )}
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
