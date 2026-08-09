import React from "react";
import { ViewState } from "../types";
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft,
  Award,
  BookOpen,
  Scale,
  Users,
  Eye,
  HeartPulse
} from "lucide-react";

interface PolicyPagesProps {
  view: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const PolicyPages: React.FC<PolicyPagesProps> = ({ view, onNavigate }) => {
  const renderHeader = (title: string, subtitle: string, icon: React.ReactNode) => (
    <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 rounded-2xl shadow-xl border border-slate-800">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => onNavigate("home")}
          className="inline-flex items-center text-slate-300 hover:text-white mb-6 text-sm font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mt-2 text-slate-400 text-base sm:text-lg">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNavLinks = () => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-wrap gap-2 text-sm font-medium text-slate-600">
      <button
        onClick={() => onNavigate("privacy_policy")}
        className={`px-3 py-2 rounded-lg transition-colors ${view === "privacy_policy" ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-slate-50"}`}
      >
        Privacy Policy
      </button>
      <button
        onClick={() => onNavigate("terms")}
        className={`px-3 py-2 rounded-lg transition-colors ${view === "terms" ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-slate-50"}`}
      >
        Terms & Conditions
      </button>
      <button
        onClick={() => onNavigate("medical_disclaimer")}
        className={`px-3 py-2 rounded-lg transition-colors ${view === "medical_disclaimer" ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-slate-50"}`}
      >
        Medical Disclaimer
      </button>
      <button
        onClick={() => onNavigate("review_policy")}
        className={`px-3 py-2 rounded-lg transition-colors ${view === "review_policy" ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-slate-50"}`}
      >
        Review & Rating Policy
      </button>
      <button
        onClick={() => onNavigate("provider_verification_policy")}
        className={`px-3 py-2 rounded-lg transition-colors ${view === "provider_verification_policy" ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-slate-50"}`}
      >
        Verification Policy
      </button>
      <button
        onClick={() => onNavigate("editorial_policy")}
        className={`px-3 py-2 rounded-lg transition-colors ${view === "editorial_policy" ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-slate-50"}`}
      >
        Editorial Standards
      </button>
      <button
        onClick={() => onNavigate("about")}
        className={`px-3 py-2 rounded-lg transition-colors ${view === "about" || view === "mission" || view === "vision" || view === "core_values" ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-slate-50"}`}
      >
        About & Mission
      </button>
      <button
        onClick={() => onNavigate("contact")}
        className={`px-3 py-2 rounded-lg transition-colors ${view === "contact" ? "bg-teal-50 text-teal-700 font-semibold" : "hover:bg-slate-50"}`}
      >
        Contact Governance
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {renderNavLinks()}

      {/* PRIVACY POLICY */}
      {view === "privacy_policy" && (
        <div>
          {renderHeader("Privacy Policy & Data Security", "How we protect patient records, provider credentials, and platform integrity.", <Lock className="w-8 h-8" />)}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
              <Lock className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
              <p className="text-sm text-teal-900 font-medium">
                <strong>Data Minimization Commitment:</strong> We never sell patient data, medical inquiry logs, or contact records to third-party advertisers. All verification documents uploaded by providers are stored in encrypted private vaults with restricted access.
              </p>
            </div>

            <h3 className="text-xl font-bold text-slate-900">1. Information We Collect</h3>
            <p>
              We collect minimal required information to facilitate healthcare provider searches, appointment requests, and verified reviews:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Patient Profiles:</strong> Full name, phone number, email address, and appointment history.</li>
              <li><strong>Provider Profiles:</strong> Professional qualifications, registration numbers (e.g. State Medical Council / NMC), clinic address, consultation fees, and operational hours.</li>
              <li><strong>Verification Credentials:</strong> Medical registration certificates, clinical establishment licenses, government identification, and practice proof (accessible exclusively by authorized administrative moderators).</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900">2. PII Isolation & Secure Storage</h3>
            <p>
              Patient phone numbers and personal emails are kept isolated from public listing views. Direct phone or WhatsApp inquiries route through authenticated endpoints or masked referral triggers.
            </p>

            <h3 className="text-xl font-bold text-slate-900">3. Verification Document Vault</h3>
            <p>
              Documents submitted by healthcare practitioners for identity and license verification are stored with strict Attribute-Based Access Control (ABAC). Non-admin users cannot read or download medical registration certificates or government ID uploads of third parties.
            </p>

            <h3 className="text-xl font-bold text-slate-900">4. Patient Rights</h3>
            <p>
              Patients retain the right to request deletion of their account history, request export of appointment logs, or update their profile at any time via the User Portal.
            </p>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              Last updated: August 2026 | Effective for all Lucknow & Regional UP platform services.
            </div>
          </div>
        </div>
      )}

      {/* TERMS & CONDITIONS */}
      {view === "terms" && (
        <div>
          {renderHeader("Terms & Conditions of Service", "Rules governing platform usage for patients, healthcare providers, and clinics.", <Scale className="w-8 h-8" />)}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed">
            <h3 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h3>
            <p>
              By accessing this platform, whether as a patient seeking medical provider information or as a healthcare practitioner listing a practice, you agree to comply with these Terms & Conditions.
            </p>

            <h3 className="text-xl font-bold text-slate-900">2. Distinction Between Listing Approval & Verification</h3>
            <p>
              <strong>Approved Listing</strong> indicates that a provider's profile has been screened for basic directory completeness and public directory suitability. <strong>Verified Provider</strong> status is awarded only after manual document review of active medical registration numbers against state/national council directories.
            </p>

            <h3 className="text-xl font-bold text-slate-900">3. Patient Responsibilities</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Patients must provide accurate contact details when requesting OPD appointments.</li>
              <li>Reviews submitted by patients must represent authentic clinical interactions. Submitting paid, defamatory, or false reviews is strictly prohibited.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900">4. Provider Responsibilities</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providers are solely responsible for maintaining current medical council registrations and clinical licenses.</li>
              <li>Misrepresenting medical qualifications, experience years, or hospital affiliations will result in immediate profile suspension and governance flagging.</li>
            </ul>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              Governance Framework: Uttar Pradesh Clinical Establishments Act & NMC Ethics Regulations.
            </div>
          </div>
        </div>
      )}

      {/* MEDICAL DISCLAIMER */}
      {view === "medical_disclaimer" && (
        <div>
          {renderHeader("Medical Disclaimer & Emergency Guidance", "Important notice regarding online directory information and emergency medical care.", <AlertTriangle className="w-8 h-8 text-amber-400" />)}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed">
            <div className="p-5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-bold text-amber-900">Emergency Warning (Do Not Delay Emergency Care)</h4>
                <p className="mt-1 text-sm text-amber-800">
                  This platform is an informational directory and OPD appointment request scheduling tool. It is <strong>NOT an emergency response service</strong>. If you or someone near you is experiencing a medical emergency, severe chest pain, shortness of breath, acute trauma, or stroke symptoms, immediately dial <strong>112</strong> or proceed to the nearest emergency room.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900">1. No Doctor-Patient Relationship Created by Directory Browsing</h3>
            <p>
              Searching provider listings, viewing doctor profiles, or submitting an appointment request through this portal does not constitute a doctor-patient relationship or telemedicine consultation. A formal doctor-patient relationship is established only during actual physical or clinical consultation with the provider.
            </p>

            <h3 className="text-xl font-bold text-slate-900">2. Directory Content Integrity</h3>
            <p>
              While we make diligent efforts to verify credentials and maintain updated timings, medical treatment decisions should never be based solely on directory listings. Patients are encouraged to verify critical diagnosis plans during direct clinical consultation.
            </p>
          </div>
        </div>
      )}

      {/* REVIEW & RATING POLICY */}
      {view === "review_policy" && (
        <div>
          {renderHeader("Review & Rating Governance Policy", "Ensuring authentic, interaction-verified reviews while preventing spam and defamation.", <Award className="w-8 h-8" />)}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
              <p className="text-sm text-teal-900 font-medium">
                <strong>Verified Patient Review Badge:</strong> Reviews tagged with "Verified Patient Interaction" originate from patients with documented appointment records or verified consultation logs.
              </p>
            </div>

            <h3 className="text-xl font-bold text-slate-900">1. Verification Standard for Reviews</h3>
            <p>
              To maintain absolute authenticity and prevent competitor manipulation or fake review syndicates, our platform enforces multi-tiered review eligibility:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Verified Patient Reviews:</strong> Priority weighted. Submitted following an appointment booking or SMS/Email interaction code check.</li>
              <li><strong>Unverified Community Reviews:</strong> Subject to mandatory automated and manual content screening before public display.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900">2. Strict Anti-Abuse Standards</h3>
            <p>Reviews containing any of the following will be rejected or immediately removed:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Profanity, hate speech, or personal threats against medical staff.</li>
              <li>Unverified allegations of medical malpractice or criminal negligence (these must be filed through state medical councils).</li>
              <li>Commercial advertisements, spam links, or competitor promotion.</li>
              <li>Reviews posted by practitioners on their own profiles or paid agency accounts.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900">3. Provider Right to Response & Dispute Desk</h3>
            <p>
              Healthcare providers have the right to post a professional public reply to any review or flag inaccurate reviews for administrative dispute review. Reported reviews undergo audit within 48 hours.
            </p>
          </div>
        </div>
      )}

      {/* PROVIDER VERIFICATION POLICY */}
      {view === "provider_verification_policy" && (
        <div>
          {renderHeader("Provider Verification & Trust Standards", "Our multi-step verification protocol for doctors, clinics, and hospitals.", <ShieldCheck className="w-8 h-8 text-teal-400" />)}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2 py-1 rounded">Level 1</span>
                <h4 className="font-bold text-slate-900 mt-2">Approved Listing</h4>
                <p className="text-xs text-slate-600 mt-1">Profile satisfies basic directory completeness, location accuracy, and contact information.</p>
              </div>
              <div className="p-4 border border-teal-200 rounded-xl bg-teal-50">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-100 px-2 py-1 rounded">Level 2</span>
                <h4 className="font-bold text-teal-950 mt-2">Verified Provider Badge</h4>
                <p className="text-xs text-teal-800 mt-1">Medical Council registration or Clinical Establishment License manually audited against official state databases.</p>
              </div>
              <div className="p-4 border border-blue-200 rounded-xl bg-blue-50">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-2 py-1 rounded">Level 3</span>
                <h4 className="font-bold text-blue-950 mt-2">Verified Review Badges</h4>
                <p className="text-xs text-blue-800 mt-1">Patient reviews linked directly to documented consultation appointments.</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900">1. Verification Document Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Doctors:</strong> Valid State Medical Council or NMC Registration Certificate, Postgraduate Degree Verification, Government ID.</li>
              <li><strong>Clinics & Hospitals:</strong> State Clinical Establishment Registration License, Fire Safety/Pollution Control Approvals where required, Chief Medical Officer (CMO) NOC.</li>
              <li><strong>Diagnostic Labs:</strong> NABL / ICMR Accreditation details or Pathologist Registration credentials.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900">2. Periodic Renewal & Audit</h3>
            <p>
              Verification status is valid for 12 months or until medical registration renewal dates. Re-verification alerts are issued 30 days prior to license expiration.
            </p>
          </div>
        </div>
      )}

      {/* EDITORIAL STANDARDS */}
      {view === "editorial_policy" && (
        <div>
          {renderHeader("Editorial & Medical Accuracy Policy", "How we maintain medical accuracy in specialized articles and healthcare guides.", <BookOpen className="w-8 h-8" />)}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed">
            <h3 className="text-xl font-bold text-slate-900">1. Medical Reviewer Oversight</h3>
            <p>
              All patient education articles, health guides, and specialty treatment descriptions published on this portal are authored or medically reviewed by certified healthcare practitioners holding recognized postgraduate medical degrees (MD, MS, DM, MCh, MDS).
            </p>

            <h3 className="text-xl font-bold text-slate-900">2. Independence & Commercial Neutrality</h3>
            <p>
              Health information is published purely for public awareness. Article content is never dictated or influenced by pharmaceutical sponsors, medical device distributors, or paid clinic promotions.
            </p>
          </div>
        </div>
      )}

      {/* ABOUT, MISSION, VISION, VALUES */}
      {(view === "about" || view === "mission" || view === "vision" || view === "core_values") && (
        <div>
          {renderHeader("About Our Healthcare Trust Platform", "Connecting Lucknow & Regional UP patients with verified doctors, clinics, and hospitals.", <Building2 className="w-8 h-8" />)}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 bg-teal-50 rounded-xl border border-teal-100 text-center">
                <HeartPulse className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900">Our Mission</h4>
                <p className="text-sm text-slate-600 mt-2">To empower every patient with transparent, verified, and accessible healthcare provider choices across Lucknow.</p>
              </div>
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900">Our Vision</h4>
                <p className="text-sm text-slate-600 mt-2">To establish the gold standard for regional healthcare governance, trust signals, and patient choice in Northern India.</p>
              </div>
              <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900">Core Values</h4>
                <p className="text-sm text-slate-600 mt-2">Authenticity, Medical Ethics, Patient Autonomy, and Zero Tolerance for Fake Reviews.</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Serving Lucknow & Regional Uttar Pradesh</h3>
              <p>
                Founded to bridge the information gap in regional healthcare discovery, our platform provides comprehensive listings across major Lucknow zones including Gomti Nagar, Hazratganj, Indira Nagar, Aliganj, Ashiyana, Alambagh, Rajajipuram, Jankipuram, and Mahanagar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT GOVERNANCE DESK */}
      {view === "contact" && (
        <div>
          {renderHeader("Contact Governance & Support Desk", "Reach our administrative verification team, report profile issues, or seek assistance.", <Mail className="w-8 h-8" />)}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Administrative Offices</h3>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900">Lucknow Operations Desk</h4>
                    <p className="text-sm text-slate-600">Patrakar Puram Chauraha, Gomti Nagar, Lucknow, Uttar Pradesh - 226010</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900">Governance & Verification Email</h4>
                    <p className="text-sm text-teal-700 font-medium">verification@lucknowhealthtrust.org</p>
                    <p className="text-xs text-slate-500">For credential submissions and dispute reviews</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900">Helpline Phone</h4>
                    <p className="text-sm text-slate-800 font-medium">+91 522 400 8900 / +91 94150 12345</p>
                    <p className="text-xs text-slate-500">Mon - Sat: 9:30 AM to 6:30 PM IST</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Send Governance Notice or Report</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert("Governance report submitted. Our team will review within 24 hours."); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Your Name</label>
                    <input type="text" required placeholder="Full Name" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email or Phone</label>
                    <input type="text" required placeholder="contact@domain.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Inquiry Type</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option>Provider Credential Verification Status</option>
                      <option>Report Fraudulent / Unregistered Profile</option>
                      <option>Dispute Inaccurate Review or Rating</option>
                      <option>General Patient Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Message Details</label>
                    <textarea rows={3} required placeholder="Provide specifics..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm">
                    Submit Governance Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyPages;
