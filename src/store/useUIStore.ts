import { create } from 'zustand';

interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface UIState {
  toasts: (ToastOptions & { id: number })[];
  confirmDialog: ConfirmOptions | null;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
  showConfirm: (options: ConfirmOptions) => void;
  hideConfirm: () => void;
}

let toastIdCount = 0;

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  confirmDialog: null,
  addToast: (message, type = 'info') => {
    const id = ++toastIdCount;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  showConfirm: (options) => set({ confirmDialog: options }),
  hideConfirm: () => set({ confirmDialog: null }),
}));
