import { Construction } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  category: string;
}

export default function PlaceholderPage({ title, category }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex-1 flex flex-col items-center justify-center text-center p-8 min-h-[50vh]">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6 group-hover:scale-110 transition-transform">
           <Construction className="w-8 h-8 text-primary/60" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">{title}</h1>
        <p className="text-[14px] text-muted-foreground max-w-md mx-auto mb-8">
          Halaman ini sedang dipersiapkan. Modul ini menunggu migrasi dari versi HTML/Vanilla JS sebelumnya ke format komponen React.
        </p>
        <button 
          onClick={() => navigate(`/${category}`)} 
          className="px-5 py-2.5 bg-primary text-primary-foreground text-[14px] font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
        >
          Kembali ke Indeks {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      </div>
    </div>
  );
}
