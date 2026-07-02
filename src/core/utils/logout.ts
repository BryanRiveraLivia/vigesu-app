import { deleteCookie } from "cookies-next";
import { useAuthStore } from "@/presentation/stores/useAuthStore";

export function performLogout() {
  deleteCookie("auth-token");
  useAuthStore.getState().logout();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
