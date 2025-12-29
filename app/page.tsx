

"use client";

// ...existing code...
import { useState } from "react";
import { usePosts } from "./hooks/usePosts";

export default function TodayPage() {
  const [sentence, setSentence] = useState("");
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");
  const { data: posts, isLoading: loading, postMutation } = usePosts();


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (sentence.length < 1 || sentence.length > 200) {
      setError("Your sentence must be 1–200 characters.");
      return;
    }
    postMutation.mutate(sentence, {
      onSuccess: () => setPosted(true),
      onError: (err: any) => setError(err.message || "Failed to post. Try again."),
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "clamp(16px, 5vw, 48px) 0 0 0",
        background: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "system-ui, Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
          fontWeight: 700,
          marginBottom: 28,
          textAlign: "center",
          letterSpacing: "-0.02em",
        }}
      >
        Today’s Page
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "90vw",
          maxWidth: 480,
          marginBottom: 32,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          background: "rgba(34,34,34,0.85)",
          borderRadius: 16,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08)",
          padding: 20,
          border: "1px solid #222",
        }}
      >
        <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>Your sentence for today</label>
        <textarea
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          disabled={posted}
          maxLength={200}
          style={{
            width: "100%",
            minHeight: 56,
            borderRadius: 10,
            border: "1.5px solid #333",
            padding: 14,
            fontSize: 17,
            background: "var(--background)",
            color: "var(--foreground)",
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
            transition: "border 0.2s",
          }}
          placeholder="Write one honest sentence..."
        />
        <button
          type="submit"
          disabled={posted}
          style={{
            padding: "13px 0",
            background: posted ? "#444" : "#2563eb",
            color: "#ededed",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 17,
            border: "none",
            cursor: posted ? "not-allowed" : "pointer",
            opacity: posted ? 0.7 : 1,
            transition: "background 0.2s",
            marginTop: 2,
            boxShadow: posted ? "none" : "0 1px 6px 0 rgba(37,99,235,0.08)",
          }}
        >
          {posted ? "You’ve said enough for today." : "Submit sentence"}
        </button>
        {error && <div style={{ color: "#f87171", fontSize: 15, marginTop: 2 }}>{error}</div>}
      </form>
      <section
        style={{
          width: "90vw",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          margin: "0 auto",
        }}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={"skeleton-" + idx}
              style={{
                height: 36,
                borderRadius: 10,
                background: "#222",
                opacity: 0.18,
                marginBottom: 10,
                animation: "pulse 1.2s infinite ease-in-out",
              }}
            />
          ))
        ) : posts && Array.isArray(posts) ? (
          posts.map((post, idx) => (
            <div
              key={post.id || idx}
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                fontWeight: 400,
                padding: "10px 0 8px 0",
                border: "none",
                background: "none",
                color: "var(--foreground)",
                opacity: 0.97,
                borderBottom: idx !== posts.length - 1 ? "1px solid #222" : "none",
                wordBreak: "break-word",
              }}
            >
              <div>{post.sentence}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                {post.created_at ? new Date(post.created_at).toLocaleString() : ""}
                {post.user_id ? ` · user: ${post.user_id}` : ""}
              </div>
            </div>
          ))
        ) : null}
      </section>
      <style jsx global>{`
      @keyframes pulse {
        0% { opacity: 0.18; }
        50% { opacity: 0.35; }
        100% { opacity: 0.18; }
      }
      @media (max-width: 600px) {
        main {
          padding-top: 18vw !important;
        }
        form, section {
          max-width: 98vw !important;
          padding-left: 2vw !important;
          padding-right: 2vw !important;
        }
        h1 {
          font-size: 1.3rem !important;
        }
      }
      `}</style>
      <div
        style={{
          marginTop: 40,
          fontSize: 16,
          color: "#888",
          textAlign: "center",
          letterSpacing: "-0.01em",
        }}
      >
        That’s enough for today.
      </div>
    </main>
  );
}
