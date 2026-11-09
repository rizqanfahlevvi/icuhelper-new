/**
 * Skor keparahan pneumonia komunitas — logika murni.
 *  - CURB-65 (Lim WS et al. Thorax 2003;58:377): mortalitas 30 hari kohort derivasi per skor
 *    0: 0,7% · 1: 3,2% · 2: 3% · 3: 17% · 4: 41,5% · 5: 57%.
 *  - PSI (Fine MJ et al. NEJM 1997;336:243): kelas I bila usia ≤50, tanpa komorbid & tanda vital
 *    abnormal; mortalitas antar-kohort I 0,1–0,4% · II 0,6–0,7% · III 0,9–2,8%.
 *  - SMART-COP (Charles PG et al. Clin Infect Dis 2008;47:375): memprediksi kebutuhan bantuan
 *    napas intensif/vasopresor (IRVS), BUKAN mortalitas; skor ≥3 menangkap 92% pasien IRVS.
 */

export const CURB65_MORTALITY: Record<number, string> = {
  0: '0,7%', 1: '3,2%', 2: '3%', 3: '17%', 4: '41,5%', 5: '57%',
};

export function curb65Group(score: number): { interp: string; act: string; tone: 'low' | 'mid' | 'high' } {
  const mort = `Mortalitas 30 hari skor ${score} (kohort derivasi): ${CURB65_MORTALITY[Math.max(0, Math.min(5, score))]}`;
  if (score <= 1) return { interp: 'Risiko Rendah', act: `Pertimbangkan rawat jalan. ${mort}`, tone: 'low' };
  if (score === 2) return { interp: 'Risiko Sedang', act: `Rawat inap. ${mort}`, tone: 'mid' };
  return { interp: 'Risiko Tinggi', act: `Rawat inap, pertimbangkan ICU (terutama skor 4–5). ${mort}`, tone: 'high' };
}

/** PSI kelas I: usia ≤50 tahun, tanpa komorbid, tanpa tanda vital/status mental abnormal. */
export function psiIsClassI(age: number, hasComorbid: boolean, hasAbnormalVitals: boolean): boolean {
  return age <= 50 && !hasComorbid && !hasAbnormalVitals;
}

export function psiClass(score: number, classI: boolean): { cls: string; mortality: string } {
  if (classI) return { cls: 'Class I', mortality: '0,1–0,4%' };
  if (score <= 70) return { cls: 'Class II', mortality: '0,6–0,7%' };
  if (score <= 90) return { cls: 'Class III', mortality: '0,9–2,8%' };
  if (score <= 130) return { cls: 'Class IV', mortality: '~8,2%' };
  return { cls: 'Class V', mortality: '~29,2%' };
}

export function smartCopRisk(score: number): { risk: string; desc: string; tone: 'low' | 'mid' | 'high' | 'veryhigh' } {
  if (score <= 2) return { risk: 'Risiko Rendah', desc: 'Risiko rendah membutuhkan bantuan napas intensif / vasopresor (IRVS).', tone: 'low' };
  if (score <= 4) return { risk: 'Risiko Sedang', desc: 'Skor ≥3: ambang yang menangkap 92% pasien yang akhirnya membutuhkan IRVS — pertimbangkan HCU/ICU & observasi ketat.', tone: 'mid' };
  if (score <= 6) return { risk: 'Risiko Tinggi', desc: 'Risiko tinggi membutuhkan IRVS — evaluasi ICU.', tone: 'high' };
  return { risk: 'Risiko Sangat Tinggi', desc: 'Risiko sangat tinggi membutuhkan IRVS — admisi ICU.', tone: 'veryhigh' };
}
