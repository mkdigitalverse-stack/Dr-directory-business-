import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Star, 
  Award, 
  MapPin, 
  Search,
  Stethoscope,
  Building2,
  Hospital as HospitalIcon,
  FlaskConical,
  Calendar,
  ShieldCheck,
  Clock,
  Languages
} from "lucide-react";
import { Provider, ProviderType, HealthPackage, Article, ViewState, SearchParams } from "../types";
import { CategoryAdSlider, SPECIALTY_ADS, DOCTOR_ADS, CLINIC_ADS, HOSPITAL_ADS, LAB_ADS, LOCALITY_ADS } from "./CategoryAdSlider";
import MedicalAvatar from "./MedicalAvatar";

interface HomeViewProps {
  providers: Provider[];
  packages: HealthPackage[];
  articles: Article[];
  onSearch: (params: Partial<SearchParams>) => void;
  onNavigate: (view: ViewState) => void;
  onSelectProvider: (id: string) => void;
  onBookAppointment: (provider: Provider) => void;
}

// 48 Popular Areas in Lucknow for rich local SEO & interactive exploration
const LUCKNOW_AREAS = [
  "Gomti Nagar", "Gomti Nagar Extension", "Indira Nagar", "Hazratganj", "Aliganj",
  "Alambagh", "Ashiyana", "Rajajipuram", "Jankipuram", "Mahanagar",
  "Vikas Nagar", "Chowk", "Charbagh", "Aminabad", "Kaiserbagh",
  "Nishatganj", "Kapoorthala", "Faizabad Road", "Sitapur Road", "Kursi Road",
  "Sushant Golf City", "Vrindavan Yojana", "Telibagh", "Cantt", "Butler Colony",
  "Chinhat", "Matiyari", "Transport Nagar", "Sarojini Nagar", "LDA Colony",
  "Aishbagh", "Talkatora", "Thakurganj", "Daliganj", "Khurram Nagar",
  "Madiyaon", "IIM Road", "Bakshi Ka Talab", "Mohanlalganj", "Kakori",
  "Dubagga", "Para", "Balaganj", "RDSO Colony", "Vikrant Khand",
  "Viram Khand", "Vineet Khand", "Sharda Nagar"
];

// Specialties with associated emojis ("fevicons")
const SPECIALTIES_LIST = [
  { name: "General Physician", emoji: "🩺", desc: "Primary care, seasonal viral, chest care" },
  { name: "Dentist", emoji: "🦷", desc: "RCT, Dental Implants, scaling, braces" },
  { name: "Gynecologist", emoji: "🤰", desc: "Pregnancy, prenatal care, PCOS, IVF" },
  { name: "Orthopedic", emoji: "🦴", desc: "Joint pain, fractures, spine care" },
  { name: "Cardiologist", emoji: "❤️", desc: "Heart failure, blood pressure, ECG" },
  { name: "Dermatologist", emoji: "🧴", desc: "Acne, eczema, laser skin therapy" },
  { name: "Neurologist", emoji: "🧠", desc: "Migraine, spine issues, nerve therapy" },
  { name: "ENT", emoji: "👂", desc: "Ear pain, sinus issues, throat infection" },
  { name: "Pediatrician", emoji: "👶", desc: "Child vaccination, newborn triage" },
  { name: "Psychiatrist", emoji: "💭", desc: "Anxiety, depression, CBT counseling" },
  { name: "Urologist", emoji: "🚽", desc: "Kidney stones, urinary health checks" },
  { name: "Oncologist", emoji: "🎗️", desc: "Cancer screenings, oncology care" },
  { name: "Pulmonologist", emoji: "🫁", desc: "Asthma, COPD, lung diagnostics" },
  { name: "Physiotherapist", emoji: "🧘", desc: "Post-surgery rehab, back pain relief" },
  { name: "Ophthalmologist", emoji: "👁️", desc: "Eye cataract, Lasik, prescription lenses" },
  { name: "IVF Specialist", emoji: "🧪", desc: "Infertility consulting, embryology" },
  { name: "Gastroenterologist", emoji: "🍏", desc: "Acid reflux, liver, IBS diagnostics" },
  { name: "Endocrinologist", emoji: "🩸", desc: "Diabetes care, thyroid management" },
  { name: "Nephrologist", emoji: "🩺", desc: "Kidney dialysis, renal health parameters" },
  { name: "Radiologist", emoji: "🩻", desc: "Ultrasound, MRI, CT scanning, X-ray" }
];

const POPULAR_TREATMENTS = [
  { name: "Dental Implant", emoji: "🦷" },
  { name: "Root Canal", emoji: "🦷" },
  { name: "IVF", emoji: "🧪" },
  { name: "Pregnancy Care", emoji: "🤰" },
  { name: "Hair Transplant", emoji: "💇‍♂️" },
  { name: "LASIK", emoji: "👁️" },
  { name: "Diabetes Care", emoji: "🩸" },
  { name: "Heart Surgery", emoji: "❤️" },
  { name: "Knee Replacement", emoji: "🦴" },
  { name: "Cataract", emoji: "👁️" },
  { name: "Skin Treatment", emoji: "🧴" },
  { name: "Weight Loss", emoji: "🏃‍♀️" }
];

const PATIENT_TESTIMONIALS = [
  {
    quote: "Finding a verified cardiologist in Indira Nagar during late evening was stress-free with LKOHEALTH. The NMC registration check gave us complete peace of mind.",
    author: "Shyamal K. Srivastav",
    role: "Retd. Railway Officer",
    locality: "Indira Nagar, Lucknow",
    rating: 5,
    avatar: "👨"
  },
  {
    quote: "The home blood collection booked through LKOHEALTH's Full Body Screening package was handled by certified professionals. Reports came on my WhatsApp in 8 hours!",
    author: "Pooja Agnihotri",
    role: "IT Consultant",
    locality: "Gomti Nagar, Lucknow",
    rating: 5,
    avatar: "👩"
  },
  {
    quote: "I compared fees and availability for pediatricians near Hazratganj, booked a virtual call and got my baby's prescription within an hour. Excellent response time!",
    author: "Dr. Tarun Saxena",
    role: "Parent & Researcher",
    locality: "Hazratganj, Lucknow",
    rating: 5,
    avatar: "👨‍👩‍👦"
  }
];

const PROVIDER_TESTIMONIALS = [
  {
    type: "doctor",
    quote: "Listing my clinical hours in Gomti Nagar on this directory has expanded my digital reach. Patients appreciate seeing my active qualification credentials clearly before arrival.",
    author: "Dr. Anand Verma",
    role: "Senior Interventional Cardiologist",
    metric: "40% rise in organic appointment enquiries"
  },
  {
    type: "clinic",
    quote: "Our diagnostic patient walk-ins from Aliganj and Mahanagar grew substantially since we highlighted our NABL accreditations on our business card listing.",
    author: "Dr. Alok Dubey",
    role: "Director, Dubey Dental Clinic",
    metric: "3x search exposure across Lucknow"
  },
  {
    type: "hospital",
    quote: "For emergency trauma centers, every second matters. Highlighting our 24/7 level-1 emergency wing helps critical patients find us instantly during trauma emergencies.",
    author: "Mr. Rajeev Mehrotra",
    role: "Administrator, Avadh Trauma Hospital",
    metric: "Realtime emergency route navigation triggers"
  }
];

const COMMUNITY_CAMPS = [
  {
    title: "Free Hypertension & Cardio Screening Camp",
    locality: "Indira Nagar Community Hall, Block C",
    date: "July 18, 2026 (09:00 AM - 03:00 PM)",
    empanelled: "Dr. Anand Verma (KGMU Alumnus)",
    joinedCount: 184,
    status: "Open"
  },
  {
    title: "SGPGI Joint Blood Donation Drive",
    locality: "Hazratganj Municipal Library Hall",
    date: "July 24, 2026 (10:00 AM - 05:00 PM)",
    empanelled: "Sanjay Gandhi Postgraduate Institute of Medical Sciences",
    joinedCount: 92,
    status: "Upcoming"
  },
  {
    title: "Maternal Health & Nutrition Awareness Program",
    locality: "Chowk Community Clinic Auditorium",
    date: "July 29, 2026 (11:00 AM - 01:30 PM)",
    empanelled: "Dr. Shambhavi Mishra (Gynecology Lead)",
    joinedCount: 61,
    status: "Upcoming"
  }
];

