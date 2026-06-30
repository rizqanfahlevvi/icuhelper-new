import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, CheckCircle, AlertCircle, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function ProfilePopup({ isOpen, onClose, onLogout }: ProfilePopupProps) {
  const { user, userProfile } = useAuth();
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen || !user || !userProfile) return null;

  const isAdmin = userProfile.role === 'admin' || user.email === 'driverizqanf@gmail.com';

  const handleResetPassword = async () => {
    setIsLoading(true);
    setResetError(null);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, user.email || '');
      setResetEmailSent(true);
    } catch (err: any) {
      console.error(err);
      setResetError(err.message || 'Gagal mengirim email reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitial = () => {
    if (userProfile.namaLengkap) return userProfile.namaLengkap.charAt(0).toUpperCase();
    if (userProfile.username) return userProfile.username.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  const getRoleLabel = () => {
    switch (userProfile.role) {
      case 'doctor': return 'Dokter Umum';
      case 'resident': return 'Residen';
      case 'specialist': return 'Dokter Spesialis';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[var(--bg-elevated)] border border-[var(--glass-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 pb-0 flex justify-between items-start">
            <h2 className="text-xl font-bold text-[var(--label-primary)]">Profil Saya</h2>
            <button 
              onClick={onClose}
              className="p-2 text-[var(--label-secondary)] hover:text-[var(--label-primary)] hover:bg-[var(--fill-secondary)] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto no-scrollbar">
            {/* Profile Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-4xl mb-4 border-2 border-[var(--glass-border)] shadow-sm">
                {getInitial()}
              </div>
              <h3 className="text-xl font-bold text-[var(--label-primary)] text-center">
                {userProfile.namaLengkap || 'Nama Belum Diisi'}
              </h3>
              <p className="text-sm text-[var(--label-secondary)] font-mono mt-1">
                @{userProfile.username || 'username'}
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-[var(--fill-secondary)] text-xs font-medium text-[var(--label-secondary)]">
                {getRoleLabel()}
              </div>
            </div>

            <div className="space-y-4">
              {/* Email & Verification */}
              <div className="bg-[var(--fill-secondary)] rounded-xl p-4">
                <div className="flex flex-row justify-between items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--label-tertiary)] uppercase tracking-wider font-bold mb-1">Email</p>
                    <p className="text-sm text-[var(--label-primary)] truncate" title={user.email || ''}>{user.email}</p>
                  </div>
                  {user.emailVerified ? (
                    <div className="shrink-0 flex items-center gap-1 text-green-500 bg-green-500/10 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                      <CheckCircle size={14} /> Terverifikasi
                    </div>
                  ) : (
                    <div className="shrink-0 flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                      <AlertCircle size={14} /> Belum Verifikasi
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Panel Button */}
              {isAdmin && (
                <div className="bg-[var(--fill-secondary)] rounded-xl p-4">
                  <p className="text-xs text-[var(--label-tertiary)] uppercase tracking-wider font-bold mb-2">Administrator</p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/admin');
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Shield size={16} />
                    Buka Admin Panel
                  </button>
                </div>
              )}

              {/* Subscription Status */}
              <div className="bg-[var(--fill-secondary)] rounded-xl p-4">
                <p className="text-xs text-[var(--label-tertiary)] uppercase tracking-wider font-bold mb-2">Status Langganan</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium uppercase tracking-wider bg-[var(--sys-green)]/10 text-[var(--sys-green)]">
                    ACTIVE (PROMO SEMENTARA)
                  </span>
                </div>
              </div>

              {/* Password Management */}
              <div className="bg-[var(--fill-secondary)] rounded-xl p-4">
                <p className="text-xs text-[var(--label-tertiary)] uppercase tracking-wider font-bold mb-3">Keamanan</p>
                
                {resetEmailSent ? (
                  <div className="bg-[var(--sys-green)]/10 text-[var(--sys-green)] p-3 rounded-lg text-sm flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 shrink-0" />
                    <p>Tautan reset password telah dikirim ke email Anda. Silakan cek inbox Anda.</p>
                  </div>
                ) : (
                  <button 
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] hover:bg-[var(--fill-tertiary)] text-[var(--label-primary)] border border-[var(--glass-border)] py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Key size={16} />
                    {isLoading ? 'Mengirim Tautan...' : 'Ganti Password'}
                  </button>
                )}
                {resetError && (
                  <p className="text-sm text-[var(--sys-red)] mt-2 text-center">{resetError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--fill-secondary)]">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 text-[var(--sys-red)] hover:bg-[var(--sys-red)]/10 py-2.5 rounded-lg text-sm font-bold transition-colors"
            >
              <LogOut size={16} />
              Keluar dari Akun
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
