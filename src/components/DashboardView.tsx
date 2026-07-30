import React, { useState, useMemo, useEffect } from "react";
import { 
  Users, Activity, Calendar, Star, ShieldCheck, RefreshCw, Upload, Sparkles, 
  Settings, TrendingUp, AlertCircle, FileText, CheckCircle, Clock, Trash, ChevronRight, Check,
  PlusCircle, Building2, Stethoscope, Hospital, FlaskConical, Search, Phone, Mail
} from "lucide-react";
import { Provider, ProviderType, Appointment, Review, ViewState } from "../types";
import { LOCALITIES } from "../data";

interface DashboardViewProps {
  providers: Provider[];
  appointments: Appointment[];
  reviews: Review[];
  onUpdateProvider: (provider: Provider) => void;
  onUpdateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  onAddProviderListing: (newProv: Provider) => void;
  onNavigate: (view: ViewState) => void;
  currentUser: any;
  initialTab?: "analytics" | "appointments" | "verification" | "edit_profile" | "add_listing";
}

export default function DashboardView({ 
  providers, 
  appointments, 
  reviews, 
  onUpdateProvider, 
  onUpdateAppointmentStatus,
  onAddProviderListing,
  onNavigate,
  currentUser,
  initialTab = "analytics"
}: DashboardViewProps) {
  
  // Resolve logged-in provider profile dynamically or provision a temporary one
  const defaultProvider = useMemo(() => {
    if (currentUser) {
      const email = currentUser.email?.toLowerCase();
      const matched = providers.find(p => p.id === currentUser.uid || p.email?.toLowerCase() === email);
      if (matched) return matched;

      // Provision clean default metadata for newly registered account
      const [name] = currentUser.displayName ? currentUser.displayName.split('|') : [currentUser.email || 'Doctor', 'provider'];
      return {
        id: currentUser.uid,
        name: name.startsWith("Dr.") ? name.substring(4) : name,
        type: ProviderType.DOCTOR,
        specialties: ["General Physician"],
        treatments: ["General OPD Consultation"],
        localityId: "gomti-nagar",
        cityId: "lucknow",
        address: "Lucknow Healthcare Practice Clinic",
        consultationFee: 400,
        rating: 5.0,
        reviewsCount: 0,
        verified: false,
        about: "Claimed practice listing on Lucknow Discovery Engine.",
        experienceYears: 3,
        languages: ["English", "Hindi"],
        services: ["In-person OPD Consultation"],
        seoScore: 85,
        emergencyServices: false,
        availability: [{
          day: "Monday - Saturday",
          slots: [
            { id: "s1", time: "10:00 AM", isAvailable: true },
            { id: "s2", time: "11:00 AM", isAvailable: true },
            { id: "s3", time: "02:00 PM", isAvailable: true },
            { id: "s4", time: "05:00 PM", isAvailable: true }
          ]
        }],
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
        medicalRegistrationNumber: ""
      };
    }
    return providers.find(p => p.id === "dr-anand-verma") || providers[0];
  }, [currentUser, providers]);

  const [activeProvider, setActiveProvider] = useState<Provider>(defaultProvider);
  
  // Dashboard Tabs
  const [dashTab, setDashTab] = useState<"analytics" | "appointments" | "verification" | "edit_profile" | "add_listing">(initialTab);

  // Profile Edit fields state
  const [editFee, setEditFee] = useState(activeProvider.consultationFee);
  const [editAbout, setEditAbout] = useState(activeProvider.about);
  const [editAddress, setEditAddress] = useState(activeProvider.address);
  const [editLandmarks, setEditLandmarks] = useState(activeProvider.landmarks ? activeProvider.landmarks.join(", ") : "");
  const [editSpecialties, setEditSpecialties] = useState(activeProvider.specialties.join(", "));
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // New Listing Form state
  const [newType, setNewType] = useState<ProviderType>(ProviderType.DOCTOR);
  const [newName, setNewName] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("General Physician");
  const [newLocality, setNewLocality] = useState("gomti-nagar");
  const [newAddress, setNewAddress] = useState("");
  const [newLandmarks, setNewLandmarks] = useState("");
  const [newFee, setNewFee] = useState(500);
  const [newExperience, setNewExperience] = useState("5");
  const [newRegistration, setNewRegistration] = useState("");
  const [newPhone, setNewPhone] = useState("+91 522 ");
  const [newEmail, setNewEmail] = useState(currentUser?.email || "");
  const [newAbout, setNewAbout] = useState("");
  const [newEmergency, setNewEmergency] = useState(false);
  const [newTeleconsult, setNewTeleconsult] = useState(true);
  const [listingSuccessMsg, setListingSuccessMsg] = useState("");
  const [claimSearch, setClaimSearch] = useState("");

  // Simulated AI Verification upload & scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [licenseId, setLicenseId] = useState(activeProvider.medicalRegistrationNumber || "MCI-45892");
  const [verificationResult, setVerificationResult] = useState<"none" | "success" | "error">("none");

  // Sync state values whenever activeProvider changes
  useEffect(() => {
    setActiveProvider(defaultProvider);
  }, [defaultProvider]);

  useEffect(() => {
    setEditFee(activeProvider.consultationFee);
    setEditAbout(activeProvider.about);
    setEditAddress(activeProvider.address);
    setEditLandmarks(activeProvider.landmarks ? activeProvider.landmarks.join(", ") : "");
    setEditSpecialties(activeProvider.specialties.join(", "));
    setLicenseId(activeProvider.medicalRegistrationNumber || "");
  }, [activeProvider]);

  // Dynamic calculations for stats
  const providerAppointments = useMemo(() => {
    return appointments.filter(a => a.providerId === activeProvider.id);
  }, [appointments, activeProvider.id]);

  const providerReviews = useMemo(() => {
    return reviews.filter(r => r.providerId === activeProvider.id);
  }, [reviews, activeProvider.id]);

  // Compute profile completeness/SEO score dynamically
  const seoAudit = useMemo(() => {
    let score = 50;
    const missing: string[] = [];

    if (activeProvider.medicalRegistrationNumber) {
      score += 10;
    } else {
      missing.push("NMC Registration Certificate Code");
    }

    if (activeProvider.image) score += 10;
    else missing.push("Professional Headshot Photo");

    if (activeProvider.about && activeProvider.about.length > 50) score += 10;
    else missing.push("Rich Professional Description (>50 chars)");

    if (activeProvider.landmarks && activeProvider.landmarks.length > 0) score += 10;
    else missing.push("Local landmarks and directions");

    if (activeProvider.specialties && activeProvider.specialties.length > 1) score += 10;
    else missing.push("Multiple relevant specialty tags");

    return { score, missing };
  }, [activeProvider]);

  // Handle saving profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Provider = {
      ...activeProvider,
      consultationFee: Number(editFee),
      about: editAbout,
      address: editAddress,
      landmarks: editLandmarks.split(",").map(s => s.trim()).filter(Boolean),
      specialties: editSpecialties.split(",").map(s => s.trim()).filter(Boolean),
      seoScore: seoAudit.score
    };
    setActiveProvider(updated);
    onUpdateProvider(updated);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  // Handle submitting new practice listing
  const handleCreateNewListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert("Please enter physician or practice name.");
      return;
    }

    const newProv: Provider = {
      id: `prov-${Date.now()}`,
      name: newName.trim(),
      type: newType,
      specialties: newSpecialty.split(",").map(s => s.trim()).filter(Boolean),
      treatments: ["Outpatient Medical Consultation"],
      localityId: newLocality,
      cityId: "lucknow",
      address: newAddress.trim() || `Lucknow Healthcare Clinic, ${newLocality}`,
      consultationFee: Number(newFee),
      rating: 5.0,
      reviewsCount: 1,
      verified: Boolean(newRegistration),
      about: newAbout.trim() || `Verified ${newType} healthcare practice operating in ${newLocality}, Lucknow.`,
      experienceYears: Number(newExperience) || 5,
      languages: ["English", "Hindi"],
      services: ["In-person OPD"],
      seoScore: 88,
      availability: [{
        day: "Monday - Saturday",
        slots: [
          { id: "s1", time: "10:00 AM", isAvailable: true },
          { id: "s2", time: "11:30 AM", isAvailable: true },
          { id: "s3", time: "03:00 PM", isAvailable: true },
          { id: "s4", time: "05:30 PM", isAvailable: true }
        ]
      }],
      image: newType === ProviderType.DOCTOR 
        ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
        : newType === ProviderType.HOSPITAL
        ? "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=300"
        : newType === ProviderType.LAB
        ? "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=300"
        : "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=300",
      medicalRegistrationNumber: newRegistration,
      email: newEmail || currentUser?.email || "practice@lucknow.health",
      emergencyServices: newEmergency,
      landmarks: newLandmarks ? newLandmarks.split(",").map(s => s.trim()).filter(Boolean) : ["Lucknow Central"]
    };

    onAddProviderListing(newProv);
    setActiveProvider(newProv);
    setListingSuccessMsg(`Congratulations! "${newProv.name}" is now live in the Lucknow Directory!`);
    
    // Reset form
    setNewName("");
    setNewAddress("");
    setNewRegistration("");
    setNewAbout("");
  };

  // Handle claiming an existing practice listing
  const handleClaimListing = (prov: Provider) => {
    const claimed: Provider = {
      ...prov,
      email: currentUser?.email || prov.email,
      verified: true
    };
    onUpdateProvider(claimed);
    setActiveProvider(claimed);
    setListingSuccessMsg(`Successfully claimed profile for "${claimed.name}"! You are now managing this practice.`);
  };

  // Drag and drop simulator
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Run AI Verification Scanner
  const runCredentialVerificationScan = () => {
    if (!licenseId.trim()) {
      alert("Please specify a valid medical license or registration number.");
      return;
    }
    setIsScanning(true);
    setScanStep(1);
    setVerificationResult("none");

    // Scan steps animation timeline
    setTimeout(() => {
      setScanStep(2); // Extracting certificate details...
      setTimeout(() => {
        setScanStep(3); // Matching NMC council archives...
        setTimeout(() => {
          setScanStep(4); // Authorizing database records...
          setTimeout(() => {
            setIsScanning(false);
            setVerificationResult("success");
            // Award verified status to local provider state and parent context
            const verifiedProv: Provider = {
              ...activeProvider,
              verified: true,
              medicalRegistrationNumber: licenseId
            };
            setActiveProvider(verifiedProv);
            onUpdateProvider(verifiedProv);
          }, 2000);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div id="dashboard-view" className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Title & Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-150 shadow-xs">
          <div className="space-y-1 text-left">
            <span className="font-mono text-[10px] text-teal-600 font-bold uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">
              Verified Practice Management
            </span>
            <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">
              Dr. {activeProvider.name} Portal
            </h1>
            <p className="text-xs text-slate-500">
              Provider ID: <strong className="font-mono font-bold">{activeProvider.id}</strong> | Clinic: {activeProvider.address}
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => onNavigate("home")}
              className="flex-1 md:flex-initial border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans text-xs font-bold px-4 py-2.5 rounded-xl text-center cursor-pointer"
            >
              Back to Portal
            </button>
            <button
              onClick={() => onNavigate("profile")}
              className="flex-1 md:flex-initial bg-teal-600 hover:bg-teal-700 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl text-center cursor-pointer shadow-sm"
            >
              Public Profile Views
            </button>
          </div>
        </div>

        {/* Outer Split layout: Left Navigation tabs, Right tab contents */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <aside className="space-y-3">
            {[
              { id: "analytics", label: "Dashboard Analytics", icon: TrendingUp },
              { id: "appointments", label: `Active Appointments (${providerAppointments.length})`, icon: Calendar },
              { id: "verification", label: "Credential Verification", icon: ShieldCheck, accent: activeProvider.verified ? "text-emerald-500" : "text-amber-500 animate-pulse" },
              { id: "edit_profile", label: "Profile Metadata", icon: Settings },
              { id: "add_listing", label: "+ List / Claim Practice", icon: PlusCircle, accent: "text-teal-600 font-extrabold" }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold font-sans transition-all flex items-center gap-3 cursor-pointer ${
                    dashTab === tab.id 
                      ? "bg-teal-600 text-white shadow-md shadow-teal-100/50" 
                      : "bg-white hover:bg-teal-50/50 text-slate-600 border border-slate-100"
                  }`}
                >
                  <TabIcon className={`h-5 w-5 shrink-0 ${tab.accent || ""}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Simulated Live status badge */}
            <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>SYSTEM STATUS: OPERATIONAL</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed leading-normal">
                Lucknow servers fully optimized. Schema tags updated on National Google Indexing.
              </p>
            </div>
          </aside>

          {/* TAB CONTENTS CONTAINER */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* TAB: ANALYTICS */}
            {dashTab === "analytics" && (
              <div id="analytics-tab" className="space-y-6 animate-in fade-in duration-200">
                
                {/* 4 Cards Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Profile Views (30d)", val: "1,248", icon: Users, color: "text-teal-600 bg-teal-50" },
                    { label: "Active Bookings", val: providerAppointments.length, icon: Calendar, color: "text-emerald-600 bg-emerald-50" },
                    { label: "Average Rating", val: `${activeProvider.rating} ★`, icon: Star, color: "text-amber-600 bg-amber-50" },
                    { label: "SEO Completeness", val: `${seoAudit.score}%`, icon: ShieldCheck, color: "text-purple-600 bg-purple-50" }
                  ].map((stat, i) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-150 text-left space-y-1 shadow-xs">
                        <div className={`p-2 rounded-xl w-10 h-10 flex items-center justify-center mb-2 ${stat.color}`}>
                          <StatIcon className="h-5 w-5" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{stat.val}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Local SEO completeness score audit & Action guide */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 text-left space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-sans font-extrabold text-slate-900 text-base flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-teal-600" />
                        Local SEO &amp; Profile Completeness Audit
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        High profile scores guarantee 2.5x more prominent ranking placement in Lucknow specialty search pages.
                      </p>
                    </div>
                    <span className="bg-teal-50 border border-teal-200 text-teal-700 text-xs font-extrabold px-3 py-1.5 rounded-xl font-mono">
                      SEO Index Score: {seoAudit.score}/100
                    </span>
                  </div>

                  {seoAudit.missing.length === 0 ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Incredible job! Your profile details are 100% complete and fully optimized for local search indexes.</span>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs sm:text-sm font-sans">
                      <p className="font-bold text-slate-800">Complete these critical tasks to hit 100% score:</p>
                      <div className="space-y-2">
                        {seoAudit.missing.map((miss, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-600">
                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{miss}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Practice Traffic Graph */}
                <div className="bg-white p-6 rounded-3xl border border-slate-150 text-left space-y-4">
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-400">Monthly Profile Click Impressions</h3>
                  <div className="h-44 flex items-end gap-3 pt-6 border-b border-slate-100">
                    {[340, 480, 520, 680, 710, 890, 1120, 1248].map((val, i) => {
                      const pct = `${(val / 1300) * 100}%`;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="bg-teal-600 hover:bg-teal-700 transition-all rounded-t-lg w-full relative group"
                            style={{ height: pct }}
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {val} clicks
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">M{i+1}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-500 text-center font-sans">
                    Impression count has steadily escalated since claiming verified profile standing.
                  </p>
                </div>

              </div>
            )}

            {/* TAB: APPOINTMENTS */}
            {dashTab === "appointments" && (
              <div id="appointments-tab" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 text-left animate-in fade-in duration-200">
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-sans font-extrabold text-slate-900 text-base">Patient Consultation Registry</h3>
                      <p className="text-xs text-slate-500 mt-1">Manage and update active appointment slots requested by Lucknow patients.</p>
                    </div>
                    <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                      {providerAppointments.length} Total slots
                    </span>
                  </div>

                  {providerAppointments.length === 0 ? (
                    <div className="text-center p-12 text-slate-400 text-xs sm:text-sm">
                      No active bookings received. Public listing is live, slots will populate automatically.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm font-sans text-slate-600">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b border-slate-150 uppercase tracking-wider text-[10px] text-left">
                            <th className="py-3 px-4">Patient Name</th>
                            <th className="py-3 px-4">Date &amp; Slot</th>
                            <th className="py-3 px-4">Contact</th>
                            <th className="py-3 px-4">Symptoms / notes</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {providerAppointments.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-slate-950">{app.patientName}</td>
                              <td className="py-3.5 px-4">
                                <p className="font-semibold text-slate-800">{app.date}</p>
                                <p className="text-[11px] text-slate-400 font-mono">{app.time}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="text-slate-800">{app.patientPhone}</p>
                                <p className="text-[11px] text-slate-400">{app.patientEmail}</p>
                              </td>
                              <td className="py-3.5 px-4 max-w-xs truncate" title={app.patientSymptoms}>
                                {app.patientSymptoms || "-"}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  app.status === "confirmed" ? "bg-emerald-50 text-emerald-700" :
                                  app.status === "cancelled" ? "bg-rose-50 text-rose-700" :
                                  app.status === "completed" ? "bg-slate-100 text-slate-600" :
                                  "bg-amber-50 text-amber-700"
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                                {app.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => onUpdateAppointmentStatus(app.id, "confirmed")}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1 rounded hover:shadow cursor-pointer"
                                      title="Confirm Booking"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => onUpdateAppointmentStatus(app.id, "cancelled")}
                                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold p-1 rounded hover:shadow cursor-pointer"
                                      title="Cancel Booking"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                                {app.status === "confirmed" && (
                                  <button
                                    onClick={() => onUpdateAppointmentStatus(app.id, "completed")}
                                    className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded cursor-pointer"
                                  >
                                    Mark Complete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* TAB: MEDICAL CREDENTIALS VERIFICATION */}
            {dashTab === "verification" && (
              <div id="verification-tab" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 text-left space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="font-sans font-extrabold text-slate-900 text-base">Automated Credential Verification Scan</h3>
                  <p className="text-xs text-slate-500 mt-1">Cross-reference state medical certificates against King George's Medical Council and NMC registries.</p>
                </div>

                {activeProvider.verified ? (
                  <div className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-600 rounded-full text-white">
                        <CheckCircle className="h-6 w-6 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">Medical Council Verified Account</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Registration: {activeProvider.medicalRegistrationNumber} | Authorized Lucknow Council</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      Your identity profile has been fully validated. You have received the blue verification seal and specialized search engine meta schema indexes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Setup license forms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">MCI / NMC Registration ID</label>
                        <input
                          type="text"
                          required
                          value={licenseId}
                          onChange={(e) => setLicenseId(e.target.value)}
                          placeholder="e.g. MCI-45892"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">Issuing Council State</label>
                        <select className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-700">
                          <option>Uttar Pradesh Medical Council</option>
                          <option>Delhi Medical Council</option>
                          <option>All India Medical Council (NMC)</option>
                        </select>
                      </div>
                    </div>

                    {/* Drag and drop simulator */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">Certificate File Upload</p>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative cursor-pointer">
                        <input 
                          type="file"
                          accept=".pdf,.png,.jpg"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="space-y-2.5">
                          <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              {uploadedFile ? uploadedFile.name : "Drag & drop registration certificate here"}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">Supports PDF, PNG, JPEG up to 5MB</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scanner action triggers */}
                    {isScanning ? (
                      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-[11px] sm:text-xs text-teal-300 space-y-3">
                        <div className="flex justify-between border-b border-slate-800 pb-2 text-white">
                          <span>AI VERIFICATION STATUS</span>
                          <span className="animate-pulse">SCANNING...</span>
                        </div>
                        <div className="space-y-1.5">
                          <p className={scanStep >= 1 ? "text-emerald-400" : "opacity-45"}>
                            {scanStep >= 1 ? "✓" : "●"} Initializing scanning matrices for Registration ID: {licenseId}
                          </p>
                          <p className={scanStep >= 2 ? "text-emerald-400" : "opacity-45"}>
                            {scanStep >= 2 ? "✓" : "●"} Extracting text and metadata stamps via AI OCR engine...
                          </p>
                          <p className={scanStep >= 3 ? "text-emerald-400" : "opacity-45"}>
                            {scanStep >= 3 ? "✓" : "●"} Authenticating registration ID with National Medical Council APIs...
                          </p>
                          <p className={scanStep >= 4 ? "text-emerald-400" : "opacity-45"}>
                            {scanStep >= 4 ? "✓" : "●"} Authorizing verified badge and deploying local SEO schema...
                          </p>
                        </div>
                        <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-teal-500 h-full transition-all duration-500"
                            style={{ width: `${(scanStep / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={runCredentialVerificationScan}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        Run AI Verification Scan
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE METADATA (EDIT) */}
            {dashTab === "edit_profile" && (
              <div id="edit-profile-tab" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 text-left animate-in fade-in duration-200">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="font-sans font-extrabold text-slate-900 text-base">Practice Metadata Settings</h3>
                    <p className="text-xs text-slate-500 mt-1">Configure consultation pricing, address coordinates, and landmarks for patient navigation.</p>
                  </div>

                  {profileSavedMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl">
                      Success! Profile details and local SEO tags have been updated in the directory.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">OPD Consultation Fee (₹)</label>
                      <input
                        type="number"
                        required
                        value={editFee}
                        onChange={(e) => setEditFee(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Specialty Tags (Comma Separated)</label>
                      <input
                        type="text"
                        required
                        value={editSpecialties}
                        onChange={(e) => setEditSpecialties(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-slate-700">Physician Biography (About)</label>
                      <textarea
                        required
                        rows={4}
                        value={editAbout}
                        onChange={(e) => setEditAbout(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-slate-700">Clinical Address</label>
                      <input
                        type="text"
                        required
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-slate-700">Navigation Landmarks (Comma Separated)</label>
                      <input
                        type="text"
                        value={editLandmarks}
                        onChange={(e) => setEditLandmarks(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3 px-6 rounded-xl cursor-pointer shadow-md"
                    >
                      Save Settings
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB: ADD NEW PRACTICE / CLAIM EXISTING */}
            {dashTab === "add_listing" && (
              <div id="add-listing-tab" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-150 text-left space-y-8 animate-in fade-in duration-200">
                
                {/* Header */}
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-sans font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <PlusCircle className="h-5 w-5 text-teal-600" />
                      List Your Medical Practice or Claim Existing Entry
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Register a new doctor, clinic, hospital, or diagnostic lab listing in Lucknow healthcare index.
                    </p>
                  </div>
                </div>

                {listingSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="font-bold">{listingSuccessMsg}</span>
                  </div>
                )}

                {/* Form to Register New Practice */}
                <form onSubmit={handleCreateNewListing} className="space-y-6">
                  
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      1. Select Healthcare Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { type: ProviderType.DOCTOR, label: "Doctor Specialist", icon: Stethoscope },
                        { type: ProviderType.CLINIC, label: "Polyclinic / Clinic", icon: Building2 },
                        { type: ProviderType.HOSPITAL, label: "Multispecialty Hospital", icon: Hospital },
                        { type: ProviderType.LAB, label: "Diagnostic Lab", icon: FlaskConical }
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSel = newType === item.type;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => setNewType(item.type)}
                            className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center text-center gap-2 cursor-pointer ${
                              isSel 
                                ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-100" 
                                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-slate-700">Practitioner / Practice Facility Name *</label>
                      <input
                        type="text"
                        required
                        placeholder={newType === ProviderType.DOCTOR ? "e.g. Dr. Rajesh Verma" : "e.g. Sanjeevani Heart & General Hospital"}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Specialty / Primary Service Tag *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cardiologist, Orthopedic, Full Body Diagnostics"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Lucknow Locality Area *</label>
                      <select
                        value={newLocality}
                        onChange={(e) => setNewLocality(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800 cursor-pointer"
                      >
                        {LOCALITIES.map((loc) => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-slate-700">Full Clinical Address in Lucknow *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Plot 42, Viram Khand-2, Near Patrakar Puram Crossing, Gomti Nagar"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">OPD Consultation Fee (₹)</label>
                      <input
                        type="number"
                        required
                        value={newFee}
                        onChange={(e) => setNewFee(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Experience (Years)</label>
                      <input
                        type="text"
                        placeholder="e.g. 10"
                        value={newExperience}
                        onChange={(e) => setNewExperience(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">NMC / State Registration ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. UP-MCI-88910"
                        value={newRegistration}
                        onChange={(e) => setNewRegistration(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Contact Telephone / WhatsApp</label>
                      <input
                        type="text"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-bold text-slate-700">Practice Description / Biography</label>
                      <textarea
                        rows={3}
                        placeholder="Describe clinical services, diagnostic equipment, or OPD clinic schedules..."
                        value={newAbout}
                        onChange={(e) => setNewAbout(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800"
                      />
                    </div>

                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input 
                        type="checkbox"
                        checked={newEmergency}
                        onChange={(e) => setNewEmergency(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <span>24x7 Emergency Services Available</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input 
                        type="checkbox"
                        checked={newTeleconsult}
                        onChange={(e) => setNewTeleconsult(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <span>Online Video Consultation Supported</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-8 rounded-xl shadow-md shadow-teal-100 cursor-pointer flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Publish Practice Listing</span>
                    </button>
                  </div>

                </form>

                {/* Claim existing practice section */}
                <div className="pt-8 border-t border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">Already listed in Lucknow Directory? Claim Your Practice</h4>
                    <p className="text-xs text-slate-500">Search for an existing unverified facility or doctor profile in our Lucknow database to claim management rights.</p>
                  </div>

                  <div className="relative max-w-md">
                    <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search existing Lucknow practice by name..."
                      value={claimSearch}
                      onChange={(e) => setClaimSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-xs rounded-xl text-slate-800"
                    />
                  </div>

                  {claimSearch.trim().length > 1 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
                      {providers
                        .filter(p => p.name.toLowerCase().includes(claimSearch.toLowerCase()) || (p.localityId && p.localityId.toLowerCase().includes(claimSearch.toLowerCase())))
                        .map(p => (
                          <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                            <div>
                              <p className="font-bold text-slate-900">{p.name}</p>
                              <p className="text-[10px] text-slate-500">{p.specialties.join(", ")} • {p.localityId}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleClaimListing(p)}
                              className="bg-slate-900 hover:bg-teal-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Claim Practice
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
