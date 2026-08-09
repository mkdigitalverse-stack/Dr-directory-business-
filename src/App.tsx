import { useState, useEffect } from "react";
import { ViewState, SearchParams, Provider, Appointment, Review, ProviderType, UserRole, ProviderVerification, AuditLog } from "./types";
import { INITIAL_PROVIDERS, HEALTH_PACKAGES, ARTICLES, MOCK_REVIEWS, INITIAL_VERIFICATIONS, INITIAL_AUDIT_LOGS } from "./data";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./lib/firebase";

// Components
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SEOManager from "./components/SEOManager";

// Views
import HomeView from "./components/HomeView";
import SearchView from "./components/SearchView";
import ProfileView from "./components/ProfileView";
import AboutView from "./components/AboutView";
import DashboardView from "./components/DashboardView";
import PolicyPages from "./components/PolicyPages";

// Modals
import BookingModal from "./components/BookingModal";
import ReviewModal from "./components/ReviewModal";
import AuthModal from "./components/AuthModal";
import ProviderOnboardingWizard from "./components/ProviderOnboardingWizard";

export default function App() {
  // Global States
  const [activeView, setActiveView] = useState<ViewState>("home");
  const [dashboardInitialTab, setDashboardInitialTab] = useState<"analytics" | "appointments" | "verification" | "edit_profile" | "add_listing">("analytics");
  
  // Firebase Auth states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "signup">("login");
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>("doctor");
  
  // Provider Onboarding Wizard states
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [onboardingRole, setOnboardingRole] = useState<UserRole>("doctor");
  
  // Search parameters for results view
  const [searchParams, setSearchParams] = useState<SearchParams>({
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

  // Providers list synced with local state (updates via Dashboard)
  const [providers, setProviders] = useState<Provider[]>([]);
  // Appointments synced with state (updates via Bookings and Dashboard actions)
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Reviews list synced with state (updates via Review Modal and computes ratings)
  const [reviews, setReviews] = useState<Review[]>([]);
  // Verifications & Audit logs synced with state (updates via Governance Desk)
  const [verifications, setVerifications] = useState<ProviderVerification[]>(INITIAL_VERIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Verification Governance Handlers
  const handleApproveVerification = (verificationId: string, providerId: string, notes: string) => {
    const updatedVerifications = verifications.map(v => 
      v.id === verificationId 
        ? { ...v, status: "VERIFIED" as const, notes, reviewedAt: new Date().toISOString() } 
        : v
    );
    setVerifications(updatedVerifications);

    const targetProv = providers.find(p => p.id === providerId);
    if (targetProv) {
      handleUpdateProvider({
        ...targetProv,
        verified: true,
        verificationStatus: "VERIFIED"
      });
    }

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser?.displayName?.split("|")[0] || "Admin",
      actorRole: currentUser?.role || "admin",
      action: "VERIFICATION_APPROVED",
      targetUser: providerId,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      details: `Approved verification request ${verificationId}. Notes: ${notes || "Verified via NMC/State Registry"}`
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);

    try {
      setDoc(doc(db, "verifications", verificationId), { status: "VERIFIED", notes, reviewedAt: new Date().toISOString() }, { merge: true });
      setDoc(doc(db, "auditLogs", newAuditLog.id), newAuditLog);
    } catch (e) {
      console.warn("Firestore governance update warning:", e);
    }
  };

  const handleRejectVerification = (verificationId: string, providerId: string, reason: string) => {
    const updatedVerifications = verifications.map(v => 
      v.id === verificationId 
        ? { ...v, status: "VERIFICATION_REJECTED" as const, rejectionReason: reason, reviewedAt: new Date().toISOString() } 
        : v
    );
    setVerifications(updatedVerifications);

    const targetProv = providers.find(p => p.id === providerId);
    if (targetProv) {
      handleUpdateProvider({
        ...targetProv,
        verified: false,
        verificationStatus: "VERIFICATION_REJECTED",
        rejectionReason: reason
      });
    }

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser?.displayName?.split("|")[0] || "Admin",
      actorRole: currentUser?.role || "admin",
      action: "VERIFICATION_REJECTED",
      targetUser: providerId,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      details: `Rejected verification request ${verificationId}. Reason: ${reason}`
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);

    try {
      setDoc(doc(db, "verifications", verificationId), { status: "VERIFICATION_REJECTED", rejectionReason: reason, reviewedAt: new Date().toISOString() }, { merge: true });
      setDoc(doc(db, "auditLogs", newAuditLog.id), newAuditLog);
    } catch (e) {
      console.warn("Firestore governance update warning:", e);
    }
  };

  const handleRequestChanges = (verificationId: string, providerId: string, notes: string) => {
    const updatedVerifications = verifications.map(v => 
      v.id === verificationId 
        ? { ...v, status: "UNVERIFIED" as const, notes, reviewedAt: new Date().toISOString() } 
        : v
    );
    setVerifications(updatedVerifications);

    const targetProv = providers.find(p => p.id === providerId);
    if (targetProv) {
      handleUpdateProvider({
        ...targetProv,
        verified: false,
        verificationStatus: "UNVERIFIED",
        rejectionReason: notes
      });
    }

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser?.displayName?.split("|")[0] || "Admin",
      actorRole: currentUser?.role || "admin",
      action: "CHANGES_REQUESTED",
      targetUser: providerId,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      details: `Requested document changes for ${verificationId}. Notes: ${notes}`
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);
  };

  const handleSuspendVerification = (providerId: string, reason: string) => {
    const targetProv = providers.find(p => p.id === providerId);
    if (targetProv) {
      handleUpdateProvider({
        ...targetProv,
        verified: false,
        verificationStatus: "UNVERIFIED",
        status: "SUSPENDED"
      });
    }

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser?.displayName?.split("|")[0] || "Admin",
      actorRole: currentUser?.role || "admin",
      action: "PROVIDER_SUSPENDED",
      targetUser: providerId,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      details: `Suspended provider profile ${providerId}. Reason: ${reason}`
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);
  };

  const handleSubmitVerification = (data: Partial<ProviderVerification>) => {
    const newVerification: ProviderVerification = {
      id: `ver-${Date.now()}`,
      providerId: data.providerId || currentUser?.uid || "prov-1",
      providerName: data.providerName || "Submitted Practice",
      status: "VERIFICATION_PENDING",
      submittedAt: new Date().toISOString().split("T")[0],
      credentials: data.credentials || {
        councilName: "UP Medical Council",
        registrationNumber: "UP-MCI-PENDING",
        registrationYear: "2018"
      },
      documents: data.documents || []
    };

    setVerifications(prev => [newVerification, ...prev]);

    const targetProv = providers.find(p => p.id === newVerification.providerId);
    if (targetProv) {
      handleUpdateProvider({
        ...targetProv,
        verificationStatus: "VERIFICATION_PENDING"
      });
    }

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorName: data.providerName || currentUser?.displayName?.split("|")[0] || "Provider",
      actorRole: "doctor",
      action: "VERIFICATION_SUBMITTED",
      targetUser: newVerification.providerId,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      details: `Submitted provider verification documents for audit.`
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);

    try {
      setDoc(doc(db, "verifications", newVerification.id), newVerification);
      setDoc(doc(db, "auditLogs", newAuditLog.id), newAuditLog);
    } catch (e) {
      console.warn("Firestore submission warning:", e);
    }
  };

  // Selected provider for ProfileView
  const [selectedProviderId, setSelectedProviderId] = useState<string>("dr-anand-verma");

  // Booking Modal overlays state
  const [bookingProvider, setBookingProvider] = useState<Provider | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Review Modal overlays state
  const [reviewProvider, setReviewProvider] = useState<Provider | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Initialize data and authenticate user on mount
  useEffect(() => {
    // Check if URL has search parameters on initial page load
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.toString().length > 0 || window.location.pathname.startsWith("/search")) {
        const parsedParams: Partial<SearchParams> = {};
        if (urlParams.has("query") || urlParams.has("q")) parsedParams.query = urlParams.get("query") || urlParams.get("q") || "";
        if (urlParams.has("type")) parsedParams.type = (urlParams.get("type") as any) || "all";
        if (urlParams.has("specialty")) parsedParams.specialty = urlParams.get("specialty") || "";
        if (urlParams.has("locality")) parsedParams.locality = urlParams.get("locality") || "";
        if (urlParams.has("city")) parsedParams.city = urlParams.get("city") || "lucknow";
        if (urlParams.has("sort")) parsedParams.sort = (urlParams.get("sort") as any) || "relevance";
        if (urlParams.has("fee")) parsedParams.fee = urlParams.get("fee") || "";
        if (urlParams.has("rating")) parsedParams.rating = urlParams.get("rating") || "";
        if (urlParams.has("emergency")) parsedParams.emergencyServices = urlParams.get("emergency") === "true";

        setSearchParams(prev => ({ ...prev, ...parsedParams }));
        setActiveView("search");
      }
    }

    // Restore custom saved providers from localStorage or INITIAL_PROVIDERS
    const savedCustom = localStorage.getItem("lko_custom_providers");
    if (savedCustom) {
      try {
        const parsed: Provider[] = JSON.parse(savedCustom);
        const customIds = new Set(parsed.map(p => p.id));
        const merged = [...parsed, ...INITIAL_PROVIDERS.filter(p => !customIds.has(p.id))];
        setProviders(merged);
      } catch {
        setProviders(INITIAL_PROVIDERS);
      }
    } else {
      setProviders(INITIAL_PROVIDERS);
    }
    setReviews(MOCK_REVIEWS);
    
    // Seed standard dummy appointments
    setAppointments([
      {
        id: "app-seed-1",
        providerId: "dr-anand-verma",
        providerName: "Anand Verma",
        providerType: ProviderType.DOCTOR,
        date: "2026-07-13",
        time: "11:30 AM",
        patientName: "Kamlesh Kumar",
        patientEmail: "kamlesh@lucknow.com",
        patientPhone: "9450321289",
        patientSymptoms: "Regular cardiac checkups and blood pressure diagnostics.",
        status: "pending",
        createdAt: "2026-07-12"
      },
      {
        id: "app-seed-2",
        providerId: "dr-shambhavi-mishra",
        providerName: "Shambhavi Mishra",
        providerType: ProviderType.DOCTOR,
        date: "2026-07-15",
        time: "04:30 PM",
        patientName: "Sunita Devi",
        patientEmail: "sunita@mail.com",
        patientPhone: "9123845920",
        patientSymptoms: "General pregnancy checkup timelines assessment.",
        status: "confirmed",
        createdAt: "2026-07-12"
      }
    ]);

    // Async fetch stored providers & appointments from Firestore
    const fetchFirestoreData = async () => {
      try {
        const provSnap = await getDocs(collection(db, "providers"));
        if (!provSnap.empty) {
          const remoteProvs: Provider[] = [];
          provSnap.forEach((docSnap) => {
            remoteProvs.push(docSnap.data() as Provider);
          });
          const remoteIds = new Set(remoteProvs.map(p => p.id));
          const merged = [...remoteProvs, ...INITIAL_PROVIDERS.filter(p => !remoteIds.has(p.id))];
          setProviders(merged);
        }
      } catch (err) {
        console.warn("Firestore sync fallback to initial dataset:", err);
      }
    };
    fetchFirestoreData();

    // Setup Firebase auth state listener + Local demo session recovery
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        const savedDemo = localStorage.getItem("lko_demo_session");
        if (savedDemo) {
          try {
            setCurrentUser(JSON.parse(savedDemo));
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("lko_demo_session");
      await signOut(auth);
      setCurrentUser(null);
      setActiveView("home");
    } catch (err) {
      console.error("Error signing out:", err);
      localStorage.removeItem("lko_demo_session");
      setCurrentUser(null);
      setActiveView("home");
    }
  };

  const handleOpenAuth = (mode: "login" | "signup", role: UserRole = "patient") => {
    setAuthInitialMode(mode);
    setAuthInitialRole(role);
    setShowAuthModal(true);
  };

  // Update a single provider details (from Dashboard edits or AI scanner verification status)
  const handleUpdateProvider = (updatedProv: Provider) => {
    setProviders(prev => prev.map(p => p.id === updatedProv.id ? updatedProv : p));
    try {
      setDoc(doc(db, "providers", updatedProv.id), updatedProv, { merge: true });
    } catch (e) {
      console.warn("Firestore provider update warning:", e);
    }
  };

  // Add a brand new physician profile listing from Dashboard registration
  const handleAddProviderListing = (newProv: Provider) => {
    setProviders(prev => [newProv, ...prev]);
    try {
      setDoc(doc(db, "providers", newProv.id), newProv);
    } catch (e) {
      console.warn("Firestore provider insert warning:", e);
    }
  };

  // Confirm/Cancel/Complete appointments (from Dashboard)
  const handleUpdateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    try {
      const targetApp = appointments.find(a => a.id === id);
      if (targetApp) {
        setDoc(doc(db, "appointments", id), { ...targetApp, status }, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore appointment update warning:", e);
    }
  };

  // Add a new booking appointment requested by patient
  const handleConfirmBooking = (details: {
    serviceId?: string;
    serviceName?: string;
    locationId?: string;
    locationAddress?: string;
    patientName: string;
    patientFirstName?: string;
    patientLastName?: string;
    patientEmail: string;
    patientPhone: string;
    patientSymptoms?: string;
    date: string;
    time: string;
  }) => {
    if (!bookingProvider) return false;

    // Double-Booking Protection Check
    const isDoubleBooked = appointments.some(app => 
      app.providerId === bookingProvider.id &&
      app.date === details.date &&
      app.time === details.time &&
      app.status !== "cancelled" &&
      app.status !== "CANCELLED"
    );

    if (isDoubleBooked) {
      return false;
    }

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      patientUid: currentUser?.uid,
      providerId: bookingProvider.id,
      providerOwnerUid: bookingProvider.ownerUid,
      providerName: bookingProvider.name,
      providerType: bookingProvider.type,
      providerSpecialty: bookingProvider.specialties?.[0],
      providerImage: bookingProvider.image,
      serviceId: details.serviceId,
      serviceName: details.serviceName || "OPD Consultation",
      locationId: details.locationId,
      locationAddress: details.locationAddress || bookingProvider.address,
      date: details.date,
      time: details.time,
      patientName: details.patientName,
      patientFirstName: details.patientFirstName,
      patientLastName: details.patientLastName,
      patientEmail: details.patientEmail,
      patientPhone: details.patientPhone,
      patientMobile: details.patientPhone,
      patientSymptoms: details.patientSymptoms,
      status: bookingProvider.bookingSettings?.bookingMode === "instant" ? "confirmed" : "pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setAppointments(prev => [newApp, ...prev]);
    try {
      setDoc(doc(db, "appointments", newApp.id), newApp);
    } catch (e) {
      console.warn("Firestore booking insert warning:", e);
    }
    return true;
  };

  // State for Review modal appointment reference
  const [reviewAppointment, setReviewAppointment] = useState<Appointment | null>(null);

  // Open review modal with optional appointment reference
  const handleOpenReviewModal = (provider: Provider, appointment?: Appointment) => {
    setReviewProvider(provider);
    setReviewAppointment(appointment || null);
    setShowReviewModal(true);
  };

  // Submit a new verified review and recalculate provider aggregate score
  const handleSubmitReview = (reviewData: Partial<Review>) => {
    if (!reviewProvider) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      reviewId: `rev-${Date.now()}`,
      providerId: reviewProvider.id,
      patientUid: reviewData.patientUid || currentUser?.uid,
      appointmentId: reviewData.appointmentId || reviewAppointment?.id,
      patientName: reviewData.patientName || "Verified Patient",
      rating: reviewData.rating || 5,
      comment: reviewData.comment || reviewData.reviewText || "",
      reviewText: reviewData.reviewText || reviewData.comment || "",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      verified: reviewData.verified ?? true,
      isVerified: reviewData.isVerified ?? true,
      status: reviewData.status || "PUBLISHED",
      doctorBehaviour: reviewData.doctorBehaviour,
      staffBehaviour: reviewData.staffBehaviour,
      waitingTime: reviewData.waitingTime,
      cleanliness: reviewData.cleanliness,
      communication: reviewData.communication,
      treatmentSatisfaction: reviewData.treatmentSatisfaction,
      metrics: reviewData.metrics
    };

    // 1. Sync review arrays
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Sync to Firestore
    try {
      setDoc(doc(db, "reviews", newReview.id), newReview);
    } catch (e) {
      console.warn("Firestore review insert warning:", e);
    }

    // 2. Recalculate average rating for this provider based on PUBLISHED reviews
    const publishedReviews = updatedReviews.filter(
      r => r.providerId === reviewProvider.id && (r.status === "PUBLISHED" || r.status === "published" || !r.status)
    );
    const avgScore = publishedReviews.length > 0
      ? parseFloat((publishedReviews.reduce((sum, r) => sum + r.rating, 0) / publishedReviews.length).toFixed(1))
      : 5.0;

    const updatedProv: Provider = {
      ...reviewProvider,
      rating: avgScore,
      reviewsCount: publishedReviews.length
    };

    handleUpdateProvider(updatedProv);
  };

  // Update a single review (e.g. moderation status change or provider response)
  const handleUpdateReview = (updatedReview: Review) => {
    const updatedList = reviews.map(r => r.id === updatedReview.id ? updatedReview : r);
    setReviews(updatedList);

    try {
      setDoc(doc(db, "reviews", updatedReview.id), updatedReview, { merge: true });
    } catch (e) {
      console.warn("Firestore review update warning:", e);
    }

    // Recalculate target provider's aggregate rating based strictly on PUBLISHED reviews
    const targetProv = providers.find(p => p.id === updatedReview.providerId);
    if (targetProv) {
      const publishedReviews = updatedList.filter(
        r => r.providerId === targetProv.id && (r.status === "PUBLISHED" || r.status === "published" || !r.status)
      );
      const avgScore = publishedReviews.length > 0
        ? parseFloat((publishedReviews.reduce((sum, r) => sum + r.rating, 0) / publishedReviews.length).toFixed(1))
        : 5.0;

      handleUpdateProvider({
        ...targetProv,
        rating: avgScore,
        reviewsCount: publishedReviews.length
      });
    }
  };

  // Simple view navigators
  const navigateToView = (view: ViewState) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hot link triggers search parameters directly
  const handleTriggerSearch = (params: Partial<SearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      query: "",
      type: "all",
      specialty: "",
      locality: "",
      ...params
    }));
    navigateToView("search");
  };

  const handleSearchSpecialty = (specName: string) => {
    handleTriggerSearch({ specialty: specName });
  };

  const handleSearchLocality = (localityId: string) => {
    // simple lookup locality string for formatting
    handleTriggerSearch({ locality: localityId.toLowerCase().replace(" ", "-") });
  };

  const handleSelectProvider = (id: string) => {
    setSelectedProviderId(id);
    navigateToView("profile");
  };

  // Central handler for List Your Practice entry point
  const handleListPracticeClick = () => {
    if (!currentUser) {
      handleOpenAuth("signup", "doctor");
      return;
    }
    
    const userProvider = providers.find(p => 
      p.ownerUid === currentUser.uid || 
      p.id === currentUser.uid || 
      (p.email && currentUser.email && p.email.toLowerCase() === currentUser.email.toLowerCase())
    );
    
    if (!userProvider) {
      const role = (currentUser.role && ["doctor", "clinic", "hospital", "diagnostic_lab"].includes(currentUser.role)) ? currentUser.role : "doctor";
      setOnboardingRole(role as UserRole);
      setShowOnboardingWizard(true);
    } else if (userProvider.status === "DRAFT" || userProvider.status === "REJECTED") {
      const role = userProvider.type === ProviderType.DOCTOR ? "doctor" : userProvider.type === ProviderType.CLINIC ? "clinic" : userProvider.type === ProviderType.HOSPITAL ? "hospital" : "diagnostic_lab";
      setOnboardingRole(role as UserRole);
      setShowOnboardingWizard(true);
    } else {
      setDashboardInitialTab("overview");
      navigateToView("dashboard");
    }
  };

  // Selected provider object for ProfileView
  const currentProvider = providers.find(p => p.id === selectedProviderId) || providers[0];

  return (
    <div className="font-sans antialiased text-slate-700 bg-slate-50 min-h-screen flex flex-col justify-between">
      
      {/* 1. SEO Head Tags Manager */}
      <SEOManager 
        view={activeView} 
        provider={currentProvider} 
        locality={searchParams.locality}
        specialty={searchParams.specialty}
      />

      {/* 2. Global Top Notification Bar */}
      <AnnouncementBar />

      {/* 3. Sticky Header Navigation bar */}
      <Header 
        activeView={activeView} 
        onNavigate={navigateToView} 
        onSelectCategory={(type) => handleTriggerSearch({ type })}
        onSearchSpecialty={handleSearchSpecialty}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenAddListing={handleListPracticeClick}
      />

      {/* 4. Active Content View Display Panel */}
      <main className="flex-1">
        {activeView === "home" && (
          <HomeView 
            providers={providers}
            packages={HEALTH_PACKAGES}
            articles={ARTICLES}
            onSearch={handleTriggerSearch}
            onNavigate={navigateToView}
            onSelectProvider={handleSelectProvider}
            onBookAppointment={(prov) => {
              setBookingProvider(prov);
              setShowBookingModal(true);
            }}
          />
        )}

        {activeView === "search" && (
          <SearchView 
            providers={providers}
            initialSearchParams={searchParams}
            onNavigate={navigateToView}
            onSelectProvider={handleSelectProvider}
            onBookAppointment={(prov) => {
              setBookingProvider(prov);
              setShowBookingModal(true);
            }}
            onUpdateSearchParams={(newParams) => {
              setSearchParams(prev => ({ ...prev, ...newParams }));
            }}
          />
        )}

        {activeView === "profile" && currentProvider && (
          <ProfileView 
            provider={currentProvider}
            allProviders={providers}
            allReviews={reviews}
            articles={ARTICLES}
            currentUser={currentUser}
            onNavigate={navigateToView}
            onSelectProvider={handleSelectProvider}
            onBookAppointment={(prov) => {
              setBookingProvider(prov);
              setShowBookingModal(true);
            }}
            onOpenAddReview={() => {
              setReviewProvider(currentProvider);
              setShowReviewModal(true);
            }}
            onUpdateProvider={handleUpdateProvider}
          />
        )}

        {activeView === "about" && (
          <AboutView onNavigate={navigateToView} />
        )}

        {activeView === "dashboard" && (
          <DashboardView 
            providers={providers}
            appointments={appointments}
            reviews={reviews}
            verifications={verifications}
            auditLogs={auditLogs}
            onUpdateProvider={handleUpdateProvider}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onAddProviderListing={handleAddProviderListing}
            onNavigate={navigateToView}
            onSelectProvider={handleSelectProvider}
            onOpenOnboarding={(role) => {
              setOnboardingRole(role || "doctor");
              setShowOnboardingWizard(true);
            }}
            currentUser={currentUser}
            initialTab={dashboardInitialTab}
            onOpenAuth={handleOpenAuth}
            onUpdateReview={handleUpdateReview}
            onOpenReviewModal={handleOpenReviewModal}
            onApproveVerification={handleApproveVerification}
            onRejectVerification={handleRejectVerification}
            onRequestChanges={handleRequestChanges}
            onSuspendVerification={handleSuspendVerification}
            onSubmitVerification={handleSubmitVerification}
          />
        )}

        {/* POLICY & GOVERNANCE PAGES */}
        {[
          "privacy_policy", 
          "terms", 
          "medical_disclaimer", 
          "review_policy", 
          "provider_verification_policy", 
          "editorial_policy", 
          "contact",
          "mission",
          "vision",
          "core_values"
        ].includes(activeView) && (
          <PolicyPages view={activeView} onNavigate={navigateToView} />
        )}
      </main>

      {/* 5. Custom footer map navigation */}
      <Footer 
        onNavigate={navigateToView}
        onSelectCategory={(type) => handleTriggerSearch({ type })}
        onSearchSpecialty={handleSearchSpecialty}
        onSearchLocality={handleSearchLocality}
      />

      {/* APPOINTMENT BOOKING MODAL */}
      {showBookingModal && bookingProvider && (
        <BookingModal 
          provider={bookingProvider}
          currentUser={currentUser}
          appointments={appointments}
          onClose={() => {
            setShowBookingModal(false);
            setBookingProvider(null);
          }}
          onOpenAuth={handleOpenAuth}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* PATIENT REVIEW MODAL */}
      {showReviewModal && reviewProvider && (
        <ReviewModal 
          provider={reviewProvider}
          appointment={reviewAppointment || undefined}
          currentUser={currentUser}
          existingReviews={reviews}
          onClose={() => {
            setShowReviewModal(false);
            setReviewProvider(null);
            setReviewAppointment(null);
          }}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* FIREBASE AUTH MODAL */}
      {showAuthModal && (
        <AuthModal 
          initialMode={authInitialMode}
          initialRole={authInitialRole}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(user, passedRole) => {
            setCurrentUser(user);
            setShowAuthModal(false);

            // Check if user had a pending booking in progress
            const pendingBooking = localStorage.getItem("lko_pending_booking");
            if (pendingBooking) {
              try {
                const parsed = JSON.parse(pendingBooking);
                const targetProv = providers.find(p => p.id === parsed.providerId);
                if (targetProv) {
                  setBookingProvider(targetProv);
                  setShowBookingModal(true);
                  return;
                }
              } catch (e) {
                console.warn("Failed restoring pending booking:", e);
              }
            }

            const role = passedRole || (user.displayName?.split('|')[1] as UserRole) || "doctor";
            const isProvider = role === "doctor" || role === "clinic" || role === "hospital" || role === "diagnostic_lab";
            
            if (isProvider && authInitialMode === "signup") {
              setOnboardingRole(role);
              setShowOnboardingWizard(true);
            } else {
              setActiveView("dashboard");
            }
          }}
        />
      )}

      {/* PROVIDER PROFILE CREATION ONBOARDING WIZARD */}
      {showOnboardingWizard && currentUser && (() => {
        const existingProv = providers.find(p => p.ownerUid === currentUser.uid || p.id === currentUser.uid || (p.email && currentUser.email && p.email.toLowerCase() === currentUser.email.toLowerCase()));
        
        return (
          <ProviderOnboardingWizard
            currentUser={currentUser}
            userRole={onboardingRole}
            initialData={existingProv ? (existingProv.draftData || {
              providerType: existingProv.type,
              practiceName: existingProv.name,
              practiceCategory: existingProv.specialties?.[0] || "General Practice",
              locality: existingProv.address?.split(",")?.[1]?.trim() || "Gomti Nagar",
              address: existingProv.address?.split(",")?.[0]?.trim() || existingProv.address || "Lucknow",
              contactNumber: existingProv.phone || "",
              contactEmail: existingProv.email || "",
              aboutPractice: existingProv.about || "",
              specialties: existingProv.specialties || [],
              servicesOffered: existingProv.services || [],
              registrationNo: existingProv.medicalRegistrationNumber || ""
            }) : undefined}
            onClose={() => {
              setShowOnboardingWizard(false);
              setActiveView("dashboard");
            }}
            onSaveDraftAndExit={(draftData) => {
              setShowOnboardingWizard(false);
              const provId = currentUser.uid || `prov-${Date.now()}`;
              const isDoc = onboardingRole === "doctor";
              const isClin = onboardingRole === "clinic";
              const isHosp = onboardingRole === "hospital";

              const draftProv: Provider = {
                id: provId,
                ownerUid: currentUser.uid,
                status: "DRAFT",
                name: draftData.practiceName || currentUser.displayName?.split('|')[0] || "Draft Practice",
                type: isDoc ? ProviderType.DOCTOR : (isClin ? ProviderType.CLINIC : (isHosp ? ProviderType.HOSPITAL : ProviderType.LAB)),
                email: currentUser.email,
                phone: draftData.contactNumber || "+91 98765 43210",
                image: draftData.coverImageUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=300",
                verified: false,
                medicalRegistrationNumber: draftData.registrationNo || "UP-MCI-DRAFT",
                qualification: "Medical Specialist",
                experienceYears: 5,
                specialties: draftData.specialties?.length ? draftData.specialties : ["General Practice"],
                treatments: draftData.servicesOffered?.length ? draftData.servicesOffered : ["OPD Consultation"],
                localityId: (draftData.locality || "Gomti Nagar").toLowerCase().replace(/\s+/g, '-'),
                cityId: "lucknow",
                address: `${draftData.address || 'Lucknow'}, ${draftData.locality || 'Gomti Nagar'}`,
                consultationFee: 500,
                languages: ["English", "Hindi"],
                availability: [],
                about: draftData.aboutPractice || "Draft provider profile.",
                services: draftData.servicesOffered || ["OPD Consultation"],
                emergencyServices: draftData.emergencyAvailability ?? true,
                seoScore: 70,
                rating: 5.0,
                reviewsCount: 0,
                profileCompletenessScore: 50,
                draftData: draftData
              };

              setProviders(prev => {
                const updated = [draftProv, ...prev.filter(p => p.id !== provId)];
                try {
                  localStorage.setItem("lko_custom_providers", JSON.stringify(updated.slice(0, 50)));
                } catch {}
                return updated;
              });

              try {
                setDoc(doc(db, "providers", provId), draftProv, { merge: true });
              } catch (e) {
                console.warn("Firestore save draft error:", e);
              }

              setActiveView("dashboard");
            }}
            onComplete={(onboardingData) => {
              setShowOnboardingWizard(false);
              
              // Build and persist complete Provider record
              const provId = currentUser.uid || `prov-${Date.now()}`;
              const isDoc = onboardingRole === "doctor";
              const isClin = onboardingRole === "clinic";
              const isHosp = onboardingRole === "hospital";
              const isLab = onboardingRole === "diagnostic_lab";

              const newProv: Provider = {
                id: provId,
                ownerUid: currentUser.uid,
                status: "SUBMITTED",
                locations: [{
                  id: `loc-${Date.now()}`,
                  isPrimary: true,
                  address: onboardingData.location?.address || onboardingData.address || 'Lucknow Medical Practice',
                  locality: onboardingData.location?.locality || onboardingData.locality || 'Gomti Nagar',
                  localityId: (onboardingData.location?.locality || onboardingData.locality || "gomti-nagar").toLowerCase().replace(/\s+/g, '-'),
                  city: 'Lucknow',
                  cityId: 'lucknow',
                  state: 'Uttar Pradesh',
                  country: 'India',
                  pinCode: onboardingData.location?.pinCode || onboardingData.pinCode || '226010',
                  phone: onboardingData.contact?.phone || onboardingData.contactNumber || "+91 98765 43210",
                  whatsApp: onboardingData.contact?.whatsapp,
                  workingHours: onboardingData.contact?.workingHours,
                  status: "active",
                  verificationStatus: "pending"
                }],
                name: onboardingData.practiceName || currentUser.displayName?.split('|')[0] || "Medical Practice",
                type: isDoc ? ProviderType.DOCTOR : (isClin ? ProviderType.CLINIC : (isHosp ? ProviderType.HOSPITAL : ProviderType.LAB)),
                email: currentUser.email,
                phone: onboardingData.contact?.phone || onboardingData.contactNumber || "+91 98765 43210",
                image: onboardingData.media?.coverImageUrl || onboardingData.coverImageUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=300",
                verified: false,
                medicalRegistrationNumber: onboardingData.verification?.registrationNo || onboardingData.registrationNo || "UP-MCI-PENDING",
                qualification: onboardingData.basic?.title || "MBBS, Medical Specialist",
                experienceYears: Number(onboardingData.basic?.experienceYears) || 5,
                specialties: onboardingData.details?.specialties?.length ? onboardingData.details.specialties : (onboardingData.specialties?.length ? onboardingData.specialties : ["General Practice"]),
                treatments: onboardingData.details?.servicesOffered?.length ? onboardingData.details.servicesOffered : (onboardingData.servicesOffered?.length ? onboardingData.servicesOffered : ["OPD Consultation"]),
                localityId: (onboardingData.location?.locality || onboardingData.locality || "gomti-nagar").toLowerCase().replace(/\s+/g, '-'),
                cityId: "lucknow",
                address: `${onboardingData.location?.address || onboardingData.address || 'Lucknow'}, ${onboardingData.location?.locality || onboardingData.locality || 'Gomti Nagar'}`,
                consultationFee: Number(onboardingData.details?.consultationFee) || 500,
                languages: onboardingData.basic?.languages?.length ? onboardingData.basic.languages : ["English", "Hindi"],
                availability: [],
                about: onboardingData.details?.aboutPractice || onboardingData.aboutPractice || "Medical practice registered on Lucknow Discovery Engine.",
                services: onboardingData.details?.servicesOffered || onboardingData.servicesOffered || ["OPD Consultation"],
                emergencyServices: onboardingData.details?.emergencyAvailability ?? true,
                seoScore: 88,
                rating: 5.0,
                reviewsCount: 0,
                profileCompletenessScore: onboardingData.completenessScore || 85,
                verificationStatus: "pending_verification",
                rejectionReason: undefined
              };

              setProviders(prev => {
                const updated = [newProv, ...prev.filter(p => p.id !== provId)];
                try {
                  localStorage.setItem("lko_custom_providers", JSON.stringify(updated.slice(0, 50)));
                } catch {}
                return updated;
              });

              try {
                setDoc(doc(db, "providers", provId), newProv, { merge: true });
              } catch (e) {
                console.warn("Firestore save provider error:", e);
              }

              // Save user meta
              const metaKey = `lko_user_meta_${currentUser.uid}`;
              const userProfile = {
                uid: currentUser.uid,
                name: newProv.name,
                email: currentUser.email,
                role: onboardingRole,
                status: "pending_verification",
                createdAt: new Date().toISOString().split("T")[0],
                lastLogin: new Date().toISOString(),
                providerId: provId,
                profileScore: {
                  score: onboardingData.completenessScore || 85,
                  breakdown: {
                    basicInfo: true,
                    about: true,
                    services: true,
                    gallery: true,
                    timings: true,
                    verification: true,
                    contact: true,
                    faqs: false
                  }
                }
              };
              localStorage.setItem(metaKey, JSON.stringify(userProfile));

              setActiveView("dashboard");
            }}
          />
        );
      })()}

    </div>
  );
}
