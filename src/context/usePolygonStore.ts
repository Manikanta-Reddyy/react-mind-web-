import { create } from "zustand";

export type Rule = {
  operator: string;
  value: number;
  color: string;
};

type PolygonConfig = {
  dataSource: string;
  field: string;
  rules: Rule[];
};

type Store = {
  selectedId: string | null;
  polygonConfigs: Record<string, PolygonConfig>;
  setSelectedId: (id: string | null) => void;
  updateConfig: (id: string, config: PolygonConfig) => void;
};

export const usePolygonStore = create<Store>((set) => ({
  selectedId: null,
  polygonConfigs: {},
  setSelectedId: (id) => set({ selectedId: id }),
  updateConfig: (id, config) =>
    set((state) => ({
      polygonConfigs: { ...state.polygonConfigs, [id]: config },
    })),
}));