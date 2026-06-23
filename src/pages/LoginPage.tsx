import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Mail, Lock, LogIn, AlertCircle, Chrome, Eye, EyeOff } from "lucide-react";
import { auth, db } from "../lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Update last Login timestamp if user document exists
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          await setDoc(userDocRef, {
            lastLogin: serverTimestamp()
          }, { merge: true });
        }
      }
      navigate("/");
    } catch (err: any) {
      console.error("Login email error:", err);
      let message = "Gagal masuk. Silakan periksa kembali email dan password Anda.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        message = "Email atau password salah.";
      } else if (err.code === "auth/invalid-email") {
        message = "Format email tidak valid.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Terlalu banyak percobaan masuk yang gagal. Silakan coba lagi nanti.";
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore users collection
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user record if they don't exist yet
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email || "",
          username: user.displayName || user.email?.split("@")[0] || "User",
          role: "pending",
          subscriptionStatus: "inactive",
          subscriptionPlan: null,
          profileCompleted: false,
          googleFormSubmitted: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        // Update last login
        await setDoc(userDocRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }

      navigate("/");
    } catch (err: any) {
      console.error("Google auth error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Gagal masuk menggunakan Google. Silakan coba kembali.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div 
        className="w-full max-w-md p-6 ios-card"
        style={{ 
          backgroundColor: "var(--bg-tertiary)",
          borderRadius: "var(--r-card)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-2)"
        }}
        id="login-card"
      >
        <div className="flex flex-col items-center mb-6 text-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white"
            style={{ 
              background: "linear-gradient(135deg, var(--sys-blue), #60a5fa)",
              boxShadow: "0 4px 12px rgba(0, 86, 179, 0.25)"
            }}
          >
            <LogIn size={32} />
          </div>
          <h1 
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ color: "var(--label-primary)" }}
          >
            ICU Helper Portal
          </h1>
          <p 
            className="text-sm"
            style={{ color: "var(--label-secondary)" }}
          >
            Masuk untuk mengakses referensi klinis dan kalkulator medis
          </p>
        </div>

        {error && (
          <div 
            className="mb-4 p-3 rounded-xl flex items-start gap-2.5 ios-warn ios-warn--danger text-sm"
            id="login-error-banner"
          >
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: "var(--sys-red)" }} />
            <div className="leading-relaxed" style={{ color: "var(--label-primary)" }}>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label 
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1"
              style={{ color: "var(--label-secondary)" }}
            >
              Email Anda
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: "var(--label-tertiary)" }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--fill-secondary)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "12px",
                  color: "var(--label-primary)",
                  minHeight: "44px"
                }}
                placeholder="dokter@layanan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label 
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1"
              style={{ color: "var(--label-secondary)" }}
            >
              Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: "var(--label-tertiary)" }}>
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--fill-secondary)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "12px",
                  color: "var(--label-primary)",
                  minHeight: "44px"
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer touch-target"
                style={{ color: "var(--label-tertiary)" }}
                disabled={isLoading}
                id="toggle-login-password-visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full font-semibold text-white shadow-sm flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--sys-blue)",
              borderRadius: "12px",
              minHeight: "44px",
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
            id="btn-login-submit"
          >
            {isLoading ? "Sedang Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: "var(--separator)" }}></div>
          </div>
          <span 
            className="relative px-3 text-xs bg-tertiary font-medium uppercase"
            style={{ 
              color: "var(--label-tertiary)",
              backgroundColor: "var(--bg-tertiary)"
            }}
          >
            Atau masuk dengan
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full font-semibold border flex items-center justify-center gap-2 mb-6 hover:opacity-90 active:scale-[0.98] transition-all"
          style={{
            borderColor: "var(--glass-border)",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--label-primary)",
            borderRadius: "12px",
            minHeight: "44px"
          }}
          id="btn-google-login"
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Masuk dengan Google</span>
        </button>

        <div className="text-center pt-2">
          <p className="text-sm" style={{ color: "var(--label-secondary)" }}>
            Belum punya akun?{" "}
            <Link 
              to="/signup" 
              className="font-semibold underline"
              style={{ color: "var(--sys-blue)" }}
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
