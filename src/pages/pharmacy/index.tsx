import React, { useState } from 'react';
import { Pill, Droplets, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import DrugReference from '../drug-reference';
import CairanIndex from '../cairan';

export default function PharmacyIndex() {
  const [activeTab, setActiveTab] = useState<'obat' | 'cairan'>('obat');
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFav = isFavorite('/pharmacy');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      <div className="pt-4 px-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Pill className="w-6 h-6 text-primary" />
              Obat & Cairan
            </h1>
            <button
              onClick={() => toggleFavorite('/pharmacy')}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <Star className={`w-5 h-5 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`} />
            </button>
          </div>

          <p className="text-muted-foreground text-[13px] mt-[-8px]">
            Panduan dosis obat-obatan, penyesuaian ginjal, interaksi, dan referensi cairan intravena.
          </p>

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
              <DrugReference isEmbedded />
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
              <CairanIndex isEmbedded />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
