# First-Aid Buddy — Clinical Safety & Governance Plan
> Version 1.0 | February 2026 | Intended Use: First-Aid Educational Tool

---

## 1. Intended Use Statement

First-Aid Buddy is a **first-aid educational and guidance tool** designed to help bystanders take appropriate initial action in emergency and non-emergency first-aid situations.

**It is NOT:**
- A medical device for diagnosis, prognosis, or treatment
- A substitute for professional medical care or emergency services
- A replacement for formal first-aid training

**Governing UK regulatory position:** As an educational tool, First-Aid Buddy does not currently meet the definition of a Software as a Medical Device (SaMD) under MHRA guidance. This position is reviewed quarterly as features evolve. A formal MHRA regulatory assessment is planned as part of the seed use-of-funds.

---

## 2. Safety Architecture

### 2.1 Emergency Detection — Dual-Layer Approach

We use **two complementary methods** to ensure life-threatening situations are always escalated:

| Layer | Method | Failure Mode |
|---|---|---|
| Layer 1 — Deterministic | Keyword whitelist (`frozenset`) in `pipeline.py` | None (always runs; zero AI involvement) |
| Layer 2 — LLM | Claude-based intent classification (`LIFE_THREATENING` / `GENERAL_QUERY`) | Possible false negative if novel phrasing |

**Logic:** `is_emergency = LLM_result OR deterministic_result`
Over-triage (showing emergency banner unnecessarily) is always preferred over under-triage.

**Current deterministic keywords include:** cardiac arrest, not breathing, no pulse, unconscious, anaphylaxis, stroke, choking, severe bleeding, poisoning, drowning, electric shock, seizure, and more (see `backend/services/pipeline.py`).

### 2.2 Crisis / Self-Harm Safeguard

Queries containing self-harm or suicidal intent keywords **bypass the normal pipeline entirely** and return a pre-approved safe response:

- Never generates AI-authored instructions
- Immediately provides crisis service numbers (Samaritans 116 123, 988 US, Befrienders.org)
- Directs to 999 / 911 if danger is immediate

### 2.3 Region-Aware Emergency Numbers

Emergency numbers are served per-request based on the user's region selection:
- UK → 999, US → 911, EU → 112, AU → 000, CA → 911, NZ → 111
- Mapping is maintained in `First_Aid_buddy/config.py` (`REGION_EMERGENCY_NUMBERS`)
- **The emergency number is always included in the API response** — not just the UI — so any integration surface that consumes the API will have access to it

---

## 3. Content Governance

### 3.1 Knowledge Base

The current knowledge base (`First_Aid_buddy/core.py`, `FIRST_AID_KNOWLEDGE_BASE`) contains:
- 15+ first-aid topics (CPR, choking, burns, bleeding, fractures, allergic reactions, etc.)
- Written in plain English with actionable step-by-step format
- Grounded in publicly available first-aid guidance consistent with Red Cross / St John Ambulance / NHS protocols

**Caveats (transparent for diligence):**
- Content is not yet externally peer-reviewed by named medical advisors
- No direct URL citations to authoritative sources yet (Phase 2 RAG upgrade)
- No formal versioning or change control workflow yet

### 3.2 Clinical Advisory Board (Planned)

Target composition (to be recruited during seed period):
- 1× GP (General Practitioner) — primary care & acute illness perspective
- 1× Paramedic / Emergency Medical Technician — pre-hospital emergency focus
- 1× Occupational Health Physician — employer/insurer segment expertise

**Mandate:**
- Quarterly KB content review
- Sign-off on new topics before addition
- Incident review (any user-reported safety concerns)
- Annual intended use / regulatory assessment review

### 3.3 Content Update Process (Phase 2)

When the pgvector RAG backend is live:
1. Clinical advisor drafts / approves new document
2. Document enters version control with reviewer name + date
3. Embedding generated; document tagged with `reviewed_by`, `reviewed_date`, `source_url`
4. Citations shown to users include reviewer name and review date for full transparency

---

## 4. Privacy & Data Governance

### 4.1 Data Minimisation
- No PII is collected by default
- Session IDs are either user-generated random strings or hashed IP addresses
- Chat queries are not stored to a persistent database (current architecture)

