import { Accordion } from '../../components/ui/Accordion';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { ARDSNET_LOW_PEEP, ROX_HIGH_RISK, ROX_LOW_RISK } from '../../utils/oxygenation';

const fmt = (n: number) => n.toLocaleString('id-ID');

export default function TeoriFisiologi() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          Fisiologi Ventilasi Mekanik
        </h1>

        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-primary">Prinsip Dasar Ventilasi Mekanik</div>
          <p className="text-muted-foreground">Ventilator bekerja dengan menciptakan <strong className="text-foreground">gradien tekanan positif</strong> dari sirkuit ke alveolus — kebalikan napas spontan yang menggunakan tekanan negatif diafragma. Pemahaman mekanika paru dan interaksi pasien-ventilator esensial untuk optimasi setting dan deteksi komplikasi.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-[12px]">
            <div className="bg-white dark:bg-[#1C1C1E] rounded-lg p-3 border border-border">
              <div className="font-bold text-primary mb-1">Persamaan Gerak</div>
              <p className="font-mono text-muted-foreground">P = (V/C) + (R×Flow) + PEEP</p>
              <p className="text-muted-foreground mt-1">P = tekanan, V = volume, C = compliance, R = resistance</p>
            </div>
            <div className="bg-white dark:bg-[#1C1C1E] rounded-lg p-3 border border-border">
              <div className="font-bold text-primary mb-1">Tujuan Utama</div>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Jaga pertukaran gas (O₂ &amp; CO₂)</li>
                <li>Kurangi Work of Breathing</li>
                <li>Cegah VILI (Ventilator-Induced Lung Injury)</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-[#1C1C1E] rounded-lg p-3 border border-border">
              <div className="font-bold text-primary mb-1">Prinsip Lung-Protective</div>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Vt 6 mL/kgBBi</li>
                <li>Pplat &lt;30 cmH₂O</li>
                <li>Driving pressure ≤15 cmH₂O</li>
                <li>PEEP adekuat</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-[11px] italic text-muted-foreground">📚 ARDSNet NEJM 2000;342:1301 · Slutsky AS & Ranieri VM NEJM 2013;369:2126 · Fan E et al. AJRCCM 2017;195:1253</p>
        </div>
      </div>

      <Accordion title="📖 Compliance, Resistance & Driving Pressure" defaultOpen={true}>
        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Compliance (C)</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-muted text-muted-foreground border-b border-border">
                <th className="p-2">Parameter</th><th className="p-2">Formula</th><th className="p-2">Normal</th><th className="p-2">ARDS Berat</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">Static Compliance</td>
                <td className="p-2 font-mono text-primary">Vt ÷ (Pplat − PEEP)</td>
                <td className="p-2">60–100 mL/cmH₂O</td>
                <td className="p-2 text-destructive font-bold">20–40 mL/cmH₂O</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">Dynamic Compliance</td>
                <td className="p-2 font-mono text-primary">Vt ÷ (PIP − PEEP)</td>
                <td className="p-2">50–80 mL/cmH₂O</td>
                <td className="p-2 text-destructive font-bold">&lt;30 mL/cmH₂O</td>
              </tr>
              <tr className="text-foreground">
                <td className="p-2 font-bold">Driving Pressure</td>
                <td className="p-2 font-mono text-primary">Pplat − PEEP</td>
                <td className="p-2">≤15 cmH₂O</td>
                <td className="p-2 text-destructive font-bold">Sering &gt;18</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Resistance & Time Constant (τ)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-[12px]">
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="font-bold text-foreground mb-1">Resistance</div>
            <p className="font-mono text-primary mb-1">R = (PIP − Pplat) ÷ Flow</p>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              <li>Normal: 5–10 cmH₂O/L/s</li>
              <li>PPOK/asma berat: &gt;20 cmH₂O/L/s</li>
              <li>Penyebab ↑R: bronkospasme, sekret, ETT kinked</li>
            </ul>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="font-bold text-foreground mb-1">Time Constant (τ = R × C)</div>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              <li>Contoh: R 10 cmH₂O/L/detik × C 0,05 L/cmH₂O = 0,5 detik</li>
              <li>Ekspirasi pasif ±95% selesai dalam 3τ, ±99% dalam 5τ</li>
              <li>PPOK: τ memanjang → risiko autoPEEP</li>
              <li>ARDS: τ memendek (C rendah) → heterogenitas</li>
            </ul>
          </div>
        </div>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Cara Ukur Pplat & DP di Bedside</h3>
        <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
          <li><strong className="text-foreground">Inspiratory Hold 0.5 detik:</strong> Tekanan akhir yang terbaca = Pplat. Lakukan saat pasien tidak ada usaha napas spontan.</li>
          <li><strong className="text-foreground">Driving Pressure:</strong> DP = Pplat − PEEP. Target ≤15 cmH₂O (risiko kematian meningkat di atas ±15; Amato 2015). Jika DP &gt;15 dengan Vt 6 mL/kgBBi → pertimbangkan turunkan Vt bertahap sampai minimal 4 mL/kgBBi, toleransi permissive hypercapnia (pH ≥7.20).</li>
          <li><strong className="text-foreground">Catatan:</strong> Pplat hanya valid bila tidak ada usaha napas spontan aktif — nilai tidak akurat jika pasien fighting ventilator.</li>
        </ul>
        <p className="mt-2 text-[11px] italic text-muted-foreground">📚 Amato MB et al. NEJM 2015;372:747 · ARDSNet NEJM 2000;342:1301 · Slutsky AS & Ranieri VM NEJM 2013;369:2126</p>
      </Accordion>

      <Accordion title="📖 Parameter Ventilator — Setting, Target & Tabel PEEP/FiO₂">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-muted text-muted-foreground border-b border-border">
                <th className="p-2">Parameter</th><th className="p-2">Target Umum</th><th className="p-2">ARDS</th><th className="p-2">Catatan Klinis</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">Tidal Volume (Vt)</td>
                <td className="p-2">6–8 mL/kgBBi</td>
                <td className="p-2 font-bold text-primary">4–6 mL/kgBBi</td>
                <td className="p-2 text-muted-foreground">Gunakan BBi, bukan BB aktual. ↓ Vt → permissive hypercapnia bila pH ≥7.20</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">RR</td>
                <td className="p-2">12–20/mnt</td>
                <td className="p-2">20–30/mnt</td>
                <td className="p-2 text-muted-foreground">Kompensasi Vt rendah. Awas autoPEEP bila RR &gt;30</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">FiO₂</td>
                <td className="p-2">SpO₂ 92–96%</td>
                <td className="p-2">SpO₂ 88–95%</td>
                <td className="p-2 text-muted-foreground">FiO₂ &gt;0.6 &gt;24 jam → toksisitas O₂. Turunkan bertahap.</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">PEEP</td>
                <td className="p-2">5 cmH₂O</td>
                <td className="p-2">≥8–15 cmH₂O</td>
                <td className="p-2 text-muted-foreground">Titrasi: best compliance + SpO₂ target + hemodinamik stabil</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">Pplat</td>
                <td className="p-2 font-bold text-primary">&lt;30 cmH₂O</td>
                <td className="p-2 font-bold text-primary">&lt;30 cmH₂O</td>
                <td className="p-2 text-muted-foreground">Ukur dengan inspiratory hold. Pplat &gt;30 → ↑ VILI</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">Driving Pressure</td>
                <td className="p-2 font-bold text-primary">≤15 cmH₂O</td>
                <td className="p-2 font-bold text-primary">≤15 cmH₂O</td>
                <td className="p-2 text-muted-foreground">Prediktor mortalitas lebih kuat dari Vt atau Pplat saja</td>
              </tr>
              <tr className="text-foreground">
                <td className="p-2 font-bold">I:E Ratio</td>
                <td className="p-2">1:2</td>
                <td className="p-2">1:2 s/d 1:3</td>
                <td className="p-2 text-muted-foreground">PPOK: perpanjang ekspirasi 1:3–1:4. Inverse ratio (2:1) jarang dipakai</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[12px] mb-4">
          <div className="font-bold text-amber-700 dark:text-amber-400 mb-2">⚖️ Formula BBi (Berat Badan Ideal)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-primary text-[13px]">
            <div><span className="text-muted-foreground font-sans font-bold not-italic">Laki-laki: </span>50 + 2.3 × (tinggi_inch − 60)</div>
            <div><span className="text-muted-foreground font-sans font-bold not-italic">Perempuan: </span>45.5 + 2.3 × (tinggi_inch − 60)</div>
          </div>
          <p className="mt-2 text-muted-foreground font-sans not-italic text-[11px]">tinggi_inch = tinggi_cm ÷ 2.54. Contoh: ♂ 170 cm → BBi = 66 kg → Target Vt ARDS = 66 × 6 = <strong className="text-foreground">396 mL</strong></p>
        </div>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Tabel PEEP/FiO₂ ARDSNet — Low PEEP Strategy</h3>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-muted text-muted-foreground border-b border-border">
                <th className="p-2">FiO₂</th>
                {ARDSNET_LOW_PEEP.map(([f]) => <td key={f} className="p-2">{f.toFixed(1).replace('.', ',')}</td>)}
              </tr>
            </thead>
            <tbody>
              <tr className="text-foreground">
                <th className="p-2 bg-muted text-muted-foreground font-bold">PEEP</th>
                {ARDSNET_LOW_PEEP.map(([f, peep]) => <td key={f} className="p-2">{peep}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] italic text-muted-foreground">📚 ARDSNet NEJM 2000;342:1301 · Fan E et al. AJRCCM 2017;195:1253 · Amato MB et al. NEJM 2015;372:747</p>
      </Accordion>

      <Accordion title="📖 P/F Ratio · S/F Ratio · ROX Index">
        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">P/F Ratio (PaO₂/FiO₂) — Kategori ARDS</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-muted text-muted-foreground border-b border-border">
                <th className="p-2">Kategori</th><th className="p-2">P/F Ratio</th><th className="p-2">Implikasi Klinis</th><th className="p-2">Est. Mortalitas</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border text-foreground"><td className="p-2">Normal</td><td className="p-2 font-bold">≥400</td><td className="p-2">Fungsi paru normal</td><td className="p-2">—</td></tr>
              <tr className="border-b border-border text-foreground"><td className="p-2 text-amber-600 dark:text-amber-400 font-bold">ARDS Mild</td><td className="p-2 font-bold">&gt;200 s/d ≤300</td><td className="p-2">PEEP ≥5, NIV/HFNC dapat dicoba dengan pemantauan ketat</td><td className="p-2">~27%</td></tr>
              <tr className="border-b border-border text-foreground"><td className="p-2 text-orange-600 dark:text-orange-400 font-bold">ARDS Moderate</td><td className="p-2 font-bold">&gt;100 s/d ≤200</td><td className="p-2">PEEP lebih tinggi dipertimbangkan; prone ≥16 jam/hari bila P/F &lt;150</td><td className="p-2">~32%</td></tr>
              <tr className="text-foreground"><td className="p-2 text-destructive font-bold">ARDS Severe</td><td className="p-2 font-bold text-destructive">≤100</td><td className="p-2">Prone ≥16 jam/hari, ECMO jika refrakter</td><td className="p-2 text-destructive font-bold">~45%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted-foreground mb-4">⚠️ Kategori Berlin mensyaratkan <strong className="text-foreground">PEEP/CPAP ≥5 cmH₂O</strong> dan PaO₂ dari ABG; estimasi mortalitas dari kohort Berlin (Ranieri 2012). Indikasi prone: P/F &lt;150 dengan FiO₂ ≥0,6 (PROSEVA; ESICM 2023). Jika ABG tidak tersedia → gunakan S/F ratio.</p>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">S/F Ratio — Surrogate P/F Tanpa ABG</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-[12px]">
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="font-bold text-foreground mb-2">Konversi S/F → P/F</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">S/F 315</strong> ≈ P/F 300 (batas mild ARDS)</li>
              <li><strong className="text-foreground">S/F 235</strong> ≈ P/F 200 (batas moderate)</li>
              <li><strong className="text-foreground">S/F 150</strong> ≈ P/F 100 (batas severe)</li>
            </ul>
            <p className="mt-2 text-[11px] italic opacity-80">Rice 2007: S/F ≈ 64 + 0,84 × P/F. Valid bila SpO₂ ≤97% (hindari ceiling effect)</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="font-bold text-foreground mb-2">Kapan Pakai S/F</div>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              <li>ABG tidak tersedia segera</li>
              <li>Monitor tren oksigenasi serial</li>
              <li>Skrining ARDS pada HFNC ≥30 L/menit atau NIV (definisi Global ARDS 2024)</li>
            </ul>
          </div>
        </div>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">ROX Index — Prediksi Keberhasilan HFNC</h3>
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-[12px] mb-3">
          <p className="font-mono text-teal-700 dark:text-teal-300 font-bold text-[14px] mb-3">ROX = (SpO₂ / FiO₂) ÷ RR</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Jam ke-</th><th className="p-2">Risiko rendah</th><th className="p-2">Risiko tinggi gagal HFNC</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(ROX_HIGH_RISK) as (keyof typeof ROX_HIGH_RISK)[]).map((h) => (
                  <tr key={h} className="border-b border-border text-foreground">
                    <td className="p-2">{h}</td>
                    <td className="p-2 text-emerald-600 dark:text-emerald-400 font-bold">≥{fmt(ROX_LOW_RISK)} — lanjutkan HFNC</td>
                    <td className="p-2 text-destructive font-bold">&lt;{fmt(ROX_HIGH_RISK[h])} — pertimbangkan intubasi</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-2 text-[11px] italic text-muted-foreground">📚 Ranieri VM et al. (Berlin) JAMA 2012;307:2526 · Matthay MA et al. AJRCCM 2024;209:37 · Grasselli G et al. (ESICM ARDS) ICM 2023;49:727 · Guérin C et al. (PROSEVA) NEJM 2013;368:2159 · Rice TW et al. Chest 2007;132:410 · Roca O et al. (ROX index) AJRCCM 2019;199:1368</p>
      </Accordion>

      <Accordion title="📖 Mode Ventilasi — VC, PC, PSV, PRVC">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-muted text-muted-foreground border-b border-border">
                <th className="p-2">Mode</th><th className="p-2">Dikontrol</th><th className="p-2">Bervariasi</th><th className="p-2">Indikasi</th><th className="p-2">Perhatian</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold text-blue-600 dark:text-blue-400">VC-AC</td>
                <td className="p-2">Vt, RR, Flow</td>
                <td className="p-2">Paw (PIP naik jika C turun)</td>
                <td className="p-2">ARDS, post-intubasi awal</td>
                <td className="p-2 text-muted-foreground">Monitor Pplat & DP ketat</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold text-purple-600 dark:text-purple-400">PC-AC</td>
                <td className="p-2">Pressure, RR, Ti</td>
                <td className="p-2">Vt (berubah jika C/effort berubah)</td>
                <td className="p-2">Sinkronisasi lebih baik</td>
                <td className="p-2 text-muted-foreground">Monitor Vt — bisa &gt;8 mL/kgBBi</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold text-emerald-600 dark:text-emerald-400">PSV</td>
                <td className="p-2">Pressure support</td>
                <td className="p-2">Vt, RR, Ti (patient-triggered)</td>
                <td className="p-2">Weaning, SBT</td>
                <td className="p-2 text-muted-foreground">Awas P-SILI bila drive napas tinggi + ARDS</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold text-amber-600 dark:text-amber-400">PRVC</td>
                <td className="p-2">Target Vt</td>
                <td className="p-2">Pressure auto-adjusted</td>
                <td className="p-2">Compliance berubah-ubah</td>
                <td className="p-2 text-muted-foreground">Adaptive pressure — perhatikan bila C turun tiba-tiba</td>
              </tr>
              <tr className="text-foreground">
                <td className="p-2 font-bold text-slate-500">SIMV</td>
                <td className="p-2">Mandatory + PS</td>
                <td className="p-2">Spontaneous breaths</td>
                <td className="p-2">Jarang direkomendasikan</td>
                <td className="p-2 text-muted-foreground">Bukti: memperpanjang weaning vs PSV/T-piece</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] italic text-muted-foreground">📚 Fan E et al. AJRCCM 2017;195:1253 · Ouellette DR et al. (Weaning) Chest 2017;151:166 · Tobin MJ NEJM 2001;344:1986</p>
      </Accordion>

      <Accordion title="📖 AutoPEEP & Air Trapping — Deteksi & Tatalaksana">
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-[12px] mb-4">
          <div className="font-bold text-destructive mb-1">⚠️ AutoPEEP — Hiperinflasi Dinamis</div>
          <p className="text-muted-foreground">Terjadi ketika ekspirasi belum selesai sebelum inspirasi berikutnya → gas terperangkap → tekanan end-expiratory melebihi PEEP yang di-set → hiperinflasi dinamis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-[12px]">
          <div>
            <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Penyebab</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>RR terlalu tinggi (Te tidak cukup)</li>
              <li>Vt besar (volume lebih banyak harus dikeluarkan)</li>
              <li>Obstruksi (PPOK, asma, sekret, ETT kecil)</li>
              <li>I:E ratio tidak adekuat</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Dampak</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Hipotensi:</strong> ↑ tekanan intratorakal → ↓ venous return → ↓ CO</li>
              <li><strong className="text-foreground">Barotrauma:</strong> Hiperinflasi → pneumotoraks</li>
              <li><strong className="text-foreground">Triggering sulit:</strong> Pasien melawan autoPEEP → dyssynchrony</li>
            </ul>
          </div>
        </div>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Cara Ukur — Expiratory Hold</h3>
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-[12px] mb-4">
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
            <li>Pastikan <strong className="text-foreground">tidak ada usaha napas spontan</strong> (sedasi adekuat)</li>
            <li>Tekan <strong className="text-foreground">Expiratory Hold</strong> di akhir ekspirasi selama 2–3 detik</li>
            <li>Baca tekanan = <strong className="text-foreground">Total PEEP</strong></li>
            <li><strong className="font-mono text-primary">AutoPEEP = Total PEEP − PEEP yang di-set</strong></li>
            <li>AutoPEEP &gt;5 cmH₂O = signifikan, perlu intervensi</li>
          </ol>
        </div>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Tatalaksana</h3>
        <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
          <li><strong className="text-foreground">↓ RR</strong> (paling efektif) → Te lebih panjang</li>
          <li><strong className="text-foreground">↓ Vt</strong> → volume lebih sedikit tiap napas</li>
          <li><strong className="text-foreground">↑ Flow inspiratory</strong> (VC mode) → Ti lebih pendek → Te lebih panjang</li>
          <li><strong className="text-foreground">Bronkodilator agresif</strong> bila PPOK/asma</li>
          <li><strong className="text-foreground">Counter-PEEP eksterna:</strong> Set PEEP = 75–80% autoPEEP → memudahkan triggering</li>
          <li><strong className="text-foreground">Trik deteksi hipotensi:</strong> Lepas dari ventilator sementara (hand-bag) — jika TD naik → autoPEEP adalah penyebabnya</li>
        </ul>
        <p className="mt-2 text-[11px] italic text-muted-foreground">📚 Slutsky AS & Ranieri VM NEJM 2013;369:2126 · Tobin MJ NEJM 2001;344:1986</p>
      </Accordion>

      <Accordion title="📖 Patient-Ventilator Dyssynchrony & P-SILI">
        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Tipe Dyssynchrony & Solusi</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-muted text-muted-foreground border-b border-border">
                <th className="p-2">Tipe</th><th className="p-2">Tanda Waveform</th><th className="p-2">Solusi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">Flow Starvation</td>
                <td className="p-2">Cekungan (dip) di kurva pressure-time saat inspirasi</td>
                <td className="p-2 text-muted-foreground">↑ flow rate atau ganti ke PC/PRVC</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">Double Triggering</td>
                <td className="p-2">Dua napas berurutan sangat cepat, Vt stacking</td>
                <td className="p-2 text-muted-foreground">↑ Ti mesin, ↑ sedasi-analgesia</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">Missed Trigger</td>
                <td className="p-2">Defleksi kecil di flow/pressure tanpa cycling mesin</td>
                <td className="p-2 text-muted-foreground">↓ trigger threshold, atasi autoPEEP</td>
              </tr>
              <tr className="border-b border-border text-foreground">
                <td className="p-2 font-bold">Auto-triggering</td>
                <td className="p-2">RR mesin &gt; RR pasien, napas aperiodik</td>
                <td className="p-2 text-muted-foreground">↑ trigger threshold, cek kebocoran sirkuit</td>
              </tr>
              <tr className="text-foreground">
                <td className="p-2 font-bold">Late Cycling</td>
                <td className="p-2">Pasien aktif melawan akhir inspirasi, Paw spike</td>
                <td className="p-2 text-muted-foreground">Turunkan % expiratory trigger (PSV)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted-foreground mb-4">Dyssynchrony &gt;10% dari total napas dikaitkan dengan peningkatan mortalitas ICU (Blanch L et al. ICM 2015).</p>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">P-SILI (Patient Self-Inflicted Lung Injury)</h3>
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-[12px] mb-3">
          <p className="text-muted-foreground"><strong className="text-foreground">P-SILI</strong> terjadi ketika usaha napas spontan yang kuat menghasilkan ayunan tekanan transpulmoner (ΔPL) besar → overdistensi lokal → lung injury, meski setting ventilator tampak protektif. Relevan pada <strong className="text-foreground">NIV dan PSV dalam konteks ARDS</strong>.</p>
        </div>
        <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
          <li><strong className="text-foreground">Faktor risiko:</strong> Drive napas tinggi (hipoksemia, demam, agitasi), compliance rendah, Vt spontan &gt;8 mL/kgBBi</li>
          <li><strong className="text-foreground">Deteksi:</strong> P0.1 &gt;3,5–4 cmH₂O = dorongan/usaha napas tinggi (Telias 2020). Vt spontan besar. Dyssynchrony berulang.</li>
          <li><strong className="text-foreground">Manajemen:</strong> Atasi penyebab drive tinggi → sedasi-analgesia → ↓ level PS → pertimbangkan switch VC-AC atau NMB jangka pendek bila P-SILI berat</li>
          <li><strong className="text-foreground">Paradoks NIV:</strong> Drive napas sangat tinggi pada NIV → P-SILI → delay intubasi memperburuk ARDS. Evaluasi ketat di 1–2 jam pertama.</li>
        </ul>
        <p className="mt-2 text-[11px] italic text-muted-foreground">📚 Blanch L et al. ICM 2015;41:633 · Brochard L et al. (P-SILI) AJRCCM 2017;195:438 · Telias I et al. AJRCCM 2020;201:1086 · Slutsky AS & Ranieri VM NEJM 2013;369:2126</p>
      </Accordion>

      <AbbrLegend terms={['VT', 'PEEP', 'Pplat', 'PIP', 'DP', 'VILI', 'P-SILI', 'ARDS', 'PPOK', 'BBI', 'RR', 'FiO2', 'SpO2', 'PaO2', 'P/F', 'S/F', 'ABG', 'ROX', 'HFNC', 'NIV', 'CPAP', 'ECMO', 'VC-AC', 'PC-AC', 'PSV', 'PS', 'PRVC', 'SIMV', 'SBT', 'NMB', 'P0.1', 'ESICM', 'ATS', 'SCCM', 'ACCP']} />

      <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
        <h3 className="font-bold text-[14px] text-foreground mb-3">📚 Referensi Utama</h3>
        <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
          <li>The Acute Respiratory Distress Syndrome Network. Ventilation with lower tidal volumes. <em>N Engl J Med</em>. 2000;342:1301.</li>
          <li>Amato MB, Meade MO, Slutsky AS, et al. Driving pressure and survival in ARDS. <em>N Engl J Med</em>. 2015;372:747.</li>
          <li>Fan E, Del Sorbo L, Goligher EC, et al. ATS/ESICM/SCCM guideline: mechanical ventilation in adult patients with ARDS. <em>Am J Respir Crit Care Med</em>. 2017;195:1253.</li>
          <li>Slutsky AS, Ranieri VM. Ventilator-induced lung injury. <em>N Engl J Med</em>. 2013;369:2126.</li>
          <li>Matthay MA, et al. A new global definition of acute respiratory distress syndrome. <em>Am J Respir Crit Care Med</em>. 2024;209:37.</li>
          <li>Ranieri VM, et al. Acute respiratory distress syndrome: the Berlin Definition. <em>JAMA</em>. 2012;307:2526.</li>
          <li>Guérin C, et al. Prone positioning in severe acute respiratory distress syndrome (PROSEVA). <em>N Engl J Med</em>. 2013;368:2159.</li>
          <li>Rice TW, et al. Comparison of the SpO₂/FiO₂ ratio and the PaO₂/FiO₂ ratio in patients with acute lung injury or ARDS. <em>Chest</em>. 2007;132:410.</li>
          <li>Grasselli G, et al. ESICM guidelines on ARDS: definition, phenotyping and respiratory support. <em>Intensive Care Med</em>. 2023;49:727.</li>
          <li>Roca O, et al. ROX index for predicting HFNC outcome. <em>Am J Respir Crit Care Med</em>. 2019;199:1368.</li>
          <li>Blanch L, et al. Asynchronies during mechanical ventilation are associated with mortality. <em>Intensive Care Med</em>. 2015;41:633.</li>
          <li>Brochard L, Slutsky A, Pesenti A. Mechanical ventilation to minimize progression of lung injury in acute respiratory failure. <em>Am J Respir Crit Care Med</em>. 2017;195:438.</li>
          <li>Telias I, et al. Airway occlusion pressure as an estimate of respiratory drive and inspiratory effort during assisted ventilation. <em>Am J Respir Crit Care Med</em>. 2020;201:1086.</li>
          <li>Tobin MJ. Advances in mechanical ventilation. <em>N Engl J Med</em>. 2001;344:1986.</li>
          <li>Ouellette DR, et al. Liberation from mechanical ventilation: ATS/ACCP guideline. <em>Chest</em>. 2017;151:166.</li>
        </ul>
      </div>

    </div>
  );
}
