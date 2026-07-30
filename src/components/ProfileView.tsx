import React, { useState, useMemo } from "react";
import { 
  CheckCircle, MapPin, Star, Clock, Heart, Share2, AlertTriangle, Phone, Mail, 
  Map, Award, BookOpen, ShieldCheck, HelpCircle, ChevronRight, ThumbsUp, Calendar, 
  ChevronDown, Video, Image as ImageIcon, Sparkles, Building2, UserCheck, ShieldAlert, GraduationCap
} from "lucide-react";
import { Provider, ProviderType, Review, ViewState, Article } from "../types";
import MedicalAvatar from "./MedicalAvatar";

interface ProfileViewProps {
  provider: Provider;
  allProviders: Provider[];
  allReviews: Review[];
  articles: Article[];
  onNavigate: (view: ViewState) => void;
  onSelectProvider: (id: string) => void;
  onBookAppointment: (provider: Provider) => void;
  onOpenAddReview: () => void;
}

export default function ProfileView({ 
  provider, 
  allProviders, 
  allReviews, 
  articles, 
  onNavigate, 
  onSelectProvider, 
  onBookAppointment,
  onOpenAddReview
}: ProfileViewProps) {
  
  const [activeTab, setActiveTab] = useState<"overview" | "credentials" | "reviews" | "faq">("overview");
  const [copied, setCopied] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Dynamic reviews filter for this specific provider
  const reviews = useMemo(() => {
    return allReviews.filter(r => r.providerId === provider.id);
  }, [allReviews, provider.id]);

  // Dynamic related/nearby providers list
  const relatedProviders = useMemo(() => {
    return allProviders
      .filter(p => p.id !== provider.id && (p.localityId === provider.localityId || p.specialties.some(s => provider.specialties.includes(s))))
      .slice(0, 3);
  }, [allProviders, provider]);

  // Related articles
  const relatedArticles = useMemo(() => {
    return articles.slice(0, 2);
  }, [articles]);

  // Handle share action
  const handleShare = () => {
    const url = `https://lucknow.healthcare.directory/provider/${provider.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // fallback
      alert(`Profile link: ${url}`);
    });
  };

  // Handle report action
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportOpen(false);
      setReportSubmitted(false);
    }, 2000);
  };

  // Dynamic calculation of verified metrics based on provider review stats
  const aggregateMetrics = useMemo(() => {
    if (reviews.length === 0) {
      return {
        doctorBehavior: 4.8,
        waitingTime: 4.5,
        cleanliness: 4.8,
        staffBehavior: 4.7,
        communication: 4.9,
        treatmentSatisfaction: 4.8
      };
    }
    const sums = reviews.reduce((acc, r) => ({
      doctorBehavior: acc.doctorBehavior + r.metrics.doctorBehavior,
      waitingTime: acc.waitingTime + r.metrics.waitingTime,
      cleanliness: acc.cleanliness + r.metrics.cleanliness,
      staffBehavior: acc.staffBehavior + r.metrics.staffBehavior,
      communication: acc.communication + r.metrics.communication,
      treatmentSatisfaction: acc.treatmentSatisfaction + r.metrics.treatmentSatisfaction
    }), {
      doctorBehavior: 0, waitingTime: 0, cleanliness: 0, staffBehavior: 0, communication: 0, treatmentSatisfaction: 0
    });
    const len = reviews.length;
    return {
      doctorBehavior: parseFloat((sums.doctorBehavior / len).toFixed(1)),
      waitingTime: parseFloat((sums.waitingTime / len).toFixed(1)),
      cleanliness: parseFloat((sums.cleanliness / len).toFixed(1)),
      staffBehavior: parseFloat((sums.staffBehavior / len).toFixed(1)),
      communication: parseFloat((sums.communication / len).toFixed(1)),
      treatmentSatisfaction: parseFloat((sums.treatmentSatisfaction / len).toFixed(1))
    };
  }, [reviews]);

  const typeLabel = provider.type === ProviderType.DOCTOR ? `Dr. ${provider.name}` : provider.name;

  return (
    <div id="profile-view" className="bg-slate-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="mb-6 text-xs sm:text-sm text-slate-500 font-sans flex items-center gap-1.5 flex-wrap">
          <span className="hover:text-teal-600 cursor-pointer" onClick={() => onNavigate("home")}>Home</span>
          <span>/</span>
          <span className="hover:text-teal-600 cursor-pointer text-slate-600 font-medium" onClick={() => onNavigate("search")}>Lucknow Listings</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{typeLabel}</span>
        </div>

        {/* 1. Profile Banner & Info Header */}
        <div id="profile-hero-card" className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          {/* Banner area */}
          <div className="h-44 sm:h-56 bg-gradient-to-r from-teal-700 via-teal-800 to-teal-950 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_50%)]"></div>
            {provider.emergencyServices && (
              <span className="absolute top-4 right-4 bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-pulse uppercase">
                <ShieldAlert className="h-3.5 w-3.5" />
                24/7 Trauma Emergency Support
              </span>
            )}
          </div>

          {/* Picture and Title Block */}
          <div className="px-6 sm:px-8 pb-8 relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 sm:-mt-20">
            {/* Profile Image with verification badge */}
            <div className="relative shrink-0">
              <MedicalAvatar
                src={provider.image}
                name={typeLabel}
                type={provider.type}
                className="w-32 h-32 sm:w-36 sm:h-36 border-4 border-white shadow-lg"
              />
              {provider.verified && (
                <div 
                  className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-1.5 rounded-full shadow-md border-2 border-white flex items-center justify-center z-30"
                  title="NMC Registered and Local Council Verified Profile"
                >
                  <CheckCircle className="h-4 w-4 fill-white text-teal-600" />
                </div>
              )}
            </div>

            {/* Profile Summary Details */}
            <div className="flex-1 text-center md:text-left space-y-2 mt-4 md:mt-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase">
                  {provider.type.replace("_", " ")}
                </span>
                {provider.medicalRegistrationNumber && (
                  <span className="bg-slate-50 border border-slate-150 text-slate-500 text-xs font-mono font-semibold px-2 py-0.5 rounded-md">
                    Registration No: {provider.medicalRegistrationNumber}
                  </span>
                )}
              </div>

              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {typeLabel}
              </h1>

              {provider.qualification && (
                <p className="text-sm font-sans text-slate-500 font-medium">
                  {provider.qualification}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center md:justify-start gap-1 font-sans">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{provider.address}</span>
              </p>
            </div>

            {/* Overall Rating & Action buttons */}
            <div className="shrink-0 text-center md:text-right space-y-3 w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-end gap-2">
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">Verified Patient Rating</span>
                  <div className="flex items-center justify-center md:justify-end gap-1 text-slate-800 font-bold text-base mt-0.5">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span>{provider.rating} Out of 5</span>
                  </div>
                </div>
                <div className="bg-amber-500 text-white font-extrabold text-lg px-3 py-2 rounded-xl shadow-xs">
                  {provider.rating}
                </div>
              </div>

              <div className="flex justify-center md:justify-end gap-2">
                <button
                  onClick={handleShare}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  title="Share Profile"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{copied ? "Copied!" : "Share Link"}</span>
                </button>
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="border border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  title="Report Listing Errors"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Report Error</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Page Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Core Details (Tabs) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tab selection triggers */}
            <div className="border-b border-slate-200 flex gap-4 overflow-x-auto scrollbar-none font-sans text-xs sm:text-sm font-semibold text-slate-500">
              {[
                { id: "overview", label: "Overview & Services" },
                { id: "credentials", label: "Education & Credentials" },
                { id: "reviews", label: `Patient Reviews (${reviews.length})` },
                { id: "faq", label: "Specialty FAQs" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`pb-3.5 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === t.id 
                      ? "border-teal-600 text-teal-600 font-extrabold" 
                      : "border-transparent hover:text-teal-500"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === "overview" && (
              <div id="overview-tab-content" className="space-y-8 animate-in fade-in duration-200">
                {/* About block */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-4 text-left">
                  <h3 className="font-sans font-extrabold text-slate-800 text-base flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-teal-600" />
                    About This Medical Professional
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                    {provider.about}
                  </p>
                </div>

                {/* Specialties, Treatments & Conditions managed */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-6 text-left">
                  <h3 className="font-sans font-extrabold text-slate-800 text-base flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-teal-600" />
                    Clinical Specializations
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Specialties */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {provider.specialties.map(spec => (
                          <span key={spec} className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Treatments */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Treatments Offered</p>
                      <div className="flex flex-wrap gap-2">
                        {provider.treatments.map(t => (
                          <span key={t} className="bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-150">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {provider.conditionsManaged && (
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Major Conditions Managed</p>
                      <div className="flex flex-wrap gap-1.5">
                        {provider.conditionsManaged.map(cond => (
                          <span key={cond} className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-100">
                            {cond}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Services list & Facilities */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-6 text-left">
                  <h3 className="font-sans font-extrabold text-slate-800 text-base flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-teal-600" />
                    Clinical Services &amp; In-House Amenities
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs sm:text-sm text-slate-600">
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Services</p>
                      {provider.services.map((serv, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <span className="h-1.5 w-1.5 bg-teal-500 rounded-full shrink-0"></span>
                          <span>{serv}</span>
                        </div>
                      ))}
                    </div>

                    {provider.facilities && (
                      <div className="space-y-2.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Infrastructure Facilities</p>
                        {provider.facilities.map((fac, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                            <span>{fac}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Styled Lucknow SVG Location Map, Nearby Localities and landmarks */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-6 text-left">
                  <h3 className="font-sans font-extrabold text-slate-800 text-base flex items-center gap-2">
                    <Map className="h-5 w-5 text-teal-600" />
                    Location Map &amp; Navigation Landmarks
                  </h3>

                  {/* Stylized custom SVG mock map */}
                  <div className="bg-slate-900 text-slate-300 h-52 sm:h-64 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    {/* SVG Map grid layout */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <svg className="absolute inset-0 w-full h-full text-slate-800" xmlns="http://www.w3.org/1900/svg">
                      {/* Gomti River line */}
                      <path d="M-50,80 Q250,150 400,90 T900,160" fill="none" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" className="opacity-40 animate-pulse" />
                      {/* Hazratganj crossing */}
                      <circle cx="350" cy="110" r="40" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" />
                      {/* Gomti Nagar block */}
                      <rect x="520" y="50" width="120" height="70" rx="8" fill="rgba(79,70,229,0.05)" stroke="#4f46e5" strokeWidth="1" />
                    </svg>
                    
                    {/* Floating map controls */}
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1.5 rounded text-[10px] font-mono text-slate-400 border border-slate-800">
                      ZOOM: 14.5x | LAT: 26.8467° N
                    </div>

                    <div className="absolute top-4 left-4 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-bold text-white flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>{provider.localityId.replace("-", " ").toUpperCase()}, LUCKNOW</span>
                    </div>

                    {/* Central location Pin with ripple */}
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="absolute h-8 w-8 bg-teal-500 rounded-full animate-ping opacity-30"></span>
                      <MapPin className="h-10 w-10 text-rose-500 fill-rose-500 drop-shadow" />
                      <span className="bg-teal-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-md mt-2 shadow border border-teal-500 whitespace-nowrap uppercase">
                        {typeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Landmarks and nearby localities list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-sans">
                    {provider.landmarks && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Navigation Landmarks</p>
                        <div className="space-y-1.5 text-slate-600">
                          {provider.landmarks.map((mark, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-teal-500 shrink-0" />
                              <span>{mark}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Surrounding Localities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Gomti Nagar", "Hazratganj", "Indira Nagar", "Aliganj", "Mahanagar"].map(surr => (
                          <span key={surr} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded hover:bg-slate-200 transition-colors select-none">
                            {surr}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: CREDENTIALS */}
            {activeTab === "credentials" && (
              <div id="credentials-tab-content" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs space-y-6 text-left animate-in fade-in duration-200">
                <div className="space-y-6">
                  <h3 className="font-sans font-extrabold text-slate-800 text-base flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-teal-600" />
                    Medical Qualifications &amp; Accreditations
                  </h3>

                  {provider.education && (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Education Timeline</p>
                      <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-600 border-l border-teal-100 pl-4 ml-2">
                        {provider.education.map((edu, i) => (
                          <div key={i} className="relative space-y-1">
                            <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 bg-teal-500 rounded-full border border-white"></span>
                            <p className="font-bold text-slate-800">{edu.split(" - ")[0]}</p>
                            <p className="text-slate-500">{edu.split(" - ")[1]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {provider.awards && (
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Honors &amp; Awards</p>
                      <div className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                        {provider.awards.map((aw, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-teal-500 shrink-0" />
                            <span>{aw}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {provider.memberships && (
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Council Memberships</p>
                      <div className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                        {provider.memberships.map((memb, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>{memb}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: REVIEWS */}
            {activeTab === "reviews" && (
              <div id="reviews-tab-content" className="space-y-6 animate-in fade-in duration-200">
                {/* Metrics detail breakdown */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
                  <h3 className="font-sans font-extrabold text-slate-800 text-base mb-4 flex items-center justify-between">
                    <span>Patient Satisfaction Metrics</span>
                    <button 
                      onClick={onOpenAddReview}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      Write Verified Review
                    </button>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    {[
                      { name: "Doctor Behaviour", score: aggregateMetrics.doctorBehavior },
                      { name: "Communication Quality", score: aggregateMetrics.communication },
                      { name: "Treatment Satisfaction", score: aggregateMetrics.treatmentSatisfaction },
                      { name: "Clinic Cleanliness", score: aggregateMetrics.cleanliness },
                      { name: "Staff Behaviour", score: aggregateMetrics.staffBehavior },
                      { name: "Consultation Waiting Time", score: aggregateMetrics.waitingTime }
                    ].map((met, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-600">{met.name}</span>
                          <span className="text-teal-600">{met.score}★</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-teal-500 h-full rounded-full"
                            style={{ width: `${(met.score / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews lists */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs sm:text-sm font-sans">
                      No customer reviews submitted yet. Be the first to share your consultation experience!
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3 text-left">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-sans font-extrabold text-slate-800 text-sm">
                              {rev.patientName}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{rev.date}</p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              VERIFIED PATIENT
                            </span>
                            <div className="flex items-center text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded">
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              <span className="ml-0.5">{rev.rating}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FAQ */}
            {activeTab === "faq" && (
              <div id="faq-tab-content" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs text-left animate-in fade-in duration-200">
                <h3 className="font-sans font-extrabold text-slate-800 text-base mb-6 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-teal-600" />
                  Frequently Asked Questions (FAQs)
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      q: `What is the consultation fee for ${typeLabel}?`,
                      a: `The standard clinical consultation fee is ₹${provider.consultationFee}. This payment can be processed in-person at the clinic counter via UPI, Cash, or Credit/Debit Cards.`
                    },
                    {
                      q: "How early should I arrive for my appointment?",
                      a: "To ensure proper record creation and complete temperature checks, please arrive 10-15 minutes prior to your scheduled consultation slot."
                    },
                    {
                      q: "Which insurance providers are accepted here?",
                      a: provider.insuranceAccepted 
                        ? `The accepted insurance options include: ${provider.insuranceAccepted.join(", ")}.`
                        : "For major cashless approvals, please connect directly with the clinic billing desk before your OPD session."
                    }
                  ].map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full text-left bg-slate-50 hover:bg-slate-100/70 px-4 py-3 flex justify-between items-center transition-colors focus:outline-none cursor-pointer"
                        >
                          <span className="font-sans font-bold text-xs sm:text-sm text-slate-800">{item.q}</span>
                          <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR: Scheduling, Contact, Landmark maps */}
          <div className="space-y-6">
            
            {/* Appointment Booking Panel */}
            <div id="booking-panel" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md space-y-5 text-left">
              <h3 className="font-sans font-extrabold text-slate-800 text-sm uppercase tracking-wider">OPD Consultation Scheduler</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs sm:text-sm border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Consultation Fee</span>
                  <span className="text-slate-800 font-extrabold text-base text-teal-600">₹{provider.consultationFee}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Availability</span>
                  <span className="text-slate-800 font-bold">{provider.availability.length} OPD Days</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Response Rate</span>
                  <span className="text-emerald-600 font-bold font-mono">100% Instant</span>
                </div>
              </div>

              {/* Day slots list */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">OPD Days &amp; Timings</p>
                <div className="space-y-1.5 text-xs">
                  {provider.availability.map((av, i) => (
                    <div key={i} className="flex justify-between bg-slate-50 px-3 py-2 rounded-lg font-sans">
                      <span className="font-bold text-slate-700">{av.day}</span>
                      <span className="text-slate-500">
                        {av.slots.length > 0 ? av.slots[0].time : "Consultation Day"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onBookAppointment(provider)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-sans text-sm font-bold py-3.5 rounded-xl transition-all shadow-md shadow-teal-100/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Confirm Appointment</span>
              </button>
              <p className="text-[10px] text-slate-400 text-center leading-normal">
                No advanced pre-payment required. Pay directly at clinical desk.
              </p>
            </div>

            {/* Quick Contact Box */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 text-left">
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-teal-400">Contact Information</h3>
              <div className="space-y-3 text-xs font-sans">
                <div className="flex gap-2.5">
                  <Phone className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">OPD Clinic Desk</p>
                    <p className="text-slate-300 mt-0.5">+91-522-4581290</p>
                  </div>
                </div>
                <div className="flex gap-2.5 border-t border-slate-800 pt-3">
                  <Mail className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Helpline Email</p>
                    <p className="text-slate-300 mt-0.5">desk@medlucknow.directory</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Articles list */}
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-xs text-slate-500 uppercase tracking-wider text-left">Related Guides</h4>
              {relatedArticles.map(art => (
                <div 
                  key={art.id}
                  onClick={() => alert(`Related Medical Guide: \n\n${art.title}`)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-teal-100 shadow-xs hover:shadow-md transition-all flex gap-3 items-center cursor-pointer text-left"
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-sans font-bold text-slate-800 text-xs leading-tight line-clamp-2">
                      {art.title}
                    </h5>
                    <span className="text-[10px] text-teal-600 font-bold mt-1 block">
                      {art.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* 3. RELATED PROVIDERS (Nearby) */}
        <div className="border-t border-slate-200 mt-12 pt-10 pb-8">
          <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-slate-900 text-left mb-6">
            Similar Healthcare Providers Nearby
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProviders.map((prov) => {
              const relLabel = prov.type === ProviderType.DOCTOR ? `Dr. ${prov.name}` : prov.name;
              return (
                <div 
                  key={prov.id}
                  onClick={() => onSelectProvider(prov.id)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-lg cursor-pointer transition-all flex gap-4 text-left items-start"
                >
                  <img
                    src={prov.image}
                    alt={prov.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {prov.type.replace("_", " ").toUpperCase()}
                    </span>
                    <h4 className="font-sans font-extrabold text-sm text-slate-800 leading-snug">
                      {relLabel}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-0.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {prov.localityId.replace("-", " ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* REPORT LISTING MODAL SHEET */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left">
            <h3 className="font-sans font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0" />
              Report Incorrect Information
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              Help us maintain medical standards. Let us know if consultation fee, clinical address, or credentials of Dr. {provider.name} require auditing.
            </p>

            {reportSubmitted ? (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-400/20 text-emerald-800 rounded-xl text-xs sm:text-sm text-center">
                Thank you! Your feedback has been queued. Our verification officers will audit this profile within 12 hours.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 mt-6 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">What is incorrect?</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700">
                    <option>Consultation fee is outdated</option>
                    <option>Clinical timings are incorrect</option>
                    <option>Address or contact is incorrect</option>
                    <option>Practitioner qualification is outdated</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Provide correct details</label>
                  <textarea 
                    required
                    placeholder="Provide details to assist our verification team..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 h-24 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
