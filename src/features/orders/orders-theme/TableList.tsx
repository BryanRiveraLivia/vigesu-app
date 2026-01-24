"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { VscOpenPreview } from "react-icons/vsc";
import ActionButton from "@/presentation/components/shared/tableButtons/ActionButton";
import { TableListProps } from "@/core/types/inspection/ITypes";
import {
  getTemplateInspections,
  TemplateInspection,
} from "../inspections/api/inspectionApi";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { slugify } from "@/core/utils/utils";
import Loading from "@/presentation/components/shared/Loading";

const TableList = ({ objFilter, setRefreshFlag }: TableListProps) => {
  const router = useRouter();
  const tToasts = useTranslations("toast");
  const tConfigs = useTranslations("configurations");
  const tGeneral = useTranslations("general");
  const pathname = usePathname();

  const [allData, setAllData] = useState<TemplateInspection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTemplateInspections(currentPage, objFilter.client);
      setAllData(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(`${tToasts("error")}: ${tToasts("msj.32")}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1); // Resetear página al aplicar filtros
  }, [objFilter]);

  useEffect(() => {
    fetchData();
  }, [currentPage, objFilter]);

  return (
    <div className="overflow-x-auto space-y-4">
      <table className="table table-fixed w-full">
        <thead>
          <tr>
            <th className="w-[70%] truncate">{tConfigs("report_form")}</th>
            <th className="w-[30%] truncate"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2} className="py-10 text-center">
                <Loading height="h-[200px]" />
              </td>
            </tr>
          ) : allData.length === 0 ? (
            <tr>
              <td colSpan={2} className="py-6 text-center">
                {tGeneral("no_records")}
              </td>
            </tr>
          ) : (
            allData.map((item) => (
              <tr
                key={item.templateInspectionId}
                className="cursor-pointer odd:bg-base-200"
                data-id={item.templateInspectionId}
              >
                <td className="truncate">{item.name}</td>
                <td className="flex items-center justify-end gap-2">
                  <ActionButton
                    icon={
                      <VscOpenPreview className="w-[20px] h-[20px] opacity-70" />
                    }
                    label={tGeneral("btnPreview")}
                    onClick={() =>
                      router.push(
                        `${pathname}/${item.templateInspectionId}/${slugify(item.name)}`,
                      )
                    }
                  />
                  <ActionButton
                    className="!hidden"
                    icon={<FiTrash2 className="w-[20px] h-[20px] opacity-70" />}
                    label={tGeneral("btnDelete")}
                    onClick={() =>
                      console.log("Delete", item.templateInspectionId)
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="join flex justify-center py-4">
        <button
          className="join-item btn font-normal"
          onClick={() => changePage(1)}
          disabled={currentPage === 1}
        >
          ««
        </button>
        <button
          className="join-item btn font-normal"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`join-item btn font-normal ${
              currentPage === idx + 1 ? "btn-active" : ""
            }`}
            onClick={() => changePage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="join-item btn font-normal"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
        <button
          className="join-item btn font-normal"
          onClick={() => changePage(totalPages)}
          disabled={currentPage === totalPages}
        >
          »»
        </button>
      </div>
    </div>
  );
};

export default TableList;
