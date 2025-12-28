

"use client";
import { useState, useRef, useEffect } from "react";

export default function TodayPage() {
  const [sentence, setSentence] = useState("");
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");
  const [sentences, setSentences] = useState([
    "Today I felt calm and present.",
    "I watched the rain and thought about nothing.",
    "Shared a quiet moment with my cat.",
    "Read a book in silence.",
    "Let go of a worry.",
    "Enjoyed a walk without my phone.",
    "Cooked a simple meal.",
    "Listened to the wind.",
    "Wrote a sentence for today.",
    "Paused and breathed.",
  ]);
  const [heard, setHeard] = useState(false);
  const ownSentenceRef = useRef<HTMLDivElement | null>(null);

  // Mock pause detection: if own sentence is visible for 5s, show acknowledgment
  useEffect(() => {
    if (!posted || heard || !ownSentenceRef.current) return;
    let timer: NodeJS.Timeout | null = null;
    function checkVisibility() {
      const el = ownSentenceRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = rect.top < vh * 0.7 && rect.bottom > vh * 0.3;
      if (visible && document.visibilityState === "visible") {
        timer = setTimeout(() => setHeard(true), 5000);
      } else {
        if (timer) clearTimeout(timer);
      }
    }
    window.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);
    document.addEventListener("visibilitychange", checkVisibility);
    checkVisibility();
    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
      document.removeEventListener("visibilitychange", checkVisibility);
      if (timer) clearTimeout(timer);
    };
  }, [posted, heard]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (sentence.length < 1 || sentence.length > 200) {
      setError("Your sentence must be 1–200 characters.");
      return;
    }
    setSentences([sentence, ...sentences]);
    setPosted(true);
    // Here you would call the real API
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
        {sentences.map((s, idx) => {
          const isOwn = posted && idx === 0 && s === sentence;
          return (
            <div
              key={idx}
              ref={isOwn ? ownSentenceRef : undefined}
              style={{
                fontSize: 20,
                lineHeight: 1.5,
                fontWeight: 400,
                padding: "0",
                border: "none",
                background: "none",
                color: "var(--foreground)",
                opacity: isOwn ? 1 : 0.95,
              }}
            >
              {s}
              {isOwn && heard && (
                <div style={{ color: "#4ade80", fontSize: 15, marginTop: 6 }}>
                  Your sentence was read.
                </div>
              )}
            </div>
          );
        })}
      </section>
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