### 4.2 Health Data (Special Category — UK GDPR Art. 9)
Users will inevitably describe health situations. This is treated as special-category data:
- Processed only as necessary to provide the service
- Not used for secondary purposes (profiling, advertising, training third-party models)
- Not shared with third parties except Anthropic (who process it under their API terms)
- Explicit consent gate shown before first use

### 4.3 Anthropic Data Processing
- Queries are sent to Anthropic's API to generate responses
- Anthropic's enterprise API terms under which we operate: [to be confirmed during seed]
- A Data Processing Addendum (DPA) with Anthropic will be executed before any paid B2B deployment

### 4.4 UK GDPR Compliance Status
| Requirement | Status |
|---|---|
| Privacy policy | ✅ Published, special-category section included |
| Terms of service | ✅ Published, England & Wales governing law |
| Consent gate | ✅ Implemented in chat UI |
| Contact for data requests | ✅ privacy@first-aid-buddy.app |
| DPIA | ❌ Planned (seed use-of-funds, Month 2) |
| ICO registration | ❌ Required before commercial launch |
| DPA with Anthropic | ❌ Planned (seed use-of-funds, Month 1) |

---

## 5. Security Controls

| Control | Status | Notes |
|---|---|---|
| XSS prevention | ✅ | `dangerouslySetInnerHTML` removed from all AI output rendering |
| Rate limiting | ✅ In-memory | Redis upgrade planned (seed, Month 3) |
| API key hygiene | ✅ | Server-side `.env` only; never transmitted to browser |
| CORS | ✅ | Dev: all origins; production: env-configured allowlist |
| Input validation | ✅ | Min 3 / max 500 chars; Pydantic model-level |
| Penetration test | ❌ | Planned pre-commercial launch |
| ISO 27001 assessment | ❌ | Planned (seed, Month 12) |

---

## 6. Incident Response

### 6.1 Reporting Channels
- User-reported safety incident: privacy@first-aid-buddy.app (subject: "Safety Concern")
- Severity 1 (potential patient harm): escalate to Clinical Advisor within 24 hours

### 6.2 Response Protocol (Draft)
1. Acknowledge within 2 business days
2. Investigate the specific query + response logged at time of incident
3. Classify: false negative emergency / inaccurate guidance / hallucination
4. Remediate: update KB / deterministic rules / prompt / model parameters
5. Notify user and relevant authorities if required by ICO guidelines
6. Document in incident register

---

## 7. Regulatory Positioning

| Question | Position |
|---|---|
| Is First-Aid Buddy a medical device? | No — educational tool. Positioned under MHRA's "Software not intended to fulfil a medical purpose" guidance. |
| Could it become a medical device? | Potentially, if marketed as diagnostic or treatment-assisting. We avoid these claims deliberately. |
| MHRA SaMD assessment needed? | Formal assessment planned during seed period. |
| CE / UKCA marking required? | Not at current intended use scope. Under review. |

---

## 8. Ongoing Evaluation Plan

### 8.1 Clinical Safety Eval Set (Phase 1)
Target: 200 labelled scenarios covering:
- Life-threatening emergencies (cardiac arrest, anaphylaxis, stroke, choking, etc.)
- Non-emergency queries (minor burns, cuts, sprains)
- Edge cases (ambiguous; near-miss emergencies)
- Self-harm queries

**Metrics to track:**
| Metric | Target |
|---|---|
| Emergency detection recall | ≥98% (zero false negatives acceptable) |
| Emergency detection precision | ≥85% |
| Crisis query safe-redirect rate | 100% |
| Citation coverage | ≥90% of answers have ≥1 citation |
| Hallucination rate (manual audit) | <2% |

### 8.2 Production Monitoring (Phase 2)
- Structured telemetry: `is_emergency`, `processing_ms`, `citations_count`, `region`, `model_error_type`
- Weekly dashboard review by Clinical Advisor + Engineering Lead
- Monthly safety review meeting

---

*This document should be reviewed and updated quarterly by the Clinical Advisory Board.*
*Last reviewed: February 2026 | Next review: May 2026*
