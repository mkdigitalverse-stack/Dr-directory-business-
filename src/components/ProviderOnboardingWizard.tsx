import React, { useState } from "react";
import { 
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Building2, Stethoscope, Hospital as HospitalIcon, 
  FlaskConical, MapPin, Phone, Mail, Globe, Clock, ShieldCheck, Upload, FileText, Image, Film, 
  Check, Save, HelpCircle, AlertCircle, ShieldAlert, X, AlertTriangle
} from "lucide-react";
import { UserRole, ProviderType } from "../types";
import { LOCALITIES } from "../data";

interface ProviderOnboardingWizardProps {
  currentUser: any;
  userRole: UserRole;
  initialData?: any;
  onComplete: (onboardingData: any) => void;
  onSaveDraftAndExit?: (draftData: any) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function ProviderOnboardingWizard({
  currentUser,
  userRole,
  initialData,
  onComplete,
  onSaveDraftAndExit,
  onCancel,
  onClose
}: ProviderOnboardingWizardProps) {
  // Show welcome screen initially
  const [showWelcome, setShowWelcome] = useState(!initialData);
  const [currentStep, setCurrentStep] = useState(initialData?.currentStep || 1);

  // Initial practice name from current user or role
  const defaultName = currentUser?.displayName?.split("|")[0] || "";

  // Selected Provider Type (DOCTOR, CLINIC, HOSPITAL, DIAGNOSTIC_LAB)
  const [selectedProviderType, setSelectedProviderType] = useState<ProviderType>(
    initialData?.providerType || 
    (userRole === "doctor" ? ProviderType.DOCTOR : 
     userRole === "clinic" ? ProviderType.CLINIC : 
     userRole === "hospital" ? ProviderType.HOSPITAL : ProviderType.LAB)
  );

  // Form State
  // Step 1: Basic Practice Information
  const [practiceName, setPracticeName] = useState(
    initialData?.practiceName || defaultName || (userRole === "doctor" ? "Dr. Anand Verma Clinic" : "Lucknow Care Facility")
  );
  const [practiceCategory, setPracticeCategory] = useState(
    initialData?.practiceCategory || (
      userRole === "doctor" ? "General Medicine & Cardiology" :
      userRole === "clinic" ? "Multi-Specialty Clinic" :
      userRole === "hospital" ? "Super Specialty Hospital" : "Diagnostic & Pathology Lab"
    )
  );
  const [tagline, setTagline] = useState(
    initialData?.tagline || (
      userRole === "doctor" ? "Compassionate & Advanced Patient Care in Lucknow" :
      userRole === "clinic" ? "Modern OPD & Diagnostic Services Under One Roof" :
      userRole === "hospital" ? "24/7 Emergency & Multi-Specialty Care Center" : "Accurate & Fast NABL Certified Diagnostic Tests"
    )
  );

  // Step 2: Location
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Uttar Pradesh");
  const [city, setCity] = useState("Lucknow");
  const [locality, setLocality] = useState("Gomti Nagar");
  const [address, setAddress] = useState("Plot 12, Viraj Khand, Near Sahara Hospital");
  const [pinCode, setPinCode] = useState("226010");
  const [mapPinSet, setMapPinSet] = useState(true);

  // Step 3: Contact Information
  const [contactNumber, setContactNumber] = useState(currentUser?.phoneNumber || "+91 98765 43210");
  const [whatsappNumber, setWhatsappNumber] = useState("+91 98765 43210");
  const [contactEmail, setContactEmail] = useState(currentUser?.email || "contact@lucknowhealth.org");
  const [website, setWebsite] = useState("https://lucknowhealth.org");

  // Step 4: Practice Details
  const [aboutPractice, setAboutPractice] = useState(
    "Providing high-quality medical care to patients across Lucknow with modern equipment, experienced specialists, and patient-centric OPD services."
  );
  const [servicesOffered, setServicesOffered] = useState<string[]>([
    "OPD Consultation", "Emergency Care", "Health Checkup Packages", "Teleconsultation"
  ]);
  const [newServiceInput, setNewServiceInput] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([
    userRole === "doctor" ? "Cardiology" : "General Medicine", "Pediatrics"
  ]);
  const [consultationTimings, setConsultationTimings] = useState("Mon - Sat: 09:00 AM - 08:00 PM, Sun: 10:00 AM - 02:00 PM");
  const [emergencyAvailability, setEmergencyAvailability] = useState(true);
  const [insuranceAccepted, setInsuranceAccepted] = useState("Star Health, Max Bupa, Ayushman Bharat, HDFC ERGO");

  // Step 5: Media
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=200");
  const [coverImageUrl, setCoverImageUrl] = useState("https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1000");
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=500"
  ]);
  const [introVideoUrl, setIntroVideoUrl] = useState("https://youtube.com/watch?v=demo");

  // Step 6: Verification & Review
  const [registrationNo, setRegistrationNo] = useState("UP-MCI-88912");
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([
    "Medical Registration Certificate.pdf",
    "Clinical Establishment License.pdf"
  ]);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Step Title & Progress Calculation
  const totalSteps = 6;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const roleLabels: Record<UserRole, { title: string; icon: any }> = {
    doctor: { title: "Doctor Profile Setup", icon: Stethoscope },
    clinic: { title: "Clinic Profile Setup", icon: Building2 },
    hospital: { title: "Hospital Profile Setup", icon: HospitalIcon },
    diagnostic_lab: { title: "Diagnostic Lab Setup", icon: FlaskConical },
    patient: { title: "Patient Profile Setup", icon: Sparkles },
    moderator: { title: "Moderator Setup", icon: ShieldCheck },
    admin: { title: "Admin Portal", icon: ShieldCheck }
  };

  const currentRoleInfo = roleLabels[userRole] || roleLabels.doctor;
  const IconComponent = currentRoleInfo.icon;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalSubmit = () => {
    const onboardingData = {
      type: selectedProviderType,
      practiceName,
      practiceCategory,
      tagline,
      locality,
      address,
      pinCode,
      location: { country, state, city, locality, address, pinCode, mapPinSet },
      contact: { contactNumber, whatsappNumber, email: contactEmail, website },
      details: { aboutPractice, servicesOffered, specialties, consultationTimings, emergencyAvailability, insuranceAccepted },
      media: { logoUrl, coverImageUrl, galleryPhotos, introVideoUrl },
      verification: { registrationNo, uploadedDocs, acceptTerms, submittedAt: new Date().toISOString() },
      registrationNo,
      status: "SUBMITTED",
      verified: false,
      rejectionReason: undefined
    };
    onComplete(onboardingData);
  };

  const handleSaveDraft = () => {
    const draftData = {
      currentStep,
      type: selectedProviderType,
      practiceName,
      practiceCategory,
      tagline,
      locality,
      address,
      pinCode,
      contactNumber,
      contactEmail,
      website,
      aboutPractice,
      specialties,
      servicesOffered,
      consultationTimings,
      emergencyAvailability,
      registrationNo,
      logoUrl,
      coverImageUrl,
      status: "DRAFT",
      savedAt: new Date().toISOString()
    };
    if (onSaveDraftAndExit) {
      onSaveDraftAndExit(draftData);
    }
    if (onClose) {
      onClose();
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceInput.trim() && !servicesOffered.includes(newServiceInput.trim())) {
      setServicesOffered([...servicesOffered, newServiceInput.trim()]);
      setNewServiceInput("");
    }
  };

  const handleRemoveService = (svc: string) => {
    setServicesOffered(servicesOffered.filter(s => s !== svc));
  };

  // Welcome Screen Component
  if (showWelcome) {
    return (
      <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 font-sans text-left flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto w-16 h-16 bg-teal-50 border border-teal-200 text-teal-600 rounded-2xl flex items-center justify-center shadow-2xs">
            <IconComponent className="h-8 w-8 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block">
              Welcome to LKOHEALTH Provider Portal
            </span>
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Welcome to LKOHEALTH!
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Let's create your professional healthcare profile. It only takes about <strong className="text-teal-950 font-bold">5–10 minutes</strong>, and you can save your progress at any time.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2.5">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800">High Patient Visibility in Lucknow</p>
                <p className="text-[11px] text-slate-500">Reach thousands of active patients searching for doctors, OPDs, and diagnostics daily.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800">Verified Provider Badge & Trust</p>
                <p className="text-[11px] text-slate-500">Display your NMC registration & CMO verification badge to build patient confidence.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-800">Seamless Appointment & Slot Roster</p>
                <p className="text-[11px] text-slate-500">Manage digital OPD bookings, emergency availability, and reception staff easily.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all shadow-md shadow-teal-100/50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Profile Setup</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {(onCancel || onClose) && (
              <button
                onClick={() => onClose ? onClose() : (onCancel && onCancel())}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer block mx-auto pt-1"
              >
                Skip for now & go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-left">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* HEADER & PROGRESS BAR CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-2xl text-teal-600">
                <IconComponent className="h-6 w-6 stroke-[2]" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-extrabold text-teal-800 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {currentRoleInfo.title}
                </span>
                <h1 className="font-sans font-extrabold text-xl text-slate-900 tracking-tight mt-0.5">
                  Profile Creation Wizard
                </h1>
              </div>
            </div>

            <button
              onClick={handleSaveDraft}
              className="self-start sm:self-auto bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Save className="h-3.5 w-3.5 text-slate-500" />
              <span>Save Progress & Exit</span>
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Step {currentStep} of {totalSteps}</span>
              <span className="font-mono text-teal-700">{progressPercent}% Complete</span>
            </div>
            
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80">
              <div 
                className="bg-teal-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Step Breadcrumb Pill */}
            <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-0.5 text-[10px] text-slate-500 scrollbar-none">
              {["Basic Info", "Location", "Contact", "Practice Details", "Media", "Verification"].map((label, idx) => {
                const stepNum = idx + 1;
                const isCurrent = stepNum === currentStep;
                const isDone = stepNum < currentStep;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      if (stepNum <= currentStep) setCurrentStep(stepNum);
                    }}
                    disabled={stepNum > currentStep}
                    className={`shrink-0 px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                      isCurrent 
                        ? "bg-teal-900 text-white shadow-2xs" 
                        : isDone 
                        ? "bg-teal-50 text-teal-800 border border-teal-200" 
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <span>{isDone ? "✔" : stepNum}.</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* STEP CONTENT BODY CARD */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          
          {/* STEP 1: BASIC PRACTICE INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-sans font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-teal-600" />
                  <span>Step 1 — Basic Practice Information</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your practice name, primary category, and optional tagline for display on the Lucknow discovery portal.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">What would you like to list? *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { type: ProviderType.DOCTOR, label: "Doctor", desc: "Practitioner / OPD", icon: Stethoscope },
                      { type: ProviderType.CLINIC, label: "Clinic", desc: "Outpatient Facility", icon: Building2 },
                      { type: ProviderType.HOSPITAL, label: "Hospital", desc: "24/7 Inpatient / ICU", icon: HospitalIcon },
                      { type: ProviderType.LAB, label: "Diagnostic Lab", desc: "Pathology / Radiology", icon: FlaskConical }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSel = selectedProviderType === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setSelectedProviderType(item.type)}
                          className={`p-3 rounded-2xl border text-left flex flex-col items-start gap-1.5 transition-all cursor-pointer ${
                            isSel
                              ? "bg-teal-50 border-teal-500 text-teal-900 shadow-2xs font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className={`p-1.5 rounded-xl ${isSel ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold">{item.label}</p>
                            <p className="text-[10px] text-slate-500 font-normal leading-tight">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {selectedProviderType === ProviderType.DOCTOR ? "Doctor / Clinic Practice Name *" : selectedProviderType === ProviderType.CLINIC ? "Clinic Name *" : selectedProviderType === ProviderType.HOSPITAL ? "Hospital Name *" : "Diagnostic Lab Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                    placeholder={selectedProviderType === ProviderType.DOCTOR ? "e.g. Dr. Anand Verma Cardiology OPD" : "e.g. Gomti Dental & Diagnostic Center"}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Practice Category *
                  </label>
                  <select
                    value={practiceCategory}
                    onChange={(e) => setPracticeCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                  >
                    <option value="General Medicine">General Medicine & Consultation</option>
                    <option value="Multi-Specialty Clinic">Multi-Specialty Clinic</option>
                    <option value="Dental Clinic">Dental & Maxillofacial Clinic</option>
                    <option value="Pathology & Diagnostic Lab">Pathology & Diagnostic Lab</option>
                    <option value="Super Specialty Hospital">Super Specialty Hospital</option>
                    <option value="Orthopedic Center">Orthopedic & Physiotherapy Center</option>
                    <option value="Eye Care & Ophthalmology">Eye Care & Ophthalmology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Practice Tagline <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Advanced Painless Care in Hazratganj"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-sans font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  <span>Step 2 — Practice Location</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Accurate locality and street address help patients in Lucknow find your practice easily.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Country</label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 px-3.5 text-xs font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">State</label>
                  <input
                    type="text"
                    disabled
                    value={state}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 px-3.5 text-xs font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Locality in Lucknow *</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  >
                    {LOCALITIES.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Complete Street Address *</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Building No, Street, Landmark..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">PIN Code *</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="226010"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Google Map Pin</label>
                  <button
                    type="button"
                    onClick={() => setMapPinSet(!mapPinSet)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      mapPinSet ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>{mapPinSet ? "Location Pin Saved (26.8467° N, 80.9462° E)" : "Set Map Location"}</span>
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200 font-mono">
                      {mapPinSet ? "Active" : "+ Set"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT INFORMATION */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-sans font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-teal-600" />
                  <span>Step 3 — Contact Information</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Provide primary contact details so patients and reception staff can connect seamlessly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Primary Contact Number *</label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">WhatsApp Number *</label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-4 w-4 text-emerald-500" />
                    </div>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Official Email Address *</label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="practice@lucknowhealth.org"
                      className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Website URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Globe className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://lucknowhealth.org"
                      className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PRACTICE DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-sans font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <span>Step 4 — Practice Details & OPD Schedule</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Detail your clinical expertise, OPD consultation hours, and emergency coverage.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">About Practice / Overview *</label>
                  <textarea
                    rows={3}
                    value={aboutPractice}
                    onChange={(e) => setAboutPractice(e.target.value)}
                    placeholder="Describe your practice, medical facilities, equipment, and philosophy..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Services Offered Tags */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Services Offered *</label>
                  <div className="flex flex-wrap gap-1.5">
                    {servicesOffered.map(svc => (
                      <span key={svc} className="inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-900 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        <span>{svc}</span>
                        <button type="button" onClick={() => handleRemoveService(svc)} className="text-teal-600 hover:text-rose-600 cursor-pointer">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddService} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newServiceInput}
                      onChange={(e) => setNewServiceInput(e.target.value)}
                      placeholder="Add another service (e.g. ECG, Dental X-Ray)..."
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="submit"
                      className="bg-teal-600 text-white font-bold text-xs py-2 px-3 rounded-xl hover:bg-teal-700 cursor-pointer"
                    >
                      + Add
                    </button>
                  </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Consultation Timings *</label>
                    <input
                      type="text"
                      value={consultationTimings}
                      onChange={(e) => setConsultationTimings(e.target.value)}
                      placeholder="e.g. Mon-Sat 09:00 AM - 08:00 PM"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Emergency Availability</label>
                    <button
                      type="button"
                      onClick={() => setEmergencyAvailability(!emergencyAvailability)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        emergencyAvailability ? "bg-rose-50 border-rose-200 text-rose-900" : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <span>24/7 Emergency Services Available</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        emergencyAvailability ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {emergencyAvailability ? "ENABLED" : "DISABLED"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Insurance Partners Accepted <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={insuranceAccepted}
                    onChange={(e) => setInsuranceAccepted(e.target.value)}
                    placeholder="e.g. Star Health, Max Bupa, Ayushman Bharat..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: MEDIA */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-sans font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Image className="h-5 w-5 text-teal-600" />
                  <span>Step 5 — Practice Media & Gallery</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your logo, cover banner, gallery photos, and intro video link to boost profile visual score.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Practice Logo Image</label>
                    <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                      <img src={logoUrl} alt="Logo preview" className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0" />
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="Logo Image URL..."
                        className="w-full border-0 bg-transparent text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Cover Banner Image</label>
                    <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                      <img src={coverImageUrl} alt="Cover preview" className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0" />
                      <input
                        type="text"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        placeholder="Cover Image URL..."
                        className="w-full border-0 bg-transparent text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Gallery Photos</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {galleryPhotos.map((photo, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                        <img src={photo} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center p-3 text-center cursor-pointer hover:bg-teal-50 hover:border-teal-400 transition-all">
                      <span className="text-[10px] font-bold text-teal-700">+ Add Photo</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Intro Video Link <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input
                    type="url"
                    value={introVideoUrl}
                    onChange={(e) => setIntroVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: VERIFICATION & REVIEW */}
          {currentStep === 6 && (() => {
            const requiredChecklist = [
              { label: "Practice / Doctor Name", ok: Boolean(practiceName.trim()) },
              { label: "Provider Type Selected", ok: Boolean(selectedProviderType) },
              { label: "Locality in Lucknow", ok: Boolean(locality.trim()) },
              { label: "Full Physical Address", ok: Boolean(address.trim()) },
              { label: "Contact Telephone", ok: Boolean(contactNumber.trim()) },
              { label: "Medical Council / NMC Reg No.", ok: Boolean(registrationNo.trim()) }
            ];

            const recommendedChecklist = [
              { label: "About Practice Overview", ok: Boolean(aboutPractice.trim()) },
              { label: "Specialties & Treatments", ok: specialties.length > 0 },
              { label: "Services Offered", ok: servicesOffered.length > 0 },
              { label: "Consultation Hours & Timings", ok: Boolean(consultationTimings.trim()) },
              { label: "Profile / Clinic Photo", ok: Boolean(logoUrl.trim()) },
              { label: "Compliance Document Attachment", ok: uploadedDocs.length > 0 }
            ];

            const requiredOk = requiredChecklist.every(i => i.ok);
            const totalItems = requiredChecklist.length + recommendedChecklist.length;
            const completedItems = requiredChecklist.filter(i => i.ok).length + recommendedChecklist.filter(i => i.ok).length;
            const profileStrengthScore = Math.round((completedItems / totalItems) * 100);

            return (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-sans font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-teal-600" />
                    <span>Step 6 — Verification, Profile Strength & Preview</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Review your completion score, compliance details, and profile preview prior to final administrator submission.
                  </p>
                </div>

                {/* PROFILE COMPLETION SCORE INDICATOR CARD */}
                <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-mono font-bold tracking-wider">Profile Completeness</p>
                      <h3 className="text-xl font-extrabold text-white mt-0.5">Profile Strength Score</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-teal-400 font-mono">{profileStrengthScore}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Required checklist */}
                    <div className="space-y-2 bg-slate-800/60 p-3.5 rounded-2xl border border-white/10">
                      <p className="font-extrabold text-teal-300 uppercase text-[11px] tracking-wide flex items-center justify-between">
                        <span>Required Checklist</span>
                        <span className={requiredOk ? "text-emerald-400" : "text-amber-400"}>
                          {requiredChecklist.filter(i => i.ok).length}/{requiredChecklist.length} Complete
                        </span>
                      </p>
                      <div className="space-y-1">
                        {requiredChecklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px]">
                            {item.ok ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                            )}
                            <span className={item.ok ? "text-slate-200" : "text-rose-300 font-bold"}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended checklist */}
                    <div className="space-y-2 bg-slate-800/60 p-3.5 rounded-2xl border border-white/10">
                      <p className="font-extrabold text-amber-300 uppercase text-[11px] tracking-wide flex items-center justify-between">
                        <span>Recommended Items</span>
                        <span className="text-slate-300">
                          {recommendedChecklist.filter(i => i.ok).length}/{recommendedChecklist.length} Complete
                        </span>
                      </p>
                      <div className="space-y-1">
                        {recommendedChecklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px]">
                            {item.ok ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className={item.ok ? "text-slate-300" : "text-slate-400"}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PROFILE PREVIEW SECTION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-teal-600" />
                      <span>Live Public Profile Preview</span>
                    </h3>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse">
                      Preview — Your profile is not public yet.
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 text-xs">
                    <div className="flex items-start gap-4">
                      <img
                        src={logoUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=200"}
                        alt={practiceName}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-sm">{practiceName || "Practice Name"}</h4>
                          <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                            {selectedProviderType}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs font-medium">{tagline}</p>
                        <p className="text-slate-500 text-[11px]">
                          📍 {address}, {locality}, Lucknow, UP ({pinCode})
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block">Category:</span>
                        <strong className="text-slate-800 font-semibold">{practiceCategory}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Registration No:</span>
                        <strong className="text-slate-800 font-mono font-bold">{registrationNo || "Not provided"}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Contact Phone:</span>
                        <strong className="text-slate-800 font-semibold">{contactNumber}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Medical Council / NMC Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      placeholder="e.g. UP-MCI-88912"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Attached Compliance Documents</label>
                    <div className="space-y-1.5">
                      {uploadedDocs.map((docName, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                          <div className="flex items-center gap-2 text-slate-800 font-medium">
                            <FileText className="h-4 w-4 text-teal-600" />
                            <span>{docName}</span>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Uploaded</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setUploadedDocs([...uploadedDocs, "GST_Clinical_Certificate.pdf"])}
                      className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>+ Upload Additional Document</span>
                    </button>
                  </div>

                  {!requiredOk && (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-900 space-y-1">
                      <div className="font-extrabold flex items-center gap-2 text-rose-700">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>Action Required Before Final Submission:</span>
                      </div>
                      <p className="text-[11px] text-rose-800">
                        Please fill in all required fields highlighted in red above before submitting for administrator review.
                      </p>
                    </div>
                  )}

                  <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-600 leading-snug">
                      I declare that all practice information, medical registration numbers, and operational details provided above are true, accurate, and compliant with medical guidelines in Uttar Pradesh.
                    </span>
                  </label>
                </div>
              </div>
            );
          })()}

          {/* BOTTOM WIZARD NAVIGATION BAR */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-150">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={handlePrev}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={currentStep === 6 && !acceptTerms}
              onClick={handleNext}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md shadow-teal-100/50 flex items-center gap-2 cursor-pointer"
            >
              <span>{currentStep === totalSteps ? "Submit Practice for Review 🎉" : "Continue"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
