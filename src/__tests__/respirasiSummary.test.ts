import { describe, it, expect } from 'vitest';
import { interpretAbg } from '../pages/abg/abgInterpretation';
import { defaultAbgInputs } from '../pages/abg/types';
import { abgSummary, rsbiSummary, toneFromAbgCls } from '../utils/respirasiSummary';
import { TONE_CLS } from '../pages/abg/abgInterpretation';

describe('respirasiSummary', () => {
  it('ABG: null bila input inti belum lengkap', () => {
    expect(abgSummary(interpretAbg({ ...defaultAbgInputs, ph: '7.31' }))).toBeNull();
  });

  it('ABG: teks = gangguan primer, nada dari kelas status pH (asidemia → bad)', () => {
    const r = interpretAbg({ ...defaultAbgInputs, ph: '7.25', pco2: '30', hco3: '13' });
    const s = abgSummary(r);
    expect(s).not.toBeNull();
    expect(s!.text).toBe(r!.analysis!.primaryText);
    expect(s!.tone).toBe('bad');
    expect(s!.caption).toContain(r!.step1!.status);
  });

  it('ABG: pH normal → nada good', () => {
    const s = abgSummary(interpretAbg({ ...defaultAbgInputs, ph: '7.40', pco2: '40', hco3: '24' }));
    expect(s!.tone).toBe('good');
  });

  it('toneFromAbgCls memetakan TONE_CLS', () => {
    expect(toneFromAbgCls(TONE_CLS.red)).toBe('bad');
    expect(toneFromAbgCls(TONE_CLS.amber)).toBe('warn');
    expect(toneFromAbgCls(TONE_CLS.emerald)).toBe('good');
    expect(toneFromAbgCls(undefined)).toBe('neutral');
  });

  it('RSBI: nada mengikuti status interpretRsbi', () => {
    expect(rsbiSummary('133', 'x', false)).toEqual({ text: 'RSBI 133 bpm/L', caption: 'x', tone: 'bad' });
    expect(rsbiSummary('67', 'y', true).tone).toBe('good');
  });
});
