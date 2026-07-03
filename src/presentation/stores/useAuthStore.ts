import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  userId: number | null;
  userName: string | null;
  employeeId: string | null;
  employeeName: string | null;
  rol: number | null;
  status: number | null;
}

interface AuthStore {
  user: User | null;
  // token vive SOLO en la cookie httpOnly "auth-token", nunca en localStorage
  setAuth: (payload: { token?: string; user?: Partial<User> }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setAuth: ({ user }) =>
        set({
          user: user
            ? {
                userId: user.userId ?? null,
                userName: user.userName ?? null,
                employeeId: user.employeeId ?? null,
                employeeName: user.employeeName ?? null,
                rol: user.rol ?? null,
                status: user.status ?? null,
              }
            : null,
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
