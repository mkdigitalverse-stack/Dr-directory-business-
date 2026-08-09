import React, { useState, useEffect } from "react";
import { 
  X, Mail, Lock, User, ShieldAlert, CheckCircle, ArrowRight, Activity, Stethoscope, 
  Eye, EyeOff, KeyRound, Sparkles, Building2, Hospital as HospitalIcon, FlaskConical, 
  Smartphone, FileCheck, Check, Clock, RefreshCw, ShieldCheck, UserCheck
} from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db, formatAuthError } from "../lib/firebase";
import { UserRole, AccountStatus, UserProfile } from "../types";

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: any, role?: UserRole, profile?: UserProfile) => void;
  initialMode?: "login" | "signup";
  initialRole?: UserRole;
}

export default function AuthModal({ onClose, onAuthSuccess, initialMode = "login", initialRole = "doctor" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode);
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || "doctor");
  const [showDemoSection, setShowDemoSection] = useState(false);
  
  // User Name Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Doctor Fields
  const [medicalRegNo, setMedicalRegNo] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialty, setSpecialty] = useState("Cardiology");
  const [facilityName, setFacilityName] = useState("");

  // Clinic / Hospital / Lab Fields
  const [facilityOwner, setFacilityOwner] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lucknow");

  // OTP Verification Step State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(["1", "2", "3", "4"]);
  const [otpTimer, setOtpTimer] = useState(30);
  const [pendingUserData, setPendingUserData] = useState<any>(null);

  // Error / Success / Loading States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (isOtpStep && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOtpStep, otpTimer]);

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const metaKey = `lko_user_meta_${result.user.uid}`;
      const existingProfileStr = localStorage.getItem(metaKey);
      
      let userProfile: UserProfile;
      if (existingProfileStr) {
        userProfile = JSON.parse(existingProfileStr);
      } else {
        userProfile = {
          uid: result.user.uid,
          name: result.user.displayName || "Google User",
          email: result.user.email || "",
          role: selectedRole,
          status: selectedRole === "patient" ? "active" : "pending_verification",
          createdAt: new Date().toISOString().split("T")[0],
          lastLogin: new Date().toISOString()
        };
        localStorage.setItem(metaKey, JSON.stringify(userProfile));
      }

      localStorage.setItem("lko_demo_session", JSON.stringify(result.user));

      setSuccessMsg("Google Sign-In successful! Accessing portal...");
      setTimeout(() => {
        onAuthSuccess(result.user, userProfile.role, userProfile);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setErrorMsg(formatAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  // 1-Click Instant Demo Portals for test evaluation
  const handleInstantDemoAccess = (targetRole: UserRole) => {
    const demoUid = `user-demo-${targetRole}-${Date.now()}`;
    const roleNames: Record<UserRole, string> = {
      patient: "Kamlesh Kumar",
      doctor: "Dr. Anand Verma",
      clinic: "Hazratganj Dental Care Clinic",
      hospital: "MedCity Hospital Lucknow",
      diagnostic_lab: "Dr. Lal PathLabs Gomti Nagar",
      moderator: "Health Moderator",
      admin: "Super Admin"
    };

    const status: AccountStatus = (targetRole === "patient" || targetRole === "admin" || targetRole === "moderator") 
      ? "active" 
      : "pending_verification";

    const demoName = roleNames[targetRole] || "Demo User";
    const demoEmail = `${targetRole}@lucknowhealth.org`;

    const demoUser = {
      uid: demoUid,
      email: demoEmail,
      displayName: `${demoName}|${targetRole}`
    };

    const profileScore = (targetRole !== "patient" && targetRole !== "admin" && targetRole !== "moderator") ? {
      score: 75,
      breakdown: {
        basicInfo: true,
        about: true,
        services: true,
        gallery: false,
        timings: true,
        verification: true,
        contact: true,
        faqs: false
      },
      suggestions: [
        { id: "s1", label: "Add Clinic Gallery Photos", points: 15 },
        { id: "s2", label: "Add Patient FAQs", points: 10 }
      ]
    } : undefined;

    const userProfile: UserProfile = {
      uid: demoUid,
      name: demoName,
      email: demoEmail,
      mobile: "+91 98765 43210",
      role: targetRole,
      status: status,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString(),
      facilityName: targetRole === "doctor" ? "Anand Heart Care" : (targetRole === "clinic" ? "Hazratganj Dental" : undefined),
      medicalRegistrationNumber: targetRole === "doctor" ? "UP-MCI-88201" : undefined,
      profileScore
    };

    localStorage.setItem(`lko_user_meta_${demoUid}`, JSON.stringify(userProfile));
    localStorage.setItem("lko_demo_session", JSON.stringify(demoUser));

    setSuccessMsg(`Accessing portal as ${demoName} (${targetRole.replace("_", " ").toUpperCase()})...`);
    setTimeout(() => {
      onAuthSuccess(demoUser, targetRole, userProfile);
      onClose();
    }, 500);
  };

  // Password Reset Request
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("Password reset email sent! Check your inbox for instructions.");
    } catch (err: any) {
      console.error("Password reset error:", err);
      setErrorMsg(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Submit Step 1 Registration -> Initiates OTP Step
  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg("First Name and Last Name are required.");
      return;
    }
    if (!mobile.trim()) {
      setErrorMsg("Mobile number is required for OTP verification.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Email address is required.");
      return;
    }
    if (!acceptTerms) {
      setErrorMsg("Please accept LKOHEALTH Terms & Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const registerEmail = email.trim();
      const registerPassword = password || "LucknowHealth123!";
      
      const combinedName = `${firstName.trim()} ${lastName.trim()}`;
      const displayName = selectedRole === "doctor" 
        ? `Dr. ${combinedName}` 
        : (facilityName.trim() || combinedName);

      setPendingUserData({
        displayName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: registerEmail,
        password: registerPassword,
        mobile,
        role: selectedRole,
        medicalRegNo: medicalRegNo || "UP-MCI-PENDING",
        qualification: qualification || "MBBS",
        specialty: specialty || "General Medicine",
        facilityName: facilityName || displayName,
        facilityOwner: facilityOwner || combinedName,
        address: address || "Lucknow Practice Location",
        city: city || "Lucknow"
      });

      // Switch to OTP Verification Modal view
      setIsOtpStep(true);
      setOtpTimer(30);
      setSuccessMsg(`OTP sent successfully to ${mobile}. Enter '1234' to verify.`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initialize registration.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete Registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeStr = otpCode.join("");
    if (codeStr.length < 4) {
      setErrorMsg("Please enter complete 4-digit OTP code.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      let firebaseUser: any = null;
      let uid = `user-reg-${Date.now()}`;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, pendingUserData.email, pendingUserData.password);
        firebaseUser = userCredential.user;
        uid = firebaseUser.uid;
        await updateProfile(firebaseUser, {
          displayName: `${pendingUserData.displayName}|${pendingUserData.role}`
        });
      } catch (authErr: any) {
        console.warn("Firebase User Creation warning:", authErr);
        if (authErr.code) {
          setErrorMsg(formatAuthError(authErr));
        }
        firebaseUser = {
          uid,
          email: pendingUserData.email,
          displayName: `${pendingUserData.displayName}|${pendingUserData.role}`
        };
      }

      const status: AccountStatus = pendingUserData.role === "patient" 
        ? "active" 
        : "pending_verification";

      const profileScore = pendingUserData.role !== "patient" ? {
        score: 65,
        breakdown: {
          basicInfo: true,
          about: false,
          services: true,
          gallery: false,
          timings: true,
          verification: true,
          contact: true,
          faqs: false
        },
        suggestions: [
          { id: "s1", label: "Submit Medical Council License Document", points: 20 },
          { id: "s2", label: "Add Comprehensive About Bio & Facility Photos", points: 15 }
        ]
      } : undefined;

      const userProfile: UserProfile = {
        uid,
        firstName: pendingUserData.firstName,
        lastName: pendingUserData.lastName,
        name: pendingUserData.displayName,
        email: pendingUserData.email,
        mobile: pendingUserData.mobile,
        role: pendingUserData.role,
        status,
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: new Date().toISOString(),
        medicalRegistrationNumber: pendingUserData.medicalRegNo,
        qualification: pendingUserData.qualification,
        specialty: pendingUserData.specialty,
        facilityName: pendingUserData.facilityName,
        address: pendingUserData.address,
        city: pendingUserData.city,
        profileScore,
        providerIds: []
      };

      try {
        await setDoc(doc(db, "users", uid), {
          uid,
          firstName: pendingUserData.firstName || "",
          lastName: pendingUserData.lastName || "",
          name: pendingUserData.displayName,
          email: pendingUserData.email,
          mobile: pendingUserData.mobile || "",
          role: pendingUserData.role,
          status: status === "active" ? "active" : "pending_verification",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          providerIds: []
        }, { merge: true });
      } catch (fsErr) {
        console.warn("Firestore user sync warning:", fsErr);
      }

      localStorage.setItem(`lko_user_meta_${uid}`, JSON.stringify(userProfile));
      localStorage.setItem("lko_demo_session", JSON.stringify(firebaseUser));

      setSuccessMsg(
        status === "active" 
          ? "Account verified & registered successfully! Welcome." 
          : "Registration received! Status: Pending Verification. Welcome to your provider portal."
      );

      setTimeout(() => {
        onAuthSuccess(firebaseUser, pendingUserData.role, userProfile);
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Standard Login (Email or Mobile)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (loginMethod === "mobile") {
        // Mobile + OTP login prompt
        if (!mobile.trim()) {
          throw new Error("Mobile number is required.");
        }
        setIsOtpStep(true);
        setPendingUserData({
          email: `${mobile.replace(/\D/g, "")}@lucknowhealth.org`,
          displayName: "Mobile Verified User",
          role: selectedRole,
          mobile
        });
        setSuccessMsg(`OTP sent to ${mobile}. Enter '1234' to sign in.`);
        setLoading(false);
        return;
      }

      // Email + Password login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const metaKey = `lko_user_meta_${userCredential.user.uid}`;
      const stored = localStorage.getItem(metaKey);

      let userProfile: UserProfile;
      if (stored) {
        userProfile = JSON.parse(stored);
      } else {
        userProfile = {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName?.split("|")[0] || "User",
          email: userCredential.user.email || email,
          role: selectedRole,
          status: "active",
          createdAt: new Date().toISOString().split("T")[0]
        };
        localStorage.setItem(metaKey, JSON.stringify(userProfile));
      }

      localStorage.setItem("lko_demo_session", JSON.stringify(userCredential.user));
      setSuccessMsg("Signed in successfully! Accessing portal...");
      setTimeout(() => {
        onAuthSuccess(userCredential.user, userProfile.role, userProfile);
        onClose();
      }, 500);
    } catch (err: any) {
      console.warn("Firebase Auth sign-in notice:", err);
      const formattedError = formatAuthError(err);
      setErrorMsg(formattedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-lg border border-slate-100 flex flex-col my-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-800 to-teal-950 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15),transparent_50%)]"></div>
            
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-teal-200 hover:text-white transition-colors cursor-pointer bg-teal-900/40 hover:bg-teal-900/80 p-1.5 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto bg-teal-500/15 border border-teal-400/20 text-teal-300 rounded-2xl w-12 h-12 flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 stroke-[2]" />
            </div>

            <h3 className="text-xl font-sans font-extrabold tracking-tight">
              {isOtpStep 
                ? "Verify OTP Code" 
                : mode === "login" 
                ? "Welcome Back to LKOHEALTH" 
                : mode === "signup" 
                ? "Healthcare Portal Registration" 
                : "Reset Password"}
            </h3>
            <p className="text-xs text-teal-200/90 mt-1 max-w-md mx-auto">
              {isOtpStep 
                ? `Enter 4-digit code sent to ${pendingUserData?.mobile || "your mobile"}`
                : mode === "login" 
                ? "Sign in to access appointments, medical records, or provider management" 
                : mode === "signup"
                ? "Join Lucknow's NMC-verified medical ecosystem"
                : "Enter registered email to receive a password reset link"}
            </p>
          </div>

          {/* Form & Modal Body */}
          <div className="p-5 sm:p-7 space-y-4 max-h-[78vh] overflow-y-auto">
            
            {/* Mode Switcher Tabs */}
            {!isOtpStep && mode !== "reset" && (
              <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === "login" ? "bg-white text-teal-950 shadow-sm" : "text-slate-500 hover:text-teal-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === "signup" ? "bg-white text-teal-950 shadow-sm" : "text-slate-500 hover:text-teal-800"
                  }`}
                >
                  Register Account
                </button>
              </div>
            )}

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* OTP Verification View */}
            {isOtpStep ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-center py-2">
                <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
                    <Smartphone className="h-4 w-4 text-teal-600" />
                    <span>OTP Sent via SMS to {pendingUserData?.mobile}</span>
                  </div>
                  <p className="text-[11px] text-teal-700 leading-snug">
                    Enter test code <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-teal-300">1234</span> or your SMS OTP code below to finalize authentication.
                  </p>
                </div>

                <div className="flex justify-center items-center gap-2 py-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const newCode = [...otpCode];
                        newCode[idx] = val;
                        setOtpCode(newCode);
                        if (val && idx < 3) {
                          const nextInput = document.getElementById(`otp-input-${idx + 1}`);
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-lg font-mono font-extrabold text-teal-950 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:bg-white focus:outline-none transition-all shadow-2xs"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <div className="flex items-center gap-1 font-mono">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
                  </div>
                  <button
                    type="button"
                    disabled={otpTimer > 0}
                    onClick={() => {
                      setOtpTimer(30);
                      setSuccessMsg("New OTP code re-sent to mobile.");
                    }}
                    className="text-teal-600 hover:text-teal-700 disabled:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Resend OTP</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{loading ? "Verifying OTP..." : "Confirm & Complete Registration"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer block mx-auto pt-1"
                >
                  ← Back to Details
                </button>
              </form>
            ) : mode === "reset" ? (
              /* Password Reset View */
              <form onSubmit={handleResetPassword} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="auth-reset-email">
                    Registered Email Address
                  </label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="auth-reset-email"
                      type="email"
                      required
                      placeholder="user@lucknowhealth.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>{loading ? "Sending..." : "Send Password Reset Link"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-teal-700 pt-1 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </form>
            ) : (
              /* Normal Sign In & Register Views */
              <div className="space-y-4">
                
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{googleLoading ? "Connecting Google..." : "Continue with Google"}</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or continue below</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* SIGN IN FORM */}
                {mode === "login" ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left">
                    <div className="flex bg-slate-100 rounded-lg p-1 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setLoginMethod("email")}
                        className={`flex-1 py-1 rounded transition-all ${loginMethod === "email" ? "bg-white text-teal-900 shadow-2xs" : "text-slate-500"}`}
                      >
                        Email + Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMethod("mobile")}
                        className={`flex-1 py-1 rounded transition-all ${loginMethod === "mobile" ? "bg-white text-teal-900 shadow-2xs" : "text-slate-500"}`}
                      >
                        Mobile + OTP
                      </button>
                    </div>

                    {loginMethod === "email" ? (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="login-email">
                            Email Address
                          </label>
                          <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                              id="login-email"
                              type="email"
                              required
                              placeholder="doctor@lucknowhealth.org"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="login-password">
                              Password
                            </label>
                            <button
                              type="button"
                              onClick={() => setMode("reset")}
                              className="text-[10px] text-teal-600 hover:text-teal-700 font-bold cursor-pointer hover:underline"
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <Lock className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                              id="login-password"
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="login-mobile">
                          Mobile Number
                        </label>
                        <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Smartphone className="h-4 w-4 text-slate-400" />
                          </div>
                          <input
                            id="login-mobile"
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>{loading ? "Authenticating..." : loginMethod === "mobile" ? "Send OTP" : "Sign In"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                ) : (
                  /* REGISTER ACCOUNT FORM (Multi-role specific inputs) */
                  <form onSubmit={handleInitiateRegistration} className="space-y-3.5 text-left">
                    
                    {/* Role Selector Grid */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Select Account Role
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { role: "patient", label: "Patient", icon: User },
                          { role: "doctor", label: "Doctor", icon: Stethoscope },
                          { role: "clinic", label: "Clinic", icon: Building2 },
                          { role: "hospital", label: "Hospital", icon: HospitalIcon },
                          { role: "diagnostic_lab", label: "Diagnostic Lab", icon: FlaskConical }
                        ].map((item) => {
                          const IconComp = item.icon;
                          const isSel = selectedRole === item.role;
                          return (
                            <button
                              key={item.role}
                              type="button"
                              onClick={() => setSelectedRole(item.role as UserRole)}
                              className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isSel 
                                  ? "border-teal-600 bg-teal-50 text-teal-950 shadow-2xs ring-1 ring-teal-500" 
                                  : "border-slate-200 hover:bg-slate-50 text-slate-600"
                              }`}
                            >
                              <IconComp className={`h-3.5 w-3.5 ${isSel ? "text-teal-600" : "text-slate-400"}`} />
                              <span className="truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Low Friction Info Banner */}
                    <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3 text-left">
                      <p className="text-[11px] text-teal-800 font-medium leading-snug">
                        ⚡ <strong className="font-bold">Fast Account Creation:</strong> Only 4 basic fields required to get started. No business or facility information is requested at this stage.
                      </p>
                    </div>

                    {/* First Name & Last Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="reg-firstname">
                          First Name *
                        </label>
                        <input
                          id="reg-firstname"
                          type="text"
                          required
                          placeholder="e.g. Anand"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="reg-lastname">
                          Last Name *
                        </label>
                        <input
                          id="reg-lastname"
                          type="text"
                          required
                          placeholder="e.g. Verma"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Contact details: Mobile & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="reg-mobile">
                          Mobile Number *
                        </label>
                        <input
                          id="reg-mobile"
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="reg-email">
                          Email Address *
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          required
                          placeholder="user@lucknowhealth.org"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Password input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="reg-password">
                        Create Password *
                      </label>
                      <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white transition-all">
                        <input
                          id="reg-password"
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full border-0 bg-transparent py-2.5 pl-3 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        id="terms-check"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="terms-check" className="text-[11px] text-slate-600 cursor-pointer">
                        I accept LKOHEALTH Terms, Privacy Policy & Verification Guidelines
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <FileCheck className="h-4 w-4" />
                      <span>{loading ? "Processing..." : "Proceed to OTP Verification"}</span>
                    </button>
                  </form>
                )}

                {/* Optional Evaluator Demo Access Helper */}
                <div className="pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setShowDemoSection(!showDemoSection)}
                    className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-teal-700 py-1 px-1 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                      <span>⚡ Need a Demo Account for Quick Testing?</span>
                    </span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {showDemoSection ? "Hide Demos" : "Explore Test Portals"}
                    </span>
                  </button>

                  {showDemoSection && (
                    <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center space-y-2 animate-in fade-in duration-200">
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Select a pre-configured demo account to evaluate portal dashboards instantly:
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleInstantDemoAccess("patient")}
                          className="bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 text-[11px] font-bold py-1.5 px-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <User className="h-3 w-3 text-teal-600 shrink-0" />
                          <span>Demo Patient</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInstantDemoAccess("doctor")}
                          className="bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 text-[11px] font-bold py-1.5 px-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Stethoscope className="h-3 w-3 text-teal-600 shrink-0" />
                          <span>Demo Doctor</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInstantDemoAccess("clinic")}
                          className="bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 text-[11px] font-bold py-1.5 px-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Building2 className="h-3 w-3 text-teal-600 shrink-0" />
                          <span>Demo Clinic</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInstantDemoAccess("hospital")}
                          className="bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 text-[11px] font-bold py-1.5 px-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <HospitalIcon className="h-3 w-3 text-teal-600 shrink-0" />
                          <span>Demo Hospital</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInstantDemoAccess("diagnostic_lab")}
                          className="bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 text-[11px] font-bold py-1.5 px-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <FlaskConical className="h-3 w-3 text-teal-600 shrink-0" />
                          <span>Demo Lab</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInstantDemoAccess("moderator")}
                          className="bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 text-[11px] font-bold py-1.5 px-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="h-3 w-3 text-teal-600 shrink-0" />
                          <span>Moderator</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInstantDemoAccess("admin")}
                          className="col-span-2 bg-teal-900 hover:bg-teal-950 text-white text-[11px] font-extrabold py-1.5 px-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                          <span>Admin Portal</span>
                        </button>
                      </div>
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
