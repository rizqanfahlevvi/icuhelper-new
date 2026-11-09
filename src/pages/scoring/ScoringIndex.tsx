import { BarChart } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { ToolIndex } from '../../components/ToolIndex';
import { ALL_FAVORITABLE_ITEMS, SCORING_GROUPS } from '../../data/favoritableItems';

const SCORING_TOOLS = ALL_FAVORITABLE_ITEMS.filter((it) => it.category === 'Skoring');

export default function ScoringIndex() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-4 pb-20 overflow-x-hidden">
      <PageHeader
        compact
        badgeIcon={BarChart}
        badgeText="SISTEM SKORING"
        title="Sistem Skoring Klinis"
        description="Alat penilaian objektif untuk kondisi dan prognosis pasien di perawatan intensif, dikelompokkan per sistem."
      />
      <ToolIndex items={SCORING_TOOLS} groups={SCORING_GROUPS} placeholder="Cari skor (mis. delirium, VAP, SOFA)…" />
      <AbbrLegend terms={['APACHE', 'BFS', 'CFS', 'CAM-ICU', 'ICU', 'CPIS', 'RASS', 'SOFA', 'PE', 'DVT', 'VAP']} />
    </div>
  );
}
