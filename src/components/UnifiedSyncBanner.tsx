import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { useClinicalStore, ClinicalData } from '../store/useClinicalStore';

export interface SyncField {
  key: keyof ClinicalData;
  label: string;
  value: string;
  setter: (val: string) => void;
  unit?: string;
  formatDisplay?: (val: string) => string;
}

interface UnifiedSyncBannerProps {
  fields: SyncField[];
}

export function UnifiedSyncBanner({ fields }: UnifiedSyncBannerProps) {
  const { data: storeData, setFields } = useClinicalStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Track initial values on mount to avoid overwriting the global store with mounting values
  const initialValuesRef = useRef<{ [key: string]: string }>({});
  const isMountedRef = useRef(false);

  // Record initial page values on mount
  useEffect(() => {
    const vals: { [key: string]: string } = {};
    fields.forEach((f) => {
      vals[f.key] = f.value || '';
    });
    initialValuesRef.current = vals;
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []); // Run once on mount

  // Check if any local field has been modified by the user since mount,
  // and publish it to the global store if it's non-empty.
  useEffect(() => {
    if (!isMountedRef.current) return;

    const updatesToStore: Partial<ClinicalData> = {};
    let hasUpdates = false;

    fields.forEach((field) => {
      const initialVal = initialValuesRef.current[field.key] || '';
      const currentLocalVal = field.value || '';
      const currentGlobalVal = storeData[field.key] || '';

      // If the local value is non-empty and has changed from both the initial mount value
      // and is different from the current global store value, we publish it.
      if (
        currentLocalVal !== '' &&
        currentLocalVal !== initialVal &&
        currentLocalVal !== currentGlobalVal
      ) {
        updatesToStore[field.key] = currentLocalVal as any;
        hasUpdates = true;
        // Keep initial value ref in sync so we don't trigger recursively
        initialValuesRef.current[field.key] = currentLocalVal;
      }
    });

    if (hasUpdates) {
      setFields(updatesToStore);
    }
  }, [fields, storeData, setFields]);

  // Determine which fields have values in the store that could be imported
  // because they are different from the current local values.
  const syncableFields = fields.filter((field) => {
    const globalVal = storeData[field.key] || '';
    const localVal = field.value || '';
    // Show sync prompt if store has a value, and it differs from the current local value
    return globalVal !== '' && globalVal !== localVal;
  });

  const handleApplyAll = () => {
    fields.forEach((field) => {
      const globalVal = storeData[field.key] || '';
      if (globalVal !== '' && globalVal !== field.value) {
        field.setter(globalVal);
        // Also update initial values to match the newly set value
        initialValuesRef.current[field.key] = globalVal;
      }
    });
    setIsOpen(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  // Show banner only if there are syncable fields, and user hasn't dismissed it
  const showBanner = syncableFields.length > 0 && !isDismissed;

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full mb-4 overflow-hidden"
      >
        <div className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm relative">
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                Data Klinis Tersimpan di Memori
              </div>
              <div className="text-xs text-amber-700/80 dark:text-amber-400/85 mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 items-center">
                <span>Gunakan data terinput dari kalkulator sebelumnya:</span>
                {syncableFields.map((field, idx) => {
                  const globalVal = storeData[field.key] || '';
                  const displayVal = field.formatDisplay
                    ? field.formatDisplay(globalVal)
                    : `${globalVal}${field.unit ? ` ${field.unit}` : ''}`;
                  return (
                    <span
                      key={field.key}
                      className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-200 font-medium text-[11px]"
                    >
                      {field.label}: {displayVal}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              onClick={handleApplyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-xl shadow-sm hover:bg-amber-500 transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" /> Gunakan Master Data
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 transition-colors cursor-pointer"
              title="Abaikan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
