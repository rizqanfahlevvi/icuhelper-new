import { Accordion } from '../../components/ui/Accordion';

export default function TeoriSyok() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          Syok — Klasifikasi, Diagnosis & Resusitasi Hemodinamik
        </h1>
        
        <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-teal-600 dark:text-teal-400">💔 Definisi Syok — Ketidaksesuaian Supply-Demand O₂</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p><strong>Syok</strong> adalah kondisi di mana terjadi ketidaksesuaian antara <em>supply</em> (DO₂) dan <em>demand</em> (VO₂) oksigen ke jaringan, mengakibatkan hipoperfusi dan disfungsi sel → kematian sel jika tidak ditangani.</p>
              <p className="mt-2 text-primary font-mono text-[14px]"><strong>DO₂ = CO × CaO₂ × 10</strong></p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">CO</strong> = Cardiac Output (L/min)</li>
                <li><strong className="text-foreground">CaO₂</strong> = Hb × 1.34 × SaO₂ + (0.003 × PaO₂)</li>
                <li>Normal DO₂: <strong className="text-foreground">950–1150 mL/min</strong></li>
                <li>Kritis: DO₂ &lt;300 mL/min → anaerobic metabolism</li>
              </ul>
            </div>
            <div>
              <p><strong>4 Mekanisme Utama Syok:</strong></p>
              <table className="w-full text-left border-collapse text-[12px] mt-1">
                <tbody>
                  <tr className="border-b border-border text-foreground"><td className="p-1 font-bold text-destructive">🔴 Distributif</td><td className="p-1 text-muted-foreground">Maldistribusi aliran → SVR ↓↓, CO ↑</td></tr>
                  <tr className="border-b border-border text-foreground"><td className="p-1 font-bold text-primary">🔵 Hipovolemik</td><td className="p-1 text-muted-foreground">Volume intravaskular ↓ → preload ↓ → CO ↓</td></tr>
                  <tr className="border-b border-border text-foreground"><td className="p-1 font-bold text-warning">🟡 Kardiogenik</td><td className="p-1 text-muted-foreground">Kegagalan pompa → CO ↓, afterload ↑</td></tr>
                  <tr className="text-foreground"><td className="p-1 font-bold text-orange-500">🟠 Obstruktif</td><td className="p-1 text-muted-foreground">Hambatan mekanik aliran → CO ↓</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-[11px] opacity-80 text-teal-700 dark:text-teal-300"><em>Berdasarkan Vincent JL & De Backer D, NEJM 2013 dan ACCCM Hemodynamic Monitoring Consensus 2022 [1, 2].</em></p>
        </div>

        </div>

        <Accordion title="📖 Klasifikasi Syok & Diagnosis Banding" defaultOpen={true}>
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Klasifikasi 4 Tipe Syok</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Tipe</th><th className="p-2">Etiologi Utama</th><th className="p-2">Patofisiologi</th><th className="p-2">Tampilan Klinis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Distributif</td>
                  <td className="p-2 text-muted-foreground">Sepsis, anafilaksis, neurogenik, insufisiensi adrenal</td>
                  <td className="p-2 text-muted-foreground">Vasodilatasi masif → SVR ↓↓ → maldistribusi mikrosirkulasi</td>
                  <td className="p-2">Kulit hangat/merah, takikardia, demam/hipotermi</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Hipovolemik</td>
                  <td className="p-2 text-muted-foreground">Hemoragik, non-hemoragik (dehidrasi, luka bakar)</td>
                  <td className="p-2 text-muted-foreground">Volume intravaskular ↓ → preload ↓ → SV ↓ → CO ↓</td>
                  <td className="p-2">Kulit pucat/dingin, vena kolaps, takikardia, oliguria</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Kardiogenik</td>
                  <td className="p-2 text-muted-foreground">AMI, miokarditis akut, tamponade, aritmia maligna</td>
                  <td className="p-2 text-muted-foreground">Kegagalan pompa → CO ↓ → backward failure → edema paru</td>
                  <td className="p-2">Ronki paru, JVP ↑, S3, edema, kulit dingin/lembab</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">Obstruktif</td>
                  <td className="p-2 text-muted-foreground">PE masif, tension pneumothorax, tamponade kardiak</td>
                  <td className="p-2 text-muted-foreground">Hambatan mekanis aliran darah → RV afterload ↑ → CO ↓</td>
                  <td className="p-2">JVP ↑, trakea deviasi, pulsus paradoksus</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Profil Hemodinamik Invasif</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-center border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2 text-left">Parameter</th><th className="p-2">Distributif</th><th className="p-2">Hipovolemik</th><th className="p-2">Kardiogenik</th><th className="p-2">Obstruktif</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-left">CVP / RAP</td><td className="p-2 text-muted-foreground">↓ atau N</td><td className="p-2 font-bold text-primary">↓↓</td><td className="p-2 font-bold text-destructive">↑↑</td><td className="p-2 font-bold text-destructive">↑↑</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-left">PAOP / PCWP</td><td className="p-2 text-muted-foreground">↓ atau N</td><td className="p-2 font-bold text-primary">↓↓</td><td className="p-2 font-bold text-destructive">↑↑ (&gt;18)</td><td className="p-2 text-muted-foreground">↓ atau N</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-left">CO / CI</td><td className="p-2 font-bold text-destructive">↑↑ (hiperdinamik)</td><td className="p-2 font-bold text-primary">↓↓</td><td className="p-2 font-bold text-primary">↓↓ (&lt;2.2)</td><td className="p-2 font-bold text-primary">↓</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-left">SVR</td><td className="p-2 font-bold text-primary">↓↓↓</td><td className="p-2 font-bold text-destructive">↑↑</td><td className="p-2 font-bold text-destructive">↑↑</td><td className="p-2 font-bold text-destructive">↑</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold text-left">Laktat</td><td className="p-2 font-bold text-destructive">↑↑</td><td className="p-2 font-bold text-destructive">↑↑</td><td className="p-2 font-bold text-destructive">↑↑</td><td className="p-2 font-bold text-destructive">↑</td></tr>
              </tbody>
            </table>
          </div>
        </Accordion>

        <Accordion title="📖 RUSH Exam (Point-of-Care Ultrasound)">
          <p className="mb-3 text-muted-foreground">RUSH (Rapid Ultrasound in Shock) dilakukan dalam &lt;5 menit di bedside untuk menentukan tipe syok sebelum terapi definitif.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-muted/40 rounded-lg">
              <h4 className="font-bold text-[14px] text-destructive mb-2">❤️ R — Pump (Jantung)</h4>
              <ul className="list-disc pl-5 text-muted-foreground text-[12px] space-y-1">
                <li><strong className="text-foreground">Window:</strong> parasternal/subkostal/apikal</li>
                <li>EF visual: hiperdinamik (dist/hipo) vs depresi (kardio)</li>
                <li>Tamponade: efusi perikardium + RV collapse saat diastole</li>
                <li>RV dilatasi: curigai PE masif atau RV infarct</li>
                <li>Kissing ventricle: ventrikel kiri hiperdinamik + kolaps = hipo</li>
              </ul>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <h4 className="font-bold text-[14px] text-primary mb-2">🚰 U — Tank (Volume Status)</h4>
              <ul className="list-disc pl-5 text-muted-foreground text-[12px] space-y-1">
                <li><strong className="text-foreground">IVC diameter dan kolapsibilitas:</strong></li>
                <li>IVC &lt;2 cm + kolaps &gt;50% dgn inspirasi → hipovolemia</li>
                <li>IVC &gt;2.5 cm + tidak kolaps → overload / obstruksi / kardio</li>
                <li>B-lines bilateral (≥3/window) → edema paru kardiogenik</li>
              </ul>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <h4 className="font-bold text-[14px] text-warning mb-2">🩸 S — Pipes (Pembuluh Darah)</h4>
              <ul className="list-disc pl-5 text-muted-foreground text-[12px] space-y-1">
                <li><strong className="text-foreground">Aorta abdominal:</strong> AAA — diameter &gt;3 cm</li>
                <li><strong className="text-foreground">Vena femoralis/poplitea:</strong> DVT — tidak kompresibel</li>
                <li>DVT + RV dilatasi → tinggi curiga PE masif</li>
              </ul>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <h4 className="font-bold text-[14px] text-foreground mb-2">Interpretasi Cepat</h4>
              <ul className="list-disc pl-5 text-muted-foreground text-[12px] space-y-1">
                <li>EF ↓ + B-lines + IVC besar → <strong className="text-foreground">Kardiogenik</strong></li>
                <li>IVC kolaps + EF hiperdinamik → <strong className="text-foreground">Hipovolemik</strong></li>
                <li>EF hiperdinamik + IVC variabel → <strong className="text-foreground">Distributif</strong></li>
                <li>RV membesar + DVT/no B-lines → <strong className="text-foreground">Obstruktif (PE)</strong></li>
              </ul>
            </div>
          </div>
        </Accordion>

        <Accordion title="📖 Resusitasi Hemodinamik — Target, Cairan & Vasopressor">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-[12px] mb-4">
            <strong className="text-primary text-[14px] block mb-2">🎯 Target Resusitasi Awal (SSC 2024)</strong>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground m-0">
                <li><strong className="text-foreground">MAP ≥65 mmHg</strong> (≥80 pd hipertensi kronik)</li>
                <li><strong className="text-foreground">Laktat clearing ≥10%/2 jam</strong></li>
                <li><strong className="text-foreground">Laktat target &lt;2 mmol/L dlm 6 jam</strong></li>
              </ul>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground m-0">
                <li><strong className="text-foreground">Urin output ≥0.5 mL/kg/jam</strong></li>
                <li><strong className="text-foreground">ScvO₂ ≥70%</strong> (atau SvO₂ ≥65%)</li>
                <li><strong className="text-foreground">CRT &lt;3 detik</strong></li>
              </ul>
            </div>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Fluid Responsiveness (Sebelum Bolus Cairan)</h3>
          <p className="text-[12px] text-muted-foreground mb-2">Hanya 50% pasien syok yang benar-benar fluid-responsive. Pemberian cairan berlebihan meningkatkan risiko ARDS dan abdominal compartment syndrome.</p>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Passive Leg Raising (PLR):</strong> Angkat kaki 45° selama 1 menit → ↑ CO ≥10% → fluid responsive.</li>
            <li><strong className="text-foreground">Pulse Pressure Variation (PPV):</strong> PPV &gt;13% pada pasien VM terkontrol → fluid responsive.</li>
            <li><strong className="text-foreground">Cairan pilihan:</strong> Normal Saline 0.9% atau Ringer Laktat. Hindari starch (HES) → nefrotoksik.</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Tabel Vasopressor Utama</h3>
          <div className="overflow-x-auto mb-2">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Vasopressor</th><th className="p-2">Mekanisme</th><th className="p-2">Indikasi Utama</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold whitespace-nowrap">Norepinefrin</td><td className="p-2 text-muted-foreground">α₁ &gt;&gt; β₁</td><td className="p-2 font-bold text-destructive">Lini pertama semua syok distributif [3]</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold whitespace-nowrap">Vasopressin</td><td className="p-2 text-muted-foreground">V1R (langsung)</td><td className="p-2 text-muted-foreground">Adjunct NE (jika NE &gt;0.25 mcg/kg/min) [3]</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold whitespace-nowrap">Epinefrin</td><td className="p-2 text-muted-foreground">α₁ + β₁ + β₂</td><td className="p-2 text-muted-foreground">Lini pertama anafilaksis, kardio refrakter [4]</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold whitespace-nowrap">Dobutamin</td><td className="p-2 text-muted-foreground">β₁ &gt;&gt; β₂</td><td className="p-2 text-muted-foreground">Syok kardiogenik (inotropik) [5]</td></tr>
              </tbody>
            </table>
          </div>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Vincent JL, De Backer D. Circulatory shock. <em>N Engl J Med</em>. 2013.</li>
            <li>Saugel B, et al. American College of Critical Care Medicine Clinical Practice Parameters for Hemodynamic Support of Adult Patients with Sepsis. <em>Crit Care Med</em>. 2022.</li>
            <li>Evans L, et al. Surviving sepsis campaign: international guidelines for management of sepsis and septic shock 2021. <em>Intensive Care Med</em>. 2021.</li>
            <li>Morita H, et al. Anaphylaxis guidelines: 2022 update. <em>Allergol Int</em>. 2022.</li>
            <li>Overgaard CB, Dzavík V. Inotropes and vasopressors: review of physiology and clinical use in cardiovascular disease. <em>Circulation</em>. 2008.</li>
          </ul>
        </div>
      </div>
  );
}
