import { useState } from "react";
import { 
  Activity, Menu, X, User, Heart, ShieldAlert, ChevronDown, CheckCircle,
  Phone, Mail, Bell, Globe
} from "lucide-react";
import { ViewState, ProviderType } from "../types";

interface HeaderProps {
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  onSelectCategory: (type: ProviderType | "all") => void;
  onSearchSpecialty: (spec: string) => void;
  currentUser: any;
  onOpenAuth: (mode: "login" | "signup") => void;
  onLogout: () => void;
  onOpenAddListing?: () => void;
}

export default function Header({ 
  activeView, 
  onNavigate, 
  onSelectCategory, 
  onSearchSpecialty,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAddListing
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFindDropdownOpen, setIsFindDropdownOpen] = useState(false);
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [isMobileFindOpen, setIsMobileFindOpen] = useState(false);
  const [isMobileSpecialistOpen, setIsMobileSpecialistOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const handleCategoryNav = (type: ProviderType) => {
    onSelectCategory(type);
    setIsFindDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleBlogClick = () => {
    handleNav("home");
    setTimeout(() => {
      const el = document.getElementById("health-knowledge");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* 1. TOP UTILITY BAR */}
      <div id="top-utility-bar" className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Contacts */}
          <div className="flex items-center gap-4">
            <a href="tel:+915223549210" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5 text-teal-400" />
              <span>📞 Helpline: +91-522-3549210</span>
            </a>
            <span className="text-slate-700">|</span>
            <a href="mailto:support@lucknow.healthcare.directory" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5 text-teal-400" />
              <span>✉️ support@lucknow.healthcare.directory</span>
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-5 relative">
            {/* Language Selector */}
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent border-none text-slate-300 focus:outline-none focus:ring-0 text-xs font-medium cursor-pointer"
              >
                <option value="en" className="bg-slate-900 text-slate-200">🌐 English</option>
                <option value="hi" className="bg-slate-900 text-slate-200">Hindi (हिन्दी)</option>
                <option value="ur" className="bg-slate-900 text-slate-200">Urdu (اردو)</option>
              </select>
            </div>

            <span className="text-slate-700">|</span>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="h-3.5 w-3.5 text-teal-400" />
                <span>Notifications</span>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-200 rounded-lg shadow-md p-3.5 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-2">Live Directory Alerts</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 bg-teal-50/50 rounded-lg border border-teal-100/50">
                      <p className="font-semibold text-teal-950">🎉 Gomti Nagar Clinic Verified</p>
                      <p className="text-slate-500 mt-0.5">Physical audit completed. Verified badge assigned successfully!</p>
                    </div>
                    <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                      <p className="font-semibold text-emerald-950">🩺 Free Consultations Campaign</p>
                      <p className="text-slate-500 mt-0.5">Now offering 15 free medical screenings in Indira Nagar.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="mt-2.5 w-full py-1.5 bg-slate-50 hover:bg-slate-100 rounded-md text-slate-500 text-[10px] font-bold transition-all text-center"
                  >
                    Dismiss Alerts
                  </button>
                </div>
              )}
            </div>

            <span className="text-slate-700">|</span>

            {/* Login / Register */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-teal-400 font-semibold font-sans">
                  👤 {currentUser.displayName?.split("|")[0] || currentUser.email}
                </span>
                <span className="text-slate-700">|</span>
                <button 
                  onClick={onLogout} 
                  className="hover:text-white transition-colors font-medium cursor-pointer bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-[10px]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => onOpenAuth("login")} className="hover:text-white transition-colors font-medium cursor-pointer">👤 Login</button>
                <span className="text-slate-800">/</span>
                <button onClick={() => onOpenAuth("signup")} className="hover:text-white transition-colors font-medium cursor-pointer">📝 Register</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Platform Name */}
          <div 
            id="logo-container" 
            onClick={() => handleNav("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-teal-600 hover:bg-teal-700 transition-colors p-2 rounded-lg text-white shadow-md shadow-teal-100/50 flex items-center justify-center">
              <Activity className="h-4.5 w-4.5 sm:h-5 sm:w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-extrabold text-base sm:text-lg tracking-tight text-teal-900 group-hover:text-teal-600 transition-colors">
                  LKO<span className="text-teal-600">HEALTH</span>
                </span>
                <span className="bg-teal-50 text-teal-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-teal-200 uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-[8px] text-slate-400 font-mono tracking-wider uppercase">Lucknow Discovery Engine</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-5 xl:gap-6">
            <button
              onClick={() => handleNav("home")}
              className={`font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeView === "home" ? "text-teal-600 border-b-2 border-teal-600 pb-1 mt-1" : "text-slate-600 hover:text-teal-600"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav("about")}
              className={`font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeView === "about" ? "text-teal-600 border-b-2 border-teal-600 pb-1 mt-1" : "text-slate-600 hover:text-teal-600"
              }`}
            >
              About
            </button>

            {/* Find Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsFindDropdownOpen(!isFindDropdownOpen);
                  setIsSpecialtyDropdownOpen(false);
                }}
                className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Find
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {isFindDropdownOpen && (
                <div 
                  id="find-dropdown"
                  className="absolute left-0 mt-3 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <button
                    onClick={() => handleCategoryNav(ProviderType.DOCTOR)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-sans cursor-pointer flex items-center gap-2"
                  >
                    👨‍⚕️ Doctors
                  </button>
                  <button
                    onClick={() => handleCategoryNav(ProviderType.CLINIC)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-sans cursor-pointer flex items-center gap-2"
                  >
                    🏢 Clinic
                  </button>
                  <button
                    onClick={() => handleCategoryNav(ProviderType.HOSPITAL)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-sans cursor-pointer flex items-center gap-2"
                  >
                    🏥 Hospitals
                  </button>
                  <button
                    onClick={() => handleCategoryNav(ProviderType.LAB)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-sans cursor-pointer flex items-center gap-2"
                  >
                    🔬 Diagnostics
                  </button>
                  <button
                    onClick={() => handleCategoryNav(ProviderType.LAB)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-sans cursor-pointer flex items-center gap-2"
                  >
                    🧪 Pathologies
                  </button>
                </div>
              )}
            </div>

            {/* Specialist Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen);
                  setIsFindDropdownOpen(false);
                }}
                className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Specialist
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {isSpecialtyDropdownOpen && (
                <div 
                  id="specialty-dropdown"
                  className="absolute left-0 mt-3 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-64 overflow-y-auto"
                >
                  {["Cardiology", "Dentistry", "Gynecology", "Orthopedics", "Dermatology", "Pediatrics", "Neurology", "General Medicine"].map((spec) => (
                    <button
                      key={spec}
                      onClick={() => {
                        onSearchSpecialty(spec);
                        setIsSpecialtyDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition-all font-sans cursor-pointer"
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Button */}
            <button
              onClick={handleBlogClick}
              className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-teal-600 transition-colors cursor-pointer"
            >
              Blog
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => currentUser ? handleNav("dashboard") : onOpenAuth("login")}
              className={`font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === "dashboard" ? "text-teal-600" : "text-slate-600 hover:text-teal-600"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Provider Portal
            </button>

            <button
              onClick={() => {
                if (onOpenAddListing) onOpenAddListing();
                else if (currentUser) handleNav("dashboard");
                else onOpenAuth("signup");
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-sans text-xs font-bold px-4 py-2 rounded-lg transition-all hover:shadow-md hover:shadow-teal-100/50 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="h-3.5 w-3.5 stroke-[2.5]" />
              List Your Practice
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => currentUser ? handleNav("dashboard") : onOpenAuth("login")}
              className="text-slate-600 hover:text-teal-600 p-2"
              title="Provider Portal"
            >
              <User className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-teal-600 p-1.5 rounded-lg bg-slate-50 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-drawer"
          className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto"
        >
          <button
            onClick={() => handleNav("home")}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-semibold text-xs transition-all"
          >
            Home
          </button>

          <button
            onClick={() => handleNav("about")}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-semibold text-xs transition-all"
          >
            About
          </button>

          {/* Mobile Find Collapsible */}
          <div>
            <button
              onClick={() => setIsMobileFindOpen(!isMobileFindOpen)}
              className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-semibold text-xs transition-all flex items-center justify-between"
            >
              <span>Find</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isMobileFindOpen ? "rotate-180" : ""}`} />
            </button>
            {isMobileFindOpen && (
              <div className="pl-4 py-1 space-y-1 bg-slate-50/60 rounded-lg my-1">
                <button
                  onClick={() => handleCategoryNav(ProviderType.DOCTOR)}
                  className="w-full text-left py-1.5 px-3 text-slate-600 hover:text-teal-600 text-xs flex items-center gap-2"
                >
                  👨‍⚕️ Doctors
                </button>
                <button
                  onClick={() => handleCategoryNav(ProviderType.CLINIC)}
                  className="w-full text-left py-1.5 px-3 text-slate-600 hover:text-teal-600 text-xs flex items-center gap-2"
                >
                  🏢 Clinic
                </button>
                <button
                  onClick={() => handleCategoryNav(ProviderType.HOSPITAL)}
                  className="w-full text-left py-1.5 px-3 text-slate-600 hover:text-teal-600 text-xs flex items-center gap-2"
                >
                  🏥 Hospitals
                </button>
                <button
                  onClick={() => handleCategoryNav(ProviderType.LAB)}
                  className="w-full text-left py-1.5 px-3 text-slate-600 hover:text-teal-600 text-xs flex items-center gap-2"
                >
                  🔬 Diagnostics
                </button>
                <button
                  onClick={() => handleCategoryNav(ProviderType.LAB)}
                  className="w-full text-left py-1.5 px-3 text-slate-600 hover:text-teal-600 text-xs flex items-center gap-2"
                >
                  🧪 Pathologies
                </button>
              </div>
            )}
          </div>

          {/* Mobile Specialist Collapsible */}
          <div>
            <button
              onClick={() => setIsMobileSpecialistOpen(!isMobileSpecialistOpen)}
              className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-semibold text-xs transition-all flex items-center justify-between"
            >
              <span>Specialist</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isMobileSpecialistOpen ? "rotate-180" : ""}`} />
            </button>
            {isMobileSpecialistOpen && (
              <div className="pl-4 py-1 space-y-1 bg-slate-50/60 rounded-lg my-1">
                {["Cardiology", "Dentistry", "Gynecology", "Orthopedics", "Dermatology", "Pediatrics", "Neurology"].map((spec) => (
                  <button
                    key={spec}
                    onClick={() => {
                      onSearchSpecialty(spec);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-1.5 px-3 text-slate-600 hover:text-teal-600 text-xs"
                  >
                    {spec}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleBlogClick();
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-semibold text-xs transition-all"
          >
            Blog
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              currentUser ? handleNav("dashboard") : onOpenAuth("login");
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <User className="h-3.5 w-3.5" />
            Provider Portal
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenAddListing) onOpenAddListing();
                else if (currentUser) handleNav("dashboard");
                else onOpenAuth("signup");
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-sans text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              List Your Practice
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
