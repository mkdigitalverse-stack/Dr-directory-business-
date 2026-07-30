import React, { useState } from "react";
import { 
  X, Mail, Lock, User, ShieldAlert, CheckCircle, ArrowRight, Activity, Stethoscope, Eye, EyeOff, KeyRound, Sparkles 
} from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: any, role?: "patient" | "provider") => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ onClose, onAuthSuccess, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode);
  const [userRole, setUserRole] = useState<"patient" | "provider">("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Save metadata locally if new
      const metaKey = `lko_user_meta_${result.user.uid}`;
      if (!localStorage.getItem(metaKey)) {
        localStorage.setItem(metaKey, JSON.stringify({
          name: result.user.displayName || "User",
          role: userRole
        }));
      }

      setSuccessMsg("Google Sign-In successful! Welcome.");
      setTimeout(() => {
        onAuthSuccess(result.user, userRole);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      let msg = "Google authentication failed. Please try again.";
      if (err.code === "auth/popup-closed-by-user") {
        msg = "Google sign-in popup was closed before completing.";
      } else if (err.code === "auth/popup-blocked") {
        msg = "Sign-in popup was blocked by your browser. Please allow popups for this site.";
      } else if (err.code === "auth/operation-not-allowed") {
        msg = "Google Sign-In is disabled in your Firebase Console. Click 'Instant Access' below to proceed seamlessly.";
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Instant Local Session Fallback with Role support
  const handleInstantDemoAccess = (targetRole?: "patient" | "provider") => {
    const activeRole = targetRole || userRole;
    const demoUid = `user-demo-${Date.now()}`;
    const demoName = activeRole === "provider" 
      ? (name.trim() || "Dr. Anand Verma") 
      : (name.trim() || "Kamlesh Kumar");
    const demoEmail = email.trim() || (activeRole === "provider" ? "doctor@lucknowhealth.org" : "patient@lucknowhealth.org");
    const demoUser = {
      uid: demoUid,
      email: demoEmail,
      displayName: `${demoName}|${activeRole}`
    };
    localStorage.setItem(`lko_user_meta_${demoUid}`, JSON.stringify({
      name: demoName,
      role: activeRole
    }));
    localStorage.setItem("lko_demo_session", JSON.stringify(demoUser));
    setSuccessMsg(`Welcome ${demoName}! Accessing ${activeRole === "provider" ? "Doctor Practice Portal" : "Patient Portal"}...`);
    setTimeout(() => {
      onAuthSuccess(demoUser, activeRole);
      onClose();
    }, 500);
  };

  // Handle Password Reset Request
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your email address to reset password.");
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
      let msg = "Failed to send password reset email.";
      if (err.code === "auth/user-not-found") {
        msg = "No account registered with this email address.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "reset") {
      return handleResetPassword(e);
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const metaKey = `lko_user_meta_${userCredential.user.uid}`;
        const stored = localStorage.getItem(metaKey);
        let userRoleMeta: "patient" | "provider" = userRole;
        if (stored) {
          try {
            userRoleMeta = JSON.parse(stored).role || userRole;
          } catch {}
        } else if (userCredential.user.displayName?.includes("provider") || userCredential.user.displayName?.startsWith("Dr.")) {
          userRoleMeta = "provider";
        }
        setSuccessMsg("Signed in successfully! Accessing portal...");
        setTimeout(() => {
          onAuthSuccess(userCredential.user, userRoleMeta);
          onClose();
        }, 500);
      } else {
        if (!name.trim()) {
          throw new Error("Full name is required for account registration.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update Firebase User Profile
        await updateProfile(userCredential.user, {
          displayName: `${name.trim()}|${userRole}`
        });

        // Store role & name local fallback for smooth session recovery
        localStorage.setItem(`lko_user_meta_${userCredential.user.uid}`, JSON.stringify({
          name: name.trim(),
          role: userRole
        }));

        setSuccessMsg("Account registered successfully! Welcome to LKOHEALTH.");
        setTimeout(() => {
          onAuthSuccess(userCredential.user, userRole);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message || "An error occurred during authentication.";
      if (err.code === "auth/user-not-found") {
        msg = "No account found with this email. Click 'Register' tab or use Instant Access.";
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        msg = "Invalid email or password combination. Please re-check your entry.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Switch to 'Sign In' to access your account.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many unsuccessful attempts. Please wait a few minutes and try again.";
      } else if (err.code === "auth/operation-not-allowed") {
        msg = "Firebase Email Auth provider is not enabled in Console. Click 'Instant Access' below to log in smoothly.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Center modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-md border border-slate-100 flex flex-col">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-800 to-teal-950 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15),transparent_50%)]"></div>
            
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-teal-200 hover:text-white transition-colors cursor-pointer bg-teal-900/40 hover:bg-teal-900/80 p-1.5 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto bg-teal-500/15 border border-teal-400/20 text-teal-300 rounded-2xl w-12 h-12 flex items-center justify-center mb-3">
              <Activity className="h-6 w-6 stroke-[2]" />
            </div>

            <h3 className="text-xl font-sans font-extrabold tracking-tight">
              {mode === "login" ? "Welcome Back to LKOHEALTH" : mode === "signup" ? "Create your LKOHEALTH Account" : "Reset Account Password"}
            </h3>
            <p className="text-xs text-teal-200/90 mt-1">
              {mode === "login" 
                ? "Sign in to manage practice listings & appointments" 
                : mode === "signup"
                ? "Join Lucknow's verified medical discovery portal"
                : "Enter your registered email to receive a password reset link"}
            </p>
          </div>

          {/* Form / Content */}
          <div className="p-6 sm:p-8 space-y-5">
            
            {/* Mode Switcher Tabs */}
            {mode !== "reset" && (
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
                  Register
                </button>
              </div>
            )}

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{errorMsg}</span>
                </div>
                {(errorMsg.includes("operation-not-allowed") || errorMsg.includes("disabled") || errorMsg.includes("Firebase")) && (
                  <button
                    type="button"
                    onClick={handleInstantDemoAccess}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mt-1"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Continue as {userRole === "provider" ? "Doctor / Practice" : "Patient"} (Instant Access)</span>
                  </button>
                )}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Quick Google Sign In & Instant Portal Demo Buttons */}
            {mode !== "reset" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{googleLoading ? "Connecting Google..." : "Continue with Google"}</span>
                </button>

                {/* 1-Click Instant Demo Portals */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                    <span>⚡ One-Click Instant Access</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleInstantDemoAccess("provider")}
                      className="bg-white hover:bg-teal-50/80 border border-slate-200 hover:border-teal-300 text-teal-950 text-xs font-bold py-2 px-2.5 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Stethoscope className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span>Doctor Portal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInstantDemoAccess("patient")}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold py-2 px-2.5 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <User className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                      <span>Patient Portal</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or email sign in</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              
              {/* Role Selection (Only in Signup Mode) */}
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Join As</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserRole("patient")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        userRole === "patient" 
                          ? "border-teal-500 bg-teal-50/50 text-teal-900 shadow-xs" 
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <User className="h-4 w-4 text-teal-600" />
                      <span>Patient / Visitor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole("provider")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        userRole === "provider" 
                          ? "border-teal-500 bg-teal-50/50 text-teal-900 shadow-xs" 
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <Stethoscope className="h-4 w-4 text-teal-600" />
                      <span>Doctor / Practice</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name (Only in Signup Mode) */}
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="auth-name">Full Name</label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="auth-name"
                      type="text"
                      required
                      placeholder={userRole === "provider" ? "e.g. Dr. Anand Verma" : "e.g. Kamlesh Kumar"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="auth-email">Email Address</label>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    placeholder="doctor@lucknowhealth.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Password Input */}
              {mode !== "reset" && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="auth-password">Password</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("reset");
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        className="text-[10px] text-teal-600 hover:text-teal-700 font-bold cursor-pointer hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="auth-password"
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
              )}

              {/* Action Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-3"
              >
                <span>
                  {loading 
                    ? "Processing..." 
                    : mode === "login" 
                    ? "Sign In" 
                    : mode === "signup" 
                    ? "Register Account" 
                    : "Send Password Reset Link"}
                </span>
                {!loading && <ArrowRight className="h-3.5 w-3.5" />}
              </button>

              {/* Back to login option when in reset mode */}
              {mode === "reset" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-teal-700 pt-2 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
