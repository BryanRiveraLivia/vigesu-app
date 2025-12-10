"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import BackButton from "@/shared/components/shared/BackButton";
import PDFViewer from "@/shared/components/shared/PDFViewer";
import { deslugify } from "@/shared/utils/utils";
import { DOMAIN } from "@/config/constants";
import { axiosInstance } from "@/shared/utils/axiosInstance";

import { useTranslations } from "next-intl";

interface TemplateInspectionItem {
  templateInspectionId: number;
  name: string;
  filePath: string;
}

interface TemplateInspectionResponse {
  items: TemplateInspectionItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const Page = () => {
  const pathname = usePathname();
  const params = useParams<{ id: string; slug: string }>();
  const id = Number(params?.id);
  const t = useTranslations("configurations");
  const tGeneral = useTranslations("general");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<TemplateInspectionItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axiosInstance.get<TemplateInspectionResponse>(
          "/TemplateInspection"
        );

        if (!isMounted) return;
        setItems(data.items ?? []);
      } catch {
        if (!isMounted) return;
        setError(t("error_loading"));
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const match = useMemo(
    () => items.find((it) => it.templateInspectionId === id),
    [items, id]
  );

  const pdfUrl = useMemo(() => {
    if (!match?.filePath) return null;

    // el backend devuelve "Templates/...", le anteponemos uploads/
    const path = match.filePath.startsWith("uploads/")
      ? match.filePath
      : `uploads/${match.filePath}`;

    // construye la URL absoluta correctamente
    const normalizedDomain = DOMAIN.endsWith("/") ? DOMAIN : `${DOMAIN}/`;
    return `${normalizedDomain}${path}`;
  }, [match]);
  console.log("pdfUrl:", pdfUrl);
  return (
    <div className="gap-4 flex flex-col min-h-full">
      <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
        <BackButton link="../" title={deslugify(params?.slug)} />
        <div className="flex flex-row gap-2">
          <button className="btn bg-red-600 rounded-full pr-3 py-6 !hidden sm:flex items-center justify-center border-none">
            <FiTrash2 className="text-xl text-white" />
            <span className="bg-red-500 py-1 px-4 text-white font-normal rounded-full hidden md:block text-[13px] ">
              {tGeneral("btnDelete")}
            </span>
          </button>
        </div>
      </div>

      <div className="boddy-app overflow-y-auto">
        <div className="container mt-0 max-w-full">
          {loading && (
            <div className="p-6 text-sm opacity-70">
              {t("loading_template")}
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-error my-4">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && !match && (
            <div className="alert my-4">
              <span>
                {t("not_found")} <b>{id}</b>.
              </span>
            </div>
          )}

          {!loading && !error && match && pdfUrl && <PDFViewer file={pdfUrl} />}
        </div>
      </div>
    </div>
  );
};

export default Page;
