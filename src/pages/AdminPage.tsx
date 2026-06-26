import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Search, RefreshCcw, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface UserDoc {
  id: string;
  uid: string;
  email: string;
  namaLengkap: string;
  role: string;
  subscriptionPlan: string | null;
  subscriptionStatus: string;
  googleFormSubmitted: boolean;
  createdAt: Timestamp | null;
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAdmin = user?.email === 'driverizqanf@gmail.com';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedUsers: UserDoc[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedUsers.push({ id: docSnap.id, ...docSnap.data() } as UserDoc);
      });
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Gagal mengambil data user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <RefreshCcw className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Memeriksa sesi administrator...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Akses Terbatas</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
          Silakan login terlebih dahulu.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Ke Halaman Login
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Akses Ditolak</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
          Halaman ini hanya untuk administrator sistem.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    setUpdatingId(userId);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        subscriptionStatus: newStatus
      });
      setUsers(users.map(u => u.id === userId ? { ...u, subscriptionStatus: newStatus } : u));
      showToast('Status berhasil diupdate');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengupdate status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    setUpdatingId(userId);
    try {
      const userRef = doc(db, 'users', userId);
      const planValue = newPlan === 'none' ? null : newPlan;
      await updateDoc(userRef, {
        subscriptionPlan: planValue
      });
      setUsers(users.map(u => u.id === userId ? { ...u, subscriptionPlan: planValue } : u));
      showToast('Paket berhasil diupdate');
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Gagal mengupdate plan.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const searchLower = searchQuery.toLowerCase();
    const nameLower = (u.namaLengkap || '').toLowerCase();
    const emailLower = (u.email || '').toLowerCase();
    return nameLower.includes(searchLower) || emailLower.includes(searchLower);
  });

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'doctor': return 'Dokter Umum';
      case 'resident': return 'Residen';
      case 'specialist': return 'Spesialis';
      default: return role || 'Tidak diketahui';
    }
  };

  const formatName = (name: string, role: string) => {
    if (!name) return 'Tanpa Nama';
    if (role === 'doctor' && !name.toLowerCase().startsWith('dr.')) {
      return `dr. ${name}`;
    }
    return name;
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-2xl shadow-xl animate-fade-in-down transition-all">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel — MD Kit</h1>
          </div>
          <button 
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="bg-white dark:bg-gray-800 px-5 py-3.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex-shrink-0 w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pengguna</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-xl">
              {users.length}
            </span>
          </div>

          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Memuat data pengguna...</p>
          </div>
        ) : (
          /* User List */
          <div className="grid gap-4">
            {filteredUsers.map(user => (
              <div key={user.id} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 ${updatingId === user.id ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  
                  {/* User Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {formatName(user.namaLengkap, user.role)}
                      </h3>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Terdaftar: {formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px]">
                    
                    {/* Status Dropdown */}
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status Akses</label>
                      <div className="relative">
                        <select
                          value={user.subscriptionStatus || 'inactive'}
                          onChange={(e) => handleUpdateStatus(user.id, e.target.value)}
                          className={`w-full appearance-none pl-3.5 pr-8 py-2.5 text-sm font-semibold rounded-xl border-0 ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-colors ${
                            user.subscriptionStatus === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/30' :
                            user.subscriptionStatus === 'trial' ? 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/20 dark:text-orange-400 dark:ring-orange-500/30' :
                            'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-500/30'
                          }`}
                        >
                          <option value="inactive">Inactive</option>
                          <option value="active">Active</option>
                          <option value="trial">Trial</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                          <svg className="h-4 w-4 fill-current opacity-50" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Plan Dropdown */}
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Paket Langganan</label>
                      <div className="relative">
                        <select
                          value={user.subscriptionPlan || 'none'}
                          onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                          className="w-full appearance-none bg-gray-50 dark:bg-gray-900/50 pl-3.5 pr-8 py-2.5 text-sm font-medium text-gray-900 dark:text-white rounded-xl border-0 ring-1 ring-inset ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-colors"
                        >
                          <option value="none">Tidak ada</option>
                          <option value="basic">Basic</option>
                          <option value="pro">Pro</option>
                          <option value="lifetime">Lifetime</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                          <svg className="h-4 w-4 fill-current text-gray-400" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Pencarian Tidak Ditemukan</h3>
                <p className="text-gray-500 dark:text-gray-400">Tidak ada user yang cocok dengan "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
