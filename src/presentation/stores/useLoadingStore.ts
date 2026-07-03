import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LoadingStore {
  isLoading: boolean;
  loadingLabel?: string;
  setLoading: (state: boolean, label?: string) => void;
  toggleLoading: () => void;
}

export const useLoadingStore = create<LoadingStore>()(
  devtools((set) => ({
    isLoading: false,
    loadingLabel: undefined,
    setLoading: (state, label) =>
      set({
        isLoading: state,
        loadingLabel: label ?? undefined,
      }),
    toggleLoading: () =>
      set((prev) => ({
        isLoading: !prev.isLoading,
      })),
  }))
);
