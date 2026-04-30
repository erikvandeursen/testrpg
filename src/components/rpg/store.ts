import { create } from "zustand";
import type { BuildName, CharacterStore } from "@/types/builds";

const initial = {
  name: "",
  level: 1,
  build: "thief" as BuildName,
  strength: 1,
  agility: 1,
  wisdom: 1,
  magic: 1,
  berserk: false,
};

export const useStore = create<CharacterStore>((set) => ({
  ...initial,
  setName: (name) => set((state) => ({ ...state, name })),
  setLevel: (level) => set((state) => ({ ...state, level })),
  setBuild: (build) => set((state) => ({ ...state, build })),
  setStats: (strength, agility, wisdom, magic) =>
    set((state) => ({ ...state, strength, agility, wisdom, magic })),
  increaseLevel: () =>
    set((state) => {
      const addition = state.berserk ? 10 : 1;
      return {
        ...state,
        level: Math.min(5, state.level + 1),
        strength: Math.min(10, state.strength + addition),
        agility: Math.min(10, state.agility + addition),
        wisdom: Math.min(10, state.wisdom + addition),
        magic: Math.min(10, state.magic + addition),
      };
    }),
  activateBerserk: () => set((state) => ({ ...state, berserk: true })),
  reset: () => set(() => ({ ...initial })),
}));
