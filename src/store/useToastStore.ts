import { create } from 'zustand';

interface ToastState {
  message: string | null;
  type: 'info' | 'success' | 'warn';
  showToast: (message: string, type?: 'info' | 'success' | 'warn') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'info',
  showToast: (message, type = 'info') => {
    set({ message, type });
    setTimeout(() => {
      set({ message: null });
    }, 2500);
  },
  hideToast: () => set({ message: null }),
}));
