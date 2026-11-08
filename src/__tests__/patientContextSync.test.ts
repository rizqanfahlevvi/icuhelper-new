/**
 * Test integrasi konteks pasien: store sungguhan + jembatan patientContextSync.
 * Membuktikan tidak ada kebocoran data antar pasien & data tersimpan otomatis.
 */
import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
  key(i: number) { return Array.from(this.m.keys())[i] ?? null; }
  get length() { return this.m.size; }
}

type Stores = {
  usePatientStore: typeof import('../store/usePatientStore').usePatientStore;
  useClinicalStore: typeof import('../store/useClinicalStore').useClinicalStore;
  sync: typeof import('../store/patientContextSync');
};
let S: Stores;

const tick = () => new Promise((r) => setTimeout(r, 0));

const newPatient = (nama: string, weightKg = '', heightCm = '', gender: '' | 'L' | 'P' = '') => ({
  nama, category: 'dewasa' as const, gender, ageUnit: 'tahun' as const, ageInput: '50', ageYears: '50',
  ageMonths: '', agePrecise: '50 tahun', weightKg, heightCm,
});

beforeAll(async () => {
  vi.stubGlobal('localStorage', new MemoryStorage());
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
  const [p, c, sync] = await Promise.all([
    import('../store/usePatientStore'),
    import('../store/useClinicalStore'),
    import('../store/patientContextSync'),
  ]);
  S = { usePatientStore: p.usePatientStore, useClinicalStore: c.useClinicalStore, sync };
  // Tunggu hidrasi IndexedDB (fallback localStorage di Node).
  for (let i = 0; i < 50 && !S.usePatientStore.persist.hasHydrated(); i++) await tick();
});

beforeEach(() => {
  S.sync._resetPatientContextSyncForTests();
  S.usePatientStore.setState({ patients: [], activePatientId: null });
  S.usePatientStore.getState().resetPatientData();
  S.useClinicalStore.getState().clearStore();
  S.sync.initPatientContextSync();
});

afterAll(() => {
  S.sync._resetPatientContextSyncForTests();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('konteks pasien', () => {
  it('ganti pasien: data pasien A tidak terbawa ke pasien B, dan kembali utuh saat A dibuka lagi', () => {
    const ps = S.usePatientStore.getState();
    const a = ps.addPatient(newPatient('A', '70'));
    const b = ps.addPatient(newPatient('B', '55'));

    S.usePatientStore.getState().setActivePatient(a);
    S.useClinicalStore.getState().setFields({ na: '128', k: '3.1', laktat: '4.2' });

    S.usePatientStore.getState().setActivePatient(b);
    const cb = S.useClinicalStore.getState();
    expect(cb.ownerId).toBe(b);
    expect(cb.data.na).toBe('');
    expect(cb.data.laktat).toBe('');
    expect(cb.data.weight).toBe('55');

    S.useClinicalStore.getState().setField('na', '145');

    S.usePatientStore.getState().setActivePatient(a);
    const ca = S.useClinicalStore.getState();
    expect(ca.data.na).toBe('128');
    expect(ca.data.k).toBe('3.1');
    expect(ca.data.laktat).toBe('4.2');
    expect(ca.data.weight).toBe('70');
    expect(typeof ca.updatedAt.na).toBe('number');

    // Snapshot B tersimpan dengan nilainya sendiri
    const snapB = S.usePatientStore.getState().patients.find((p) => p.id === b)!;
    expect(snapB.clinicalData?.na).toBe('145');
    expect(snapB.clinicalData?.k).toBeUndefined();
  });

  it('tutup pasien mengosongkan data kerja; hapus pasien aktif juga', () => {
    const a = S.usePatientStore.getState().addPatient(newPatient('A'));
    S.usePatientStore.getState().setActivePatient(a);
    S.useClinicalStore.getState().setField('hb', '7.2');

    S.usePatientStore.getState().setActivePatient(null);
    expect(S.useClinicalStore.getState().data.hb).toBe('');
    expect(S.useClinicalStore.getState().ownerId).toBeNull();

    // Snapshot tetap tersimpan
    expect(S.usePatientStore.getState().patients[0].clinicalData?.hb).toBe('7.2');

    S.usePatientStore.getState().setActivePatient(a);
    expect(S.useClinicalStore.getState().data.hb).toBe('7.2');
    S.usePatientStore.getState().deletePatient(a);
    expect(S.useClinicalStore.getState().data.hb).toBe('');
  });

  it('pasien baru dimulai kosong walau pasien sebelumnya aktif', () => {
    const a = S.usePatientStore.getState().addPatient(newPatient('A'));
    S.usePatientStore.getState().setActivePatient(a);
    S.useClinicalStore.getState().setField('creatinine', '3.4');

    const c = S.usePatientStore.getState().addPatient(newPatient('C'));
    S.usePatientStore.getState().setActivePatient(c);
    expect(S.useClinicalStore.getState().data.creatinine).toBe('');
  });

  it('BB/TB/JK satu sumber: diubah di kalkulator → data pasien; diubah di data pasien → kalkulator', () => {
    const a = S.usePatientStore.getState().addPatient(newPatient('A', '60', '170', 'L'));
    S.usePatientStore.getState().setActivePatient(a);
    expect(S.useClinicalStore.getState().data.gender).toBe('m');

    S.useClinicalStore.getState().setField('weight', '64');
    expect(S.usePatientStore.getState().weightKg).toBe('64');
    expect(S.usePatientStore.getState().patients[0].weightKg).toBe('64');

    S.usePatientStore.getState().setPatientData({ heightCm: '172' });
    expect(S.useClinicalStore.getState().data.height).toBe('172');
  });

  it('perubahan dari kalkulator tersimpan otomatis ke snapshot pasien aktif (debounce)', async () => {
    const a = S.usePatientStore.getState().addPatient(newPatient('A'));
    S.usePatientStore.getState().setActivePatient(a);
    S.useClinicalStore.getState().setField('trombosit', '45');
    await new Promise((r) => setTimeout(r, 450));
    const snap = S.usePatientStore.getState().patients.find((p) => p.id === a)!;
    expect(snap.clinicalData?.trombosit).toBe('45');
    expect(typeof snap.clinicalUpdatedAt?.trombosit).toBe('number');
  });

  it('data sesi tanpa pasien tidak menempel ke pasien yang kemudian diaktifkan', () => {
    S.useClinicalStore.getState().setField('na', '120');
    const a = S.usePatientStore.getState().addPatient(newPatient('A'));
    S.usePatientStore.getState().setActivePatient(a);
    expect(S.useClinicalStore.getState().data.na).toBe('');
  });
});
