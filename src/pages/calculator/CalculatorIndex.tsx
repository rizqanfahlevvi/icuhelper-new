import { Calculator } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { ToolIndex } from '../../components/ToolIndex';
import { ALL_FAVORITABLE_ITEMS, CALC_GROUPS } from '../../data/favoritableItems';

/** Semua alat kategori Kalkulator (termasuk ABG & Weaning), dikelompokkan per sistem organ. */
const CALCULATORS = ALL_FAVORITABLE_ITEMS.filter((it) => it.category === 'Kalkulator');

export default function CalculatorIndex() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      <PageHeader
        compact
        badgeIcon={Calculator}
        badgeText="ALAT PERHITUNGAN"
        title="Kalkulator Klinis"
        description={`${CALCULATORS.length} alat perhitungan klinis, dikelompokkan per sistem organ. Ketuk ★ untuk menyematkan ke Home.`}
      />
      <ToolIndex items={CALCULATORS} groups={CALC_GROUPS} placeholder="Cari kalkulator (mis. kalium, P/F, insulin)…" />
      <AbbrLegend terms={['RSI', 'ICU', 'IBW', 'TV', 'NEE', 'NLR', 'P/F', 'PaO2', 'FiO2', 'CrCl', 'GFR', 'Hb', 'PRC', 'WB', 'TBSA', 'AGD', 'ABG', 'RSBI']} />
    </div>
  );
}
