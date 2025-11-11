import { create } from "zustand";

interface RateLimitState {
  isLocked: boolean;
  lockUntil: number | null;
  retryAfter: number;
  setLocked: (locked: boolean, retryAfterMinutes: number) => void;
  reset: () => void;
}

export const useRateLimitStore = create<RateLimitState>((set) => ({
  isLocked: false,
  lockUntil: null,
  retryAfter: 0,

  setLocked: (locked: boolean, retryAfterMinutes: number) => {
    if (locked) {
      const lockUntil = Date.now() + retryAfterMinutes * 60 * 1000;
      set({
        isLocked: true,
        lockUntil,
        retryAfter: retryAfterMinutes,
      });
    } else {
      set({
        isLocked: false,
        lockUntil: null,
        retryAfter: 0,
      });
    }
  },

  reset: () =>
    set({
      isLocked: false,
      lockUntil: null,
      retryAfter: 0,
    }),
}));
