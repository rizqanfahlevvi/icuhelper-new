import { useHistoryStore } from '../store/useHistoryStore';
import { Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Riwayat() {
  const history = useHistoryStore((state) => state.entries);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const deleteEntry = useHistoryStore((state) => state.deleteEntry);

  const MODULE_META: Record<string, { label: string; icon: string; path: string }> = {
    ibw: { label: 'IBW & Parameter', icon: '⚖️', path: '/calculator/ibw' },
    renal: { label: 'Renal / FENa', icon: '🫘', path: '/calculator/renal' },
    // we can add more specific mappings when migrating other modules
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            🕓 Riwayat Perhitungan
          </h1>
          <p className="text-muted-foreground mt-1">Log otomatis riwayat perhitungan Anda</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={() => {
              if(confirm('Hapus SEMUA riwayat perhitungan? Tindakan ini tidak dapat dibatalkan.')) clearHistory();
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold text-destructive hover:bg-destructive/10 border border-destructive/20 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Hapus Semua</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4 opacity-50">🗒️</span>
            <h3 className="font-semibold text-foreground">Belum ada riwayat.</h3>
            <p className="text-[13px] text-muted-foreground mt-1 max-w-sm">Lakukan perhitungan di kalkulator klinis — hasilnya akan otomatis tersimpan di sini agar mudah ditinjau ulang.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((entry) => {
              const meta = MODULE_META[entry.module] || { label: entry.module, icon: '🧮', path: `/calculator/${entry.module}` };
              return (
                <div key={entry.id} className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row gap-4 p-4 !justify-between items-start">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-2">
                       <span>{meta.icon}</span> {meta.label}
                    </div>
                    <div className="font-semibold text-foreground text-[14px] leading-tight mb-1">{entry.label}</div>
                    <div className="text-[12px] text-muted-foreground line-clamp-3">{entry.summary}</div>
                    <div className="text-[10px] text-muted-foreground mt-2">{formatTime(entry.timestamp)}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                    <Link to={meta.path} className="px-3 py-1.5 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[12px] font-semibold transition-colors flex items-center gap-1.5 border border-border">
                      <ExternalLink className="w-3.5 h-3.5" /> Buka
                    </Link>
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors border border-transparent hover:border-destructive/20"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
