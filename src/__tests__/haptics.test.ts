import { describe, it, expect, vi, beforeEach } from 'vitest';

const state = { vibrationEnabled: true };
vi.mock('../store/settingsStore', () => ({ useSettingsStore: { getState: () => state } }));

import { haptic, hapticsSupported, HAPTIC_PATTERNS } from '../utils/haptics';

describe('haptic', () => {
  let vibrate: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vibrate = vi.fn();
    vi.stubGlobal('navigator', { vibrate });
    state.vibrationEnabled = true;
  });
  it('getar sesuai pola bila aktif', () => {
    haptic('success'); expect(vibrate).toHaveBeenLastCalledWith(HAPTIC_PATTERNS.success);
    haptic('warning'); expect(vibrate).toHaveBeenLastCalledWith([40, 60, 40]);
  });
  it('tidak getar bila pengaturan mati', () => { state.vibrationEnabled = false; haptic('tap'); expect(vibrate).not.toHaveBeenCalled(); });
  it('no-op bila browser tak mendukung (iPhone)', () => {
    vi.stubGlobal('navigator', {});
    expect(hapticsSupported()).toBe(false);
    expect(() => haptic('tap')).not.toThrow();
  });
});
