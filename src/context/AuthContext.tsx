import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";
import { auth } from "../lib/firebase";
import { parseExpiryDate } from "../utils/subscription";

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  namaLengkap?: string;
  role: "pending" | "doctor" | "resident" | "specialist" | "admin";
  subscriptionStatus: "inactive" | "trial" | "active" | "expired";
  profileCompleted: boolean;
  subscriptionExpiredAt?: Timestamp | null;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;
    // Naik setiap kali status auth berubah: hasil import dinamis yang terlambat untuk
    // user lama diabaikan (mencegah profil user A terpasang setelah user B login).
    let generation = 0;
    let disposed = false;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      const gen = ++generation;
      setUser(currentUser);

      // Clean up previous Firestore subscription if user changed or logged out
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (currentUser) {
        // Subscribe to user snapshot in Firestore (SDK dimuat dinamis; isLoading tetap
        // true sampai snapshot pertama/galat — perilaku gerbang otorisasi tidak berubah).
        Promise.all([import("firebase/firestore"), import("../lib/firestore")]).then(([{ doc, onSnapshot }, { db }]) => {
        if (disposed || gen !== generation) return;
        const userDocRef = doc(db, "users", currentUser.uid);
        unsubscribeFirestore = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
            } else {
              setUserProfile(null);
            }
            setIsLoading(false);
          },
          (error) => {
            console.error("Error fetching user profile from Firestore:", error);
            setUserProfile(null);
            setIsLoading(false);
          }
        );
        }).catch((error) => {
          if (disposed || gen !== generation) return;
          console.error("Gagal memuat Firestore:", error);
          setUserProfile(null);
          setIsLoading(false);
        });
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      disposed = true;
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  const isAuthenticated = !!user;
  const isAuthorized =
    isAuthenticated &&
    userProfile !== null &&
    (() => {
      const expiry = parseExpiryDate(userProfile.subscriptionExpiredAt);
      return !expiry || expiry > new Date();
    })();

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    isAuthorized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
