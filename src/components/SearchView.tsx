import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, MapPin, Star, Filter, RotateCcw, Clock, ShieldCheck, 
  ChevronDown, Phone, Globe, DollarSign, Activity, Award, User, HelpCircle, AlertCircle,
  CheckCircle, Landmark, ShieldAlert, GraduationCap, Building2, Eye, Flame, Navigation,
  Calendar, X, SlidersHorizontal, ArrowRight, Sparkles, CheckCircle2, Stethoscope, Hospital as HospitalIcon, FlaskConical, MessageSquare
} from "lucide-react";
import { Provider, ProviderType, SearchParams, ViewState } from "../types";
import { LOCALITIES, SPECIALTIES, CITIES } from "../data";
import MedicalAvatar from "./MedicalAvatar";

interface SearchViewProps {
  providers: Provider[];
  initialSearchParams: SearchParams;
  onNavigate: (view: ViewState) => void;
  onSelectProvider: (id: string) => void;
  onBookAppointment: (provider: Provider) => void;
  onUpdateSearchParams?: (params: Partial<SearchParams>) => void;
}

export default function SearchView({ 
  providers, 
  initialSearchParams, 
  onNavigate, 
  onSelectProvider, 
  onBookAppointment,
  onUpdateSearchParams
}: SearchViewProps) {
  
  // Internal filter state starting from initial search params
  const [params, setParams] = useState<SearchParams>(() => {
    // Try to read from URL search params on mount if available
    if (typeof window !== "undefined" && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        query: urlParams.get("query") || urlParams.get("q") || initialSearchParams.query || "",
        type: (urlParams.get("type") as any) || initialSearchParams.type || "all",
        specialty: urlParams.get("specialty") || initialSearchParams.specialty || "",
        locality: urlParams.get("locality") || initialSearchParams.locality || "",
        city: urlParams.get("city") || initialSearchParams.city || "lucknow",
        gender: urlParams.get("gender") || initialSearchParams.gender || "",
        experience: urlParams.get("experience") || initialSearchParams.experience || "",
        fee: urlParams.get("fee") || initialSearchParams.fee || "",
        rating: urlParams.get("rating") || initialSearchParams.rating || "",
        availability: urlParams.get("availability") || initialSearchParams.availability || "",
        insurance: urlParams.get("insurance") || initialSearchParams.insurance || "",
        language: urlParams.get("language") || initialSearchParams.language || "",
        onlineConsultation: urlParams.get("online") === "true" || initialSearchParams.onlineConsultation || false,
        emergencyServices: urlParams.get("emergency") === "true" || initialSearchParams.emergencyServices || false,
        sort: (urlParams.get("sort") as any) || initialSearchParams.sort || "relevance"
      };
    }
    return initialSearchParams;
  });

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync internal filter state whenever search params passed from parent props change
  useEffect(() => {
    if (initialSearchParams) {
      setParams(prev => ({
        ...prev,
        ...initialSearchParams
      }));
    }
  }, [initialSearchParams]);

  // Sync current search parameters to the URL query string & window history
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.pathname = "/search";
    
    // Clear existing params first to build clean URL
    const newSearchParams = new URLSearchParams();

    if (params.query) newSearchParams.set("query", params.query);
    if (params.type && params.type !== "all") newSearchParams.set("type", params.type);
    if (params.specialty) newSearchParams.set("specialty", params.specialty);
    if (params.locality) newSearchParams.set("locality", params.locality);
    if (params.city && params.city !== "lucknow") newSearchParams.set("city", params.city);
    if (params.sort && params.sort !== "relevance") newSearchParams.set("sort", params.sort);
    if (params.fee) newSearchParams.set("fee", params.fee);
    if (params.rating) newSearchParams.set("rating", params.rating);
    if (params.experience) newSearchParams.set("experience", params.experience);
    if (params.emergencyServices) newSearchParams.set("emergency", "true");

    const searchStr = newSearchParams.toString();
    const newRelativePathQuery = window.location.pathname + (searchStr ? "?" + searchStr : "");
    window.history.replaceState({ path: newRelativePathQuery }, "", newRelativePathQuery);

    // Update document page title & metadata dynamically
    const displaySpecialty = params.specialty ? params.specialty : "Healthcare Providers";
    const localityObj = LOCALITIES.find(l => l.id === params.locality);
    const displayLocality = localityObj ? `in ${localityObj.name}` : "in Lucknow";
    document.title = `Find ${displaySpecialty} ${displayLocality} | Lucknow Healthcare Directory`;

    if (onUpdateSearchParams) {
      onUpdateSearchParams(params);
    }
  }, [params, onUpdateSearchParams]);

  // Helper to update individual parameter
  const updateParam = (key: keyof SearchParams, value: any) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset all search filters helper
  const resetFilters = () => {
    setParams({
      query: "",
      type: "all",
      specialty: "",
      locality: "",
      city: "lucknow",
      gender: "",
      experience: "",
      fee: "",
      rating: "",
      availability: "",
      insurance: "",
      language: "",
      onlineConsultation: false,
      emergencyServices: false,
      sort: "relevance"
    });
  };

  // Intelligent Natural Query Intent Parser + Multi-factor Filtering Logic
  const filteredAndSortedProviders = useMemo(() => {
    const rawFiltered = providers.filter(provider => {
      // REQUIREMENT 1 & 20: STRICT SECURITY & APPROVAL FILTER
      // Public search MUST ONLY return status === APPROVED (or legacy providers verified without status field)
      // NEVER expose DRAFT, SUBMITTED, UNDER_REVIEW, REJECTED, or SUSPENDED providers!
      if (provider.status && provider.status !== "APPROVED") {
        return false;
      }

      // REQUIREMENT 3: City Filter
      if (params.city && provider.cityId && provider.cityId.toLowerCase() !== params.city.toLowerCase()) {
        return false;
      }

      // REQUIREMENT 1 & 2: Natural Query Matching across Name, Specialty, Services, Clinic/Hospital/Lab, Locality
      if (params.query.trim()) {
        const queryLower = params.query.trim().toLowerCase();

        // Check if query contains natural locality mentions e.g. "in Gomti Nagar", "Aliganj"
        const matchedLocality = LOCALITIES.find(loc => 
          queryLower.includes(loc.name.toLowerCase()) || queryLower.includes(loc.id)
        );

        // Check if query contains provider type keywords
        const queryHasDoc = queryLower.includes("doctor") || queryLower.includes("physician") || queryLower.includes("dr");
        const queryHasClinic = queryLower.includes("clinic");
        const queryHasHospital = queryLower.includes("hospital");
        const queryHasLab = queryLower.includes("lab") || queryLower.includes("diagnostic") || queryLower.includes("pathology");

        // Field match checks
        const matchesName = provider.name.toLowerCase().includes(queryLower);
        const matchesSpecialties = provider.specialties.some(s => s.toLowerCase().includes(queryLower));
        const matchesTreatments = provider.treatments.some(t => t.toLowerCase().includes(queryLower));
        const matchesServices = provider.services?.some(s => s.toLowerCase().includes(queryLower));
        const matchesAbout = provider.about?.toLowerCase().includes(queryLower);
        const matchesQualification = provider.qualification?.toLowerCase().includes(queryLower);
        const matchesAddress = provider.address.toLowerCase().includes(queryLower);
        const matchesLocalityId = provider.localityId.toLowerCase().includes(queryLower);

        // Natural query tokenized matching
        const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2 && t !== "in" && t !== "and" && t !== "for" && t !== "the");
        const matchesTokens = queryTokens.length > 0 && queryTokens.every(token => 
          provider.name.toLowerCase().includes(token) ||
          provider.specialties.some(s => s.toLowerCase().includes(token)) ||
          provider.treatments.some(t => t.toLowerCase().includes(token)) ||
          provider.address.toLowerCase().includes(token) ||
          provider.localityId.toLowerCase().includes(token)
        );

        const isDirectMatch = matchesName || matchesSpecialties || matchesTreatments || matchesServices || matchesAbout || matchesQualification || matchesAddress || matchesLocalityId || matchesTokens;

        if (!isDirectMatch) {
          // If query has specific intent tokens like "cardiologist in gomti nagar", verify match
          if (matchedLocality && provider.localityId !== matchedLocality.id && !provider.address.toLowerCase().includes(matchedLocality.name.toLowerCase())) {
            return false;
          }
          if (queryHasDoc && provider.type !== ProviderType.DOCTOR) return false;
          if (queryHasClinic && provider.type !== ProviderType.CLINIC) return false;
          if (queryHasHospital && provider.type !== ProviderType.HOSPITAL) return false;
          if (queryHasLab && provider.type !== ProviderType.LAB) return false;
          
          if (!matchedLocality && !queryHasDoc && !queryHasClinic && !queryHasHospital && !queryHasLab) {
            return false;
          }
        }
      }

      // REQUIREMENT 4: Filter by Provider Type
      if (params.type !== "all" && provider.type !== params.type) {
        return false;
      }

      // REQUIREMENT 4: Filter by Specialty
      if (params.specialty) {
        const specTarget = params.specialty.toLowerCase();
        const hasSpec = provider.specialties.some(s => 
          s.toLowerCase() === specTarget || 
          s.toLowerCase().includes(specTarget) || 
          specTarget.includes(s.toLowerCase())
        );
        if (!hasSpec) return false;
      }

      // REQUIREMENT 4: Filter by Locality
      if (params.locality && provider.localityId !== params.locality && !provider.address.toLowerCase().includes(params.locality.toLowerCase())) {
        return false;
      }

      // Filter by Experience Years
      if (params.experience) {
        const minExp = parseInt(params.experience.replace("+", ""), 10);
        if (provider.experienceYears < minExp) return false;
      }

      // Filter by Consultation Fee
      if (params.fee) {
        if (params.fee === "<500" && provider.consultationFee >= 500) return false;
        if (params.fee === "500-1000" && (provider.consultationFee < 500 || provider.consultationFee > 1000)) return false;
        if (params.fee === ">1000" && provider.consultationFee <= 1000) return false;
      }

      // Filter by Rating
      if (params.rating) {
        const minRating = parseFloat(params.rating.replace("+", ""));
        if (provider.rating < minRating) return false;
      }

      // Filter by 24/7 Emergency Support
      if (params.emergencyServices && !provider.emergencyServices) {
        return false;
      }

      // Filter by Language
      if (params.language && !provider.languages.some(l => l.toLowerCase() === params.language.toLowerCase())) {
        return false;
      }

      return true;
    });

    // REQUIREMENT 6 & 10: DETERMINISTIC RELEVANCE RANKING & SORTING
    const scoredList = rawFiltered.map(provider => {
      let score = 0;
      const queryLower = params.query.trim().toLowerCase();

      if (queryLower) {
        if (provider.name.toLowerCase().includes(queryLower)) score += 100;
        if (provider.specialties.some(s => s.toLowerCase().includes(queryLower))) score += 80;
        if (provider.treatments.some(t => t.toLowerCase().includes(queryLower))) score += 60;
        if (provider.address.toLowerCase().includes(queryLower)) score += 40;
      }

      if (params.specialty && provider.specialties.some(s => s.toLowerCase().includes(params.specialty.toLowerCase()))) {
        score += 50;
      }

      if (params.locality && provider.localityId === params.locality) {
        score += 30;
      }

      // Quality signals weighting
      score += (provider.rating || 4.0) * 10;
      score += Math.min(provider.reviewsCount || 0, 50) * 0.5;
      score += (provider.profileCompletenessScore || 80) * 0.2;

      return { provider, score };
    });

    const sortOption = params.sort || "relevance";

    scoredList.sort((a, b) => {
      if (sortOption === "rating") {
        return b.provider.rating - a.provider.rating || b.provider.reviewsCount - a.provider.reviewsCount;
      }
      if (sortOption === "experience") {
        return b.provider.experienceYears - a.provider.experienceYears;
      }
      if (sortOption === "fee_asc") {
        return a.provider.consultationFee - b.provider.consultationFee;
      }
      if (sortOption === "fee_desc") {
        return b.provider.consultationFee - a.provider.consultationFee;
      }
      // Default: Relevance
      return b.score - a.score;
    });

    return scoredList.map(item => item.provider);
  }, [providers, params]);

  // Current locality object helper
  const selectedLocalityObj = LOCALITIES.find(l => l.id === params.locality);

  return (
    <div id="search-view" className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* REQUIREMENT 3 & 14: LOCATION HIERARCHY & BREADCRUMBS */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 font-sans">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="hover:text-teal-600 cursor-pointer" onClick={() => onNavigate("home")}>India</span>
            <span>/</span>
            <span className="hover:text-teal-600 cursor-pointer" onClick={() => onNavigate("home")}>Uttar Pradesh</span>
            <span>/</span>
            <span 
              className={`hover:text-teal-600 cursor-pointer ${!params.locality ? "font-bold text-slate-800" : ""}`}
              onClick={() => updateParam("locality", "")}
            >
              Lucknow
            </span>
            {selectedLocalityObj && (
              <>
                <span>/</span>
                <span className="text-teal-700 font-bold">{selectedLocalityObj.name}</span>
              </>
            )}
            {params.specialty && (
              <>
                <span>/</span>
                <span className="text-slate-800 font-bold">{params.specialty}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">City:</span>
            <select
              value={params.city || "lucknow"}
              onChange={(e) => updateParam("city", e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {CITIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* PAGE INTRO BANNER */}
        <div className="space-y-1">
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {params.specialty ? `${params.specialty} Specialists` : "Verified Healthcare Providers"}
            {selectedLocalityObj ? ` in ${selectedLocalityObj.name}, Lucknow` : " in Lucknow, UP"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Discover verified doctors, super specialty hospitals, multi-specialty clinics, and diagnostic labs. All profiles hold active medical licenses verified by Lucknow Healthcare Moderation.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
          
          {/* Natural Text Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search provider, specialty (e.g. Cardiologist), or locality (e.g. Gomti Nagar)..."
              value={params.query}
              onChange={(e) => updateParam("query", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all"
            />
            {params.query && (
              <button 
                onClick={() => updateParam("query", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Locality Quick Selector */}
          <div className="w-full md:w-52 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600" />
            <select
              value={params.locality}
              onChange={(e) => updateParam("locality", e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Lucknow Localities</option>
              {LOCALITIES.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.zone || "Lucknow"})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset Filters CTA */}
          <button
            onClick={resetFilters}
            className="border border-slate-200 hover:bg-slate-100 text-slate-600 font-sans text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            <span>Reset</span>
          </button>
        </div>

        {/* REQUIREMENT 10 & 11: DISCOVERY QUICK CHIPS (SPECIALTY & LOCALITY) */}
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          
          {/* Provider Format Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Type:</span>
            {[
              { label: "All Formats", val: "all", icon: ShieldCheck },
              { label: "Doctors", val: ProviderType.DOCTOR, icon: Stethoscope },
              { label: "Clinics", val: ProviderType.CLINIC, icon: Building2 },
              { label: "Hospitals", val: ProviderType.HOSPITAL, icon: HospitalIcon },
              { label: "Diagnostic Labs", val: ProviderType.LAB, icon: FlaskConical }
            ].map(item => {
              const IconComp = item.icon;
              const isActive = params.type === item.val;
              return (
                <button
                  key={item.val}
                  onClick={() => updateParam("type", item.val)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <IconComp className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Specialty:</span>
            <button
              onClick={() => updateParam("specialty", "")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 ${
                !params.specialty ? "bg-teal-100 text-teal-800 font-bold" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Specialties
            </button>
            {SPECIALTIES.map(s => (
              <button
                key={s.id}
                onClick={() => updateParam("specialty", params.specialty === s.name ? "" : s.name)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-all ${
                  params.specialty === s.name
                    ? "bg-teal-600 text-white font-bold"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Locality:</span>
            <button
              onClick={() => updateParam("locality", "")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 ${
                !params.locality ? "bg-teal-100 text-teal-800 font-bold" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Entire Lucknow
            </button>
            {LOCALITIES.map(loc => (
              <button
                key={loc.id}
                onClick={() => updateParam("locality", params.locality === loc.id ? "" : loc.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-all ${
                  params.locality === loc.id
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN RESULTS GRID & SIDEBAR FILTERS SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-2">
          
          {/* LEFT SIDEBAR: FILTERS PANEL (Desktop) */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5 sticky top-24">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-teal-600" />
                  Filter Listings
                </span>
                <button onClick={resetFilters} className="text-xs text-teal-600 hover:text-teal-800 font-bold cursor-pointer">
                  Clear All
                </button>
              </div>

              {/* 1. Category Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Provider Format</label>
                <div className="space-y-1">
                  {[
                    { label: "All Formats", val: "all" },
                    { label: "Doctors & Specialists", val: ProviderType.DOCTOR },
                    { label: "Multi-Specialty Clinics", val: ProviderType.CLINIC },
                    { label: "Hospitals & Medical Centers", val: ProviderType.HOSPITAL },
                    { label: "Diagnostic Labs & Pathology", val: ProviderType.LAB }
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => updateParam("type", item.val)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        params.type === item.val 
                          ? "bg-teal-50 text-teal-800 font-bold border-l-4 border-teal-600" 
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Fee range filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Consultation Fee</label>
                <div className="space-y-1.5">
                  {[
                    { label: "Any Fee Range", val: "" },
                    { label: "Under ₹500", val: "<500" },
                    { label: "₹500 - ₹1000", val: "500-1000" },
                    { label: "Above ₹1000", val: ">1000" }
                  ].map((item) => {
                    const isChecked = params.fee === item.val;
                    return (
                      <label key={item.val} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                        <input
                          type="radio"
                          name="fee_range"
                          checked={isChecked}
                          onChange={() => updateParam("fee", item.val)}
                          className="text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Experience Years Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Minimum Experience</label>
                <select
                  value={params.experience}
                  onChange={(e) => updateParam("experience", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">Any Experience</option>
                  <option value="5+">5+ Years Experience</option>
                  <option value="10+">10+ Years Experience</option>
                  <option value="15+">15+ Years Experience</option>
                </select>
              </div>

              {/* 4. Rating Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Minimum Rating</label>
                <select
                  value={params.rating}
                  onChange={(e) => updateParam("rating", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">All Ratings</option>
                  <option value="4.0+">4.0★ &amp; Above</option>
                  <option value="4.5+">4.5★ &amp; Above</option>
                  <option value="4.8+">4.8★ &amp; Above</option>
                </select>
              </div>

              {/* 5. Emergency Toggle */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.emergencyServices}
                    onChange={(e) => updateParam("emergencyServices", e.target.checked)}
                    className="text-rose-600 focus:ring-rose-500 rounded h-4 w-4"
                  />
                  <span>24/7 Emergency Support</span>
                </label>
              </div>

            </div>
          </aside>

          {/* RIGHT COLUMN: SEARCH RESULTS */}
          <main className="lg:col-span-3 space-y-5">
            
            {/* REQUIREMENT 9 & 10: RESULT COUNT & SORTING BAR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              
              <div className="text-xs sm:text-sm text-slate-600 font-sans">
                Showing <strong className="text-slate-900 font-extrabold">{filteredAndSortedProviders.length}</strong> verified
                {params.specialty ? ` ${params.specialty}` : " healthcare"}
                {params.type !== "all" ? ` ${params.type}s` : " listings"}
                {selectedLocalityObj ? ` in ${selectedLocalityObj.name}, Lucknow` : " in Lucknow"}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Sort by:</span>
                  <select
                    value={params.sort || "relevance"}
                    onChange={(e) => updateParam("sort", e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating: High to Low</option>
                    <option value="experience">Experience: High to Low</option>
                    <option value="fee_asc">Fee: Low to High</option>
                    <option value="fee_desc">Fee: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* REQUIREMENT 8: EMPTY SEARCH STATES WITH HELPFUL ALTERNATIVES */}
            {filteredAndSortedProviders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-6 shadow-2xs">
                <div className="bg-amber-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto border border-amber-200">
                  <ShieldAlert className="h-8 w-8 text-amber-600 stroke-[2]" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="font-sans font-extrabold text-xl text-slate-900">
                    We couldn't find an exact match
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    No approved healthcare listings match your active search filters. Try broadening your criteria or search across all Lucknow localities.
                  </p>
                </div>

                {/* Helpful Alternative Action Chips */}
                <div className="pt-2 max-w-lg mx-auto space-y-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={resetFilters}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Clear All Filters
                    </button>

                    {params.locality && (
                      <button
                        onClick={() => updateParam("locality", "")}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-sans text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <MapPin className="h-3.5 w-3.5 text-teal-600" />
                        Search Entire Lucknow
                      </button>
                    )}
                  </div>

                  {/* Browse Top Specialties Quick Buttons */}
                  <div className="space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Browse Top Medical Specialties:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Cardiology", "Orthopedics & Joint Replacement", "Pediatrics & Neonatal Care", "Dermatology", "Gynecology & Obstetrics", "Dentistry"].map(spec => (
                        <button
                          key={spec}
                          onClick={() => {
                            resetFilters();
                            updateParam("specialty", spec);
                          }}
                          className="bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Explore Popular Localities Quick Buttons */}
                  <div className="space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Explore Major Lucknow Localities:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {LOCALITIES.slice(0, 6).map(loc => (
                        <button
                          key={loc.id}
                          onClick={() => {
                            resetFilters();
                            updateParam("locality", loc.id);
                          }}
                          className="bg-white hover:bg-slate-900 border border-slate-200 text-slate-700 hover:text-white text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          📍 {loc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* REQUIREMENT 5: PROVIDER RESULT CARDS */
              <div className="space-y-4">
                {filteredAndSortedProviders.map((provider) => {
                  const typeLabel = provider.type === ProviderType.DOCTOR ? `Dr. ${provider.name}` : provider.name;
                  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${provider.name} ${provider.address} Lucknow`)}`;

                  return (
                    <div 
                      key={provider.id}
                      className="bg-white rounded-3xl border border-slate-200/80 hover:border-teal-300 p-5 sm:p-6 transition-all hover:shadow-xl hover:shadow-teal-950/5 flex flex-col sm:flex-row gap-5"
                    >
                      {/* Left: Medical Vector Avatar / Image with verified badge overlay */}
                      <div className="relative shrink-0 mx-auto sm:mx-0">
                        <MedicalAvatar
                          src={provider.image}
                          name={typeLabel}
                          type={provider.type}
                          className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl"
                        />
                        {provider.verified && (
                          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1.5 whitespace-nowrap z-20">
                            <CheckCircle className="h-3 w-3 fill-white text-teal-600 shrink-0" />
                            NMC Verified
                          </span>
                        )}
                      </div>

                      {/* Right Content */}
                      <div className="flex-1 flex flex-col justify-between space-y-3">
                        
                        <div className="space-y-1.5 text-center sm:text-left">
                          
                          {/* Badges Bar */}
                          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                              {provider.type.replace("_", " ")}
                            </span>

                            <span className="text-amber-500 flex items-center text-xs font-bold gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                              <Star className="h-3.5 w-3.5 fill-amber-500" />
                              {provider.rating}
                            </span>
                            
                            <span className="text-slate-400 text-xs font-sans">({provider.reviewsCount} reviews)</span>

                            {provider.emergencyServices && (
                              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">
                                24/7 Emergency
                              </span>
                            )}
                          </div>

                          {/* Provider Name */}
                          <h3 
                            onClick={() => onSelectProvider(provider.id)}
                            className="font-sans font-extrabold text-lg sm:text-xl text-slate-900 hover:text-teal-600 cursor-pointer transition-colors leading-tight"
                          >
                            {typeLabel}
                          </h3>

                          {provider.qualification && (
                            <p className="text-xs text-slate-600 font-semibold font-sans">
                              {provider.qualification}
                            </p>
                          )}

                          {/* Location */}
                          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-sans">
                            <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                            <span>{provider.address}</span>
                          </p>
                        </div>

                        {/* Specialities & Treatments Tags */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                          {provider.specialties.map(spec => (
                            <span key={spec} className="bg-teal-50 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-teal-100">
                              {spec}
                            </span>
                          ))}
                          {provider.treatments?.slice(0, 2).map(treat => (
                            <span key={treat} className="bg-slate-50 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                              {treat}
                            </span>
                          ))}
                        </div>

                        {/* Divider & Actions */}
                        <div className="border-t border-slate-100 pt-3.5 flex flex-col sm:flex-row justify-between items-center gap-3">
                          
                          <div className="text-center sm:text-left text-xs font-sans text-slate-500">
                            {provider.experienceYears > 0 && (
                              <p>Experience: <strong className="text-slate-800 font-bold">{provider.experienceYears}+ Years</strong></p>
                            )}
                            <p className="mt-0.5">Consultation Fee: <strong className="text-teal-700 font-extrabold text-sm">₹{provider.consultationFee}</strong></p>
                          </div>

                          {/* CTAs Bar */}
                          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                            
                            {/* Secondary Action: Directions */}
                            <a
                              href={googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer transition-all shrink-0"
                              title="Get Directions on Google Maps"
                            >
                              <Navigation className="h-4 w-4 text-teal-600" />
                            </a>

                            {/* Secondary Action: Call */}
                            {provider.phone && (
                              <a
                                href={`tel:${provider.phone}`}
                                className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer transition-all shrink-0"
                                title={`Call ${provider.name}`}
                              >
                                <Phone className="h-4 w-4 text-teal-600" />
                              </a>
                            )}

                            {/* Secondary Action: WhatsApp */}
                            {(provider.directContact?.whatsApp || provider.locations?.[0]?.whatsApp || provider.phone) && (
                              <a
                                href={`https://wa.me/${(provider.directContact?.whatsApp || provider.locations?.[0]?.whatsApp || provider.phone || "").replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl cursor-pointer transition-all shrink-0"
                                title={`WhatsApp ${provider.name}`}
                              >
                                <MessageSquare className="h-4 w-4 text-emerald-600" />
                              </a>
                            )}

                            {/* Primary Action 1: View Profile */}
                            <button
                              onClick={() => onSelectProvider(provider.id)}
                              className="flex-1 sm:flex-initial border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl text-center cursor-pointer transition-all"
                            >
                              View Profile
                            </button>

                            {/* Primary Action 2: Book Appointment or Contact */}
                            {provider.status === "SUSPENDED" || provider.status === "REJECTED" ? (
                              <button
                                disabled
                                className="flex-1 sm:flex-initial bg-slate-100 text-slate-400 text-xs font-bold px-4 py-2.5 rounded-xl text-center cursor-not-allowed"
                              >
                                Booking Unavailable
                              </button>
                            ) : provider.bookingSettings?.onlineBookingEnabled === false ? (
                              <a
                                href={`tel:${provider.phone || "+915224581290"}`}
                                className="flex-1 sm:flex-initial bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl text-center cursor-pointer shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                <span>Contact Provider</span>
                              </a>
                            ) : (
                              <button
                                onClick={() => onBookAppointment(provider)}
                                className="flex-1 sm:flex-initial bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl text-center cursor-pointer shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                              >
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Book Appointment</span>
                              </button>
                            )}
                          </div>

                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>
      </div>

      {/* MOBILE FILTERS SHEET MODAL */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-80 bg-white min-h-full p-6 space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-250">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="font-sans font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-teal-600" />
                  Search &amp; Filter
                </span>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Controls */}
              <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Provider Format</label>
                  <select
                    value={params.type}
                    onChange={(e) => updateParam("type", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="all">All Formats</option>
                    <option value={ProviderType.DOCTOR}>Doctors</option>
                    <option value={ProviderType.CLINIC}>Clinics</option>
                    <option value={ProviderType.HOSPITAL}>Hospitals</option>
                    <option value={ProviderType.LAB}>Diagnostic Labs</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Specialty</label>
                  <select
                    value={params.specialty}
                    onChange={(e) => updateParam("specialty", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="">All Specialties</option>
                    {SPECIALTIES.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Locality</label>
                  <select
                    value={params.locality}
                    onChange={(e) => updateParam("locality", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="">All Lucknow Localities</option>
                    {LOCALITIES.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Fee Range</label>
                  <select
                    value={params.fee}
                    onChange={(e) => updateParam("fee", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="">Any Consultation Fee</option>
                    <option value="<500">Under ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value=">1000">Above ₹1000</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Min Rating</label>
                  <select
                    value={params.rating}
                    onChange={(e) => updateParam("rating", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-medium"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.0+">4.0★ &amp; Above</option>
                    <option value="4.5+">4.5★ &amp; Above</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={params.emergencyServices}
                    onChange={(e) => updateParam("emergencyServices", e.target.checked)}
                    className="text-rose-600 rounded h-4 w-4"
                  />
                  <span>24/7 Emergency Support</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-center text-xs cursor-pointer shadow-md"
              >
                Apply Filters ({filteredAndSortedProviders.length} results)
              </button>
              <button
                onClick={resetFilters}
                className="w-full bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl text-center text-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
