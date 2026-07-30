import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Apple, 
  Wind, 
  Calendar, 
  ChevronRight,
  ChevronLeft,
  Info,
  Share2,
  Stethoscope
} from "lucide-react";
import { ViewState } from "../types";

interface HealthTip {
  id: string;
  title: string;
  category: string;
  summary: string;
  actionableItem: string;
  tag: string;
  urgency: "high" | "medium" | "general" | string;
}

interface TrendingHealthTipsProps {
  onNavigate?: (view: ViewState) => void;
  onSearchSpecialty?: (spec: string) => void;
}

const CATEGORIES = ["All", "Climate Care", "Nutrition", "Hygiene", "Immunity", "Hydration"];

const SEASONS = [
  { label: "July (Monsoon / Humidity)", month: "July", season: "Monsoon" },
  { label: "August (Peak Rains / Dengue Risk)", month: "August", season: "Monsoon" },
  { label: "May (Summer Heat / Hydration)", month: "May", season: "Summer" },
  { label: "November (Autumn Smog / Respiratory)", month: "November", season: "Pre-Winter" },
  { label: "January (Winter Cold / Immunity)", month: "January", season: "Winter" },
];

const PRESET_PROMPTS = [
  "Monsoon dengue & mosquito protection in Gomti Nagar",
  "Hygiene tips for street food in Chowk & Hazratganj",
  "Seasonal superfoods like Malihabad jamun & mangoes",
  "Air quality precautions during Lucknow harvest season"
];

