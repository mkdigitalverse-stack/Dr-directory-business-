import { 
  ShieldCheck, Activity, Target, Compass, Award, CheckCircle, 
  HelpCircle, Mail, MapPin, Phone, Users, Landmark, Flame 
} from "lucide-react";
import { ViewState } from "../types";

interface AboutViewProps {
  onNavigate: (view: ViewState) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div id="about-view" className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-slate-500 font-sans flex items-center gap-1.5 flex-wrap">
          <span className="hover:text-teal-600 cursor-pointer" onClick={() => onNavigate("home")}>Home</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold">About Platform</span>
        </div>

        {/* 1. Hero Banner */}
        <div className="bg-gradient-to-br from-teal-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center space-y-4 border border-teal-950 shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.2),transparent_40%)]"></div>
          <span className="inline-block bg-teal-500/15 border border-teal-400/20 text-teal-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            A trusted medical directory
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            Connecting Lucknow Citizens with Vetted Medical Experts
          </h1>
          <p className="text-sm sm:text-base text-teal-200 max-w-2xl mx-auto leading-relaxed font-sans">
            We are creating India's strongest local healthcare authority. Starting with Lucknow, Uttar Pradesh, we ensure 100% transparency, active credential validation, and frictionless booking.
          </p>
        </div>

        {/* 2. Our Story, Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-3 text-left">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl w-12 h-12 flex items-center justify-center">
              <Compass className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Our Story</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Finding reliable healthcare online in Uttar Pradesh used to require sifting through sponsored ads and paid listings. We built LKOHEALTH to serve as a pure, objective discovery engine backed by physical and professional registry checks.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-3 text-left">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-12 h-12 flex items-center justify-center">
              <Target className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Our core mission is to eradicate local healthcare discoverability issues. By maintaining complete up-to-date registry lists, landmarks, fees, and patient audits, patients book calls with absolute confidence.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-3 text-left">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl w-12 h-12 flex items-center justify-center">
              <Award className="h-6 w-6 stroke-[2]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We are scaling our technology architecture nationwide. Our system is engineered specifically to support Country → State → City → Locality routing, preparing for expansion across every city in India.
            </p>
          </div>

        </div>

        {/* 3. The 100% Automated Credential Verification Process */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 text-left space-y-6">
          <div className="space-y-2">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-teal-600">Verification Blueprint</span>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">
              Our Multi-Step Medical Council Verification Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              To earn our blue Verified Badge, every physician and facility must successfully transition through our licensing filter:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 font-sans">
            {[
              { step: "01", title: "Registration Upload", desc: "Provider uploads their MCI/NMC state medical registration number and credentials certificate." },
              { step: "02", title: "Council Cross-Check", desc: "Our system automatedly scans official NMC registries and State Medical Council directories to match registration entries." },
              { step: "03", title: "Physical Location Check", desc: "Our local Lucknow ground verification partners audit coordinates, landmarks, and clinic facility details." },
              { step: "04", title: "Blue Badge Authorized", desc: "Once matches are successfully certified, the blue verification seal and Google Local SEO schema tags are deployed." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-3 relative">
                <span className="text-4xl font-extrabold text-teal-100 select-none font-mono">
                  {item.step}
                </span>
                <h4 className="font-extrabold text-slate-800 text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Core Values */}
        <div className="space-y-6 text-left">
          <h2 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
            {[
              { title: "Patient-First Integrity", desc: "We prioritize patient safety and objective rating over directory advertisement placements. Bad reviews cannot be paid off." },
              { title: "Medical Authority Standards", desc: "We respect medical credentials. Our listings enforce NMC registry crosschecks to keep fake therapists out." },
              { title: "Local SEO Amplification", desc: "We give Lucknow clinics maximum local visibility. Outranking generic directories with rich schema architecture is our standard." },
              { title: "Frictionless Healthcare", desc: "Booking appointment enquiries takes 3 clicks. We protect user privacy and avoid annoying spam telemarketing calls." }
            ].map((v, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex gap-4 items-start shadow-xs">
                <CheckCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-850 text-sm">{v.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Quick Contact Form info */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 justify-between items-center text-left">
          <div className="space-y-3">
            <h3 className="font-sans font-extrabold text-lg sm:text-xl">Are you a clinic administrator or doctor in Lucknow?</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-lg leading-relaxed">
              Join thousands of clinical practitioners on Uttar Pradesh's fastest-growing healthcare discovery ecosystem. Set up your SEO-rich metadata tags today.
            </p>
          </div>
          <button 
            onClick={() => onNavigate("dashboard")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-sans text-sm font-bold px-6 py-3.5 rounded-xl whitespace-nowrap transition-all shadow-md cursor-pointer shrink-0"
          >
            Claim &amp; List Your Practice
          </button>
        </div>

      </div>
    </div>
  );
}
