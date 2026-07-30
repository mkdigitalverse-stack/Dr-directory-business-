import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

export interface AdSlide {
  title: string;
  subtitle: string;
  badge: string;
  bgImage: string;
  color: string;
}

// 1. Specialty Ads Slides (5)
export const SPECIALTY_ADS: AdSlide[] = [
  {
    title: "Lucknow Cardiology Super-Specialty OPD Sessions Scheduled This Week",
    subtitle: "Immediate consultation slots with Lucknow's senior-most cardiologists. Pre-book to skip waiting rooms and optimize consult pathways.",
    badge: "Cardiology Spotlight",
    bgImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800&auto=format&fit=crop",
    color: "from-blue-950/90 to-slate-950/95"
  },
  {
    title: "Monsoon Season Pediatric Health Camps",
    subtitle: "Protect your children from seasonal pathogens & respiratory vector threats. Free pediatric wellness guides & immunization checklists.",
    badge: "Pediatrics Campaign",
    bgImage: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop",
    color: "from-teal-950/90 to-slate-950/95"
  },
  {
    title: "Bone Density & Spine Screenings at Aliganj Clinics",
    subtitle: "Lucknow Orthopedic Association wellness drive: Vetted physical therapy assessments with high-end diagnostic sensors.",
    badge: "Orthopedics Drive",
    bgImage: "https://images.unsplash.com/photo-1579153138244-3917a00b01d7?q=80&w=800&auto=format&fit=crop",
    color: "from-emerald-950/90 to-slate-950/95"
  },
  {
    title: "Gastroenterology Diagnostic Pipelines Now Active",
    subtitle: "Comprehensive metabolic screening panels for ultimate digestive wellness. Access fully verified clinical centers in Hazratganj.",
    badge: "Gastroenterology Special",
    bgImage: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=800&auto=format&fit=crop",
    color: "from-cyan-950/90 to-slate-950/95"
  },
  {
    title: "Advanced Laser Aesthetic & Complex Skin Care Solutions",
    subtitle: "Clinical skin consultations for persistent dermatological conditions. Meet verified specialist dermatologists with modern clinics.",
    badge: "Dermatology Elite",
    bgImage: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop",
    color: "from-indigo-950/90 to-slate-950/95"
  }
];

// 2. Doctor Ads Slides (5)
export const DOCTOR_ADS: AdSlide[] = [
  {
    title: "NMC Vetted Surgical Pioneers on Active Duty",
    subtitle: "Connect with certified surgical specialists in Lucknow. Get direct second opinions, clinical guidance and fast-track evaluations.",
    badge: "Surgical Expert Spotlight",
    bgImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
    color: "from-teal-950/90 to-slate-950/95"
  },
  {
    title: "Premium Orthodontic & Dental Care Consultations",
    subtitle: "Pre-book diagnostic appointments at Dr. Alok Dubey's verified Lucknow dental rooms for pain-free orthodontic corrections.",
    badge: "Dentistry Excellence",
    bgImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop",
    color: "from-sky-950/90 to-slate-950/95"
  },
  {
    title: "Verified Maternal & Prenatal Care Specialist OPDs",
    subtitle: "Advanced gynecology guidance, fetal development scans, and holistic maternal healthcare checklists in Gomti Nagar.",
    badge: "Maternal Wellness Center",
    bgImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
    color: "from-rose-950/90 to-slate-950/95"
  },
  {
    title: "Clinical Neurologists & Brain Health Diagnostics",
    subtitle: "Vetted consult paths for chronic migraines, nerve conductivity blocks, and advanced sleep-resilience support.",
    badge: "Neurology Special",
    bgImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    color: "from-purple-950/90 to-slate-950/95"
  },
  {
    title: "Premium Endocrine & Diabetology Consult Chairs",
    subtitle: "Keep your blood sugars stable. Browse specialist lists in Indira Nagar for personalized nutritional and medical planning.",
    badge: "Diabetes Care Spotlight",
    bgImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
    color: "from-amber-950/90 to-slate-950/95"
  }
];

