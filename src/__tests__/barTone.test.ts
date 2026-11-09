import { describe, it, expect } from 'vitest';
import { toneFromColorClass, signed } from '../utils/barTone';

describe('toneFromColorClass', () => {
  it('memetakan warna interpretasi halaman ke nada bilah', () => {
    expect(toneFromColorClass('text-red-500')).toBe('bad');
    expect(toneFromColorClass('bg-orange-500/10 border-orange-500/20')).toBe('warn');
    expect(toneFromColorClass('text-amber-600 dark:text-amber-400')).toBe('warn');
    expect(toneFromColorClass('text-emerald-600 dark:text-emerald-400')).toBe('good');
    expect(toneFromColorClass('text-teal-500')).toBe('good');
    expect(toneFromColorClass('text-purple-500')).toBe('info');
    expect(toneFromColorClass('text-slate-500')).toBe('neutral');
    expect(toneFromColorClass(undefined)).toBe('neutral');
  });
});

describe('signed', () => {
  it('memberi tanda pada skor bertanda', () => {
    expect(signed(2)).toBe('+2');
    expect(signed(-3)).toBe('−3');
    expect(signed(0)).toBe('0');
  });
});
