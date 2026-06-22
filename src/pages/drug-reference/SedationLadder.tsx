import { Accordion } from '../../components/ui/Accordion';
import { SEDATION_LADDER } from './data';

export default function SedationLadder() {
  return (
    <div className="mt-4">
      <Accordion title="💤 Tangga Sedasi ICU — SCCM PADIS 2018">
        <div className="space-y-3">
          {SEDATION_LADDER.map((rung, idx) => (
            <div key={idx} className={`border-l-4 ${rung.color} bg-card border border-l-border rounded-r-lg rounded-l-sm p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${rung.bgColor}`}>
                  Level {rung.level}
                </span>
                <strong className="text-[13px] text-foreground">{rung.label}</strong>
              </div>
              <div className="text-[11px] text-muted-foreground mb-3">{rung.description}</div>
              
              <div className="space-y-2">
                {rung.agents.map((a, i) => (
                  <div key={i} className="bg-muted/40 border border-border/50 rounded-md p-2 flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                    <span className="text-[12px] font-bold text-foreground whitespace-nowrap">{a.name}</span>
                    <span className="text-[11px] font-mono text-primary whitespace-nowrap">{a.dose}</span>
                    <span className="text-[11px] text-muted-foreground">{a.note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Accordion>
    </div>
  );
}