// 3. Clinic Ads Slides (5)
export const CLINIC_ADS: AdSlide[] = [
  {
    title: "Advanced Multidisciplinary Daycare OPDs in Gomti Nagar",
    subtitle: "Skip high hospital admission overheads. Get treated at state-of-the-art diagnostic clinics with instant verification.",
    badge: "Gomti Nagar Daycare",
    bgImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop",
    color: "from-teal-950/90 to-slate-950/95"
  },
  {
    title: "Hazratganj Multi-Specialty Clinical Rooms",
    subtitle: "Optimized patient care schedules. Walk in with fully digital pre-checked appointment slips to avoid waiting.",
    badge: "Hazratganj Premium",
    bgImage: "https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=800&auto=format&fit=crop",
    color: "from-emerald-950/90 to-slate-950/95"
  },
  {
    title: "Indira Nagar Dental & Maxillofacial Daycare Facilities",
    subtitle: "Vetted pediatric dental extractions, deep scaling, root canals, and cosmetic dental restorations.",
    badge: "Clinical Dentistry",
    bgImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop",
    color: "from-cyan-950/90 to-slate-950/95"
  },
  {
    title: "Vikas Nagar Laser Vision Care & Retinal Mapping",
    subtitle: "Highly accurate digital eye pressure tests, advanced cataract consultations, and corrective laser planning.",
    badge: "Vision Care Elite",
    bgImage: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=800&auto=format&fit=crop",
    color: "from-blue-950/90 to-slate-950/95"
  },
  {
    title: "Aliganj Physiotherapy & Active Posture Recovery",
    subtitle: "Advanced spinal rehabilitation, targeted muscle strengthening, and professional sports physical therapy.",
    badge: "Physical Therapy Care",
    bgImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    color: "from-indigo-950/90 to-slate-950/95"
  }
];

// 4. Hospital Ads Slides (5)
export const HOSPITAL_ADS: AdSlide[] = [
  {
    title: "24/7 emergency Trauma Care & Vetted ICU Beds",
    subtitle: "Instant ambulances, expert critical care specialists, and emergency cardiac monitoring on permanent standby.",
    badge: "24/7 Trauma Emergency",
    bgImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    color: "from-rose-950/90 to-slate-950/95"
  },
  {
    title: "Hazratganj Multi-Specialty Critical Care Wings",
    subtitle: "Equipped with advanced telemetry networks, verified critical infrastructure status, and round-the-clock nursing.",
    badge: "Superspecialty Hospital",
    bgImage: "https://images.unsplash.com/photo-1516613902344-03c7f1be7f42?q=80&w=800&auto=format&fit=crop",
    color: "from-slate-950/95 to-teal-950/90"
  },
  {
    title: "Lucknow Post-Operative Rehabilitation Programs",
    subtitle: "Providing specialized clinical care, comprehensive post-surgical physical therapy, and nutrition planning.",
    badge: "Post-Operative Recovery",
    bgImage: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
    color: "from-amber-950/90 to-slate-950/95"
  },
  {
    title: "Lucknow Pediatric ICUs & Neonatal Critical Care",
    subtitle: "NMC validated neonatological clinical teams. High care environment for pediatric and infant health emergencies.",
    badge: "Pediatric Emergency Unit",
    bgImage: "https://images.unsplash.com/photo-1502740479796-5197713af7ff?q=80&w=800&auto=format&fit=crop",
    color: "from-indigo-950/90 to-slate-950/95"
  },
  {
    title: "Superspecialty Cardiac Cath Labs & Heart Operation Theatres",
    subtitle: "Verified structural readiness, active cardiac surgeons lists, and state-of-the-art interventional suites.",
    badge: "Cardiology Cath Lab",
    bgImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
    color: "from-cyan-950/90 to-slate-950/95"
  }
];

// 5. Diagnostic Pathology Lab Ads Slides (5)
export const LAB_ADS: AdSlide[] = [
  {
    title: "Free Certified Home Sample Collection in 45 Minutes",
    subtitle: "Safe and hygienic blood collection by NABL-trained phlebotomists. Instant digital dispatch of pathology reports.",
    badge: "Pathology Labs Spotlight",
    bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    color: "from-teal-950/90 to-slate-950/95"
  },
  {
    title: "Complete Metabolic Profile & Diabetes HbA1c Pathology Screens",
    subtitle: "Vetted molecular diagnostics with digital reporting dispatched directly to your health wallet within 6 hours.",
    badge: "NABL Certified Laboratories",
    bgImage: "https://images.unsplash.com/photo-1579153138244-3917a00b01d7?q=80&w=800&auto=format&fit=crop",
    color: "from-cyan-950/90 to-slate-950/95"
  },
  {
    title: "Lucknow City Diagnostic Drive: Comprehensive Health Screenings",
    subtitle: "Enjoy massive savings of up to 60% on lipid markers, thyroid panels, and renal chemistry with certified local labs.",
    badge: "Diagnostic Campaign",
    bgImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    color: "from-emerald-950/90 to-slate-950/95"
  },
  {
    title: "Certified Preventive Health Biochemistry Passes",
    subtitle: "Identify early clinical markers for vitamin D3, vitamin B12, liver metabolism, and cardiac inflammation factors.",
    badge: "Preventive Pathology",
    bgImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
    color: "from-indigo-950/90 to-slate-950/95"
  },
  {
    title: "Post-Viral Pulmonary Assessment Profiles",
    subtitle: "Comprehensive screening including oxygen transport variables, blood counts, and arterial clinical indexes.",
    badge: "Pulmonary Pathologies",
    bgImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
    color: "from-blue-950/90 to-slate-950/95"
  }
];

