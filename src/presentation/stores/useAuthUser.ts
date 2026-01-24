import { useAuthStore } from "@/presentation/stores/useAuthStore";

export const useAuthUser = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  return {
    token,
    isAuthenticated: !!token && !!user,
    user,

    // Accesos directos
    userId: user?.userId ?? null,
    userName: user?.userName ?? null,
    employeeId: user?.employeeId ?? null,
    employeeName: user?.employeeName ?? null,
    rol: user?.rol ?? null,
    status: user?.status ?? null,
  };
};
