import React, { useState } from 'react';
import { Pill, Droplets, Star, Search, XCircle, Beaker } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import DrugReference from '../drug-reference';
import CairanIndex from '../cairan';
import { PageHeader } from '../../components/ui/PageHeader';

export default function PharmacyIndex() {
  const [activeTab, setActiveTab] = useState<'obat' | 'cairan'>('obat');
  const [globalSearch, setGlobalSearch] = useState('');
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFav = isFavorite('/pharmacy');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      <div className="pt-4 px-4">
        <div className="flex flex-col gap-4">
          <PageHeader 
            badgeIcon={Beaker}
            badgeText="FARMAKOLOGI"
            title="Obat & Cairan"
            description="Panduan dosis obat-obatan, penyesuaian ginjal, interaksi, dan referensi cairan intravena."
            rightContent={
              <button
                onClick={() => toggleFavorite('/pharmacy')}
                className={`flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl border font-bold text-sm shadow-sm transition-all active:scale-95 ${isFav ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                <Star className={`w-4 h-4 sm:mr-2 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span className="hidden sm:inline">{isFav ? 'Difavoritkan' : 'Favoritkan'}</span>
              </button>
            }
          />

          {/* Global Search Bar */}
          <div className="relative w-full shadow-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari obat, cairan, kategori, atau indikasi..." 
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
            {globalSearch && (
              <button onClick={() => setGlobalSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Main Tab Switcher */}
          <div className="flex p-1 bg-muted rounded-xl shadow-sm border border-border/50">
            <button
              onClick={() => setActiveTab('obat')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg flex justify-center items-center gap-2 transition-all ${
                activeTab === 'obat' ? 'bg-background shadow-sm text-foreground border border-border/10' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Pill className="w-4 h-4" /> Obat
            </button>
            <button
              onClick={() => setActiveTab('cairan')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg flex justify-center items-center gap-2 transition-all ${
                activeTab === 'cairan' ? 'bg-background shadow-sm text-foreground border border-border/10' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Droplets className="w-4 h-4" /> Cairan
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'obat' && (
            <motion.div
              key="obat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <DrugReference isEmbedded globalSearch={globalSearch} />
            </motion.div>
          )}
          {activeTab === 'cairan' && (
            <motion.div
              key="cairan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <CairanIndex isEmbedded globalSearch={globalSearch} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

