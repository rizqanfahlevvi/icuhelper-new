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
          className="w-full font-semibold border flex items-center justify-center gap-2 mb-6"
          style={{
            borderColor: "var(--glass-border)",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--label-primary)",
            borderRadius: "12px",
            minHeight: "44px"
          }}
          id="btn-google-login"
        >
          <Chrome size={18} style={{ color: "#ea4335" }} />
          <span>Google Workspace</span>
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