const LUCKNOW_NEWS = [
  {
    title: "Lucknow CMO establishes dedicated hydration camps across Gomti Nagar and Hazratganj",
    source: "UP State Health Bulletin",
    date: "July 12, 2026",
    desc: "The Chief Medical Officer directed municipal health clinics to set up emergency drinking water and hydration spots to aid residents."
  },
  {
    title: "KGMU inaugurates new state-of-the-art pediatric cardiology wing in Lucknow",
    source: "Medical Research Press",
    date: "July 08, 2026",
    desc: "King George's Medical University expands its specialty care unit to handle complex infant cardiac cases from across Northern India."
  },
  {
    title: "SGPGI launches weekly preventive health awareness seminars on lifestyle disorders",
    source: "SGPGIMS Press Liaison",
    date: "July 03, 2026",
    desc: "Doctors will deliver free counseling on hypertension, insulin resistance, and dietary guidelines for Lucknow's elderly."
  }
];

const FAQS_LIST = [
  {
    question: "How does LKOHEALTH verify medical provider listings?",
    answer: "Every doctor listed must supply their National Medical Commission (NMC) or State Medical Council registration number. Our verification team double-checks these entries against active government registers and completes a physical audit before awarding the 'Verified' status badge."
  },
  {
    question: "Is there any booking fee charged to the patients?",
    answer: "No, LKOHEALTH is a free search and discovery platform for Lucknow citizens. Booking consultation inquiries, calling the helpline, or reserving free health camp passes is 100% free of charge."
  },
  {
    question: "How can clinics or hospitals register their services?",
    answer: "Healthcare providers can click on 'List Your Practice' in the navigation bar, sign up with an active email, fill in their qualifications, registration credentials, operating hours, and submit documents for rapid onboarding."
  },
  {
    question: "What is an NABL certified lab?",
    answer: "NABL stands for the National Accreditation Board for Testing and Calibration Laboratories. Labs with this accreditation maintain international standards of accuracy in diagnostic pathology reports."
  }
];

interface CountryData {
  id: string;
  name: string;
  flag: string;
  states: {
    id: string;
    name: string;
    cities: {
      id: string;
      name: string;
      localities: string[];
    }[];
  }[];
}

const COUNTRIES_DATA: CountryData[] = [
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    states: [
      {
        id: "uttar-pradesh",
        name: "Uttar Pradesh",
        cities: [
          {
            id: "lucknow",
            name: "Lucknow",
            localities: [
              "Gomti Nagar", "Gomti Nagar Extension", "Indira Nagar", "Hazratganj", "Aliganj",
              "Alambagh", "Ashiyana", "Rajajipuram", "Jankipuram", "Mahanagar",
              "Vikas Nagar", "Chowk", "Charbagh"
            ]
          },
          {
            id: "kanpur",
            name: "Kanpur",
            localities: ["Civil Lines", "Swaroop Nagar", "Kidwai Nagar", "Kakadeo", "Lajpat Nagar"]
          },
          {
            id: "noida",
            name: "Noida",
            localities: ["Sector 62", "Sector 15", "Sector 18", "Sector 50", "Sector 137"]
          }
        ]
      },
      {
        id: "delhi",
        name: "Delhi NCR",
        cities: [
          {
            id: "new-delhi",
            name: "New Delhi",
            localities: ["Connaught Place", "Saket", "Karol Bagh", "Vasant Kunj", "Dwarka", "Rajouri Garden"]
          },
          {
            id: "gurugram",
            name: "Gurugram",
            localities: ["Sector 21", "DLF Phase 3", "Golf Course Road", "Sohna Road"]
          }
        ]
      },
      {
        id: "maharashtra",
        name: "Maharashtra",
        cities: [
          {
            id: "mumbai",
            name: "Mumbai",
            localities: ["Bandra", "Andheri", "Colaba", "Juhu", "Borivali", "Worli", "Dadar"]
          },
          {
            id: "pune",
            name: "Pune",
            localities: ["Koregaon Park", "Kothrud", "Hinjewadi", "Shivaji Nagar", "Viman Nagar", "Baner"]
          }
        ]
      },
      {
        id: "karnataka",
        name: "Karnataka",
        cities: [
          {
            id: "bengaluru",
            name: "Bengaluru",
            localities: ["Indiranagar", "Koramangala", "Jayanagar", "Whitefield", "HSR Layout", "Malleshwaram"]
          },
          {
            id: "mysuru",
            name: "Mysuru",
            localities: ["Gokulam", "Vijayanagar", "Saraswathipuram", "Jayalakshmipuram"]
          }
        ]
      }
    ]
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    states: [
      {
        id: "dubai-emirate",
        name: "Dubai",
        cities: [
          {
            id: "dubai-city",
            name: "Dubai City",
            localities: ["Deira", "Downtown Dubai", "Jumeirah", "Marina", "Al Barsha", "Silicon Oasis"]
          }
        ]
      },
      {
        id: "abu-dhabi-emirate",
        name: "Abu Dhabi",
        cities: [
          {
            id: "abu-dhabi-city",
            name: "Abu Dhabi City",
            localities: ["Yas Island", "Khalifa City", "Al Reem Island", "Al Khalidiyah", "Corniche"]
          }
        ]
      }
    ]
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    states: [
      {
        id: "california",
        name: "California",
        cities: [
          {
            id: "los-angeles",
            name: "Los Angeles",
            localities: ["Santa Monica", "Beverly Hills", "Hollywood", "Downtown LA", "Pasadena"]
          },
          {
            id: "san-francisco",
            name: "San Francisco",
            localities: ["SOMA", "Mission District", "Marina District", "Presidio", "Fisherman's Wharf"]
          }
        ]
      },
      {
        id: "new-york",
        name: "New York",
        cities: [
          {
            id: "new-york-city",
            name: "New York City",
            localities: ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"]
          }
        ]
      }
    ]
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    states: [
      {
        id: "england",
        name: "England",
        cities: [
          {
            id: "london",
            name: "London",
            localities: ["Westminster", "Kensington & Chelsea", "Camden", "Soho", "Greenwich", "Richmond"]
          },
          {
            id: "manchester",
            name: "Manchester",
            localities: ["Deansgate", "Spinningfields", "Ancoats", "Northern Quarter"]
          }
        ]
      }
    ]
  }
];

