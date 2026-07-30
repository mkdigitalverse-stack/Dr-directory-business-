import React from "react";
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  Microscope, 
  FileCheck, 
  Lock, 
  Activity,
  HeartPulse,
  Stethoscope
} from "lucide-react";

export interface TrustSeal {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  authority: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeTag: string;
}

export const MEDICAL_SEALS: TrustSeal[] = [
  {
    id: "nmc-verified",
    code: "NMC / UPMC Vetted",
    title: "NMC Registered Physicians",
    subtitle: "Every doctor is verified against National Medical Commission & UP Medical Council databases.",
    authority: "National Medical Commission",
    icon: <Stethoscope className="w-6 h-6 text-teal-600" />,
    bgColor: "bg-teal-50/70",
    borderColor: "border-teal-200/80",
    textColor: "text-teal-950",
    badgeTag: "License Verified"
  },
  {
    id: "nabh-hospital",
    code: "NABH Accredited",
    title: "NABH Quality Hospitals",
    subtitle: "Hospital partners adhere to National Accreditation Board for Hospitals clinical standards.",
    authority: "Quality Council of India",
    icon: <Building2 className="w-6 h-6 text-indigo-600" />,
    bgColor: "bg-indigo-50/70",
    borderColor: "border-indigo-200/80",
    textColor: "text-indigo-950",
    badgeTag: "Hospital Audit"
  },
  {
    id: "nabl-lab",
    code: "NABL Certified",
    title: "NABL Pathology Labs",
    subtitle: "Diagnostic centers comply with NABL calibration standards for accurate blood & bio-testing.",
    authority: "NABL India",
    icon: <Microscope className="w-6 h-6 text-sky-600" />,
    bgColor: "bg-sky-50/70",
    borderColor: "border-sky-200/80",
    textColor: "text-sky-950",
    badgeTag: "Lab Standard"
  },
  {
    id: "abdm-privacy",
    code: "ABDM Compliant",
    title: "Ayushman Bharat Digital",
    subtitle: "Encrypted booking logs & consent-driven records adhering to Ayushman Bharat digital privacy.",
    authority: "National Health Authority",
    icon: <Lock className="w-6 h-6 text-emerald-600" />,
    bgColor: "bg-emerald-50/70",
    borderColor: "border-emerald-200/80",
    textColor: "text-emerald-950",
    badgeTag: "256-Bit Encrypted"
  },
  {
    id: "iso-audit",
    code: "ISO 9001:2015",
    title: "Physical Audit Protocol",
    subtitle: "Lucknow Healthcare Directory teams inspect physical OPD setups, equipment & operating hours.",
    authority: "Directory Quality Wing",
    icon: <FileCheck className="w-6 h-6 text-amber-600" />,
    bgColor: "bg-amber-50/70",
    borderColor: "border-amber-200/80",
    textColor: "text-amber-950",
    badgeTag: "Field Audited"
  },
  {
    id: "lma-partner",
    code: "LMA Directory Network",
    title: "Lucknow Medical Network",
    subtitle: "Direct partnership with Lucknow Medical Association for verified practitioner listings.",
    authority: "Lucknow Med Network",
    icon: <Award className="w-6 h-6 text-purple-600" />,
    bgColor: "bg-purple-50/70",
    borderColor: "border-purple-200/80",
    textColor: "text-purple-950",
    badgeTag: "Certified Partner"
  }
];

export default function TrustAndVerificationSeals() {
  return (
    <section id="trusted-medical-seals" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1.5 rounded-full border border-teal-400/30">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Verified Healthcare Quality Standards</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trusted Accreditation Seals & Practitioner Verification
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Lucknow Healthcare Directory maintains strict verification protocols across every doctor, clinic, hospital, and diagnostic laboratory listed on our platform.
          </p>
        </div>

        {/* Seals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MEDICAL_SEALS.map((seal) => (
            <div 
              key={seal.id}
              className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 p-5 rounded-2xl transition-all duration-200 flex items-start gap-4 shadow-sm group"
            >
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 shrink-0 group-hover:scale-105 transition-transform">
                {seal.icon}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest">
                    {seal.code}
                  </span>
                  <span className="text-[9px] font-bold bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800/60 uppercase">
                    {seal.badgeTag}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                  {seal.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {seal.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <CheckCircle2 className="w-3 w-3 text-emerald-400 shrink-0" />
                  <span>Authority: {seal.authority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Disclaimer / Policy Note */}
        <div className="mt-8 bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              <strong>Medical Verification Assurance:</strong> All practitioner registration numbers (NMC / UPMC) are validated through official council registries. Directory badges certify physical facility existence & medical license active status.
            </span>
          </div>
          <span className="text-[10px] text-teal-400/90 font-mono shrink-0 uppercase tracking-wider bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            • Policy Compliant Directory
          </span>
        </div>

      </div>
    </section>
  );
}
