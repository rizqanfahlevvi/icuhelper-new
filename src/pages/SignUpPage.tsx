import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { auth, db } from "../lib/firebase";

export default function SignUpPage() {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Form validations
    if (!namaLengkap.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (!username.trim()) {
      setError("Nama pengguna (username) wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi harus minimal memiliki 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Write user profile to Firestore database
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email || "",
        username: username,
        namaLengkap: namaLengkap,
        role: "pending",
        verificationStatus: "unverified",
        isAdmin: false,
        subscriptionStatus: "inactive",
        subscriptionPlan: null,
        subscriptionExpiredAt: null,
        profileCompleted: false,
        googleFormSubmitted: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      setSuccess("Akun berhasil dibuat! Silakan lengkapi profil dokter Anda.");
      
      // Delay navigation to allow user to read success message
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (err: any) {
      console.error("SignUp error:", err);
      let message = "Gagal membuat akun. Silakan coba kembali.";
      if (err.code === "auth/email-already-in-use") {
        message = "Email ini sudah terdaftar oleh pengguna lain.";
      } else if (err.code === "auth/invalid-email") {
        message = "Format email tidak valid.";
      } else if (err.code === "auth/weak-password") {
        message = "Kata sandi terlalu lemah. Gunakan minimal 6 karakter.";
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
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
        id="signup-card"
      >
        <div className="flex flex-col items-center mb-6 text-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white"
            style={{ 
              background: "linear-gradient(135deg, var(--sys-blue), #60a5fa)",
              boxShadow: "0 4px 12px rgba(0, 86, 179, 0.25)"
            }}
          >
            <UserPlus size={32} />
          </div>
          <h1 
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ color: "var(--label-primary)" }}
          >
            Daftar Akun Baru
          </h1>
          <p 
            className="text-sm"
            style={{ color: "var(--label-secondary)" }}
          >
            Silakan lengkapi formulir pendaftaran di bawah ini
          </p>
        </div>

        {error && (
          <div 
            className="mb-4 p-3 rounded-xl flex items-start gap-2.5 ios-warn ios-warn--danger text-sm"
            id="signup-error-banner"
          >
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: "var(--sys-red)" }} />
            <div className="leading-relaxed" style={{ color: "var(--label-primary)" }}>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div 
            className="mb-4 p-3 rounded-xl flex items-start gap-2.5 text-sm"
            style={{ 
              backgroundColor: "rgba(21, 128, 61, 0.12)",
              color: "var(--sys-green)",
              border: "1px solid rgba(21, 128, 61, 0.3)"
            }}
            id="signup-success-banner"
          >
            <CheckCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: "var(--sys-green)" }} />
            <div className="leading-relaxed font-semibold">
              {success}
            </div>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label 
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1"
              style={{ color: "var(--label-secondary)" }}
            >
              NAMA LENGKAP
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: "var(--label-tertiary)" }}>
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--fill-secondary)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "12px",
                  color: "var(--label-primary)",
                  minHeight: "44px"
                }}
                placeholder="Contoh: Rizqan Fahlevi"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                disabled={isLoading || !!success}
              />
            </div>
            <p className="text-[11px] mt-1 ml-1 leading-normal" style={{ color: "var(--label-secondary)" }}>
              Tulis nama tanpa gelar. Gelar akan ditambahkan otomatis setelah verifikasi.
            </p>
          </div>

          <div>
            <label 
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1"
              style={{ color: "var(--label-secondary)" }}
            >
              Nama Pengguna (Username)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: "var(--label-tertiary)" }}>
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--fill-secondary)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "12px",
                  color: "var(--label-primary)",
                  minHeight: "44px"
                }}
                placeholder="dr. Syafiq"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading || !!success}
              />
            </div>
          </div>

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
                placeholder="email@rumahsakit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !!success}
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
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !!success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer touch-target"
                style={{ color: "var(--label-tertiary)" }}
                disabled={isLoading || !!success}
                id="toggle-password-visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label 
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1"
              style={{ color: "var(--label-secondary)" }}
            >
              Ulangi Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: "var(--label-tertiary)" }}>
                <Lock size={18} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--fill-secondary)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "12px",
                  color: "var(--label-primary)",
                  minHeight: "44px"
                }}
                placeholder="Konfirmasi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || !!success}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer touch-target"
                style={{ color: "var(--label-tertiary)" }}
                disabled={isLoading || !!success}
                id="toggle-confirm-password-visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!success}
            className="w-full font-semibold text-white shadow-sm flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--sys-blue)",
              borderRadius: "12px",
              minHeight: "44px",
              opacity: (isLoading || success) ? 0.7 : 1,
              cursor: (isLoading || success) ? "not-allowed" : "pointer"
            }}
            id="btn-signup-submit"
          >
            {isLoading ? "Membuat Akun..." : "Daftar"}
          </button>
        </form>

        <div className="text-center pt-6 mt-4 border-t" style={{ borderColor: "var(--separator)" }}>
          <p className="text-sm" style={{ color: "var(--label-secondary)" }}>
            Sudah punya akun?{" "}
            <Link 
              to="/login" 
              className="font-semibold underline"
              style={{ color: "var(--sys-blue)" }}
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
