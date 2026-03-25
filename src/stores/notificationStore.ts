import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  enabled: boolean;
  intervalDays: number | null;
  lastBoardingDate: string | null;
  setEnabled: (enabled: boolean) => void;
  setIntervalDays: (days: number | null) => void;
  setLastBoardingDate: (date: string | null) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      enabled: false,
      intervalDays: null,
      lastBoardingDate: null,

      setEnabled: (enabled) => set({ enabled }),
      setIntervalDays: (days) => set({ intervalDays: days }),
      setLastBoardingDate: (date) => set({ lastBoardingDate: date }),
    }),
    {
      name: 'notification-storage',
    },
  ),
);
