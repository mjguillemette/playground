import type { StateCreator } from "zustand";

export interface AppSlice {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  theme: "dark",
  sidebarOpen: false,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
});
