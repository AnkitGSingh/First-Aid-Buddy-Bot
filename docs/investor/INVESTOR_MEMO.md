# First-Aid Buddy — Investor Memo
> **Confidential | February 2026 | Seeking £800K Seed**

---

## The Problem — 3 Sentences

Every 90 seconds a cardiac arrest occurs in the UK where a bystander could save a life with correct first-aid action. **70% of people freeze because they don't know what to do.** Current alternatives — YouTube, NHS 111, Google Search — are slow, unfocused, and never emergency-aware.

---

## The Solution

**First-Aid Buddy** is an AI-powered first-aid assistant that triages emergencies, delivers step-by-step guidance in plain language, and cites every source it uses — in under 3 seconds.

| Feature | Today (v1) | 6-Month Target |
|---|---|---|
| Emergency triage | ✅ LLM + deterministic rules | ✅ Validated eval set |
| Step-by-step guidance | ✅ Claude-powered | ✅ 50+ topics |
| Cited sources | ✅ Knowledge-base grounded | ✅ Externally reviewed |
| Region-aware emergency numbers | ✅ UK/US/EU/AU | ✅ |
| Crisis safeguard (self-harm) | ✅ Keyword + safe responding | ✅ |
| Voice / hands-free mode | ❌ | ✅ Phase 2 |
| Mobile app | ❌ | ✅ Phase 2 |

---

## Target Customer & GTM Wedge

**Primary: Healthcare / Insurers**
- UK private medical insurers (AXA Health, Aviva, Bupa) seeking digital-first wellness tools for employer group policies
- NHS-adjacent occupational health service providers
- Corporate HR / EAP (Employee Assistance Programme) bundles

**Distribution:**
1. **B2B pilot** — 2–3 employer wellness partnerships at £3–8/employee/year
2. **Insurer white-label** — platform embedded in existing insurer apps
3. **Direct B2C** — freemium with premium "family plan" tier (Phase 2)

---

## Market Size

| Segment | Size (UK) | Notes |
|---|---|---|
| Corporate wellness software | £1.2B (2025, growing 11% YoY) | CAAT estimates |
| Health & safety compliance tools (employers) | £450M | HSE-driven demand |
| Digital consumer health apps | £2.8B | App Store / Google Play |

Serviceable addressable market (SaaS B2B first-aid + training tools): **~£180M UK, >£2B globally.**

---

## Traction (Current)

- Working product: Next.js + FastAPI, deployed and functional
- Knowledge base: 15+ first-aid topics, deterministic + LLM triage
- Tech de-risked: Claude-powered, RAG-ready architecture, region-aware emergency numbers
- Safety governance: Crisis pathway, XSS-free, UK GDPR–aligned privacy policy

**Nothing sold yet — pre-revenue, pre-pilot. Funding unlocks pilots and commercial team.**

---

## Competitive Differentiation

| Competitor | Gap vs First-Aid Buddy |
|---|---|
| ChatGPT / general AI | No emergency triage, no KB citations, no crisis pathway |
| NHS 111 Online | Symptom diagnosis only, no real-time step guidance, UK-only |
| YouTube first aid videos | Not interactive, not personalized, can't escalate to 999 |
| First-aid apps (Pulse Point etc.) | Offline only, no AI, no personalization |
| **First-Aid Buddy** | **Interactive + triage + citations + crisis safeguard + multi-region** |

**Defensible moat:** Safety-first evaluation loop + clinical content governance + a growing curated knowledge base that becomes harder to replicate as we add medical advisory sign-off.

---

## Business Model

| Stream | Price Point | Year 1 Target |
|---|---|---|
| B2B employer licensing | £4/employee/year (500-seat min) | 4 pilots = £8K ARR |
| Insurer white-label SLA | £25–60K/yr per insurer partner | 1 partner = £35K |
| B2C premium (Phase 2) | £4.99/mo or £39.99/yr | — |

**Year 1 Revenue Target:** £50–80K ARR (proof of commercial model for Series A)

---

## Unit Economics (at scale)

- **COGS per chat:** ~£0.002 (Claude Sonnet API cost per 1K tokens at volume pricing)
- **Gross margin (B2B SaaS):** >80%
- **Payback (B2B employer):** <6 months at 500 seats

---

## Use of £800K Seed

| Bucket | % | £ | What it Buys |
|---|---|---|---|
| Product & Engineering | 40% | £320K | RAG upgrade (pgvector), voice mode, mobile app skeleton, analytics instrumentation |
| Clinical & Safety Governance | 15% | £120K | Medical advisory board (2 GPs / paramedics), content review workflow, DPIA, regulatory assessment |
| Commercial & Pilots | 25% | £200K | BD hire (part-time), 3 paid pilots, insurer BD intro meetings |
| Infrastructure & Security | 10% | £80K | Redis rate limiting, structured logging, pen-test, ISO 27001 preparation |
| Legal & IP | 10% | £80K | IP assignment, contracts, employment law, data processing addendums |

**Runway: ~18–22 months to Series A / revenue-positive.**

---

## Milestones for Next Round

- [ ] 3 paying B2B pilots (employer or insurer)
- [ ] >1,000 unique monthly active users
- [ ] Clinical safety eval set (200 scenarios) with published precision/recall
- [ ] Medical advisory board in place
- [ ] ISO 27001 readiness assessment complete

---

## Team

*[Add founding team profiles here — technical background, healthcare/AI credentials, Sheffield ecosystem connections]*

---

## The Ask

**£800,000 Seed** in exchange for [X]% equity. SAFE or convertible note preferred.

> **"First-aid knowledge is critical infrastructure. First-Aid Buddy makes it conversational, safe, and cited — for everyone."**

---

*Not a prospectus. For discussion purposes only. All projections are estimates.*
