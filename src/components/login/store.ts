import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginStore {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set(() => ({ isLoggedIn: true })),
      logout: () => set(() => ({ isLoggedIn: false })),
    }),
    { name: "login-store" },
  ),
);
