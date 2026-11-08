/**
 * Jembatan "konteks pasien" antara usePatientStore (daftar pasien + demografi)
 * dan useClinicalStore (data kerja klinis/lab yang dibaca semua kalkulator).
 *
 * Menjamin:
 * 1. Ganti pasien → data kerja DIGANTI dengan snapshot pasien baru (tidak digabung),
 *    jadi nilai pasien A tidak pernah terbawa ke pasien B.
 * 2. Tutup/hapus pasien aktif → data kerja dikosongkan.
 * 3. Setiap perubahan data kerja (dari kalkulator mana pun) otomatis tersimpan
 *    ke snapshot pasien aktif, lengkap dengan cap waktu per variabel.
 * 4. Demografi (BB, TB, usia, JK) satu sumber: data pasien ↔ clinical store
 *    dicerminkan dua arah (L/P ↔ m/f).
 *
 * Logika keputusan murni ada di utils/patientContext.ts (dites unit).
 */
import { usePatientStore, type Patient } from './usePatientStore';
import { useClinicalStore } from './useClinicalStore';
import type { ClinicalData, ClinicalKey, ClinicalTimestamps } from '../utils/clinicalVariables';
import {
  cleanClinicalRecord,
  cleanTimestamps,
  demographicsToClinical,
  demographicUpdatesFromClinical,
  diffClinical,
  normalizeLegacyClinicalRecord,
  resolveStartupAction,
  toClinicalData,
  LEGACY_OWNER,
} from '../utils/patientContext';

const FLUSH_DELAY_MS = 400;
let started = false;
let running = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const unsubscribers: Array<() => void> = [];

/** Simpan data kerja sekarang ke snapshot pemiliknya (bukan sekadar "pasien aktif"). */
export function flushClinicalToPatient(): void {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  const { ownerId, data, updatedAt } = useClinicalStore.getState();
  if (!ownerId || ownerId === LEGACY_OWNER) return;
  const ps = usePatientStore.getState();
  if (!ps.patients.some((p) => p.id === ownerId)) return;
  const clean = cleanClinicalRecord(data);
  ps.savePatientClinicalData(ownerId, clean, cleanTimestamps(updatedAt, clean));
}

function scheduleFlush() {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flushClinicalToPatient, FLUSH_DELAY_MS);
}

/** Bangun data kerja dari snapshot pasien; demografi data pasien selalu menang. */
export function buildWorkingCopy(p: Patient): { data: Partial<ClinicalData>; updatedAt: ClinicalTimestamps } {
  const snapshot = toClinicalData(normalizeLegacyClinicalRecord(p.clinicalData));
  const stamps = cleanTimestamps(p.clinicalUpdatedAt, snapshot) as ClinicalTimestamps;
  const demo = demographicsToClinical(p);
  const data: Partial<ClinicalData> = { ...snapshot, ...demo };
  // Cap waktu demografi hanya dipertahankan bila nilainya sama dengan snapshot.
  for (const k of Object.keys(demo) as ClinicalKey[]) {
    if ((snapshot[k] ?? '') !== (demo[k] ?? '')) delete stamps[k];
  }
  return { data, updatedAt: stamps };
}

function loadPatient(id: string | null) {
  const cs = useClinicalStore.getState();
  if (!id) {
    cs.clearStore();
    return;
  }
  const p = usePatientStore.getState().patients.find((x) => x.id === id);
  if (!p) {
    cs.clearStore();
    return;
  }
  const { data, updatedAt } = buildWorkingCopy(p);
  cs.loadSnapshot({ data, updatedAt, ownerId: id });
}

function mirrorDemographicsToClinical() {
  const ps = usePatientStore.getState();
  const cs = useClinicalStore.getState();
  const diff = diffClinical(cs.data, demographicsToClinical(ps));
  if (Object.keys(diff).length > 0) cs.setFields(diff);
}

function reconcile() {
  const { ownerId } = useClinicalStore.getState();
  const ps = usePatientStore.getState();
  const exists = !!ps.activePatientId && ps.patients.some((p) => p.id === ps.activePatientId);
  const action = resolveStartupAction(ownerId, ps.activePatientId, exists);
  switch (action) {
    case 'keep':
      mirrorDemographicsToClinical();
      flushClinicalToPatient();
      break;
    case 'load':
      loadPatient(ps.activePatientId);
      break;
    case 'clear':
      useClinicalStore.getState().clearStore();
      if (ps.activePatientId && !exists) ps.setActivePatient(null);
      break;
    case 'keepSession':
      if (ownerId !== null) useClinicalStore.setState({ ownerId: null });
      break;
  }
}

function start() {
  if (running) return;
  running = true;
  reconcile();

  unsubscribers.push(
    usePatientStore.subscribe((s, prev) => {
      if (s.activePatientId !== prev.activePatientId) {
        // Simpan dulu data kerja ke pemilik lama, lalu ganti dengan snapshot pasien baru.
        flushClinicalToPatient();
        loadPatient(s.activePatientId);
        return;
      }
      if (
        s.weightKg !== prev.weightKg ||
        s.heightCm !== prev.heightCm ||
        s.ageYears !== prev.ageYears ||
        s.gender !== prev.gender
      ) {
        mirrorDemographicsToClinical();
      }
    }),
  );

  unsubscribers.push(
    useClinicalStore.subscribe((s, prev) => {
      if (s.data === prev.data) return;
      const ps = usePatientStore.getState();
      // Demografi yang diisi di kalkulator → data pasien (hanya nilai non-kosong).
      if (s.ownerId === ps.activePatientId || (!s.ownerId && !ps.activePatientId)) {
        const updates = demographicUpdatesFromClinical(s.data, ps);
        if (updates) ps.setPatientData(updates);
      }
      if (s.ownerId && s.ownerId === ps.activePatientId) scheduleFlush();
    }),
  );

  if (typeof window !== 'undefined') {
    const onHide = () => flushClinicalToPatient();
    window.addEventListener('pagehide', onHide);
    const onVis = () => {
      if (document.visibilityState === 'hidden') flushClinicalToPatient();
    };
    document.addEventListener('visibilitychange', onVis);
    unsubscribers.push(() => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onVis);
    });
  }
}

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (fn: () => void) => () => void;
}
/** Store tanpa persist (mis. storage tidak tersedia) dianggap sudah terhidrasi. */
const persistOf = (store: { persist?: PersistApi }): PersistApi | undefined => store.persist;
const isHydrated = (store: { persist?: PersistApi }) => persistOf(store)?.hasHydrated() ?? true;

/** Panggil sekali saat aplikasi dimulai (main.tsx). Aman dipanggil berulang. */
export function initPatientContextSync(): void {
  if (started) return;
  started = true;
  const whenReady = () => {
    if (isHydrated(usePatientStore) && isHydrated(useClinicalStore)) {
      start();
      return true;
    }
    return false;
  };
  if (whenReady()) return;
  const unsubs: Array<() => void> = [];
  const check = () => {
    if (whenReady()) unsubs.forEach((u) => u());
  };
  for (const store of [usePatientStore, useClinicalStore] as Array<{ persist?: PersistApi }>) {
    const api = persistOf(store);
    if (api) unsubs.push(api.onFinishHydration(check));
  }
}

/** Untuk test: hentikan semua langganan dan reset status. */
export function _resetPatientContextSyncForTests(): void {
  unsubscribers.splice(0).forEach((u) => u());
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = null;
  started = false;
  running = false;
}
