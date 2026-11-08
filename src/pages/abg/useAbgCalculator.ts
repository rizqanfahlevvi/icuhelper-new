import { useMemo } from 'react';
import { AbgInputs } from './types';
import { interpretAbg, AbgResultData } from './abgInterpretation';
import { useSettingsStore } from '../../store/settingsStore';

export type { AbgResultData, OxResult } from './abgInterpretation';

/** Hook tipis — seluruh logika ada di interpretAbg (fungsi murni, dites). */
export function useAbgCalculator(inputs: AbgInputs): AbgResultData | null {
  const agUpper = useSettingsStore(s => s.agUpperNormal);
  return useMemo(() => interpretAbg(inputs, { agUpper }), [inputs, agUpper]);
}
