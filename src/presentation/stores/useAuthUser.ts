import { useAuthStore } from "@/presentation/stores/useAuthStore";
import { getCookie } from "cookies-next";

export const useAuthUser = () => {
  const user = useAuthStore((state) => state.user);
  // El token vive en la cookie httpOnly, no en el store
  const token = getCookie("auth-token") as string | undefined;

  return {
    token: token ?? null,
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
