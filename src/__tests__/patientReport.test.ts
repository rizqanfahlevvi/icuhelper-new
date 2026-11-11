import { describe, it, expect } from 'vitest';
import { buildPatientReport, groupClinicalValues, hospitalDay, latestPerModule } from '../utils/patientReport';

const NOW = new Date('2026-11-09T10:00:00').getTime();

describe('hospitalDay', () => {
  it('MRS hari ini = hari ke-1', () => expect(hospitalDay('2026-11-09', NOW)).toBe(1));
  it('MRS 3 hari lalu = hari ke-4', () => expect(hospitalDay('2026-11-06', NOW)).toBe(4));
  it('kosong/masa depan → null', () => { expect(hospitalDay(undefined, NOW)).toBeNull(); expect(hospitalDay('2026-11-20', NOW)).toBeNull(); });
});

describe('groupClinicalValues', () => {
  it('mengelompokkan, melewati kosong & demografi, menambah satuan', () => {
    const g = groupClinicalValues({ pao2: '68', fio2: '50', na: '', k: '3.1', weight: '72' }, { pao2: NOW - 2 * 3600_000 }, NOW);
    const labels = g.map((x) => x.label);
    expect(labels).toContain('AGD & Respirasi');
    expect(labels).toContain('Elektrolit');
    expect(g.flatMap((x) => x.items.map((i) => i.key))).not.toContain('weight');
    const pao2 = g.flatMap((x) => x.items).find((i) => i.key === 'pao2');
    expect(pao2?.value).toBe('68 mmHg');
    expect(pao2?.age).toBe('2 jam lalu');
  });
});

describe('latestPerModule', () => {
  it('ambil entri terbaru per modul', () => {
    const r = latestPerModule([
      { module: 'pf', label: 'P/F', summary: 'lama', timestamp: 1 },
      { module: 'pf', label: 'P/F', summary: 'baru', timestamp: 5 },
      { module: 'sofa', label: 'SOFA', summary: 's', timestamp: 3 },
    ]);
    expect(r.map((e) => e.summary)).toEqual(['baru', 's']);
  });
});

describe('buildPatientReport', () => {
  it('identitas, hari rawat, nilai, kalkulasi, catatan verifikasi', () => {
    const t = buildPatientReport(
      { nama: 'Tn. Budi', agePrecise: '58 thn', gender: 'L', weightKg: '72', mrsDate: '2026-11-06' },
      { pao2: '68', fio2: '50' }, {},
      [{ module: 'pf', label: 'P/F Ratio', summary: 'P/F 136', timestamp: NOW - 60_000 * 5 }],
      NOW,
    );
    expect(t).toContain('RINGKASAN PASIEN — Tn. Budi · 58 thn · L · BB 72 kg');
    expect(t).toContain('Hari rawat ke-4');
    expect(t).toContain('PaO₂');
    expect(t).toContain('- P/F Ratio: P/F 136 (5 mnt lalu)'); // label modul dari HISTORY_MODULES
    expect(t).toContain('verifikasi dengan data rekam medis');
  });
});

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { HISTORY_MODULES } from '../data/historyModules';

describe('HISTORY_MODULES', () => {
  it('mencakup semua kunci module= yang dipakai halaman', () => {
    const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : []; });
    const keys = new Set<string>();
    for (const f of walk(join(__dirname, '..', 'pages'))) for (const m of readFileSync(f, 'utf8').matchAll(/module=["']([a-z0-9_]+)["']/g)) keys.add(m[1]);
    const missing = [...keys].filter((k) => !HISTORY_MODULES[k]);
    expect(missing).toEqual([]);
  });
});
