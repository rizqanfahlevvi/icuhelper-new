import { describe, it, expect } from 'vitest';
import { HACOR_TABLE, HACOR_MAX, HACOR_CUTOFF, hacorPoints } from '../utils/hacor';

describe('HACOR (Duan 2017)', () => {
  it('tabel: jumlah poin maksimum = 25', () => {
    const max = HACOR_TABLE.reduce((s, p) => s + Math.max(...p.bands.map((b) => b.points)), 0);
    expect(max).toBe(HACOR_MAX);
  });
  it('contoh hitung manual: HR 121, pH 7,32, GCS 12, P/F 180, RR 33 → 1+2+5+2+1 = 11', () => {
    expect(hacorPoints({ hr: 121, ph: 7.32, gcs: 12, pf: 180, rr: 33 })).toEqual({ hr: 1, ph: 2, gcs: 5, pf: 2, rr: 1, total: 11 });
  });
  it('normal → 0; terburuk → 25', () => {
    expect(hacorPoints({ hr: 90, ph: 7.4, gcs: 15, pf: 300, rr: 20 }).total).toBe(0);
    expect(hacorPoints({ hr: 140, ph: 7.1, gcs: 8, pf: 80, rr: 50 }).total).toBe(25);
  });
  it('batas rentang', () => {
    expect(hacorPoints({ hr: 120, ph: 7.35, gcs: 15, pf: 201, rr: 30 }).total).toBe(0);
    expect(hacorPoints({ hr: 90, ph: 7.3, gcs: 13, pf: 200, rr: 31 })).toMatchObject({ ph: 2, gcs: 2, pf: 2, rr: 1 });
    expect(hacorPoints({ hr: 90, ph: 7.25, gcs: 11, pf: 125, rr: 41 })).toMatchObject({ ph: 3, gcs: 5, pf: 5, rr: 3 });
    expect(hacorPoints({ hr: 90, ph: 7.4, gcs: 15, pf: 100, rr: 20 }).pf).toBe(6);
  });
  it('ambang gagal NIV: skor >5', () => {
    expect(HACOR_CUTOFF).toBe(5);
  });
});
