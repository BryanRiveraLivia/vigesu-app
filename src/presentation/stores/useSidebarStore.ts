import { create } from "zustand";
import { SidebarState } from "@/core/types/TGeneral";

export const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen: false,

  openSidebar: () => set({ isSidebarOpen: true }),

  closeSidebar: () => set({ isSidebarOpen: false }),

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
