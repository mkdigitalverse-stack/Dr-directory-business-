import { Activity, Mail, Phone, MapPin, Heart, ArrowUpRight } from "lucide-react";
import { ViewState, ProviderType } from "../types";

interface FooterProps {
  onNavigate: (view: ViewState) => void;
  onSelectCategory: (type: ProviderType | "all") => void;
  onSearchSpecialty: (spec: string) => void;
  onSearchLocality: (loc: string) => void;
}

export default function Footer({ onNavigate, onSelectCategory, onSearchSpecialty, onSearchLocality }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-400 border-t border-slate-800">
      {/* Top Footer: Brand, Specialities, Localities, Resources */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate("home")}>
              <div className="bg-teal-600 p-2 rounded-lg text-white shadow-lg">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-sans font-extrabold text-lg sm:text-xl text-white tracking-tight">
                LKO<span className="text-teal-500">HEALTH</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier, verified local healthcare directory and digital discovery engine for Lucknow, Uttar Pradesh. Enabling patients to securely discover clinics, doctors, and hospitals.
            </p>
            <div className="space-y-2.5 font-sans text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                <span>+91-522-3549210 (Lucknow Helpline)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                <span>support@lucknow.healthcare.directory</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Halwasiya Court, Hazratganj, Lucknow, UP 226001</span>
              </div>
            </div>
          </div>

          {/* Specialties Col */}
          <div>
            <h3 className="font-sans font-bold text-xs text-slate-200 uppercase tracking-wider mb-4">Browse Specialties</h3>
            <ul className="space-y-2.5 text-xs">
              {["Cardiology", "Dentistry", "Gynecology", "Orthopedics", "Dermatology", "Pediatrics"].map((spec) => (
                <li key={spec}>
                  <button
                    onClick={() => onSearchSpecialty(spec)}
                    className="hover:text-teal-400 hover:translate-x-1 transition-all flex items-center gap-1 cursor-pointer text-left"
                  >
                    {spec}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Localities Col */}
          <div>
            <h3 className="font-sans font-bold text-xs text-slate-200 uppercase tracking-wider mb-4">Lucknow Localities</h3>
            <ul className="space-y-2.5 text-xs">
              {["Gomti Nagar", "Indira Nagar", "Hazratganj", "Aliganj", "Ashiyana", "Alambagh"].map((loc) => (
                <li key={loc}>
                  <button
                    onClick={() => onSearchLocality(loc)}
                    className="hover:text-teal-400 hover:translate-x-1 transition-all text-left cursor-pointer"
                  >
                    Doctors in {loc}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Col */}
          <div>
            <h3 className="font-sans font-bold text-xs text-slate-200 uppercase tracking-wider mb-4">Healthcare Categories</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onSelectCategory(ProviderType.DOCTOR)} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                  Find Trusted Doctors
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory(ProviderType.CLINIC)} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                  Specialist Clinics
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory(ProviderType.HOSPITAL)} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                  Emergency Hospitals
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory(ProviderType.LAB)} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                  Diagnostic Pathology Labs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                  How We Verify Credentials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("dashboard")} className="hover:text-teal-400 transition-colors cursor-pointer text-left text-teal-400 font-semibold">
                  Provider Registration
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="border-t border-slate-800 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-slate-400">
            <p className="font-mono text-slate-500">
              &copy; {currentYear} LKOHEALTH Directory.
            </p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Website Created By</span>
              <a 
                href="https://www.mkdigitalverse.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-teal-400 hover:text-teal-300 font-bold hover:underline transition-colors flex items-center gap-1"
              >
                <span>MK Digitalverse</span>
                <span className="text-slate-500 font-normal text-[10px]">(www.mkdigitalverse.in)</span>
                <ArrowUpRight className="h-3 w-3 text-teal-400" />
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <button onClick={() => onNavigate("privacy_policy")} className="hover:text-slate-300 transition-colors text-left cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate("terms")} className="hover:text-slate-300 transition-colors text-left cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => onNavigate("medical_disclaimer")} className="hover:text-slate-300 transition-colors text-left cursor-pointer">
              Medical Disclaimer
            </button>
            <button onClick={() => onNavigate("review_policy")} className="hover:text-slate-300 transition-colors text-left cursor-pointer">
              Review Policy
            </button>
            <button onClick={() => onNavigate("provider_verification_policy")} className="hover:text-slate-300 transition-colors text-left cursor-pointer">
              Verification Policy
            </button>
            <button onClick={() => onNavigate("editorial_policy")} className="hover:text-slate-300 transition-colors text-left cursor-pointer">
              Editorial Policy
            </button>
            <button onClick={() => onNavigate("contact")} className="hover:text-slate-300 transition-colors text-left cursor-pointer">
              Contact Governance
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
