import { create } from "zustand";

type TimeSelection = {
  mode: "single" | "range";
  selected: number | [number, number];
  setMode: (mode: "single" | "range") => void;
  setSelected: (value: number | [number, number]) => void;
};

export const useTimeStore = create<TimeSelection>((set) => ({
  mode: "single",
  selected: 360,
  setMode: (mode) =>
    set((state) => ({
      mode,
      selected: mode === "range" ? [340, 380] : 360, // ✅ fix here
    })),
  setSelected: (value) => set({ selected: value }),
}));