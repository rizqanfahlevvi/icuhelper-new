import { Accordion } from '../../components/ui/Accordion';
import { VASOPRESSOR_FLOWCHART } from './data';

export default function VasopressorFlowchart() {
  return (
    <div className="mt-10">
      <Accordion title="🫀 Algoritma Vasopressor — Pilihan per Tipe Syok">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VASOPRESSOR_FLOWCHART.map((fc) => (
            <div key={fc.id} className={`border ${fc.color} rounded-lg overflow-hidden`}>
              <div className={`flex items-center gap-2 px-3 py-2 border-b ${fc.color} ${fc.bgColor}`}>
                <span className="text-lg">{fc.icon}</span>
                <strong className={`text-sm ${fc.textColor}`}>{fc.label}</strong>
              </div>
              <div className="p-3 space-y-3">
                {fc.steps.map((s, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full ${fc.bgColor} ${fc.textColor} border ${fc.color} text-[10px] font-bold`}>
                      {s.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold text-foreground">{s.agent}</div>
                      <div className="text-[11px] font-mono text-primary mt-0.5">{s.dose}</div>
                      <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{s.note}</div>
                    </div>
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
