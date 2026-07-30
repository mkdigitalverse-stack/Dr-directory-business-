import React, { useState, useMemo } from "react";
import { 
  Search, MapPin, Star, Filter, RotateCcw, Clock, ShieldCheck, 
  ChevronDown, Phone, Globe, DollarSign, Activity, Award, User, HelpCircle, AlertCircle,
  CheckCircle, Landmark, ShieldAlert, GraduationCap, Building2, Eye, Flame 
} from "lucide-react";
import { Provider, ProviderType, SearchParams, ViewState } from "../types";
import { LOCALITIES, SPECIALTIES } from "../data";
import MedicalAvatar from "./MedicalAvatar";

interface SearchViewProps {
  providers: Provider[];
  initialSearchParams: SearchParams;
  onNavigate: (view: ViewState) => void;
  onSelectProvider: (id: string) => void;
  onBookAppointment: (provider: Provider) => void;
}

export default function SearchView({ 
  providers, 
  initialSearchParams, 
  onNavigate, 
  onSelectProvider, 
  onBookAppointment 
}: SearchViewProps) {
  
  // Internal filter state starting from initial search params
  const [params, setParams] = useState<SearchParams>(initialSearchParams);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync internal filter state whenever search params passed from Header/App change
  React.useEffect(() => {
    setParams(initialSearchParams);
  }, [initialSearchParams]);

  // Update specific search parameter helper
  const updateParam = (key: keyof SearchParams, value: any) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset all filters helper
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
      emergencyServices: false
    });
  };

  // Dynamic filter logic execution
  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      // 1. Filter by search query (name, specialties, treatments, about)
      if (params.query) {
        const queryLower = params.query.toLowerCase();
        const matchesName = provider.name.toLowerCase().includes(queryLower);
        const matchesSpecialties = provider.specialties.some(s => s.toLowerCase().includes(queryLower));
        const matchesTreatments = provider.treatments.some(t => t.toLowerCase().includes(queryLower));
        const matchesAbout = provider.about.toLowerCase().includes(queryLower);
        
        if (!matchesName && !matchesSpecialties && !matchesTreatments && !matchesAbout) {
          return false;
        }
      }

      // 2. Filter by provider type (doctor, clinic, hospital, diagnostic_lab)
      if (params.type !== "all" && provider.type !== params.type) {
        return false;
      }

      // 3. Filter by specialty
      if (params.specialty && !provider.specialties.some(s => s.toLowerCase() === params.specialty.toLowerCase())) {
        return false;
      }

      // 4. Filter by locality
      if (params.locality && provider.localityId !== params.locality) {
        return false;
      }

      // 5. Filter by experience (e.g. "5+", "10+", "15+")
      if (params.experience) {
        const minExp = parseInt(params.experience.replace("+", ""), 10);
        if (provider.experienceYears < minExp) return false;
      }

      // 6. Filter by consultation fee
      if (params.fee) {
        if (params.fee === "<500" && provider.consultationFee >= 500) return false;
        if (params.fee === "500-1000" && (provider.consultationFee < 500 || provider.consultationFee > 1000)) return false;
        if (params.fee === ">1000" && provider.consultationFee <= 1000) return false;
      }

      // 7. Filter by rating (e.g. "4.0+")
      if (params.rating) {
        const minRating = parseFloat(params.rating.replace("+", ""));
        if (provider.rating < minRating) return false;
      }

      // 8. Filter by emergency services
      if (params.emergencyServices && !provider.emergencyServices) {
        return false;
      }

      // 9. Filter by language
      if (params.language && !provider.languages.some(l => l.toLowerCase() === params.language.toLowerCase())) {
        return false;
      }

      // 10. Filter by insurance provider (simple search against provider tags)
      if (params.insurance && provider.insuranceAccepted) {
        const searchIns = params.insurance.toLowerCase();
        const matchesIns = provider.insuranceAccepted.some(i => i.toLowerCase().includes(searchIns));
        if (!matchesIns) return false;
      }

      return true;
    });
  }, [providers, params]);

  return (
    <div id="search-view" className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb & Intro */}
        <div className="mb-6 text-xs sm:text-sm text-slate-500 font-sans flex items-center gap-1.5 flex-wrap">
          <span className="hover:text-teal-600 cursor-pointer" onClick={() => onNavigate("home")}>Home</span>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Lucknow Directory Search</span>
        </div>

        <div className="mb-8 space-y-4">
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Verified Healthcare Listings in Lucknow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            All listed clinics and physicians hold active registrations verified against National Medical Commission directories. Use our filter drawer to narrow down options.
          </p>
        </div>

        {/* Global Search Bar Refinement */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by specialty, treatment name, doctor, or clinic..."
              value={params.query}
              onChange={(e) => updateParam("query", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
            />
          </div>

          <div className="w-full md:w-48 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={params.locality}
              onChange={(e) => updateParam("locality", e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all appearance-none"
            >
              <option value="">All Lucknow Localities</option>
              {LOCALITIES.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={resetFilters}
            className="border border-slate-200 hover:bg-slate-100 text-slate-600 font-sans text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 shrink-0" />
            <span>Reset Search</span>
          </button>
        </div>

        {/* Desktop Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: FILTERS PANEL (Desktop) */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-teal-600" />
                  Filter Listings
                </span>
                <button onClick={resetFilters} className="text-xs text-teal-600 hover:text-teal-800 font-semibold cursor-pointer">
                  Clear All
                </button>
              </div>

              {/* 1. Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Provider Type</label>
                <div className="space-y-1.5">
                  {[
                    { label: "All Formats", val: "all" },
                    { label: "Doctors", val: ProviderType.DOCTOR },
                    { label: "Clinics", val: ProviderType.CLINIC },
                    { label: "Hospitals", val: ProviderType.HOSPITAL },
                    { label: "Diagnostics Labs", val: ProviderType.LAB }
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => updateParam("type", item.val)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${
                        params.type === item.val 
                          ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600" 
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Specialties Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Specialty</label>
                <select
                  value={params.specialty}
                  onChange={(e) => updateParam("specialty", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                >
                  <option value="">All Specialties</option>
                  {SPECIALTIES.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* 3. Fee range filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Consultation Fee</label>
                <div className="space-y-1.5">
                  {[
                    { label: "Under ₹500", val: "<500" },
                    { label: "₹500 - ₹1000", val: "500-1000" },
                    { label: "Above ₹1000", val: ">1000" }
                  ].map((item) => {
                    const isChecked = params.fee === item.val;
                    return (
                      <label key={item.val} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="fee_range"
                          checked={isChecked}
                          onChange={() => updateParam("fee", isChecked ? "" : item.val)}
                          className="text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Experience Years Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Experience</label>
                <select
                  value={params.experience}
                  onChange={(e) => updateParam("experience", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">Any Experience</option>
                  <option value="5+">5+ Years</option>
                  <option value="10+">10+ Years</option>
                  <option value="15+">15+ Years</option>
                </select>
              </div>

              {/* 5. Rating Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Minimum Rating</label>
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

              {/* 6. Emergency Toggle */}
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

              {/* 7. Languages Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Languages</label>
                <select
                  value={params.language}
                  onChange={(e) => updateParam("language", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Any Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Urdu">Urdu</option>
                </select>
              </div>

            </div>
          </aside>

          {/* RIGHT COLUMN: LISTING RESULTS */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Results metadata summary */}
            <div className="flex justify-between items-center bg-white px-5 py-3.5 rounded-xl border border-slate-100 shadow-xs">
              <span className="text-xs sm:text-sm text-slate-500 font-sans">
                Found <strong className="text-slate-800">{filteredProviders.length}</strong> verified healthcare structures
              </span>
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Results Card Grid / list */}
            {filteredProviders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4 shadow-xs">
                <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto stroke-[2.5]" />
                <h3 className="font-sans font-extrabold text-lg text-slate-800">No Listings Match Your Search</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  Try adjusting your locality, expanding specialties, or disabling specific filter selectors to locate available practitioners.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-sans text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProviders.map((provider) => {
                  const typeLabel = provider.type === ProviderType.DOCTOR ? `Dr. ${provider.name}` : provider.name;
                  return (
                    <div 
                      key={provider.id}
                      className="bg-white rounded-2xl border border-slate-100 hover:border-teal-200 p-5 sm:p-6 transition-all hover:shadow-xl hover:shadow-teal-50/20 flex flex-col sm:flex-row gap-5"
                    >
                      {/* Left: Medical Vector Avatar / Image with verified badge overlay */}
                      <div className="relative shrink-0 mx-auto sm:mx-0">
                        <MedicalAvatar
                          src={provider.image}
                          name={typeLabel}
                          type={provider.type}
                          className="w-32 h-32"
                        />
                        {provider.verified && (
                          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1.5 whitespace-nowrap z-30">
                            <CheckCircle className="h-3 w-3 fill-white text-teal-600 shrink-0" />
                            Verified
                          </span>
                        )}
                      </div>

                      {/* Right Content */}
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5 text-center sm:text-left">
                          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                            <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                              {provider.type.replace("_", " ")}
                            </span>
                            <span className="text-amber-500 flex items-center text-xs font-semibold gap-0.5">
                              <Star className="h-3.5 w-3.5 fill-amber-500" />
                              {provider.rating}
                            </span>
                            <span className="text-slate-400 text-xs">({provider.reviewsCount} reviews)</span>
                          </div>

                          <h3 
                            onClick={() => onSelectProvider(provider.id)}
                            className="font-sans font-extrabold text-lg text-slate-900 hover:text-teal-600 cursor-pointer transition-colors"
                          >
                            {typeLabel}
                          </h3>

                          {provider.qualification && (
                            <p className="text-xs text-slate-500 font-medium font-sans">
                              {provider.qualification}
                            </p>
                          )}

                          <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1 font-sans">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{provider.address}</span>
                          </p>
                        </div>

                        {/* Specialities, Treatments tags */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                          {provider.specialties.map(spec => (
                            <span key={spec} className="bg-teal-50 text-teal-700 text-[10px] font-semibold px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                          {provider.treatments.slice(0, 2).map(treat => (
                            <span key={treat} className="bg-slate-50 text-slate-600 text-[10px] font-semibold px-2 py-1 rounded border border-slate-100">
                              {treat}
                            </span>
                          ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                          <div className="text-center sm:text-left text-xs font-sans text-slate-500">
                            {provider.experienceYears > 0 && (
                              <p>Experience: <strong className="text-slate-800">{provider.experienceYears} Years</strong></p>
                            )}
                            <p className="mt-0.5">Consultation Fee: <strong className="text-teal-600 font-bold">₹{provider.consultationFee}</strong></p>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => onSelectProvider(provider.id)}
                              className="flex-1 sm:flex-initial border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl text-center cursor-pointer"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => onBookAppointment(provider)}
                              className="flex-1 sm:flex-initial bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl text-center cursor-pointer shadow-xs hover:shadow-md transition-all"
                            >
                              Book Appointment
                            </button>
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
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-80 bg-white min-h-full p-6 space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-250">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="font-sans font-bold text-slate-800 text-sm">Filters</span>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-full bg-slate-50 text-slate-400 hover:text-slate-700"
                >
                  &times;
                </button>
              </div>

              {/* Re-use core filter UI */}
              <div className="space-y-4 overflow-y-auto max-h-[75vh] pr-2">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Provider Type</label>
                  <select
                    value={params.type}
                    onChange={(e) => updateParam("type", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="all">All Formats</option>
                    <option value={ProviderType.DOCTOR}>Doctors</option>
                    <option value={ProviderType.CLINIC}>Clinics</option>
                    <option value={ProviderType.HOSPITAL}>Hospitals</option>
                    <option value={ProviderType.LAB}>Diagnostic Labs</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Specialty</label>
                  <select
                    value={params.specialty}
                    onChange={(e) => updateParam("specialty", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="">All Specialties</option>
                    {SPECIALTIES.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Fee Option</label>
                  <select
                    value={params.fee}
                    onChange={(e) => updateParam("fee", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="">Any Price</option>
                    <option value="<500">Under ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value=">1000">Above ₹1000</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Min Rating</label>
                  <select
                    value={params.rating}
                    onChange={(e) => updateParam("rating", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs"
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
                  <span>24/7 Emergency</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-center text-sm cursor-pointer"
            >
              Apply Filters ({filteredProviders.length})
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
