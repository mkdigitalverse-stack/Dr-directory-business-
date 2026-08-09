# LKOHEALTH Directory & Verification Platform — Complete System Documentation

## Executive Overview
LKOHEALTH (`lucknow.healthcare.directory`) is a production-grade regional healthcare discovery, verification, and appointment scheduling platform built for Lucknow and Uttar Pradesh, India. Designed with strict data isolation, zero-trust security, and medical governance standards, it connects patients with authentic doctors, super-specialty hospitals, local clinics, and diagnostic pathology labs.

Website Created & Engineered by: **MK Digitalverse** ([www.mkdigitalverse.in](https://www.mkdigitalverse.in))

---

## 1. System Architecture & Technical Stack

- **Frontend Architecture:** Single-Page Application (SPA) built with React 18, TypeScript, Tailwind CSS, Lucide React Icons, and Motion animations.
- **Backend Infrastructure:** Express server running on Node.js / Cloud Run proxying Gemini API health insights, serving dynamic SEO meta tags, `robots.txt`, and `sitemap.xml`.
- **Database & Auth:** Firebase Firestore (`ai-studio-healthcaredirect-e528ebf7-7e4a-4157-b1d0-4eb9e3b22dcd`) with Firebase Authentication (Email/Password & OTP/Instant Access).
- **Security & Access Control:** Attribute-Based Access Control (ABAC) enforced via server-side Firestore security rules (`firestore.rules`).
- **AI Health Intelligence:** Server-side Gemini 3.6 Flash integration (`/api/health-tips`) providing localized Lucknow seasonal wellness protocols with fallback safety.

---

## 2. Platform Roles & Core Entities

### User Roles
1. `patient`: End-user searching for medical care, booking appointments, and posting verified reviews.
2. `provider_owner`: Medical professional or clinic manager managing practice listings, OPD schedules, appointments, and credentials.
3. `admin`: Governance officer moderating listings, reviewing council registration certificates, handling review disputes, and auditing access logs (`mkdigitalverse@gmail.com`).

### Lifecycle Statuses

#### Provider Listing Status
- `DRAFT`: Incomplete profile saved by provider owner (private to owner & admin).
- `SUBMITTED`: Completed profile awaiting initial directory moderation (private to owner & admin).
- `UNDER_REVIEW`: In active screening by admin governance team (private to owner & admin).
- `APPROVED`: Fully screened profile visible in public directory and search results.
- `REJECTED`: Rejected during moderation; provider can fix and resubmit.
- `SUSPENDED`: Suspended for policy violations or fraudulent claims (hidden from public).

#### Verification Status
- `UNVERIFIED`: Profile listed without submitted Medical Council / Clinical Establishment licenses.
- `VERIFICATION_PENDING`: Verification documents submitted and under administrative audit.
- `VERIFIED`: Credentials verified against official State Medical Council / NMC databases. Displays verified trust seal.
- `VERIFICATION_REJECTED`: Verification rejected due to expired/invalid licenses.

#### Appointment Status
- `PENDING`: Initial booking request placed by patient.
- `CONFIRMED`: OPD slot confirmed by clinic or doctor.
- `CANCELLED`: Appointment cancelled by patient or clinic.
- `COMPLETED`: Patient consultation completed. Unlocks verified review eligibility.
- `NO_SHOW`: Patient did not show up for the slot.

#### Review Status
- `PENDING`: Community review under automated or manual moderation.
- `PUBLISHED`: Verified or approved review published on doctor profile.
- `FLAGGED`: Review reported for harassment, spam, or defamation.
- `REJECTED`: Review rejected by admin for violating review guidelines.
- `REMOVED`: Review taken down following dispute audit.

---

## 3. Firestore Collections Schema Overview

1. `users`: `{ uid, email, displayName, phone, role, createdAt }`
2. `providers`: `{ id, ownerUid, name, type, status, verificationStatus, verified, specialties, qualification, experienceYears, medicalRegistrationNumber, councilName, address, localityId, landmark, consultationFee, phone, whatsapp, email, timings, services, treatments, rating, reviewsCount, image, createdAt, updatedAt }`
3. `appointments`: `{ id, patientUid, patientName, patientPhone, patientEmail, providerId, providerOwnerUid, providerName, localityId, serviceName, fee, date, time, status, notes, createdAt, updatedAt }`
4. `reviews`: `{ id, providerId, patientUid, patientName, isVerifiedPatient, rating, title, comment, metrics: { doctorBehavior, waitingTime, cleanliness, staffBehavior, communication, treatmentSatisfaction }, status, response: { comment, date }, createdAt }`
5. `reviewReports`: `{ id, reviewId, reportedByUid, reason, details, status, createdAt }`
6. `verifications`: `{ id, providerId, requestedByUid, councilRegistrationNumber, councilName, establishmentLicense, idDocumentUrl, registrationCertUrl, licenseCertUrl, status, reviewerNotes, submittedAt, reviewedAt }`
7. `auditLogs`: `{ id, actorUid, actorEmail, action, targetType, targetId, details, timestamp }`

---

## 4. Phase-by-Phase Implementation & Audit

### Phase 1: Authentication & User Management
- **Objective:** Secure multi-role user authentication.
- **Functionality:** Email/Password and Instant Access sign-in, session state persistence, role-based navigation.
- **Data Models:** `users` collection.
- **Security:** Private user profiles editable only by account owner; roles protected by admin governance.
- **QA Status:** PASS.

### Phase 2: Provider Listing Workflow
- **Objective:** Structured onboarding for doctors, clinics, hospitals, and diagnostic labs.
- **Functionality:** Multi-step wizard, draft auto-saving, OPD schedule creation, address & landmark mapping.
- **Data Models:** `providers` collection.
- **Security:** Self-approval disabled; status transitions restricted to admin.
- **QA Status:** PASS.

### Phase 3: Patient Discovery & Search
- **Objective:** High-performance, multi-filter local search engine.
- **Functionality:** Filter by Lucknow locality (Gomti Nagar, Hazratganj, Aliganj, etc.), medical specialty, fee range, verification status, and category.
- **Data Models:** `providers` collection (filters `status == 'APPROVED'`).
- **Security:** Non-approved profiles excluded from public search results.
- **QA Status:** PASS.

### Phase 4: Appointments & Double-Booking Protection
- **Objective:** Direct OPD appointment scheduling with concurrency protection.
- **Functionality:** Slot selection, instant booking confirmation, patient dashboard, provider OPD schedule manager.
- **Data Models:** `appointments` collection.
- **Security:** Atomic Firestore checks prevent duplicate bookings for same `(providerId, date, time)`. Access restricted to patient owner, provider owner, and admin.
- **QA Status:** PASS.

### Phase 5: Reviews & Reputation System
- **Objective:** Authentic patient feedback with multi-metric rating aggregation.
- **Functionality:** Rating submission across 6 clinical dimensions, verified patient badge for completed appointments, provider response portal, report/flag mechanism.
- **Data Models:** `reviews`, `reviewReports` collections.
- **Security:** Ratings calculated strictly from `PUBLISHED` reviews; self-review and multiple reviews per appointment blocked.
- **QA Status:** PASS.

### Phase 6: Verification & Governance
- **Objective:** Medical council credential verification.
- **Functionality:** Registration certificate upload modal, Admin Verification Desk, document review workflow, Verified Seal issuance.
- **Data Models:** `verifications` collection.
- **Security:** Verification status editable strictly by admin role; verification documents stored with restricted read access.
- **QA Status:** PASS.

### Phase 7: Production Hardening & Security
- **Objective:** Firestore security rules deployment, role escalation prevention, and data isolation.
- **Functionality:** Comprehensive `firestore.rules` enforcing ABAC for all collections.
- **Security:** Public read allowed ONLY for approved provider listings and published reviews.
- **QA Status:** PASS.

### Phase 8: Final QA Audit
- **Objective:** End-to-end verification across Patient, Provider, and Admin workflows.
- **QA Status:** PASS (Zero critical or high-priority bugs).

### Phase 9: Production Launch Preparation
- **Objective:** Final deployment configuration, SEO indexing rules, `robots.txt`, `sitemap.xml`, and documentation.
- **QA Status:** READY FOR DEPLOYMENT.

---

## 5. Deployment Requirements & Production Checklist

1. **Firebase Console Rules Deployment:** Verify `firestore.rules` is deployed on project `lucky-rarity-nx6pd` / database `ai-studio-healthcaredirect-e528ebf7-7e4a-4157-b1d0-4eb9e3b22dcd`.
2. **Environment Variables:** Ensure `GEMINI_API_KEY` is configured in production environment secrets for seasonal health tip generation.
3. **Domain & SSL:** Point custom domain (e.g., `lucknow.healthcare.directory`) to Cloud Run service and enable automatic SSL certificate.
4. **Admin Account Setup:** Register or assign `admin` role to `mkdigitalverse@gmail.com` in `users` collection.
5. **Periodic Firestore Backups:** Enable automated GCP Firestore daily export to GCS bucket for disaster recovery.

---

*Documentation compiled and maintained by MK Digitalverse (www.mkdigitalverse.in) for LKOHEALTH Directory.*
