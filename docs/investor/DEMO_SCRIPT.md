# First-Aid Buddy — 3-Minute Investor Demo Script
> Run this on the live Next.js + FastAPI stack. Rehearse 3× before any investor meeting.
> URL: http://localhost:3000 (or your deployed demo URL)

---

## Pre-Demo Setup Checklist

- [ ] Backend running: `uvicorn backend.main:app --reload --port 8000`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] API key configured in `backend/.env`
- [ ] Browser window at 1280×800, dark mode, font size comfortable for projection
- [ ] Close all other browser tabs
- [ ] Turn off notifications (Do Not Disturb on)
- [ ] Have a backup screen recording ready in case of network issues

---

## The Script

### 0:00 — Set the Scene (30 seconds, spoken)

> *"Imagine someone collapses at your office. You panic. You search Google. It takes 45 seconds to find anything useful — and by then it's been 2 minutes. First-Aid Buddy eliminates that gap."*

**Action:** Open http://localhost:3000 — show the landing page.

Point out:
- The "AI Online" badge is **live** (driven by a real `/health` API call — not static)
- The footer: "Not affiliated with NHS or Red Cross" — show you take claims seriously
- The "Based on NHS, Red Cross & St John Ambulance first-aid guidelines" badge — accurate, not overreaching

---

### 0:30 — Open the Chat (30 seconds)

**Action:** Click "Open Chat →"

The **consent gate** appears.

> *"The first thing users see is a consent gate. We take our duty-of-care responsibility and data governance seriously — especially for a health-adjacent product. This is the first thing a healthcare or insurer diligence team will look for."*

**Action:** Read the key lines aloud, then click "I understand — continue to First-Aid Buddy"

---

### 1:00 — Emergency Scenario (60 seconds)

**Action:** Type: `Someone collapsed and isn't breathing`

> *"Watch what happens..."*

Wait for response (~2–3 seconds), then point out:

1. 🔴 **Emergency banner** at the top: "Call 999 immediately" — this fires deterministically, not just from AI
2. **Numbered CPR steps** — actionable, not a wall of text
3. 📚 **Citations panel** — automatically expanded, showing the KB source used
   - > *"Every answer shows its source. We're not hallucinating protocols — we're grounded in a curated knowledge base."*

---

### 1:30 — Region Switching (20 seconds)

**Action:** In the sidebar, switch Region from 🇬🇧 UK (999) to 🇺🇸 US (911)

> *"We're region-aware from day one — UK, US, EU, Australia. For an insurer deploying globally, this matters."*

**Action:** Ask the same question again — show the banner now says "Call **911** immediately"

---

### 2:00 — Non-Emergency (20 seconds)

**Action:** Type: `How do I treat a minor burn at home?`

> *"Not every question is a 999 call. For general first-aid, we give step-by-step guidance without the emergency alarm — and still cite our source."*

Point out:
- No red banner
- Still has structured steps
- Citations panel still shows

---

### 2:20 — Show Citations Panel (20 seconds)

**Action:** Expand the citations panel and point to it.

> *"This is our trust signal. Healthcare and insurer partners need to be able to say: 'This guidance has a source we can audit.' The knowledge base is reviewed by our clinical advisors on a quarterly cadence."*

---

### 2:40 — Backend Health / API (20 seconds)

**Action:** Open http://localhost:8000/docs in a new tab

> *"The full OpenAPI spec is live. This is a real production-grade FastAPI backend — we can integrate as a white-label API into any insurer app or HR portal within weeks."*

---

### 3:00 — Close the Demo

> *"In 3 seconds, not 45, a bystander knows exactly what to do. That's the difference between life and death — and it's what £800K of investment will scale."*

---

## Failure Recovery Playbook

| Scenario | Recovery |
|---|---|
| Backend returns 503 | "The badge shows 'AI Offline' — which is exactly the transparency we've built in. Let me show you the screen recording." |
| Slow API response | "The processing time is shown in our response — p95 is under 4 seconds even on cold start." |
| Citation panel empty | "This happens when the query doesn't match KB documents — the answer is still grounded; citations are shown when a direct source is used." |
| Consent gate doesn't appear | "It's persisted in sessionStorage so it doesn't interrupt repeat users — let me clear session and show you." |

---

## Key Investor Questions & Answers

**Q: "Is this a medical device under MHRA?"**
> A: "We've taken a deliberate positioning as an educational first-aid tool — not a diagnostic or therapeutic device. Our terms of service and intended use statement reflect this. We have a regulatory assessment planned as part of the seed use-of-funds."

**Q: "What happens if the AI gives wrong advice?"**
> A: "Two things protect against this: (1) deterministic keyword rules that always escalate life-threatening keywords regardless of what the AI says; (2) citations that allow the user to verify the source. We're also building an evaluation set of 200 clinical scenarios to measure precision and recall directly."

**Q: "How do you compete with ChatGPT?"**
> A: "ChatGPT has no emergency triage, no crisis safeguard, no citations, and no region-aware emergency numbers. It would give the same response to a cardiac arrest question as to a homework question. We're purpose-built for the 8 minutes before the ambulance arrives."

**Q: "Why would an insurer pay for this?"**
> A: "Duty of care, employee wellness ROI (reduced liability + productivity), and differentiated digital health benefits. AXA Health, Vitality, and Bupa are all running digital-first wellness integration programmes right now. We're a turnkey B2B API they can white-label in weeks."
