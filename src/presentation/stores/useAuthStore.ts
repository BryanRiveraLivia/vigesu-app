import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId: number | null;
  userName: string | null;
  employeeId: string | null;
  employeeName: string | null;
  rol: number | null;
  status: number | null;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (payload: { token?: string; user?: Partial<User> }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) =>
        set({
          token: token ?? null,
          user: {
            userId: user?.userId ?? null,
            userName: user?.userName ?? null,
            employeeId: user?.employeeId ?? null,
            employeeName: user?.employeeName ?? null,
            rol: user?.rol ?? null,
            status: user?.status ?? null,
          },
        }),
      logout: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
