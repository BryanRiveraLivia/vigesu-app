import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getLastPathSegmentFormatted } from "@/infrastructure/lib/utils";

/**
 * Hook que retorna el título de la página basado en el último segmento del pathname.
 */
export const usePageTitle = (): string => {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState<string>("");

  useEffect(() => {
    if (pathname) {
      const title = getLastPathSegmentFormatted(pathname);
      setPageTitle(title);
    }
  }, [pathname]);

  return pageTitle;
};
