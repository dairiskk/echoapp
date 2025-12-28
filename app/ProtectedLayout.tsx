"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabaseClient } from "../lib/supabase";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Allow /auth route without auth
        if (pathname === "/auth") {
            setLoading(false);
            setAuthenticated(true);
            return;
        }
        const supabase = getSupabaseClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.replace("/auth");
            } else {
                setAuthenticated(true);
            }
            setLoading(false);
        });
        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.replace("/auth");
            }
        });
        return () => {
            listener.subscription.unsubscribe();
        };
    }, [pathname, router]);

    async function handleSignOut() {
        const supabase = getSupabaseClient();
        await supabase.auth.signOut();
        router.replace("/auth");
    }

    if (loading) {
        return null;
    }
    if (!authenticated) return null;
    return (
        <>
            <button
                onClick={handleSignOut}
                style={{
                    position: "fixed",
                    top: 16,
                    right: 16,
                    zIndex: 100,
                    padding: "8px 16px",
                    background: "#222",
                    color: "#ededed",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 500,
                    cursor: "pointer",
                    opacity: 0.85,
                }}
            >
                Sign out
            </button>
            {children}
        </>
    );
}
