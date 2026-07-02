import type { User } from 'firebase/auth';
import type { UserProfile } from '../context/AuthContext';

/**
 * Returns true if the user has admin privileges.
 * Role check is the authoritative gate; email is a hardcoded bootstrap
 * fallback for the owner account before the Firestore role is set.
 */
export function isAdminUser(
  user: User | null | undefined,
  profile: UserProfile | null | undefined
): boolean {
  return profile?.role === 'admin' || user?.email === 'driverizqanf@gmail.com';
}