export default function TrendingHealthTips({ onNavigate, onSearchSpecialty }: TrendingHealthTipsProps) {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customTopic, setCustomTopic] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [isAI, setIsAI] = useState<boolean>(true);
  const [sourceNote, setSourceNote] = useState<string>("");
  const [savedTipIds, setSavedTipIds] = useState<Record<string, boolean>>({});

  const tipsScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (tipsScrollRef.current) {
      tipsScrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tipsScrollRef.current) {
      tipsScrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  const fetchHealthTips = async (
    month: string = selectedSeason.month,
    season: string = selectedSeason.season,
    category: string = selectedCategory,
    query: string = activeQuery
  ) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/health-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          season,
          category,
          customTopic: query
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.tips)) {
        setTips(data.tips);
        setIsAI(Boolean(data.isAI));
        setSourceNote(data.sourceNote || "Lucknow Seasonal Health Advisory");
      } else {
        throw new Error(data.error || "Failed to parse health tips payload.");
      }
    } catch (err: any) {
      console.error("Error fetching health tips:", err);
      setError("Unable to generate live tips. Showing fallback advisory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthTips(selectedSeason.month, selectedSeason.season, selectedCategory, activeQuery);
  }, [selectedSeason, selectedCategory]);

  const handleCustomQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    setActiveQuery(customTopic.trim());
    fetchHealthTips(selectedSeason.month, selectedSeason.season, selectedCategory, customTopic.trim());
  };

  const handlePresetClick = (preset: string) => {
    setCustomTopic(preset);
    setActiveQuery(preset);
    fetchHealthTips(selectedSeason.month, selectedSeason.season, selectedCategory, preset);
  };

  const toggleSaveTip = (id: string) => {
    setSavedTipIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryIcon = (categoryName: string) => {
    const cat = categoryName.toLowerCase();
    if (cat.includes("climate") || cat.includes("temp")) return <Thermometer className="h-4 w-4 text-amber-500" />;
    if (cat.includes("hydration") || cat.includes("water")) return <Droplets className="h-4 w-4 text-sky-500" />;
    if (cat.includes("nutrit") || cat.includes("food")) return <Apple className="h-4 w-4 text-emerald-500" />;
    if (cat.includes("air") || cat.includes("smog")) return <Wind className="h-4 w-4 text-purple-500" />;
    if (cat.includes("hygiene") || cat.includes("sanitat")) return <ShieldAlert className="h-4 w-4 text-rose-500" />;
    return <Sparkles className="h-4 w-4 text-teal-500" />;
  };

  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 via-teal-50/20 to-white font-sans border-y border-teal-100/60 relative overflow-hidden">
      {/* Decorative background glow elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-100/80 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-full mb-3 border border-teal-200">
              <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
              <span>Gemini 3.6 Flash Powered Intelligence</span>
              <span className="bg-teal-700 text-white text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ml-1">AI Live</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Trending Lucknow Seasonal Health Tips</span>
            </h2>
            
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 max-w-2xl">
              Dynamically generated preventive care, climate precautions, and dietary recommendations tuned specifically for Lucknow residents during <span className="font-semibold text-teal-800">{selectedSeason.label}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchHealthTips(selectedSeason.month, selectedSeason.season, selectedCategory, activeQuery)}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Refresh AI health insights"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-teal-600 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Generating..." : "Regenerate Tips"}</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-2xl border border-teal-100 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          
          {/* Top Row: Season & Query */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            
            {/* Season Select */}
            <div className="lg:col-span-5 flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold shrink-0">
                <Calendar className="h-4 w-4 text-teal-600" />
                <span>Season:</span>
              </div>
              <div className="relative flex-1">
                <select
                  value={selectedSeason.month}
                  onChange={(e) => {
                    const found = SEASONS.find(s => s.month === e.target.value);
                    if (found) setSelectedSeason(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl py-2.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
                >
                  {SEASONS.map((s) => (
                    <option key={s.month} value={s.month}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom AI Query Input */}
            <form onSubmit={handleCustomQuerySubmit} className="lg:col-span-7 flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ask Gemini for tailored Lucknow advice (e.g. dengue prevention, street food hygiene)..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-xs rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !customTopic.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ask AI</span>
              </button>
            </form>

          </div>

          {/* Quick Preset Queries */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">Quick Prompts:</span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(p)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                    activeQuery === p 
                      ? "bg-teal-50 border-teal-300 text-teal-800 font-bold" 
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                  }`}
                >
                  ⚡ {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">Category:</span>
            <div className="flex items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? "bg-teal-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Source Note Badge */}
        {sourceNote && (
          <div className="flex items-center justify-between mb-6 text-xs text-slate-500 bg-teal-50/60 border border-teal-100 rounded-xl px-3.5 py-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-teal-600 shrink-0" />
              <span>
                <strong>Context:</strong> {sourceNote}
              </span>
            </div>
            <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
              Lucknow, UP • India
            </span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-slate-200 rounded w-24"></div>
                  <div className="h-5 bg-slate-200 rounded-full w-16"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-150 rounded w-full"></div>
                  <div className="h-4 bg-slate-150 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-150 rounded w-4/6"></div>
                </div>
                <div className="h-12 bg-teal-50 rounded-xl border border-teal-100"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchHealthTips()}
              className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold px-3 py-1 rounded-lg transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Health Tips Cards Carousel Slider */}
        {!loading && tips.length > 0 && (
          <div className="relative group/carousel my-2">
            
            {/* Left Carousel Control Button */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 sm:-ml-5 z-20 bg-white/95 text-teal-900 p-2.5 sm:p-3 rounded-full shadow-lg border border-teal-200 hover:bg-teal-600 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shadow-teal-900/10"
              aria-label="Scroll Health Tips Left"
              title="Previous Health Tip"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Scrollable Container */}
            <div 
              ref={tipsScrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth py-2 px-1 snap-x snap-mandatory"
            >
              {tips.map((tip, idx) => (
                <div 
                  key={tip.id || idx}
                  className="flex-shrink-0 w-80 sm:w-88 bg-white rounded-2xl border border-slate-200/80 hover:border-teal-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group snap-start"
                >
                  
                  {/* Card Top / Header */}
                  <div className="p-5 space-y-3 flex-1">
                    
                    {/* Category & Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        {getCategoryIcon(tip.category)}
                        <span>{tip.category}</span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        tip.urgency === "high" || tip.tag.toLowerCase().includes("alert")
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-teal-50 text-teal-800 border border-teal-200"
                      }`}>
                        {tip.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                      {tip.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {tip.summary}
                    </p>

                    {/* Daily Action Box */}
                    <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 border border-teal-200/70 rounded-xl p-3 text-xs space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 text-teal-900 font-bold text-[11px] uppercase tracking-wider">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                        <span>Recommended Daily Action</span>
                      </div>
                      <p className="text-slate-700 text-[11.5px] leading-snug font-medium">
                        {tip.actionableItem}
                      </p>
                    </div>

                  </div>

                  {/* Card Footer Actions */}
                  <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => toggleSaveTip(tip.id || String(idx))}
                      className={`font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                        savedTipIds[tip.id || String(idx)] ? "text-teal-700 font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>{savedTipIds[tip.id || String(idx)] ? "Saved" : "Save Tip"}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onSearchSpecialty) {
                          onSearchSpecialty("General Physician");
                        } else if (onNavigate) {
                          onNavigate("search");
                        }
                      }}
                      className="text-teal-700 hover:text-teal-900 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Consult Doctor</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Right Carousel Control Button */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 sm:-mr-5 z-20 bg-white/95 text-teal-900 p-2.5 sm:p-3 rounded-full shadow-lg border border-teal-200 hover:bg-teal-600 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shadow-teal-900/10"
              aria-label="Scroll Health Tips Right"
              title="Next Health Tip"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

          </div>
        )}

        {/* Bottom Callout */}
        <div className="mt-8 bg-gradient-to-r from-teal-900 to-teal-950 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/20 border border-teal-400/30 p-2.5 rounded-xl shrink-0">
              <Stethoscope className="h-6 w-6 text-teal-300" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Need personalized medical advice in Lucknow?</h4>
              <p className="text-xs text-teal-200 mt-0.5">Connect with NMC verified doctors across Gomti Nagar, Hazratganj, Indira Nagar & Aliganj.</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onNavigate) onNavigate("search");
            }}
            className="bg-teal-400 hover:bg-teal-300 text-teal-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Find Local Doctors
          </button>
        </div>

      </div>
    </section>
  );
}
