import { useState, useEffect } from "react";
import { ViewState, SearchParams, Provider, Appointment, Review, ProviderType, UserRole } from "./types";
import { INITIAL_PROVIDERS, HEALTH_PACKAGES, ARTICLES, MOCK_REVIEWS } from "./data";
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

// Modals
import BookingModal from "./components/BookingModal";
import ReviewModal from "./components/ReviewModal";
import AuthModal from "./components/AuthModal";

export default function App() {
  // Global States
  const [activeView, setActiveView] = useState<ViewState>("home");
  const [dashboardInitialTab, setDashboardInitialTab] = useState<"analytics" | "appointments" | "verification" | "edit_profile" | "add_listing">("analytics");
  
  // Firebase Auth states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "signup">("login");
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>("doctor");
  
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
    setProviders(INITIAL_PROVIDERS);
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
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientSymptoms: string;
    date: string;
    time: string;
  }) => {
    if (!bookingProvider) return;

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      providerId: bookingProvider.id,
      providerName: bookingProvider.name,
      providerType: bookingProvider.type,
      date: details.date,
      time: details.time,
      patientName: details.patientName,
      patientEmail: details.patientEmail,
      patientPhone: details.patientPhone,
      patientSymptoms: details.patientSymptoms,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setAppointments(prev => [newApp, ...prev]);
    try {
      setDoc(doc(db, "appointments", newApp.id), newApp);
    } catch (e) {
      console.warn("Firestore booking insert warning:", e);
    }
  };

  // Submit a new verified review and recalculate provider aggregate score
  const handleSubmitReview = (reviewDetails: {
    patientName: string;
    comment: string;
    rating: number;
    metrics: any;
  }) => {
    if (!reviewProvider) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      providerId: reviewProvider.id,
      patientName: reviewDetails.patientName,
      rating: reviewDetails.rating,
      comment: reviewDetails.comment,
      date: new Date().toISOString().split("T")[0],
      verified: true,
      metrics: reviewDetails.metrics
    };

    // 1. Sync review arrays
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // 2. Recalculate average rating for this provider and update provider list
    const pReviews = updatedReviews.filter(r => r.providerId === reviewProvider.id);
    const avgScore = parseFloat(
      (pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length).toFixed(1)
    );

    const updatedProv: Provider = {
      ...reviewProvider,
      rating: avgScore,
      reviewsCount: pReviews.length
    };

    handleUpdateProvider(updatedProv);
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
        onOpenAddListing={() => {
          if (currentUser) {
            setDashboardInitialTab("add_listing");
            navigateToView("dashboard");
          } else {
            handleOpenAuth("signup", "doctor");
          }
        }}
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
          />
        )}

        {activeView === "profile" && currentProvider && (
          <ProfileView 
            provider={currentProvider}
            allProviders={providers}
            allReviews={reviews}
            articles={ARTICLES}
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
            onUpdateProvider={handleUpdateProvider}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onAddProviderListing={handleAddProviderListing}
            onNavigate={navigateToView}
            currentUser={currentUser}
            initialTab={dashboardInitialTab}
          />
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
          onClose={() => {
            setShowBookingModal(false);
            setBookingProvider(null);
          }}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* PATIENT REVIEW MODAL */}
      {showReviewModal && reviewProvider && (
        <ReviewModal 
          provider={reviewProvider}
          onClose={() => {
            setShowReviewModal(false);
            setReviewProvider(null);
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
            const [_, role] = user.displayName?.split('|') || [user.email, passedRole || 'patient'];
            if (role !== 'patient' || user.displayName?.startsWith('Dr.')) {
              setActiveView("dashboard");
            }
          }}
        />
      )}

    </div>
  );
}