// 6. Locality Ads Slides (5)
export const LOCALITY_ADS: AdSlide[] = [
  {
    title: "Verified Gomti Nagar Clinical Outposts Now Online",
    subtitle: "Skip Lucknow's peak traffic. Connect instantly with verified consultants right inside Gomti Nagar extension.",
    badge: "Gomti Nagar Locality Focus",
    bgImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    color: "from-teal-950/90 to-slate-950/95"
  },
  {
    title: "Hazratganj Specialty Ward Diagnostic Facilities",
    subtitle: "Access high-end molecular labs, digital X-rays, and physical consultation suites in the central heart of Lucknow.",
    badge: "Hazratganj Ward Spotlight",
    bgImage: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=800&auto=format&fit=crop",
    color: "from-emerald-950/90 to-slate-950/95"
  },
  {
    title: "Indira Nagar Immediate Consultation OPD Chairs",
    subtitle: "Connecting you with local dentists, pediatricians, and orthopedic consultants. Book safe, pre-vetted local slots.",
    badge: "Indira Nagar Ward Focus",
    bgImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop",
    color: "from-cyan-950/90 to-slate-950/95"
  },
  {
    title: "Aliganj Community Pediatricians & Maternal Care Clinics",
    subtitle: "Vetted pediatric care and family health centers. Safe consult zones with direct medical license verification.",
    badge: "Aliganj Ward Special",
    bgImage: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop",
    color: "from-rose-950/90 to-slate-950/95"
  },
  {
    title: "Alambagh Orthopedics & Specialized Physical Therapy Hubs",
    subtitle: "Vetted clinic setups equipped with spine decompressive sensors and active physical rehabilitation teams.",
    badge: "Alambagh Ward Spotlight",
    bgImage: "https://images.unsplash.com/photo-1579153138244-3917a00b01d7?q=80&w=800&auto=format&fit=crop",
    color: "from-indigo-950/90 to-slate-950/95"
  }
];

interface CategoryAdSliderProps {
  slides: AdSlide[];
  onActionClick?: () => void;
  ctaText?: string;
}

export function CategoryAdSlider({ slides, onActionClick, ctaText = "Book Free Consult Inquiry" }: CategoryAdSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000); // 6s rotation
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="mb-8 relative rounded-3xl overflow-hidden min-h-[160px] sm:min-h-[190px] shadow-lg border border-teal-500/10 flex flex-col justify-center p-5 sm:p-8 transition-all duration-500 select-none bg-[#030c0a]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={slides[activeIndex].bgImage}
          alt={slides[activeIndex].title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-[0.3] transition-all duration-700 scale-102"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slides[activeIndex].color} opacity-90`}></div>
      </div>

      {/* Content Info */}
      <div className="relative z-10 max-w-2xl space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="bg-teal-500/25 text-teal-300 text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-teal-400/20 uppercase tracking-widest">
            📢 LKO SPONSOR INFO
          </span>
          <span className="text-emerald-400 font-mono text-[9px] font-extrabold uppercase tracking-wide">
            • {slides[activeIndex].badge}
          </span>
        </div>
        <h4 className="font-display font-extrabold text-sm sm:text-lg text-white tracking-tight leading-snug animate-fadeIn">
          {slides[activeIndex].title}
        </h4>
        <p className="text-[11px] text-slate-300 leading-relaxed font-sans line-clamp-2 max-w-xl animate-fadeIn">
          {slides[activeIndex].subtitle}
        </p>
        
        <div className="flex items-center gap-4 pt-1">
          {onActionClick ? (
            <button
              onClick={onActionClick}
              className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold py-2 px-4 rounded-lg transition-all cursor-pointer active:scale-97 shadow-md shadow-teal-500/10"
            >
              {ctaText} →
            </button>
          ) : (
            <span className="text-[10px] text-teal-400/90 font-semibold uppercase tracking-wider bg-teal-950/80 px-2 py-1 rounded border border-teal-900/50">
              ⚡ Verified Medical Sponsor
            </span>
          )}
          <span className="text-[9px] text-slate-500 font-mono hidden sm:inline">Active Lucknow Clinical Seat Reservation</span>
        </div>
      </div>

      {/* Manual Indicators */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-20">
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)}
          className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white transition-all cursor-pointer w-6 h-6 flex items-center justify-center border border-slate-700/30"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
              activeIndex === idx ? "bg-teal-400 w-4" : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Ad slide ${idx + 1}`}
          ></button>
        ))}
        <button
          onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
          className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white transition-all cursor-pointer w-6 h-6 flex items-center justify-center border border-slate-700/30"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
