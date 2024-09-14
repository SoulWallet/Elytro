import { create } from "zustand";

interface AppState {
  count: number;
  increment: () => void;
}

const useStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

export default useStore;
