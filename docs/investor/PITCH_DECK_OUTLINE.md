# First-Aid Buddy — Pitch Deck Outline
> 10–12 slides | ~15 minutes including demo | Target: Healthcare / Insurer Investors

---

## Slide 1 — Title
**"First-Aid Buddy: AI that saves lives when seconds count"**
- Logo, tagline, your name & contact
- *Investor note:* Lead with urgency, not technology

---

## Slide 2 — The Problem (The Hook)
**"Every 90 seconds someone in the UK has a cardiac arrest where a bystander could help. Most don't."**

Key stats:
- 70% of people freeze in an emergency because they lack confidence
- Average 999 response time: 8 minutes — first-aid in the gap is the difference between life and death
- Existing tools (Google, YouTube, NHS 111) are slow, unfocused, and not interactive

*Visual:* Timeline showing the "golden minutes" and what happens without bystander intervention

---

## Slide 3 — Our Solution
**"An AI first-aid companion — triage, guidance, citations, in under 3 seconds"**

- 🔴 **Emergency triage:** Detects life-threatening situations and surfaces the correct emergency number immediately
- 📋 **Step-by-step guidance:** Actionable, numbered steps tailored to the specific situation (not generic Q&A)
- 📚 **Cited sources:** Every answer shows the knowledge-base document it was grounded in
- 🛡️ **Safety-first:** Crisis safeguard for self-harm queries; deterministic emergency keyword rules as a safety net alongside AI

*Visual:* 3-panel screenshot of the chat UI — empty state → emergency query → response with banner + citations

---

## Slide 4 — Live Demo
**[2-minute demo here — see DEMO_SCRIPT.md for the exact flow]**

Demo path:
1. Consent gate → shows we take responsibility seriously
2. Type "Someone collapsed and isn't breathing" → emergency banner + 999 + step-by-step CPR
3. Citations panel → auto-expanded, shows KB source
4. Switch region to US → emergency number changes to 911
5. General query "how to treat a burn" → differentiated response, no emergency banner

---

## Slide 5 — Target Market & Customer
**"Starting with healthcare / insurers — the highest trust, highest value channel"**

- **ICP:** UK private medical insurers (AXA Health, Bupa, Aviva) + occupational health providers + large employer HR/EAP teams
- **Why them:** Duty-of-care pressure, regulatory compliance (HSE), employee wellness investment
- **GTM wedge:** B2B pilot with 1–2 insurers, 500-seat employer proof of concept → white-label

Market size: £180M SAM (UK B2B wellness/safety tools) → £2B+ global

---

## Slide 6 — Traction & Validation
**"Working product, de-risked technology, early signals"**

What exists today (Feb 2026):
- Functional Next.js + FastAPI product, Docker-deployable
- 15+ first-aid topics, region-aware emergency numbers (UK/US/EU/AU)
- XSS-free, GDPR-aligned, crisis safeguard live
- UK GDPR–compliant privacy policy, England & Wales governing law

What's in progress:
- Inbound conversations with [X occupational health provider / insurer — add if applicable]
- Clinical advisory board recruitment underway

---

## Slide 7 — Competitive Landscape
**"We're not a chatbot. We're a safety-critical guidance layer."**

| | Emergency triage | Citations | Hands-free | Multi-region | Crisis safe |
|---|---|---|---|---|---|
| ChatGPT | ❌ | ❌ | ❌ | ❌ | ❌ |
| NHS 111 | Partial | ❌ | ❌ | UK only | ❌ |
| First-aid apps | Partial | ❌ | Partial | Partial | ❌ |
| **First-Aid Buddy** | ✅ | ✅ | 🔜 | ✅ | ✅ |

**Moat:** Clinical governance + curated KB + safety evaluation loop + insurer-grade compliance posture

---

## Slide 8 — Business Model
**"B2B first, B2C at scale"**

| Revenue Stream | Year 1 | Year 2 |
|---|---|---|
| B2B employer pilots (£4/seat/yr) | £8–20K ARR | £80K ARR |
| Insurer white-label | £35–60K/yr | £150K ARR |
| B2C premium (Phase 2) | — | £40K ARR |

- COGS per conversation: ~£0.002 (API cost)
- Target gross margin: >80%
- Payback period: <6 months at 500-seat B2B deal

---

## Slide 9 — Product Roadmap
**"Funded roadmap, not wishlist"**

**Phase 1 (Months 1–6, in-flight):**
- ✅ XSS fix, claims alignment, consent gate, live health badge
- ✅ Region-aware emergency numbers
- 🔜 Clinical advisory board, safety eval set (200 scenarios)
- 🔜 pgvector RAG with document versioning
- 🔜 Redis rate limiting (multi-instance)

**Phase 2 (Months 7–12):**
- Voice / hands-free mode (TTS + large-button UI)
- CPR metronome / timer
- Mobile app (React Native)
- Offline "emergency quick steps" fallback
- Multi-language support (Welsh, Punjabi, Urdu)

**Phase 3 (Months 13–18):**
- Insurer white-label SDK
- Clinical outcome evaluation (pilot study)
- ISO 27001 certification
- MHRA regulatory positioning (educational tool stance)

---

## Slide 10 — Clinical Safety & Governance
**"We take safety seriously — it's the moat, not the risk"**

- Deterministic emergency detection (keyword rules + LLM — OR logic, over-triage is safer)
- Crisis / self-harm safeguard — never gives instructions, always routes to Samaritans/988
- Medical advisory board (GP + paramedic) reviewing KB content quarterly
- Privacy: no PII stored; health data treated as special category (UK GDPR Art. 9)
- Intended use: First-aid educational tool (not a medical device; not for diagnosis)
- Governing law: England and Wales

*Full governance plan: see CLINICAL_SAFETY_AND_GOVERNANCE.md*

---

## Slide 11 — Team
**[Your names, roles, credentials]**

Suggested structure:
- **Founder / CEO:** [Name] — AI/product background, [Sheffield / UK ecosystem]
- **Clinical Advisor:** [Name] — GP / paramedic / occupational health
- **Advisor:** [Name] — HealthTech investor / insurer BD contact

---

## Slide 12 — The Ask
**"£800K Seed to get to 3 paying pilots and Series A readiness"**

- **Round size:** £800,000
- **Structure:** SAFE / Convertible Note at [cap]
- **Use of funds:** Engineering (40%), Clinical governance (15%), Commercial pilots (25%), Infrastructure & Security (10%), Legal (10%)
- **18–22 months runway** to: 3 paying B2B pilots, 1,000 MAU, published safety eval, medical advisory board
- **Next milestone for Series A:** £150K ARR + insurer white-label in commercial diligence

> **"Every second matters. Help us make sure every bystander knows what to do."**

---

*Appendix materials available: architecture diagram, clinical safety plan, demo script, financial model*
