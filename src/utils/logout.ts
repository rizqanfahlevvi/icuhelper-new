import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { usePatientStore } from '../store/usePatientStore';
import { useClinicalStore } from '../store/useClinicalStore';
import { useHistoryStore } from '../store/useHistoryStore';

/**
 * Signs the user out AND wipes patient-identifiable data from this device
 * (patient list, clinical values, calculation history). On shared hospital
 * workstations this prevents the next user from reading the previous
 * doctor's patients via DevTools/IndexedDB.
 *
 * Data is cleared before sign-out so privacy holds even if the network
 * call fails.
 */
export async function logoutAndClearPatientData(): Promise<void> {
  usePatientStore.setState({ patients: [] });
  usePatientStore.getState().resetPatientData();
  useClinicalStore.getState().clearStore();
  useHistoryStore.getState().clearHistory();

  await signOut(auth);
}
