# LKOHEALTH Directory & Verification Platform

LKOHEALTH (`lucknow.healthcare.directory`) is a production-grade healthcare directory and discovery platform for Lucknow, Uttar Pradesh. It connects patients with verified medical practitioners, super-specialty hospitals, clinics, and diagnostic labs.

Engineered by **MK Digitalverse** ([www.mkdigitalverse.in](https://www.mkdigitalverse.in)).

---

## Technical Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, Motion
- **Backend:** Express, Node.js, Vite
- **Database & Auth:** Firebase Firestore & Firebase Authentication
- **AI Integration:** Google Gemini 3.6 Flash for localized Lucknow seasonal health tips

---

## Key Features
1. **Patient Discovery & Search:** Filter by Lucknow locality (Gomti Nagar, Hazratganj, Aliganj, etc.), specialty, category, and verification status.
2. **OPD Appointment Scheduling:** Real-time slot booking with double-booking prevention.
3. **Provider Onboarding & Management:** Multi-step listing wizard, OPD schedule manager, review response desk.
4. **Credential Verification Desk:** Administrative verification of State Medical Council / NMC registration certificates and issuance of Verified Provider seals.
5. **Multi-Metric Review System:** 6-point clinical evaluation with verified patient badges.
6. **Governance & Moderation:** Comprehensive Admin Desk for provider listing approval, review reports, and audit logging.

---

## System Documentation
For detailed architecture, data schemas, security rules, and phase reports, please refer to:
[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

---

## Production Build & Linting

```bash
# Typecheck & Lint
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```
