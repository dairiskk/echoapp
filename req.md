# Public Diary of Today — Product Requirements (v1)

## 1. Product Concept

A calm, anonymous web app that acts as a **public diary page for today**.

- Each person can write **one sentence per day**
- Everyone reads the **same page of today**
- No profiles, no followers, no likes, no metrics
- Designed for honesty, calm, and presence — not performance

---

## 2. Platform & Stack

- Web app built with **Next.js**
- Mobile-first responsive design
- Progressive Web App (PWA)
- Backend: **Supabase** (Auth + Postgres)
- Hosting: Vercel (or equivalent)
- No native mobile apps in v1

---

## 3. Authentication & Identity

### Authentication
- Email magic link login (Supabase Auth)
- No passwords
- No usernames
- No public identity

### Identity Model
- Supabase provides `auth_user_id`
- App maps this to an **internal random user ID**
- Email is never stored in app tables
- Same email on different devices = same user

### Sessions
- Auth tokens expire normally
- User may need to re-enter email
- Identity is preserved across sessions and devices

---

## 4. Time & “Today” Logic

- “Today” follows the **user’s current local time**
- Time zone detected automatically from browser
- No time zone shown in UI
- Day resets at **local midnight**
- Traveling users follow new local time
- Double posting due to travel is allowed

---

## 5. Posting Rules

- One post per user per local day
- Post is:
  - plain text only
  - max length: **120–200 characters**
  - no links
  - no emoji spam
- No editing after posting

After posting:
- Input is disabled
- Message shown:
  > “You’ve said enough for today.”

---

## 6. Feed (“Today’s Page”)

### Layout
- Single vertical column
- Text-only
- No cards, no avatars, no borders
- Feels like a **page**, not a social feed

### Density
- Mobile: **2–4 sentences per screen**
- Desktop: **3–6 sentences per screen**
- Controlled via typography and spacing

### Behavior
- Chronological (newest first)
- No infinite scroll
- Hard cap: ~30–50 sentences
- End-of-page message:
  > “That’s enough for today.”

---

## 7. Reading & Presence (“Pause”)

### Concept
- No buttons
- No likes
- No reactions
- Presence is inferred automatically

### Pause Detection
A pause is detected when:
- Sentence is ≥ 60–70% visible
- User is not scrolling
- Browser tab is active
- Condition holds for ≥ 5 seconds

### Recording Rules
- Max 1 pause per user per post per day
- No duration stored
- No timestamps exposed
- Stored server-side only

---

## 8. Writer Acknowledgment (“You Were Heard”)

### Behavior
- Delayed
- Binary (yes/no)
- Shown **once per day max**

### Example Message
> “Your sentence was read.”

Rules:
- Shown only if **any pause occurred**
- Same message regardless of count
- No numbers
- No timing details
- No per-post stats

---

## 9. Metrics & Popularity (Forbidden)

Do NOT show:
- Daily user count
- Online users
- Views
- Likes
- Rankings
- Trending posts
- Engagement stats

Optional (safe):
- One qualitative line for everyone:
  > “Today’s page was read quietly.”

---

## 10. UI Language & Copy

Use:
- “Today”
- “Your sentence”
- “This page”
- “Come back tomorrow”

Avoid:
- “Post”
- “Feed”
- “Users”
- “Followers”
- “Engagement”

Tone:
- calm
- minimal
- human
- non-technical

---

## 11. Data Model (Minimal)

### Tables

#### users
- id (internal random ID)
- auth_user_id
- timezone
- created_at

#### posts
- id
- user_id
- content
- created_at (UTC)

#### presence_pauses
- post_id
- user_id
- date
- unique(post_id, user_id, date)

---

## 12. Privacy Principles

- No emails stored in app DB
- No analytics shown to users
- No cursor tracking
- No scroll heatmaps
- Clear “Delete my data” option

---

## 13. Explicitly Out of Scope (v1)

- Profiles
- Comments
- Replies
- Likes
- Emojis
- Search
- Notifications
- Push
- Editing
- Public history
- Following

---

## 14. Definition of Done (v1)

The app is ready when:
- Users can log in with email
- Write one sentence per day
- Read today’s page
- Feel reassured they were heard
- The app feels calm and intentional

---

## 15. Guiding Rule

> If a feature answers “How well did I do?” — do not implement it.

Only answer:
> “Was I here?”
