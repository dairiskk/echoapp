

"use client";

import { useState, useRef, useEffect } from "react";
import { postSentence, fetchPosts } from "../lib/supabase";

export default function TodayPage() {
  const [sentence, setSentence] = useState("");
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Fetch posts from Supabase on mount
  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const { data, error } = await fetchPosts();
      if (!error && data) {
        setPosts(data);
        if (data.length === 0) {
          console.log("No posts found in Supabase.");
        } else {
          console.log("Fetched posts:", data);
        }
      } else {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    }
    loadPosts();
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (sentence.length < 1 || sentence.length > 200) {
      setError("Your sentence must be 1–200 characters.");
      return;
    }
    // Post to Supabase
    const { error } = await postSentence(sentence);
    if (error) {
      setError("Failed to post. Try again.");
      return;
    }
    // Re-fetch posts after posting
    const { data } = await fetchPosts();
    if (data) {
      setPosts(data);
    }
    setPosted(true);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 48,
        background: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "system-ui, Arial, Helvetica, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          marginBottom: 32,
          textAlign: "center",
          letterSpacing: "-0.02em",
        }}
      >
        Today’s Page
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 480,
          marginBottom: 40,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <label style={{ fontWeight: 500, fontSize: 16 }}>Your sentence for today</label>
        <textarea
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          disabled={posted}
          maxLength={200}
          style={{
            width: "100%",
            minHeight: 48,
            borderRadius: 8,
            border: "1px solid #444",
            padding: 12,
            fontSize: 16,
            background: "var(--background)",
            color: "var(--foreground)",
            resize: "none",
            outline: "none",
          }}
          placeholder="Write one honest sentence..."
        />
        <button
          type="submit"
          disabled={posted}
          style={{
            padding: "10px 0",
            background: posted ? "#444" : "#222",
            color: "#ededed",
            borderRadius: 6,
            fontWeight: 500,
            border: "none",
            cursor: posted ? "not-allowed" : "pointer",
            opacity: posted ? 0.7 : 1,
            transition: "background 0.2s",
          }}
        >
          {posted ? "You’ve said enough for today." : "Submit sentence"}
        </button>
        {error && <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div>}
      </form>
      <section
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={"skeleton-" + idx}
              style={{
                height: 32,
                borderRadius: 8,
                background: "#222",
                opacity: 0.2,
                marginBottom: 8,
                animation: "pulse 1.2s infinite ease-in-out",
              }}
            />
          ))
        ) : (
          posts.map((post, idx) => {
            return (
              <div
                key={post.id || idx}
                style={{
                  fontSize: 20,
                  lineHeight: 1.5,
                  fontWeight: 400,
                  padding: "0",
                  border: "none",
                  background: "none",
                  color: "var(--foreground)",
                  opacity: 0.95,
                }}
              >
                <div>{post.sentence}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                  {post.created_at ? new Date(post.created_at).toLocaleString() : ""}
                  {post.user_id ? ` · user: ${post.user_id}` : ""}
                </div>
              </div>
            );
          })
        )}
      </section>
      <style jsx global>{`
      @keyframes pulse {
        0% { opacity: 0.2; }
        50% { opacity: 0.5; }
        100% { opacity: 0.2; }
      }
      `}</style>
      <div
        style={{
          marginTop: 48,
          fontSize: 18,
          color: "#888",
          textAlign: "center",
        }}
      >
        That’s enough for today.
      </div>
    </main>
  );
}
