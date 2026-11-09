import { describe, it, expect } from 'vitest';
import { normalizeDecimalInput } from '../utils/decimalInput';

describe('normalizeDecimalInput', () => {
  it('koma → titik', () => { expect(normalizeDecimalInput('1,5')).toBe('1.5'); expect(normalizeDecimalInput('7,31')).toBe('7.31'); });
  it('titik tetap', () => expect(normalizeDecimalInput('0.21')).toBe('0.21'));
  it('satu pemisah saja', () => expect(normalizeDecimalInput('1.2.3')).toBe('1.23'));
  it('buang huruf/spasi', () => expect(normalizeDecimalInput(' 7 2kg')).toBe('72'));
  it('minus di depan', () => { expect(normalizeDecimalInput('-4,5')).toBe('-4.5'); expect(normalizeDecimalInput('4-5')).toBe('45'); });
  it('minus dilarang bila allowNegative=false', () => expect(normalizeDecimalInput('-3', false)).toBe('3'));
  it('kosong & sedang mengetik', () => { expect(normalizeDecimalInput('')).toBe(''); expect(normalizeDecimalInput('1,')).toBe('1.'); expect(normalizeDecimalInput('-')).toBe('-'); });
});
