"use client";
import { useState } from "react";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSent(false);
        // TODO: Integrate with Supabase Auth
        try {
            // Example: await supabase.auth.signInWithOtp({ email });
            setSent(true);
        } catch (err: any) {
            setError("Failed to send magic link. Try again.");
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-white">
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 rounded shadow bg-gray-50">
                <h1 className="text-2xl font-semibold mb-4 text-center">Sign in to Today</h1>
                <label className="block mb-2 text-sm font-medium">Email address</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring"
                    placeholder="you@example.com"
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-black text-white rounded font-medium hover:bg-gray-800 transition"
                    disabled={sent}
                >
                    {sent ? "Check your email" : "Send magic link"}
                </button>
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                {sent && <p className="text-green-600 mt-2 text-sm">Magic link sent! Check your inbox.</p>}
            </form>
        </main>
    );
}
