import React, { useState, useMemo, useEffect } from "react";
import { 
  Users, Activity, Calendar, Star, ShieldCheck, RefreshCw, Upload, Sparkles, 
  Settings, TrendingUp, AlertCircle, FileText, CheckCircle, Clock, Trash, ChevronRight, Check,
  PlusCircle, Building2, Stethoscope, Hospital as HospitalIcon, FlaskConical, Search, Phone, Mail,
  User, ShieldAlert, Heart, UserPlus, Bell, Lock, FileCheck, Eye, BadgeAlert, AlertTriangle, Shield,
  Bed, FileSpreadsheet, Megaphone, DollarSign, Layers, CheckSquare, XCircle, UserCheck, Plus, Edit2,
  Share2, MapPin, Map, Award, HelpCircle, Navigation
} from "lucide-react";
import { 
  Provider, ProviderType, Appointment, Review, ViewState, UserRole, AccountStatus, UserProfile, 
  FamilyMember, VerificationDocument, AuditLog, ReceptionStaff, HospitalDepartment, LabTestItem, 
  LabReport, AbuseReport, AdvertCampaign 
} from "../types";
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
  initialTab?: string;
  onOpenAuth?: (mode?: "login" | "signup") => void;
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
  initialTab,
  onOpenAuth
}: DashboardViewProps) {

  // Resolve user role & profile metadata
  const userRole: UserRole = useMemo(() => {
    if (!currentUser) return "patient";
    if (currentUser.role) return currentUser.role;
    const metaKey = `lko_user_meta_${currentUser.uid}`;
    const stored = localStorage.getItem(metaKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.role) return parsed.role;
      } catch {}
    }
    const nameLower = (currentUser.displayName || "").toLowerCase();
    if (nameLower.includes("admin")) return "admin";
    if (nameLower.includes("moderator")) return "moderator";
    if (nameLower.includes("hospital")) return "hospital";
    if (nameLower.includes("clinic")) return "clinic";
    if (nameLower.includes("lab")) return "diagnostic_lab";
    if (nameLower.includes("dr.") || nameLower.includes("doctor")) return "doctor";
    return "patient";
  }, [currentUser]);

  const isGuest = !currentUser;
  const isPatient = userRole === "patient";
  const isDoctor = userRole === "doctor";
  const isClinic = userRole === "clinic";
  const isHospital = userRole === "hospital";
  const isLab = userRole === "diagnostic_lab";
  const isModerator = userRole === "moderator";
  const isAdmin = userRole === "admin";
  const isProvider = isDoctor || isClinic || isHospital || isLab;

  // Resolve active provider profile for provider roles
  const activeProvider = useMemo(() => {
    if (currentUser) {
      const email = currentUser.email?.toLowerCase();
      const matched = providers.find(p => p.id === currentUser.uid || (p.email && p.email.toLowerCase() === email));
      if (matched) return matched;

      const namePart = currentUser.displayName?.split('|')[0] || currentUser.email || 'Healthcare Facility';
      return {
        id: currentUser.uid,
        name: namePart.startsWith("Dr.") ? namePart.substring(4) : namePart,
        type: isClinic ? ProviderType.CLINIC : (isHospital ? ProviderType.HOSPITAL : (isLab ? ProviderType.LAB : ProviderType.DOCTOR)),
        specialties: ["General Practice"],
        treatments: ["Outpatient Consultation"],
        localityId: "gomti-nagar",
        cityId: "lucknow",
        address: "Lucknow Health Practice Facility",
        consultationFee: 500,
        rating: 4.8,
        reviewsCount: 3,
        verified: false,
        about: "Verified medical practice registered on Lucknow Discovery Engine.",
        experienceYears: 7,
        languages: ["English", "Hindi"],
        services: ["In-person OPD", "Emergency Care"],
        seoScore: 82,
        emergencyServices: true,
        availability: [{
          day: "Monday - Saturday",
          slots: [
            { id: "s1", time: "10:00 AM", isAvailable: true },
            { id: "s2", time: "11:30 AM", isAvailable: true },
            { id: "s3", time: "03:00 PM", isAvailable: true },
            { id: "s4", time: "05:30 PM", isAvailable: true }
          ]
        }],
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
        medicalRegistrationNumber: "UP-MCI-88201"
      };
    }
    return providers[0];
  }, [currentUser, providers, isClinic, isHospital, isLab, isDoctor]);

  // Tab State initialization based on role
  const defaultTabForRole = useMemo(() => {
    if (isPatient) return "upcoming_appointments";
    if (isDoctor) return "analytics";
    if (isClinic) return "analytics";
    if (isHospital) return "analytics";
    if (isLab) return "analytics";
    if (isModerator) return "review_moderation";
    if (isAdmin) return "overview_stats";
    return "upcoming_appointments";
  }, [isPatient, isDoctor, isClinic, isHospital, isLab, isModerator, isAdmin]);

  const [dashTab, setDashTab] = useState<string>(initialTab || defaultTabForRole);

  useEffect(() => {
    if (!initialTab) {
      setDashTab(defaultTabForRole);
    }
  }, [defaultTabForRole, initialTab]);

  // --- PATIENT STATE ---
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "fm-1", name: "Sunita Kumar", relationship: "Spouse", gender: "Female", age: 42, bloodGroup: "B+" },
    { id: "fm-2", name: "Aarav Kumar", relationship: "Child", gender: "Male", age: 14, bloodGroup: "O+" }
  ]);
  const [newFmName, setNewFmName] = useState("");
  const [newFmRel, setNewFmRel] = useState("Spouse");
  const [newFmAge, setNewFmAge] = useState("");
  const [newFmGender, setNewFmGender] = useState("Female");
  const [newFmBlood, setNewFmBlood] = useState("B+");
  const [fmMsg, setFmMsg] = useState("");

  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    push: false
  });

  const [savedProviderIds, setSavedProviderIds] = useState<string[]>(["dr-anand-verma", "hazratganj-dental"]);

  // --- DOCTOR / CLINIC EDITABLE FIELDS ---
  const [editFee, setEditFee] = useState(activeProvider.consultationFee);
  const [editAbout, setEditAbout] = useState(activeProvider.about);
  const [editAddress, setEditAddress] = useState(activeProvider.address);
  const [editSpecialties, setEditSpecialties] = useState(activeProvider.specialties.join(", "));
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // --- CLINIC RECEPTION STAFF STATE ---
  const [receptionStaff, setReceptionStaff] = useState<ReceptionStaff[]>([
    { id: "stf-1", name: "Ramesh Sharma", email: "ramesh.reception@clinic.com", phone: "+91 98390 11223", assignedClinicId: activeProvider.id, addedAt: "2026-06-10" },
    { id: "stf-2", name: "Priya Singh", email: "priya.frontdesk@clinic.com", phone: "+91 94150 44556", assignedClinicId: activeProvider.id, addedAt: "2026-07-01" }
  ]);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  // --- CLINIC DOCTORS ROSTER STATE ---
  const [clinicDoctors, setClinicDoctors] = useState([
    { id: "c-doc-1", name: "Dr. Anand Verma", specialty: "Cardiology", qualification: "MD, DM", expYears: 12, fee: 700 },
    { id: "c-doc-2", name: "Dr. Priya Saxena", specialty: "Dentistry", qualification: "BDS, MDS", expYears: 8, fee: 500 }
  ]);
  const [newCDocName, setNewCDocName] = useState("");
  const [newCDocSpec, setNewCDocSpec] = useState("Orthopedics");
  const [newCDocFee, setNewCDocFee] = useState(500);

  // --- HOSPITAL DEPARTMENTS STATE ---
  const [departments, setDepartments] = useState<HospitalDepartment[]>([
    { id: "dep-1", name: "Cardiology & Cardiac Surgery", headDoctor: "Dr. Anand Verma", doctorCount: 6, bedCapacity: 35, availableBeds: 8 },
    { id: "dep-2", name: "Orthopedics & Joint Replacement", headDoctor: "Dr. Sunita Kapoor", doctorCount: 4, bedCapacity: 25, availableBeds: 5 },
    { id: "dep-3", name: "Neurology & Neurosurgery", headDoctor: "Dr. R.K. Pandey", doctorCount: 3, bedCapacity: 20, availableBeds: 3 },
    { id: "dep-4", name: "24/7 Emergency & Critical Trauma", headDoctor: "Dr. Alok Srivastava", doctorCount: 8, bedCapacity: 40, availableBeds: 12 }
  ]);
  const [newDepName, setNewDepName] = useState("");
  const [newDepHead, setNewDepHead] = useState("");
  const [newDepBeds, setNewDepBeds] = useState(20);

  // --- DIAGNOSTIC LAB TESTS STATE ---
  const [labTests, setLabTests] = useState<LabTestItem[]>([
    { id: "lt-1", testName: "Complete Blood Count (CBC)", category: "Hematology", price: 350, sampleRequired: "Blood", turnaroundTime: "6 Hours", isHomeCollectionAvailable: true },
    { id: "lt-2", testName: "Lipid Profile Screening", category: "Biochemistry", price: 600, sampleRequired: "Fasting Blood", turnaroundTime: "12 Hours", isHomeCollectionAvailable: true },
    { id: "lt-3", testName: "HbA1c Glycated Hemoglobin", category: "Diabetology", price: 450, sampleRequired: "Blood", turnaroundTime: "8 Hours", isHomeCollectionAvailable: true },
    { id: "lt-4", testName: "Thyroid Profile (T3, T4, TSH)", category: "Endocrinology", price: 550, sampleRequired: "Blood", turnaroundTime: "24 Hours", isHomeCollectionAvailable: true }
  ]);
  const [newTestName, setNewTestName] = useState("");
  const [newTestCat, setNewTestCat] = useState("Biochemistry");
  const [newTestPrice, setNewTestPrice] = useState(500);

  const [labReports, setLabReports] = useState<LabReport[]>([
    { id: "rep-101", patientName: "Kamlesh Kumar", testName: "Lipid Profile Screening", date: "2026-07-28", status: "ready" },
    { id: "rep-102", patientName: "Sunita Kumar", testName: "Thyroid Profile (T3, T4, TSH)", date: "2026-07-30", status: "processing" }
  ]);

  // --- MODERATOR ABUSE REPORTS & REVIEWS STATE ---
  const [abuseReports, setAbuseReports] = useState<AbuseReport[]>([
    { id: "rep-1", targetId: "rev-88", targetName: "Review for Dr. Anand Verma", reporterName: "Patient Anon", reason: "Inappropriate language in review comment", date: "2026-07-29", status: "pending" },
    { id: "rep-2", targetId: "prov-12", targetName: "Unverified Clinic Listing", reporterName: "Dr. Alok", reason: "Claimed fake registration number", date: "2026-07-30", status: "pending" }
  ]);

  const [reviewsQueue, setReviewsQueue] = useState([
    { id: "rq-1", providerName: "Dr. Anand Verma", patientName: "Rahul Sharma", rating: 5, comment: "Excellent care and thorough examination for my cardiac issue.", date: "2026-07-30", status: "pending" },
    { id: "rq-2", providerName: "Gomti Dental Clinic", patientName: "Megha Gupta", rating: 4, comment: "Clean clinic, reasonable fees, polite front desk staff.", date: "2026-07-31", status: "pending" }
  ]);

  // --- ADMIN SYSTEM STATE ---
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [usersList, setUsersList] = useState<UserProfile[]>([
    { uid: "user-101", name: "Dr. Anand Verma", email: "dr.anand@lucknowcardiology.org", mobile: "+91 98390 12345", role: "doctor", status: "active", createdAt: "2026-05-10", medicalRegistrationNumber: "UP-MCI-88201", facilityName: "Lucknow Heart Care Center" },
    { uid: "user-102", name: "Gomti Nagar Dental Clinic", email: "contact@gomtidentistry.in", mobile: "+91 522 230911", role: "clinic", status: "pending_verification", createdAt: "2026-07-25", facilityName: "Gomti Nagar Dental Clinic" },
    { uid: "user-103", name: "MedCity Hospital Lucknow", email: "admin@medcitylucknow.org", mobile: "+91 522 450000", role: "hospital", status: "active", createdAt: "2026-04-12", facilityName: "MedCity Hospital" },
    { uid: "user-104", name: "Dr. Lal PathLabs Gomti Nagar", email: "gomtilab@pathlabs.com", mobile: "+91 94150 99887", role: "diagnostic_lab", status: "active", createdAt: "2026-06-01" },
    { uid: "user-105", name: "Kamlesh Kumar", email: "patient@lucknowhealth.org", mobile: "+91 98765 43210", role: "patient", status: "active", createdAt: "2026-07-15" }
  ]);

  const [adverts, setAdverts] = useState<AdvertCampaign[]>([
    { id: "adv-1", title: "Free Cardiac Health Checkup Camp", providerName: "Lucknow Heart Care Center", placement: "hero_banner", budget: 15000, clicks: 420, impressions: 8500, status: "active" },
    { id: "adv-2", title: "20% Off Dental Scaling Package", providerName: "Gomti Dental Clinic", placement: "search_top", budget: 8000, clicks: 190, impressions: 4200, status: "active" }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: "log-1", actorName: "Super Admin", actorRole: "admin", action: "Approved Doctor Verification", targetUser: "Dr. Anand Verma", timestamp: "2026-07-28 14:32", details: "Verified NMC Registration Certificate" },
    { id: "log-2", actorName: "Health Moderator", actorRole: "moderator", action: "Approved Review", targetUser: "Gomti Nagar Dental Clinic", timestamp: "2026-07-29 10:15", details: "Review ID rev-102 validated as genuine patient" }
  ]);

  // Verification documents state
  const [verificationDocs, setVerificationDocs] = useState<VerificationDocument[]>([
    {
      id: "doc-101",
      documentType: "NMC / State Medical Registration Certificate",
      documentNumber: activeProvider.medicalRegistrationNumber || "UP-MCI-88201",
      submittedAt: "2026-07-28",
      status: activeProvider.verified ? "approved" : "pending"
    }
  ]);
  const [newDocType, setNewDocType] = useState("NMC Registration Certificate");
  const [newDocNo, setNewDocNo] = useState("");
  const [docSuccessMsg, setDocSuccessMsg] = useState("");

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Provider = {
      ...activeProvider,
      consultationFee: Number(editFee),
      about: editAbout,
      address: editAddress,
      specialties: editSpecialties.split(",").map(s => s.trim()).filter(Boolean)
    };
    onUpdateProvider(updated);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFmName.trim()) return;
    const newMember: FamilyMember = {
      id: `fm-${Date.now()}`,
      name: newFmName.trim(),
      relationship: newFmRel,
      gender: newFmGender,
      age: Number(newFmAge) || 25,
      bloodGroup: newFmBlood
    };
    setFamilyMembers([...familyMembers, newMember]);
    setNewFmName("");
    setNewFmAge("");
    setFmMsg("Family member added successfully!");
    setTimeout(() => setFmMsg(""), 2500);
  };

  const handleAddReceptionStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;
    const newStf: ReceptionStaff = {
      id: `stf-${Date.now()}`,
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      phone: newStaffPhone.trim() || "+91 98000 00000",
      assignedClinicId: activeProvider.id,
      addedAt: new Date().toISOString().split("T")[0]
    };
    setReceptionStaff([...receptionStaff, newStf]);
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffPhone("");
  };

  const handleAddHospitalDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepName.trim()) return;
    const newDep: HospitalDepartment = {
      id: `dep-${Date.now()}`,
      name: newDepName.trim(),
      headDoctor: newDepHead.trim() || "Dr. Assigned Head",
      doctorCount: 3,
      bedCapacity: Number(newDepBeds) || 20,
      availableBeds: Number(newDepBeds) || 20
    };
    setDepartments([...departments, newDep]);
    setNewDepName("");
    setNewDepHead("");
  };

  const handleAddLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;
    const newTest: LabTestItem = {
      id: `lt-${Date.now()}`,
      testName: newTestName.trim(),
      category: newTestCat,
      price: Number(newTestPrice) || 400,
      sampleRequired: "Blood / Urine",
      turnaroundTime: "12 Hours",
      isHomeCollectionAvailable: true
    };
    setLabTests([...labTests, newTest]);
    setNewTestName("");
  };

  const handleToggleUserStatus = (uid: string, newStatus: AccountStatus) => {
    setUsersList(usersList.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        actorName: currentUser?.displayName?.split("|")[0] || "Admin",
        actorRole: userRole,
        action: `Set Account Status to ${newStatus.toUpperCase()}`,
        targetUser: uid,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        details: `Updated account status for user ${uid}`
      },
      ...auditLogs
    ]);
  };

  // If Guest visitor accesses dashboard
  if (isGuest) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 font-sans text-left">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="mx-auto bg-teal-50 border border-teal-200 text-teal-600 rounded-3xl w-16 h-16 flex items-center justify-center">
            <Lock className="h-8 w-8 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs text-teal-700 font-extrabold uppercase tracking-widest bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
              AUTHENTICATION REQUIRED
            </span>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">
              Access Lucknow Healthcare Dashboards
            </h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Guests can freely search doctors, clinics, hospitals, and diagnostic labs. Please sign in or create an account to manage appointments, clinic rosters, or access specialized user portals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-2">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150">
              <span className="text-xl">👨‍⚕️</span>
              <p className="font-bold text-xs text-slate-900 mt-1">Patients</p>
              <p className="text-[10px] text-slate-500">Bookings & Records</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150">
              <span className="text-xl">🩺</span>
              <p className="font-bold text-xs text-slate-900 mt-1">Doctors</p>
              <p className="text-[10px] text-slate-500">OPD Slots & Analytics</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150">
              <span className="text-xl">🏢</span>
              <p className="font-bold text-xs text-slate-900 mt-1">Clinics & Labs</p>
              <p className="text-[10px] text-slate-500">Rosters & Test Catalog</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150">
              <span className="text-xl">🛡️</span>
              <p className="font-bold text-xs text-slate-900 mt-1">Admin / Mod</p>
              <p className="text-[10px] text-slate-500">System Verification</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => onOpenAuth && onOpenAuth("login")}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Sign In to Portal
            </button>
            <button
              onClick={() => onOpenAuth && onOpenAuth("signup")}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
            >
              Register New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard-view" className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP HEADER CARD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-150 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-teal-800 font-extrabold uppercase tracking-wider bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                {userRole.replace("_", " ").toUpperCase()} PORTAL
              </span>

              {isProvider && (
                activeProvider.verified ? (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    <span>NMC Verified</span>
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <BadgeAlert className="h-3 w-3 text-amber-600" />
                    <span>Pending Verification</span>
                  </span>
                )
              )}
            </div>

            <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">
              Welcome, {currentUser?.displayName?.split("|")[0] || activeProvider.name}
            </h1>
            <p className="text-xs text-slate-500">
              Logged in as <strong className="font-mono text-slate-700">{currentUser?.email || activeProvider.email}</strong> • Account Status: <span className="font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">ACTIVE</span>
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => onNavigate("home")}
              className="flex-1 md:flex-initial border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans text-xs font-bold px-4 py-2.5 rounded-xl text-center cursor-pointer"
            >
              Back to Home
            </button>
            {isProvider && (
              <button
                onClick={() => onNavigate("profile")}
                className="flex-1 md:flex-initial bg-teal-600 hover:bg-teal-700 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl text-center cursor-pointer shadow-sm"
              >
                View Public Listing
              </button>
            )}
          </div>
        </div>

        {/* MAIN SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* SIDEBAR TABS */}
          <aside className="space-y-2">
            
            {/* 1. PATIENT TABS */}
            {isPatient && [
              { id: "upcoming_appointments", label: "Upcoming Bookings", icon: Calendar },
              { id: "past_appointments", label: "Past Appointments", icon: Clock },
              { id: "saved_providers", label: "Saved Providers", icon: Heart },
              { id: "family_members", label: "Family Members", icon: Users },
              { id: "notif_prefs", label: "Notification Settings", icon: Bell },
              { id: "account_settings", label: "Account Settings", icon: Settings }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    dashTab === tab.id 
                      ? "bg-teal-600 text-white shadow-md shadow-teal-100" 
                      : "bg-white hover:bg-teal-50/50 text-slate-600 border border-slate-100"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${dashTab === tab.id ? "text-white" : "text-teal-600"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* 2. DOCTOR TABS */}
            {isDoctor && [
              { id: "analytics", label: "Overview & Analytics", icon: TrendingUp },
              { id: "appointments", label: `OPD Queue (${appointments.length})`, icon: Calendar },
              { id: "slots_timings", label: "OPD Slots & Timings", icon: Clock },
              { id: "verification", label: "NMC License Credentials", icon: ShieldCheck },
              { id: "edit_profile", label: "Clinic & Bio Settings", icon: Settings }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    dashTab === tab.id 
                      ? "bg-teal-600 text-white shadow-md shadow-teal-100" 
                      : "bg-white hover:bg-teal-50/50 text-slate-600 border border-slate-100"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${dashTab === tab.id ? "text-white" : "text-teal-600"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* 3. CLINIC TABS */}
            {isClinic && [
              { id: "analytics", label: "Clinic Overview", icon: TrendingUp },
              { id: "doctors_roster", label: `Doctors Directory (${clinicDoctors.length})`, icon: Stethoscope },
              { id: "reception_staff", label: `Reception Staff (${receptionStaff.length})`, icon: Users },
              { id: "appointments", label: "Master Appointments", icon: Calendar },
              { id: "edit_profile", label: "Clinic Profile Settings", icon: Building2 }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    dashTab === tab.id 
                      ? "bg-teal-600 text-white shadow-md shadow-teal-100" 
                      : "bg-white hover:bg-teal-50/50 text-slate-600 border border-slate-100"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${dashTab === tab.id ? "text-white" : "text-teal-600"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* 4. HOSPITAL TABS */}
            {isHospital && [
              { id: "analytics", label: "Hospital Overview", icon: TrendingUp },
              { id: "departments", label: `Departments (${departments.length})`, icon: Layers },
              { id: "hospital_doctors", label: "Doctors Directory", icon: Stethoscope },
              { id: "appointments", label: "OPD & Admissions Queue", icon: Calendar },
              { id: "edit_profile", label: "Hospital Infrastructure", icon: HospitalIcon }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    dashTab === tab.id 
                      ? "bg-teal-600 text-white shadow-md shadow-teal-100" 
                      : "bg-white hover:bg-teal-50/50 text-slate-600 border border-slate-100"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${dashTab === tab.id ? "text-white" : "text-teal-600"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* 5. DIAGNOSTIC LAB TABS */}
            {isLab && [
              { id: "analytics", label: "Lab Overview", icon: TrendingUp },
              { id: "tests_catalog", label: `Tests Catalog (${labTests.length})`, icon: FlaskConical },
              { id: "patient_reports", label: `Patient Reports (${labReports.length})`, icon: FileSpreadsheet },
              { id: "appointments", label: "Home Sample Bookings", icon: Calendar },
              { id: "edit_profile", label: "Lab Profile Settings", icon: Settings }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    dashTab === tab.id 
                      ? "bg-teal-600 text-white shadow-md shadow-teal-100" 
                      : "bg-white hover:bg-teal-50/50 text-slate-600 border border-slate-100"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${dashTab === tab.id ? "text-white" : "text-teal-600"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* 6. MODERATOR TABS */}
            {isModerator && [
              { id: "review_moderation", label: `Review Moderation (${reviewsQueue.length})`, icon: Star },
              { id: "abuse_reports", label: `Abuse Reports (${abuseReports.length})`, icon: AlertTriangle },
              { id: "verification_support", label: "Verification Support", icon: ShieldCheck }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    dashTab === tab.id 
                      ? "bg-teal-600 text-white shadow-md shadow-teal-100" 
                      : "bg-white hover:bg-teal-50/50 text-slate-600 border border-slate-100"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${dashTab === tab.id ? "text-white" : "text-teal-600"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* 7. ADMIN TABS */}
            {isAdmin && [
              { id: "overview_stats", label: "Platform Overview", icon: TrendingUp },
              { id: "user_mgmt", label: `User Accounts (${usersList.length})`, icon: Users },
              { id: "providers_mgmt", label: `Providers (${providers.length})`, icon: ShieldCheck },
              { id: "adverts_revenue", label: `Adverts & Revenue`, icon: Megaphone },
              { id: "audit_logs", label: "System Audit Logs", icon: FileText }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    dashTab === tab.id 
                      ? "bg-teal-600 text-white shadow-md shadow-teal-100" 
                      : "bg-white hover:bg-teal-50/50 text-slate-600 border border-slate-100"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${dashTab === tab.id ? "text-white" : "text-teal-600"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </aside>

          {/* MAIN TAB CONTENT DISPLAY */}
          <div className="lg:col-span-3 space-y-6">

            {/* --- PATIENT VIEWS --- */}
            {isPatient && (dashTab === "upcoming_appointments" || dashTab === "past_appointments") && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-4">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <span>{dashTab === "upcoming_appointments" ? "My Upcoming Appointments" : "Past Appointment History"}</span>
                </h3>

                {appointments.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 font-bold">No appointments found.</p>
                    <button
                      onClick={() => onNavigate("search")}
                      className="mt-3 bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Search & Book Doctor
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            apt.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {apt.status}
                          </span>
                          <h4 className="font-bold text-slate-900 mt-1">{apt.providerName}</h4>
                          <p className="text-xs text-slate-500">📅 {apt.date} at 🕒 {apt.time}</p>
                          <p className="text-xs text-slate-600 mt-1">Patient: <strong>{apt.patientName}</strong> ({apt.patientPhone})</p>
                        </div>
                        <div className="flex gap-2">
                          {apt.status !== "cancelled" && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, "cancelled")}
                              className="bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isPatient && dashTab === "family_members" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-5">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  <span>Family Members Directory</span>
                </h3>

                {fmMsg && (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>{fmMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {familyMembers.map((fm) => (
                    <div key={fm.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{fm.name}</h4>
                        <p className="text-xs text-slate-500">{fm.relationship} • {fm.age} Yrs • {fm.gender}</p>
                        {fm.bloodGroup && <span className="font-mono text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">Blood Group: {fm.bloodGroup}</span>}
                      </div>
                      <button
                        onClick={() => setFamilyMembers(familyMembers.filter(m => m.id !== fm.id))}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddFamilyMember} className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">+ Add Family Member</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={newFmName}
                      onChange={(e) => setNewFmName(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                    <select
                      value={newFmRel}
                      onChange={(e) => setNewFmRel(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Age"
                      value={newFmAge}
                      onChange={(e) => setNewFmAge(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                  </div>
                  <button type="submit" className="bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                    Add Family Member
                  </button>
                </form>
              </div>
            )}

            {isPatient && dashTab === "notif_prefs" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-4">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-teal-600" />
                  <span>Notification Preferences</span>
                </h3>
                <div className="space-y-3 max-w-md">
                  {[
                    { key: "sms", label: "SMS Appointment Alerts & Reminders" },
                    { key: "email", label: "Email Confirmation & Diagnostic Reports" },
                    { key: "whatsapp", label: "WhatsApp Real-time Slot Updates" },
                    { key: "push", label: "Browser Push Notifications" }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                      <span className="text-xs font-bold text-slate-700">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={(notifPrefs as any)[item.key]}
                        onChange={(e) => setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* --- DOCTOR VIEWS --- */}
            {isDoctor && dashTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-2xs space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booked OPD Patients</p>
                    <p className="text-2xl font-extrabold text-slate-900 font-mono">{appointments.length}</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-2xs space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Rating</p>
                    <p className="text-2xl font-extrabold text-amber-600 font-mono flex items-center gap-1">
                      <span>{activeProvider.rating}</span>
                      <Star className="h-4 w-4 fill-amber-500 stroke-none" />
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-2xs space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consultation Fee</p>
                    <p className="text-2xl font-extrabold text-teal-600 font-mono">₹{activeProvider.consultationFee}</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-3">
                  <h3 className="font-bold text-base text-slate-900">Today's Appointment Queue</h3>
                  {appointments.length === 0 ? (
                    <p className="text-xs text-slate-500">No appointments logged yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {appointments.map((apt) => (
                        <div key={apt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{apt.patientName} ({apt.patientPhone})</p>
                            <p className="text-slate-500 text-[11px]">{apt.date} • {apt.time}</p>
                          </div>
                          <span className="font-bold capitalize text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- CLINIC VIEWS --- */}
            {isClinic && dashTab === "doctors_roster" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-teal-600" />
                    <span>Clinic Associated Doctors Roster</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clinicDoctors.map((doc) => (
                    <div key={doc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                        <p className="text-xs text-slate-500">{doc.specialty} • {doc.qualification}</p>
                        <p className="text-xs text-teal-700 font-bold mt-1">₹{doc.fee} Fee • {doc.expYears} Yrs Experience</p>
                      </div>
                      <button
                        onClick={() => setClinicDoctors(clinicDoctors.filter(d => d.id !== doc.id))}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCDocName.trim()) return;
                  setClinicDoctors([...clinicDoctors, { id: `c-doc-${Date.now()}`, name: newCDocName, specialty: newCDocSpec, qualification: "MBBS", expYears: 5, fee: Number(newCDocFee) }]);
                  setNewCDocName("");
                }} className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">+ Add Doctor to Clinic Roster</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Doctor Name (e.g. Dr. K.P. Singh)"
                      value={newCDocName}
                      onChange={(e) => setNewCDocName(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Specialty (e.g. Pediatrics)"
                      value={newCDocSpec}
                      onChange={(e) => setNewCDocSpec(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Consultation Fee (₹)"
                      value={newCDocFee}
                      onChange={(e) => setNewCDocFee(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                  </div>
                  <button type="submit" className="bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                    Add Doctor
                  </button>
                </form>
              </div>
            )}

            {isClinic && dashTab === "reception_staff" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-5">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  <span>Reception & Desk Staff Accounts</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {receptionStaff.map((stf) => (
                    <div key={stf.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{stf.name}</h4>
                        <p className="text-xs text-slate-500">{stf.email} • {stf.phone}</p>
                        <span className="text-[10px] text-slate-400">Added: {stf.addedAt}</span>
                      </div>
                      <button
                        onClick={() => setReceptionStaff(receptionStaff.filter(s => s.id !== stf.id))}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddReceptionStaff} className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">+ Add Reception Staff Account</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Staff Name"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Staff Email"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                  </div>
                  <button type="submit" className="bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                    Create Reception Login
                  </button>
                </form>
              </div>
            )}

            {/* --- HOSPITAL VIEWS --- */}
            {isHospital && dashTab === "departments" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-5">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-teal-600" />
                  <span>Hospital Clinical Departments & Bed Capacity</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {departments.map((dep) => (
                    <div key={dep.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-sm">{dep.name}</h4>
                        <span className="font-mono text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-bold">
                          {dep.availableBeds} / {dep.bedCapacity} Beds Free
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Department Head: <strong>{dep.headDoctor}</strong></p>
                      <p className="text-xs text-slate-600">Doctors On Duty: <strong>{dep.doctorCount} Doctors</strong></p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddHospitalDept} className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">+ Add Clinical Department</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Department Name"
                      value={newDepName}
                      onChange={(e) => setNewDepName(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Department Head"
                      value={newDepHead}
                      onChange={(e) => setNewDepHead(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                    <input
                      type="number"
                      placeholder="Total Bed Capacity"
                      value={newDepBeds}
                      onChange={(e) => setNewDepBeds(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                  </div>
                  <button type="submit" className="bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                    Add Department
                  </button>
                </form>
              </div>
            )}

            {/* --- DIAGNOSTIC LAB VIEWS --- */}
            {isLab && dashTab === "tests_catalog" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-5">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-teal-600" />
                  <span>Diagnostic Tests & Pathology Catalog</span>
                </h3>

                <div className="space-y-2">
                  {labTests.map((tst) => (
                    <div key={tst.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{tst.testName}</h4>
                        <p className="text-slate-500 text-[11px]">{tst.category} • Sample: {tst.sampleRequired} • TAT: {tst.turnaroundTime}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-extrabold text-teal-700 text-sm">₹{tst.price}</span>
                        <p className="text-[10px] text-emerald-600 font-bold">Home Collection Available</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddLabTest} className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">+ Add Diagnostic Test</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Test Name (e.g. Vitamin D Total)"
                      value={newTestName}
                      onChange={(e) => setNewTestName(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                    <select
                      value={newTestCat}
                      onChange={(e) => setNewTestCat(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    >
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Hematology">Hematology</option>
                      <option value="Diabetology">Diabetology</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Microbiology">Microbiology</option>
                    </select>
                    <input
                      type="number"
                      required
                      placeholder="Price (₹)"
                      value={newTestPrice}
                      onChange={(e) => setNewTestPrice(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl"
                    />
                  </div>
                  <button type="submit" className="bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                    Add Test to Catalog
                  </button>
                </form>
              </div>
            )}

            {/* --- MODERATOR VIEWS --- */}
            {isModerator && dashTab === "review_moderation" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-4">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-teal-600" />
                  <span>Patient Review Moderation Queue</span>
                </h3>

                <div className="space-y-3">
                  {reviewsQueue.map((rq) => (
                    <div key={rq.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{rq.patientName}</span>
                          <span className="font-bold text-amber-600 text-xs flex items-center gap-0.5">
                            {rq.rating} ★
                          </span>
                          <span className="text-xs text-slate-400">for {rq.providerName}</span>
                        </div>
                        <p className="text-xs text-slate-700 italic mt-1 font-serif">"{rq.comment}"</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setReviewsQueue(reviewsQueue.filter(q => q.id !== rq.id))}
                          className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          Approve Review
                        </button>
                        <button
                          onClick={() => setReviewsQueue(reviewsQueue.filter(q => q.id !== rq.id))}
                          className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- ADMIN VIEWS --- */}
            {isAdmin && dashTab === "overview_stats" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-2xs">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Platform Users</p>
                    <p className="text-xl font-extrabold text-slate-900 font-mono">{usersList.length + 120}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-2xs">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Listed Providers</p>
                    <p className="text-xl font-extrabold text-teal-700 font-mono">{providers.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-2xs">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Bookings</p>
                    <p className="text-xl font-extrabold text-slate-900 font-mono">1,840</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-2xs">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Platform Status</p>
                    <p className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">HEALTHY</p>
                  </div>
                </div>
              </div>
            )}

            {isAdmin && dashTab === "user_mgmt" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-teal-600" />
                    <span>User Accounts Directory</span>
                  </h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-48">
                      <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search user..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 pl-8 pr-2 py-1.5 text-xs rounded-xl"
                      />
                    </div>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs px-2 py-1.5 rounded-xl"
                    >
                      <option value="all">All Roles</option>
                      <option value="patient">Patients</option>
                      <option value="doctor">Doctors</option>
                      <option value="clinic">Clinics</option>
                      <option value="hospital">Hospitals</option>
                      <option value="diagnostic_lab">Labs</option>
                      <option value="moderator">Moderators</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {usersList
                    .filter(u => roleFilter === "all" || u.role === roleFilter)
                    .filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((usr) => (
                      <div key={usr.uid} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{usr.name}</span>
                            <span className="font-mono text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded uppercase font-bold">
                              {usr.role}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              usr.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {usr.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{usr.email} • {usr.mobile || "No Mobile"}</p>
                        </div>

                        <div className="flex gap-1.5 flex-wrap">
                          {usr.status === "active" ? (
                            <button
                              onClick={() => handleToggleUserStatus(usr.uid, "suspended")}
                              className="bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleUserStatus(usr.uid, "active")}
                              className="bg-teal-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {isAdmin && dashTab === "audit_logs" && (
              <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs space-y-4">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  <span>Platform System Audit Trail</span>
                </h3>
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{log.action} <span className="text-slate-500 font-normal">by {log.actorName} ({log.actorRole})</span></p>
                        <p className="text-[11px] text-slate-500">{log.details}</p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
