import { usePathname } from "next/navigation";
import { getLastPathSegmentFormatted } from "@/infrastructure/lib/utils";

/**
 * Hook que retorna el título de la página basado en el último segmento del pathname.
 */
export const usePageTitle = (): string => {
  const pathname = usePathname();
  return getLastPathSegmentFormatted(pathname ?? "");
};