export default function HomeView({
  providers,
  packages,
  articles,
  onSearch,
  onNavigate,
  onSelectProvider,
  onBookAppointment
}: HomeViewProps) {
  
  // Interactive Hero States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [searchState, setSearchState] = useState("uttar-pradesh");
  const [searchCity, setSearchCity] = useState("lucknow");
  const [searchCountry, setSearchCountry] = useState("india");

  // Find current active datasets for cascading selections
  const currentCountryObj = COUNTRIES_DATA.find(c => c.id === searchCountry) || COUNTRIES_DATA[0];
  const statesList = currentCountryObj.states;
  const currentStateObj = statesList.find(s => s.id === searchState) || statesList[0] || { id: "", name: "", cities: [] };
  const citiesList = currentStateObj.cities;
  const currentCityObj = citiesList.find(c => c.id === searchCity) || citiesList[0] || { id: "", name: "", localities: [] };
  const localitiesList = currentCityObj.localities || [];

  // Handler functions for cascading selection dropdowns
  const handleCountryChange = (countryId: string) => {
    setSearchCountry(countryId);
    const country = COUNTRIES_DATA.find(c => c.id === countryId);
    if (country && country.states.length > 0) {
      const firstState = country.states[0];
      setSearchState(firstState.id);
      if (firstState.cities.length > 0) {
        setSearchCity(firstState.cities[0].id);
      } else {
        setSearchCity("");
      }
    } else {
      setSearchState("");
      setSearchCity("");
    }
    setSelectedLocality("");
  };

  const handleStateChange = (stateId: string) => {
    setSearchState(stateId);
    const stateObj = statesList.find(s => s.id === stateId);
    if (stateObj && stateObj.cities.length > 0) {
      setSearchCity(stateObj.cities[0].id);
    } else {
      setSearchCity("");
    }
    setSelectedLocality("");
  };

  const handleCityChange = (cityId: string) => {
    setSearchCity(cityId);
    setSelectedLocality("");
  };

  // Luxurious card sliders refs & handlers
  const offeringsScrollRef = useRef<HTMLDivElement>(null);
  const specialtiesScrollRef = useRef<HTMLDivElement>(null);
  const doctorsScrollRef = useRef<HTMLDivElement>(null);
  const clinicsScrollRef = useRef<HTMLDivElement>(null);
  const hospitalsScrollRef = useRef<HTMLDivElement>(null);
  const labsScrollRef = useRef<HTMLDivElement>(null);
  const packagesScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // Show all areas toggle
  const [showAllAreas, setShowAllAreas] = useState(false);
  const [bookedPackage, setBookedPackage] = useState<string | null>(null);

  // Live platform activity updates simulator (converted to elegant popup toasts)
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const liveActivities = [
    "📋 User from Gomti Nagar extension just booked a diagnostic Full Body Screen.",
    "🛡️ Dr. Alok Dubey's Dental Care successfully passed clinical credential verification.",
    "⚡ Avadh Trauma Hospital flagged its Level-1 ICU beds as ACTIVE and updated.",
    "👶 Dr. Shambhavi Mishra opened 8 new neonatal consultation slots for tomorrow."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showPopup) {
      // Notification is visible: stick for 3 seconds, then hide
      timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } else {
      // Notification is hidden: wait for 6 seconds, then show next notification
      timer = setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % liveActivities.length);
        setShowPopup(true);
      }, 6000);
    }

    return () => clearTimeout(timer);
  }, [showPopup]);

  // Image Slider Banner sections (Display Ads / Category Banners)
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerSlides = [
    {
      title: "Featured Lucknow Doctors Direct Connect",
      subtitle: "NMC verified consult chairs in Lucknow. Pre-book telemedicine or physical clinic appointments directly.",
      badge: "Vetted Specialists",
      bgImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1200&auto=format&fit=crop",
      link: ProviderType.DOCTOR,
      cta: "Book Appointment Now",
      color: "from-teal-950 via-teal-900/60 to-slate-950"
    },
    {
      title: "24/7 Trauma & Critical Care Hospital Directory",
      subtitle: "Verified ICU bed availability, level-1 trauma centers and emergency services listings for Gomti Nagar, Aliganj & Hazratganj.",
      badge: "Emergency Care Units",
      bgImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
      link: ProviderType.HOSPITAL,
      cta: "Search Active Hospitals",
      color: "from-rose-950 via-rose-900/60 to-slate-950"
    },
    {
      title: "Diagnostic Labs & Pathology Packages",
      subtitle: "NABL certified blood reports delivered within 12 hours. Free certified home sample collection dispatch included.",
      badge: "NABL Certified Laboratories",
      bgImage: "https://images.unsplash.com/photo-1579153138244-3917a00b01d7?q=80&w=1200&auto=format&fit=crop",
      link: ProviderType.LAB,
      cta: "Schedule Free Home Collection",
      color: "from-amber-950 via-amber-900/60 to-slate-950"
    },
    {
      title: "Specialist Daycare Clinics & OPDs",
      subtitle: "High efficiency specialist daycare setups and multi-specialty clinics. Minimize waiting times and custom OPD consult paths.",
      badge: "Verified Daycare Clinics",
      bgImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop",
      link: ProviderType.CLINIC,
      cta: "Explore Active Clinics",
      color: "from-emerald-950 via-emerald-900/60 to-slate-950"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 5500); // auto slide every 5.5s
    return () => clearInterval(timer);
  }, []);

  // Comparer Tool State
  const [compareMetric, setCompareMetric] = useState<"hospital" | "clinic" | "lab">("hospital");

  // Testimonial Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Health Camp Registration Simulation state
  const [registeredCampIndex, setRegisteredCampIndex] = useState<number[]>([]);
  const [campSuccessMessage, setCampSuccessMessage] = useState<string | null>(null);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Back to Top button state
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Sticky search on scroll trigger
  const [showStickySearch, setShowStickySearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickySearch(true);
        setShowBackToTop(true);
      } else {
        setShowStickySearch(false);
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search Submit Handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query: searchQuery,
      locality: selectedLocality,
      city: searchCity,
      type: "all"
    });
  };

  // Quick Action triggers
  const triggerSpecialty = (spec: string) => {
    onSearch({ specialty: spec, city: "lucknow", type: "all" });
  };

  const triggerLocality = (loc: string) => {
    // Convert human name to snake/slug casing
    const locId = loc.toLowerCase().replace(/\s+/g, "-");
    onSearch({ locality: locId, city: "lucknow", type: "all" });
  };

  const triggerType = (type: ProviderType) => {
    onSearch({ type });
  };

  // Register for Camp Simulation
  const handleCampRegister = (index: number, campTitle: string) => {
    if (registeredCampIndex.includes(index)) return;
    setRegisteredCampIndex((prev) => [...prev, index]);
    setCampSuccessMessage(`🎉 Successfully registered for: "${campTitle}"! Your Free Entry Pass has been generated and sent to your contact number.`);
    setTimeout(() => setCampSuccessMessage(null), 5000);
  };

  // Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  // Filter provider lists
  const docProviders = providers.filter(p => p.type === ProviderType.DOCTOR);
  const clinicProviders = providers.filter(p => p.type === ProviderType.CLINIC);
  const hospitalProviders = providers.filter(p => p.type === ProviderType.HOSPITAL);
  const labProviders = providers.filter(p => p.type === ProviderType.LAB);

  return (
    <div className="bg-[#f4f7f5] min-h-screen relative font-sans text-slate-700">

      {/* STICKY SEARCH ON SCROLL (FLOATING TOP PILL) */}
      {showStickySearch && (
        <div className="fixed top-4 left-4 right-4 max-w-6xl mx-auto bg-white/90 backdrop-blur-lg border border-teal-100/80 shadow-xl rounded-2xl z-50 py-3 px-5 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <span className="bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-md shadow-teal-100">🏥</span>
              <span className="font-display font-black text-slate-900 hidden sm:inline text-sm tracking-tight uppercase">LKO<span className="text-teal-600">Health</span></span>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search doctors, treatments, clinics, hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50/85 border border-slate-200/80 rounded-xl pl-8 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400 font-medium transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-teal-100 transition-all cursor-pointer hover:shadow-teal-200"
              >
                Search
              </button>
            </form>
            <button 
              onClick={() => onNavigate("dashboard")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-emerald-100 transition-all shrink-0 hidden md:block cursor-pointer"
            >
              List Practice
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: HERO SECTION WITH UNIVERSAL SEARCH & SEPARATED LEFT/RIGHT PANELS */}
      <section id="hero-section" className="relative bg-gradient-to-br from-[#0c2e27] via-[#061f1a] to-[#041512] text-white overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b border-[#051f19]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_60%)]"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Side Panel */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Lucknow Healthcare Authority Registry Empanelled
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              Find Trusted Doctors, Clinics &amp; Hospitals Near You
            </h1>
            <p className="text-sm sm:text-base text-teal-200/90 leading-relaxed font-sans max-w-2xl">
              Search verified healthcare providers, compare profiles, read patient reviews and book appointments with confidence. Start finding Lucknow's vetted medical chairs now.
            </p>

            {/* Universal Smart Search & Locality selectors */}
            <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl text-slate-800 border border-slate-100/50 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* Country Dropdown */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Country</label>
                  <select 
                    value={searchCountry} 
                    onChange={(e) => handleCountryChange(e.target.value)} 
                    className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-700 outline-none transition-all cursor-pointer"
                  >
                    {COUNTRIES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
                {/* State Dropdown */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">State</label>
                  <select 
                    value={searchState} 
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-700 outline-none transition-all cursor-pointer"
                  >
                    {statesList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                {/* City Dropdown */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">City</label>
                  <select 
                    value={searchCity} 
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-700 outline-none transition-all cursor-pointer"
                  >
                    {citiesList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {/* Area Dropdown */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Area</label>
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-700 outline-none transition-all cursor-pointer"
                  >
                    <option value="">All Areas</option>
                    {localitiesList.map((area) => (
                      <option key={area} value={area.toLowerCase().replace(/\s+/g, "-")}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Keyword Text Input */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <div className="flex-1 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search doctor specialty, treatment, disease, clinic or hospital name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl pl-10 pr-4 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-sans text-xs font-bold py-3.5 px-7 rounded-xl transition-all shadow-lg shadow-teal-500/15 flex items-center justify-center gap-2 cursor-pointer hover:shadow-teal-500/25 active:scale-98"
                >
                  <span>Search Providers</span>
                </button>
              </form>
            </div>

            {/* Secondary CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-teal-300">Are you a healthcare provider?</span>
              <button 
                onClick={() => onNavigate("dashboard")}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-[11px] font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>🚀 List Your Practice Free</span>
              </button>
            </div>
          </div>

          {/* Hero Right Side Panel (Premium Image Asset with Overlays) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-teal-500/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop"
                alt="LKOHEALTH Premium Healthcare Hub"
                referrerPolicy="no-referrer"
                className="w-full h-[360px] object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              {/* Vetted Doctor floating badge representation */}
              <div className="absolute bottom-5 left-5 right-5 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3 text-xs text-left shadow-2xl">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="font-display font-bold text-white text-sm tracking-tight">NMC-Vetted Database</p>
                  <p className="text-slate-300 text-[10px] mt-0.5 leading-relaxed">100% credential audit before listing live.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: TRUST & AUTHORITY BAR (FEATURES SECTION) */}
      <section id="trust-bar" className="bg-[#f4f7f5] py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Verified Providers", desc: "Double NMC Cross Check", icon: "🛡️" },
              { label: "Verified Reviews", desc: "Genuine Patient Feedback", icon: "⭐" },
              { label: "Secure Booking", desc: "Patient Record Encryption", icon: "🔒" },
              { label: "Privacy Protected", desc: "GDPR & HIPAA Guidelines", icon: "🤫" },
              { label: "Local Health Experts", desc: "Lucknow Ward Specialties", icon: "📍" },
              { label: "Fast Customer Support", desc: "24/7 Helpline Team", icon: "📞" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white hover:bg-white/95 border border-slate-200/60 hover:border-teal-300/60 rounded-2xl p-4 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-center text-center group cursor-default">
                <div className="p-3 rounded-xl bg-[#f0f5f1] group-hover:bg-teal-50 text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="font-display font-bold text-slate-800 text-xs sm:text-xs tracking-tight">{item.label}</h4>
                <p className="text-[9px] text-slate-400 mt-1 font-mono">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CATEGORY DISPLAY ADS IMAGE SLIDER BANNER */}
      <section id="category-banner-slider" className="bg-[#04110e] border-y border-teal-950/80 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(20,184,166,0.08),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Active Ad Banner Card */}
          <div className="relative rounded-3xl overflow-hidden min-h-[180px] sm:min-h-[220px] shadow-2xl border border-teal-500/10 flex flex-col justify-center p-6 sm:p-10 transition-all duration-500">
            {/* Background image with overlay */}
            <div className="absolute inset-0 select-none">
              <img
                src={bannerSlides[bannerIndex].bgImage}
                alt={bannerSlides[bannerIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.35]"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${bannerSlides[bannerIndex].color} opacity-95`}></div>
            </div>

            {/* Content info */}
            <div className="relative z-10 max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 text-[9px] font-mono font-bold px-2.5 py-1 rounded-md border border-teal-400/20 uppercase tracking-widest">
                📢 DISPLAY SPONSOR • {bannerSlides[bannerIndex].badge}
              </span>
              <h3 className="font-display font-extrabold text-lg sm:text-2xl text-white tracking-tight leading-tight animate-fadeIn">
                {bannerSlides[bannerIndex].title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-xl animate-fadeIn">
                {bannerSlides[bannerIndex].subtitle}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => triggerType(bannerSlides[bannerIndex].link)}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 cursor-pointer active:scale-98"
                >
                  {bannerSlides[bannerIndex].cta} →
                </button>
                <span className="text-[10px] text-slate-400 font-mono">Lucknow Division Authority Empanelled Listing</span>
              </div>
            </div>

            {/* Manual navigation controls */}
            <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
              {bannerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setBannerIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    bannerIndex === idx ? "bg-teal-400 w-6" : "bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                ></button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7: QUICK HEALTHCARE ACCESS NODES */}
      <section id="quick-access-nodes" className="py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Direct Portal Routing</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Quick Healthcare Access Nodes
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
              Skip waitlists. Instantly jump to local doctor tables, diagnostics, clinics, or preventive packages with active verification badges.
            </p>
          </div>

          <div className="relative group">
            {/* Left Button */}
            <button
              onClick={() => scrollLeft(offeringsScrollRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-white/95 backdrop-blur-md text-teal-800 p-3 rounded-full shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-teal-50 cursor-pointer hidden sm:flex items-center justify-center w-11 h-11"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={offeringsScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-6 px-1"
            >
              {[
                { title: "Doctors", desc: "NMC verified consult chairs", type: ProviderType.DOCTOR, icon: <Stethoscope className="w-4 h-4 text-teal-600" />, bg: "from-teal-500/10 to-teal-600/5 text-teal-700", border: "border-teal-100 hover:border-teal-300", image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=400&auto=format&fit=crop" },
                { title: "Hospitals", desc: "24/7 Trauma Level-1 beds", type: ProviderType.HOSPITAL, icon: <HospitalIcon className="w-4 h-4 text-rose-600" />, bg: "from-rose-500/10 to-rose-600/5 text-rose-700", border: "border-rose-100 hover:border-rose-300", image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=400&auto=format&fit=crop" },
                { title: "Clinics", desc: "Specialist day care OPDs", type: ProviderType.CLINIC, icon: <Building2 className="w-4 h-4 text-emerald-600" />, bg: "from-emerald-500/10 to-emerald-600/5 text-emerald-700", border: "border-emerald-100 hover:border-emerald-300", image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400&auto=format&fit=crop" },
                { title: "Diagnostic Labs", desc: "NABL certified home tests", type: ProviderType.LAB, icon: <FlaskConical className="w-4 h-4 text-amber-600" />, bg: "from-amber-500/10 to-amber-600/5 text-amber-700", border: "border-amber-100 hover:border-amber-300", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop" },
                { title: "Online Consultation", desc: "Instant telemedicine inquiries", action: "online", icon: <Clock className="w-4 h-4 text-cyan-600" />, bg: "from-cyan-500/10 to-cyan-600/5 text-cyan-700", border: "border-cyan-100 hover:border-cyan-300", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop" },
                { title: "Health Packages", desc: "Preventive health screenings", action: "packages", icon: <Award className="w-4 h-4 text-teal-600" />, bg: "from-teal-500/10 to-teal-600/5 text-teal-700", border: "border-teal-100 hover:border-teal-300", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400&auto=format&fit=crop" }
              ].map((node, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (node.type) {
                      triggerType(node.type);
                    } else if (node.action === "packages") {
                      document.getElementById("packages-section")?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      onSearch({ onlineConsultation: true });
                    }
                  }}
                  className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl border border-slate-200/60 hover:border-teal-300/80 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group/card overflow-hidden text-left flex flex-col"
                >
                  {/* Card Premium Visual Banner */}
                  <div className="relative h-40 overflow-hidden w-full">
                    <img
                      src={node.image}
                      alt={node.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent"></div>
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm text-slate-800 border border-slate-100">
                      {node.icon}
                      <span>Explore</span>
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1 relative">
                    {/* Hover subtle color lift */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    
                    <div className="relative z-10 space-y-1.5">
                      <span className="text-[10px] font-bold text-teal-600 tracking-widest uppercase">Premium Hub Channel</span>
                      <h3 className="font-sans font-extrabold text-base text-slate-800 group-hover/card:text-teal-600 transition-colors flex items-center justify-between">
                        <span>{node.title}</span>
                        <span className="text-slate-300 group-hover/card:translate-x-1 group-hover/card:text-teal-500 transition-all text-sm">→</span>
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {node.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-50 flex items-center justify-between text-[10px] font-semibold text-slate-400 font-mono">
                      <span>✓ CREDENTIAL VETTED</span>
                      <span className="text-teal-600 uppercase group-hover/card:underline">INSTANT ROUTE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={() => scrollRight(offeringsScrollRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-white/95 backdrop-blur-md text-teal-800 p-3 rounded-full shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-teal-50 cursor-pointer hidden sm:flex items-center justify-center w-11 h-11"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: BROWSE BY MEDICAL SPECIALTY */}
      <section id="specialty-grid" className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-200/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Expertise Screening</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
                Browse by Medical Specialty
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => triggerType(ProviderType.DOCTOR)}
                className="text-teal-600 hover:text-teal-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:underline transition-all"
              >
                <span>View All Specialties</span>
                <span>→</span>
              </button>
              
              {/* Header Scroll Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLeft(specialtiesScrollRef)}
                  className="bg-white text-slate-700 p-2 rounded-full shadow-xs border border-slate-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all cursor-pointer flex items-center justify-center w-9 h-9"
                  aria-label="Scroll Left"
                  title="Previous Specialty"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => scrollRight(specialtiesScrollRef)}
                  className="bg-white text-slate-700 p-2 rounded-full shadow-xs border border-slate-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all cursor-pointer flex items-center justify-center w-9 h-9"
                  aria-label="Scroll Right"
                  title="Next Specialty"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
          <CategoryAdSlider 
            slides={SPECIALTY_ADS} 
            onActionClick={() => triggerType(ProviderType.DOCTOR)} 
            ctaText="Explore Specialty Care" 
          />

          <div className="relative group my-4">
            {/* Left Side Control Button */}
            <button
              onClick={() => scrollLeft(specialtiesScrollRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 sm:-ml-5 z-20 bg-white/95 text-teal-900 p-2.5 sm:p-3 rounded-full shadow-lg border border-teal-200 hover:bg-teal-600 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shadow-teal-900/10"
              aria-label="Scroll Specialties Left"
              title="Previous Specialty"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={specialtiesScrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-6 px-1"
            >
              {SPECIALTIES_LIST.map((spec, i) => (
                <div
                  key={i}
                  onClick={() => triggerSpecialty(spec.name)}
                  className="flex-shrink-0 w-52 p-6 rounded-3xl bg-[#f8faf9] hover:bg-white border border-slate-200/60 hover:border-teal-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center group/spec relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover/spec:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="p-4 rounded-2xl bg-white group-hover/spec:bg-teal-50/50 group-hover/spec:scale-110 shadow-sm group-hover/spec:shadow-md transition-all duration-300 text-3xl mb-4 flex items-center justify-center w-16 h-16 border border-slate-200/50">
                      {spec.emoji}
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-800 group-hover/spec:text-teal-600 transition-colors">
                      {spec.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed line-clamp-2 max-w-[150px] font-sans">
                      {spec.desc}
                    </p>
                    
                    <span className="text-[10px] font-bold text-teal-600 mt-4 opacity-0 group-hover/spec:opacity-100 transition-opacity duration-300 flex items-center gap-1 font-sans">
                      <span>Browse Providers</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side Control Button */}
            <button
              onClick={() => scrollRight(specialtiesScrollRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 sm:-mr-5 z-20 bg-white/95 text-teal-900 p-2.5 sm:p-3 rounded-full shadow-lg border border-teal-200 hover:bg-teal-600 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shadow-teal-900/10"
              aria-label="Scroll Specialties Right"
              title="Next Specialty"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>



      {/* SECTION 10: FEATURED VERIFIED DOCTORS */}
      <section id="featured-doctors" className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Expert Practitioners</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
                Featured Verified Doctors
              </h2>
            </div>
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
              <button 
                onClick={() => triggerType(ProviderType.DOCTOR)} 
                className="text-teal-600 hover:text-teal-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:underline transition-all"
              >
                <span>All Doctors</span>
                <span>→</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLeft(doctorsScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRight(doctorsScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <CategoryAdSlider 
            slides={DOCTOR_ADS} 
            onActionClick={() => triggerType(ProviderType.DOCTOR)} 
            ctaText="Find Specialist Doctors" 
          />

          <div className="relative">
            <div
              ref={doctorsScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-6 px-1"
            >
              {docProviders.slice(0, 8).map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex-shrink-0 w-80 sm:w-96 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between relative group"
                >
                  <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-b-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div>
                    <div className="flex gap-4 items-start mb-5">
                      <MedicalAvatar src={doc.image} name={doc.name} type={doc.type} className="w-16 h-16" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider font-mono flex items-center gap-1 shrink-0">
                            <ShieldCheck className="w-3 h-3" /> NMC VERIFIED
                          </span>
                          <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">⭐ {doc.rating}</span>
                        </div>
                        <h3 
                          onClick={() => onSelectProvider(doc.id)} 
                          className="font-display font-bold text-base text-slate-900 mt-1.5 cursor-pointer hover:text-teal-600 transition-colors truncate"
                        >
                          Dr. {doc.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{doc.qualification}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400 flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5 text-teal-600/80" /> Specialty</span>
                        <strong className="text-slate-800 font-semibold truncate max-w-[150px]">{doc.specialties.join(", ")}</strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400 flex items-center gap-1"><Award className="w-3.5 h-3.5 text-teal-600/80" /> Experience</span>
                        <strong className="text-slate-800 font-semibold">{doc.experienceYears} Years</strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400 flex items-center gap-1">₹ Consultation Fee</span>
                        <strong className="text-teal-600 font-bold">₹{doc.consultationFee}</strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400 flex items-center gap-1"><Languages className="w-3.5 h-3.5 text-teal-600/80" /> Languages</span>
                        <span className="text-slate-800 font-medium truncate max-w-[150px]">{doc.languages.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                    <div className="bg-[#f0fcf4] text-emerald-800 text-[10px] font-bold py-2 px-3 rounded-xl flex items-center justify-between border border-emerald-100/60 font-sans">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        📅 Next Slots Available
                      </span>
                      <span>Today / Tomorrow</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => onSelectProvider(doc.id)}
                        className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-xl text-center cursor-pointer transition-colors"
                      >
                        View Profile
                      </button>
                      <button 
                        onClick={() => onBookAppointment(doc)}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 rounded-xl text-center cursor-pointer shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-98 transition-all"
                      >
                        Book Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: FEATURED CLINICS */}
      <section id="featured-clinics" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5] border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Daycare Clinical OPDs</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
                Featured Specialist Clinics
              </h2>
            </div>
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
              <button 
                onClick={() => triggerType(ProviderType.CLINIC)} 
                className="text-teal-600 hover:text-teal-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                <span>All Clinics</span>
                <span>→</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLeft(clinicsScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRight(clinicsScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <CategoryAdSlider 
            slides={CLINIC_ADS} 
            onActionClick={() => triggerType(ProviderType.CLINIC)} 
            ctaText="Explore Daycare Clinics" 
          />

          <div className="relative">
            <div
              ref={clinicsScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-6 px-1"
            >
              {clinicProviders.slice(0, 8).map((clinic) => (
                <div 
                  key={clinic.id} 
                  className="flex-shrink-0 w-80 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between relative group"
                >
                  <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-b-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  
                  <div>
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-slate-100">
                      <img
                        src={clinic.image}
                        alt={clinic.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-teal-700 flex items-center gap-1 shadow-sm border border-slate-100">
                        <Building2 className="w-3 h-3" /> Daycare Clinic
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {clinic.rating}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">({clinic.reviewsCount} reviews)</span>
                    </div>

                    <h3 
                      onClick={() => onSelectProvider(clinic.id)} 
                      className="font-display font-bold text-base text-slate-900 hover:text-teal-600 cursor-pointer transition-colors line-clamp-1"
                    >
                      {clinic.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1 font-sans line-clamp-2 min-h-[32px]">
                      <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" /> <span>{clinic.address}</span>
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">OPD Consultation Fee</span>
                      <strong className="text-teal-600 font-bold text-sm">₹{clinic.consultationFee}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => onSelectProvider(clinic.id)} 
                        className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all text-center"
                      >
                        Profile
                      </button>
                      <button 
                        onClick={() => onBookAppointment(clinic)} 
                        className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-98 transition-all text-center"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: FEATURED HOSPITALS */}
      <section id="featured-hospitals" className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-rose-600 text-[10px] font-bold uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">Level 1 Multi-Specialty</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
                Featured Hospitals in Lucknow
              </h2>
            </div>
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
              <button 
                onClick={() => triggerType(ProviderType.HOSPITAL)} 
                className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                <span>All Hospitals</span>
                <span>→</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLeft(hospitalsScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRight(hospitalsScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <CategoryAdSlider 
            slides={HOSPITAL_ADS} 
            onActionClick={() => triggerType(ProviderType.HOSPITAL)} 
            ctaText="Find Hospital Services" 
          />

          <div className="relative">
            <div
              ref={hospitalsScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-6 px-1"
            >
              {hospitalProviders.slice(0, 8).map((hosp) => (
                <div 
                  key={hosp.id} 
                  className="flex-shrink-0 w-80 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between relative group"
                >
                  <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-rose-400 to-amber-500 rounded-b-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  
                  <div>
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-slate-100">
                      <img
                        src={hosp.image}
                        alt={hosp.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-rose-600 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-md">
                        <HospitalIcon className="w-3 h-3" /> 24/7 Trauma Level-1
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {hosp.rating}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold font-mono">NABH Accredited</span>
                    </div>

                    <h3 
                      onClick={() => onSelectProvider(hosp.id)} 
                      className="font-display font-bold text-base text-slate-900 hover:text-teal-600 cursor-pointer transition-colors line-clamp-1"
                    >
                      {hosp.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1 font-sans line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" /> <span>{hosp.address}</span>
                    </p>

                    <div className="mt-2 text-[10px] text-slate-400 font-medium font-sans min-h-[36px] line-clamp-2 leading-relaxed">
                      🏬 Facilities: {hosp.facilities.slice(0, 3).join(", ")}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => onSelectProvider(hosp.id)} 
                        className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all text-center"
                      >
                        Profile
                      </button>
                      <button 
                        onClick={() => onBookAppointment(hosp)} 
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-98 transition-all text-center"
                      >
                        Emergency
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13: FEATURED DIAGNOSTIC LABS */}
      <section id="diagnostic-labs" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5] border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Quality Assurance</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
                Featured Diagnostic Pathology Labs
              </h2>
            </div>
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
              <button 
                onClick={() => triggerType(ProviderType.LAB)} 
                className="text-teal-600 hover:text-teal-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                <span>All Labs</span>
                <span>→</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLeft(labsScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRight(labsScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <CategoryAdSlider 
            slides={LAB_ADS} 
            onActionClick={() => triggerType(ProviderType.LAB)} 
            ctaText="Explore Diagnostic Labs" 
          />

          <div className="relative">
            <div
              ref={labsScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-6 px-1"
            >
              {labProviders.slice(0, 8).map((lab) => (
                <div 
                  key={lab.id} 
                  className="flex-shrink-0 w-80 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between relative group"
                >
                  <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-b-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  
                  <div>
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-slate-100">
                      <img
                        src={lab.image}
                        alt={lab.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-teal-600 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-md">
                        <FlaskConical className="w-3 h-3" /> NABL Approved Lab
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {lab.rating}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold font-mono">🏡 FREE HOME COLLECTION</span>
                    </div>

                    <h3 
                      onClick={() => onSelectProvider(lab.id)} 
                      className="font-display font-bold text-base text-slate-900 hover:text-teal-600 cursor-pointer transition-colors line-clamp-1"
                    >
                      {lab.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 min-h-[48px] leading-relaxed font-sans">
                      {lab.about}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Reports Delivery</span>
                      <strong className="text-slate-800 font-bold">Same Day</strong>
                    </div>
                    <button 
                      onClick={() => onBookAppointment(lab)} 
                      className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all active:scale-98 text-center"
                    >
                      Book Pathology Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14: HEALTH CHECKUP PACKAGES */}
      <section id="packages-section" className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Preventive Care Screenings</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
                Affordable Lucknow Health Checkup Packages
              </h2>
            </div>
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
              <span className="text-slate-400 text-xs font-medium hidden sm:inline">Certified Labs</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollLeft(packagesScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRight(packagesScrollRef)}
                  className="bg-white/95 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300 cursor-pointer flex items-center justify-center w-10 h-10"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Booked Package Notification Banner */}
          {bookedPackage && (
            <div className="mb-6 p-4 bg-teal-50 border border-teal-150 rounded-2xl flex items-center justify-between text-teal-800 text-xs sm:text-sm animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <span>
                  <strong>Success!</strong> Your slot reservation for <strong>{bookedPackage}</strong> has been secured. Complete details and home collection setup are listed in your Scheduler tab.
                </span>
              </div>
              <button 
                onClick={() => setBookedPackage(null)} 
                className="text-teal-500 hover:text-teal-800 font-extrabold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <div className="relative">
            <div
              ref={packagesScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-6 px-1"
            >
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="flex-shrink-0 w-80 sm:w-96 bg-white border border-slate-200 hover:border-teal-300 hover:shadow-xl rounded-3xl p-6 transition-all duration-300 shadow-sm flex flex-col justify-between relative group"
                >
                  <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-b-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <div>
                    {pkg.image && (
                      <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-slate-100 select-none">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-teal-600 text-white px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase tracking-wider font-mono shadow-md">
                          🏠 Free Home Sample
                        </span>
                        <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-teal-300 px-2 py-0.5 rounded-lg text-[9px] font-mono border border-teal-500/30">
                          ⏱️ {pkg.duration}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="bg-teal-50 text-teal-700 text-[9px] font-bold px-2 py-0.5 rounded border border-teal-100 font-mono tracking-wide uppercase">
                          ⭐ RECOMMENDED
                        </span>
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 mt-1.5 line-clamp-1">{pkg.name}</h3>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400 line-through font-mono">₹{pkg.originalPrice}</span>
                        <p className="text-lg sm:text-xl font-display font-extrabold text-teal-600">₹{pkg.price}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4 font-sans line-clamp-2 min-h-[32px]">{pkg.description}</p>

                    <div className="space-y-2 mb-6">
                      <p className="text-[11px] font-bold text-slate-700 tracking-tight">What is included ({pkg.testsIncluded.length} parameters):</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-sans">
                        {pkg.testsIncluded.slice(0, 4).map((test, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-emerald-500 font-semibold text-xs">✔</span>
                            <span className="truncate">{test}</span>
                          </div>
                        ))}
                        {pkg.testsIncluded.length > 4 && (
                          <div className="text-teal-600 font-semibold">+{pkg.testsIncluded.length - 4} More Tests</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs mt-2">
                    <div className="font-sans space-y-0.5 text-slate-500">
                      <p>Reports: <strong className="text-slate-800 font-medium">{pkg.duration}</strong></p>
                      <p>For: <strong className="text-slate-800 font-medium truncate max-w-[100px] inline-block align-bottom">{pkg.recommendedFor}</strong></p>
                    </div>
                    <button 
                      onClick={() => {
                        setBookedPackage(pkg.name);
                        // Optional scroll up slightly to show success banner
                        document.getElementById("packages-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-98 transition-all"
                    >
                      Book Diagnostic Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 15: POPULAR TREATMENTS */}
      <section id="popular-treatments" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(20,184,166,0.1),transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <div className="space-y-2">
            <span className="text-teal-400 text-[10px] font-bold uppercase tracking-widest bg-teal-950/80 px-3 py-1 rounded-full border border-teal-900">Precision Medical Care</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mt-3">
              Most Searched Treatments &amp; Procedures in Lucknow
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
              Find Lucknow's super-specialists who specialize in advanced clinical surgeries and OPD wellness procedures.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {POPULAR_TREATMENTS.map((treat, idx) => (
              <button
                key={idx}
                onClick={() => onSearch({ query: treat.name, city: "lucknow" })}
                className="bg-slate-900 hover:bg-teal-600 text-slate-100 text-xs font-semibold px-5 py-3 rounded-xl border border-slate-800 hover:border-teal-400 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>{treat.emoji}</span>
                <span>{treat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>



      {/* SECTION 17: WHY PATIENTS TRUST US */}
      <section id="why-patients-trust-us" className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Patient Centric Care</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Why Lucknow Patients Trust LKOHEALTH
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "NMC Checked Providers", desc: "We cross-verify every medical registration number before publishing a doctor listing, preventing fraud.", emoji: "🛡️" },
              { title: "No Paid/Biased Rankings", desc: "Clinics can't pay us to artificially boost their ratings. Display parameters reflect pure patient feedback.", emoji: "⚖️" },
              { title: "24-Hour Clinical Audit", desc: "Our platform syncs clinical slots and emergency bed capabilities in Lucknow with extreme fidelity.", emoji: "⏰" },
              { title: "Zero Directory Markup Fees", desc: "We never charge booking markups. You pay exactly the consultant's own physical desk fee.", emoji: "💸" },
              { title: "Robust Privacy Standards", desc: "Patient symptoms, names, or booking dates are encrypted and sent directly to the physician's cabinet.", emoji: "🔒" },
              { title: "Genuinely Local Focus", desc: "No generic listings. From Hazratganj to Alambagh, we map Lucknow block-by-block.", emoji: "📍" }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white hover:bg-white border border-slate-200/80 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex gap-4 shadow-sm group">
                <div className="p-3.5 h-12 w-12 rounded-2xl bg-slate-50 group-hover:bg-teal-50 transition-colors flex items-center justify-center text-xl shrink-0 border border-slate-100">
                  {item.emoji}
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-950 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 18: WHY HEALTHCARE PROVIDERS JOIN */}
      <section id="why-providers-join" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5] border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Practice Growth</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Why Lucknow Doctors &amp; Clinics Join LKOHEALTH
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
              We build specialized local SEO landing pages for every listed clinician, ensuring Google search visibility in Lucknow.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 font-sans">
              {[
                "📱 Rich Professional Profile Pages",
                "🔍 Localized Search Visibility Engine",
                "📈 Practice Performance Dashboard",
                "🛡️ Official Verification Accreditation Badge",
                "📅 Seamless Direct Appointment Inquiries",
                "🎨 Custom Photo & Video Cabinets",
                "⭐ Patient Reviews Management Modules",
                "⚙️ Easy Hours & Specialty Controls"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 font-medium">
                  <span className="text-emerald-500 font-bold">✔</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate("dashboard")}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Register Your Clinic Online →
            </button>
          </div>

          {/* Practice checklist overview mock layout */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-lg group border border-slate-200/60 bg-[#0c2e27]">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop" 
                alt="Verified Lucknow Doctor" 
                referrerPolicy="no-referrer"
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-teal-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">Verified Clinician Network</span>
                <h4 className="font-display font-bold text-sm mt-1.5 text-white">Direct-to-Patient Consultations</h4>
                <p className="text-[10px] text-slate-300 font-sans mt-0.5">Empanelling medical practitioners across Hazratganj, Alambagh, Gomti Nagar &amp; more.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-display font-bold text-xs text-slate-800">Estimated Profile Completeness</span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase font-mono tracking-wider">100% Verified</span>
              </div>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between text-slate-500">
                  <span>NMC Registration Verification</span>
                  <span className="text-emerald-600 font-bold">Passed</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Google Map SEO Syncing</span>
                  <span className="text-emerald-600 font-bold">Active</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Direct Consultation Dial</span>
                  <span className="text-emerald-600 font-bold">Enabled</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Diagnostic Packages Linked</span>
                  <span className="text-emerald-600 font-bold">Synced</span>
                </div>
              </div>
              <div className="bg-[#f0fcf4] p-4 rounded-2xl text-[10px] text-teal-950 font-mono border border-emerald-100/60 leading-relaxed">
                🚀 <strong>SEO Index Alert:</strong> Dr. Anand Verma's patrakar puram cardiology profile is currently indexing for <strong>14 critical healthcare search keywords</strong> in Lucknow.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 19: PLATFORM STATISTICS */}
      <section id="platform-stats" className="bg-[#0c2e27] text-teal-100 py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-b border-teal-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.1),transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { count: "480+", label: "Registered Doctors", emoji: "👨‍⚕️" },
              { count: "120+", label: "Active Clinics", emoji: "🏢" },
              { count: "45+", label: "Verified Hospitals", emoji: "🏥" },
              { count: "14,500+", label: "Patients Helped", emoji: "🤝" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <span className="text-3xl block">{stat.emoji}</span>
                <p className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">{stat.count}</p>
                <p className="text-xs text-teal-200 font-semibold uppercase tracking-wider font-mono">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 20: PROVIDER VERIFICATION PROCESS */}
      <section id="verification-process" className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">High Integrity Standards</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Our 5-Step Provider Verification Timeline
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
              How we build an airtight, clinically vetted healthcare listing database for Uttar Pradesh residents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-center relative">
            {[
              { step: "1", title: "Practice Registration", desc: "Provider registers practice hours, specialties, and consult desk fees.", emoji: "📝" },
              { step: "2", title: "Submit Credentials", desc: "Submits NMC or state registration numbers and clinical degree proofs.", emoji: "📤" },
              { step: "3", title: "Database Audit", desc: "Verification team checks submitted registrations against active state medical council records.", emoji: "🔍" },
              { step: "4", title: "Approval Granted", desc: "Credential authenticity checked and verified credentials status finalized.", emoji: "✅" },
              { step: "5", title: "Active Listing", desc: "Listing goes live with 'Verified' seal, boosting local SEO.", emoji: "🚀" }
            ].map((step, idx) => (
              <div key={idx} className="relative p-5 rounded-3xl bg-slate-50/50 border border-slate-200/60 hover:bg-white hover:border-teal-300 hover:shadow-md transition-all duration-300 space-y-3 group cursor-default">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center mx-auto text-xs shadow-md shadow-teal-500/10">
                  {step.step}
                </div>
                <span className="text-2xl block group-hover:scale-110 transition-transform duration-300">{step.emoji}</span>
                <h4 className="font-display font-bold text-slate-900 text-xs tracking-tight">{step.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 21: PATIENT TESTIMONIALS */}
      <section id="patient-testimonials" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5] border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Patient Testimonials</span>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight mt-2">
            What Patients in Lucknow Say About Us
          </h2>
 
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md relative min-h-[180px] flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
            <span className="text-4xl text-teal-100 absolute top-4 left-4 font-serif">“</span>
            <div className="space-y-4 relative z-10">
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed font-sans">
                {PATIENT_TESTIMONIALS[testimonialIndex].quote}
              </p>
              <div className="flex justify-center text-amber-400 gap-1 text-[11px]">
                {Array.from({ length: PATIENT_TESTIMONIALS[testimonialIndex].rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 relative z-10">
              <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm">
                {PATIENT_TESTIMONIALS[testimonialIndex].avatar} {PATIENT_TESTIMONIALS[testimonialIndex].author}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {PATIENT_TESTIMONIALS[testimonialIndex].role} • {PATIENT_TESTIMONIALS[testimonialIndex].locality}
              </p>
            </div>
          </div>
 
          {/* Testimonial Nav */}
          <div className="flex justify-center gap-2">
            {PATIENT_TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  testimonialIndex === idx ? "bg-teal-600 w-6" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
 
      {/* SECTION 22: HEALTHCARE PROVIDER TESTIMONIALS */}
      <section id="provider-testimonials" className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Clinic &amp; Hospital Partners</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Clinicians &amp; Directors Share Their Experience
            </h2>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROVIDER_TESTIMONIALS.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-teal-600 text-2xl mb-3 block">💬</span>
                  <p className="text-xs text-slate-600 italic leading-relaxed font-sans">
                    "{item.quote}"
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 text-xs">
                  <h4 className="font-display font-bold text-slate-900">{item.author}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.role}</p>
                  <span className="inline-block bg-emerald-50 text-emerald-800 text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-emerald-100 mt-2.5">
                    📈 Result: {item.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* SECTION 23: HEALTH KNOWLEDGE CENTER */}
      <section id="health-knowledge" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5] border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Clinical Handbooks</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
                Health Knowledge Center
              </h2>
            </div>
            <button 
              onClick={() => alert("Redirecting to the comprehensive articles archive.")} 
              className="text-teal-600 hover:text-teal-700 text-xs font-bold flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span>All Articles</span>
              <span>→</span>
            </button>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((art) => (
              <div key={art.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-sm">
                <div>
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2 text-[10px] text-teal-600 font-bold uppercase tracking-wider font-mono">
                      <span>🩺 {art.category}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="font-display font-bold text-slate-900 text-sm hover:text-teal-600 transition-colors cursor-pointer leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-sans">
                      {art.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-100">
                  <span>Author: {art.author}</span>
                  <span>Published: {art.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* SECTION 24: HEALTHCARE NEWS & UPDATES (GOVERNMENT HEALTH UPDATES) */}
      <section id="healthcare-news" className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">State &amp; Municipal Advisory</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Healthcare News &amp; Updates
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
              Stay informed about critical healthcare decisions, CMO circulars, and awareness drives in Lucknow.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LUCKNOW_NEWS.map((news, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-teal-300 hover:shadow-xl transition-all duration-300 space-y-3 shadow-sm">
                <div className="flex justify-between items-center text-[10px] text-teal-600 font-bold uppercase font-mono bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100/60">
                  <span>📰 {news.source}</span>
                  <span>{news.date}</span>
                </div>
                <h3 className="font-display font-bold text-slate-900 text-sm leading-snug">
                  {news.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {news.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* SECTION 25: FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5] border-b border-slate-200/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Resolving Queries</span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight mt-2">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl mx-auto">
              Clear information for patients and providers about listing compliance, fee policies, and verification steps.
            </p>
          </div>
 
          <div className="space-y-3">
            {FAQS_LIST.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full text-left px-5 py-4.5 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:text-teal-600 transition-colors cursor-pointer"
                >
                  <span className="font-display">❓ {faq.question}</span>
                  <span className="text-slate-400 text-xs">{openFaqIndex === i ? "▲" : "▼"}</span>
                </button>
                {openFaqIndex === i && (
                  <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* SECTION 26: COMMUNITY HEALTH INITIATIVES */}
      <section id="community-initiatives" className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Social Responsibility</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">
              Community Health Initiatives &amp; Camps
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
              We coordinate with empanelled clinical heads to launch zero-cost diagnostic camps and SGPGI blood donation campaigns.
            </p>
          </div>
 
          {campSuccessMessage && (
            <div className="max-w-3xl mx-auto mb-6 p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl text-xs font-bold text-center shadow-sm">
              {campSuccessMessage}
            </div>
          )}
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMUNITY_CAMPS.map((camp, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-sm relative group">
                <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-b-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="bg-emerald-50 text-emerald-800 text-[9px] font-extrabold px-2.5 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-wider font-mono">
                      🟢 ACTIVE REGISTRATION
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">👥 {camp.joinedCount} Joined</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-950 text-base leading-snug">{camp.title}</h3>
                  <div className="space-y-1.5 text-xs text-slate-500 leading-relaxed font-sans">
                    <p>📍 Location: <strong className="text-slate-800 font-semibold">{camp.locality}</strong></p>
                    <p>📅 Time: <strong className="text-slate-800 font-semibold">{camp.date}</strong></p>
                    <p>🩺 Lead: <strong className="text-slate-800 font-semibold">{camp.empanelled}</strong></p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleCampRegister(idx, camp.title)}
                    disabled={registeredCampIndex.includes(idx)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      registeredCampIndex.includes(idx)
                        ? "bg-slate-200 text-slate-500 cursor-default"
                        : "bg-teal-600 hover:bg-teal-700 text-white shadow-md active:scale-98"
                    }`}
                  >
                    {registeredCampIndex.includes(idx) ? "✔ Registered (Pass Generated)" : "🤝 Join Camp Free"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* SECTION 27: PARTNER NETWORK */}
      <section id="partner-network" className="py-8 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5] border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Trusted Healthcare Associations &amp; Networks</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="text-slate-500 font-bold text-xs sm:text-sm font-mono tracking-wider">🏢 UP MEDICAL ASSOC.</span>
            <span className="text-slate-500 font-bold text-xs sm:text-sm font-mono tracking-wider">🏥 SGPGIMS PATHOLOGY</span>
            <span className="text-slate-500 font-bold text-xs sm:text-sm font-mono tracking-wider">🩸 SGPGI BLOOD SERVICES</span>
            <span className="text-slate-500 font-bold text-xs sm:text-sm font-mono tracking-wider">🛡️ NABL COOPERATIVE</span>
          </div>
        </div>
      </section>
 
      {/* LOCALITY DISPLAY ADS BANNER */}
      <section className="bg-white py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <CategoryAdSlider 
            slides={LOCALITY_ADS} 
            ctaText="Search Nearest Clinics" 
            onActionClick={() => triggerType(ProviderType.CLINIC)}
          />
        </div>
      </section>

      {/* SECTION 28: NEWSLETTER */}
      <section id="newsletter-subscription" className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0c2e27] to-[#041411] rounded-3xl p-6 sm:p-10 text-white text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.1),transparent_70%)]"></div>
          <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
            <span className="text-2xl">📬</span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-2">
              Subscribe for Weekly Lucknow Health Advisories
            </h2>
            <p className="text-xs text-teal-200/85 leading-relaxed font-sans">
              Receive verified seasonal wellness circulars from CMO offices, clinical alerts, and free diagnostic camp openings.
            </p>
 
            {newsletterSubscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 p-4 rounded-xl text-xs font-bold font-mono">
                🎉 Success! You are subscribed to LKOHEALTH Advisories list.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 mt-4 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your active email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-teal-900/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-teal-200/40 focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
                />
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md shrink-0 active:scale-98"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
 
      {/* SECTION 29: DUAL CALL TO ACTION */}
      <section id="dual-cta" className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f4f7f5]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Patients CTA card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left shadow-sm group">
            <div className="space-y-3">
              <div className="p-3.5 h-12 w-12 rounded-2xl bg-slate-50 group-hover:bg-teal-50 transition-colors flex items-center justify-center text-xl shrink-0 border border-slate-100">
                👨‍⚕️
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-2">For Patients</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Find state-accredited medical doctors, view registration numbers, compare consultancy fees, and schedule call slots instantly.
              </p>
            </div>
            <button
              onClick={() => triggerType(ProviderType.DOCTOR)}
              className="mt-6 bg-slate-900 hover:bg-black text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-center active:scale-98 shadow-sm"
            >
              Search Vetted Doctors
            </button>
          </div>
 
          {/* Providers CTA card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 hover:border-teal-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left shadow-sm group">
            <div className="space-y-3">
              <div className="p-3.5 h-12 w-12 rounded-2xl bg-slate-50 group-hover:bg-teal-50 transition-colors flex items-center justify-center text-xl shrink-0 border border-slate-100">
                🚀
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-2">For Providers</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                List your consultancy hours or hospital capabilities on Lucknow's premier directory. Boost local SEO index and handle booking inquiries directly.
              </p>
            </div>
            <button
              onClick={() => onNavigate("dashboard")}
              className="mt-6 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-center shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-98"
            >
              Onboard Your Practice Free
            </button>
          </div>
 
        </div>
      </section>



      {/* FLOATING SOCIAL MEDIA & HELPLINE ACTIONS */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        {/* WhatsApp Floating Action */}
        <a
          href="https://wa.me/915223549210"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer text-lg border border-emerald-400"
          title="WhatsApp Help Desk Support"
        >
          💬
        </a>
 
        {/* Back to Top button */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-slate-900 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer text-lg border border-slate-800"
            title="Back to Top"
          >
            ▲
          </button>
        )}
      </div>

      {/* FLOATING POPUP NOTIFICATIONS (LIVE PLATFORM ACTIVITY) */}
      {showPopup && (
        <div className="fixed bottom-4 left-4 z-40 max-w-xs sm:max-w-sm bg-slate-950/95 backdrop-blur-md text-white p-4 rounded-2xl border border-teal-500/30 shadow-2xl flex items-start gap-3 animate-fadeIn">
          <div className="p-2 bg-teal-500/20 text-teal-300 rounded-xl text-base shrink-0 border border-teal-400/20 font-sans">
            🔔
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="block text-[9px] font-mono font-bold text-teal-400 uppercase tracking-widest mb-0.5">
              ⚡ LIVE LKO PLATFORM ACTIVITY
            </span>
            <p className="text-[10px] sm:text-xs text-slate-200 leading-relaxed font-mono">
              {liveActivities[tickerIndex]}
            </p>
          </div>
          <button
            onClick={() => setShowPopup(false)}
            className="text-slate-400 hover:text-white text-[10px] font-bold cursor-pointer transition-colors p-1 shrink-0 font-sans"
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}
 
    </div>
  );
}

