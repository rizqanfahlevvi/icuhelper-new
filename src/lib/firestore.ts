import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { app } from "./firebase";

/**
 * Instans Firestore. Dipisah dari lib/firebase.ts supaya SDK Firestore (±300 KB)
 * tidak masuk bundel awal: AuthContext memuatnya secara dinamis, halaman Login/
 * SignUp/Admin (rute lazy) mengimpornya langsung.
 */
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
