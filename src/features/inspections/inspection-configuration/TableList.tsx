// Tabla dinámica para Inspections Configuration con API real
"use client";

import { useEffect, useState } from "react";
import { TableListProps } from "@/core/types/inspection/ITypes";
import ActionButton from "@/presentation/components/shared/tableButtons/ActionButton";
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { getTypeInspections } from "@/features/inspections/inspection-configuration/api/typeInspectionApi";
import { ITypeInspectionItem } from "./models/typeInspection";
import { toast } from "sonner";
import { getInspectionStatusLabel } from "@/core/utils/utils";
import Loading from "@/presentation/components/shared/Loading";
import { usePathname, useRouter } from "next/navigation";
import { axiosInstance } from "@/core/utils/axiosInstance";
import { useTranslations } from "next-intl";

const TableList = ({ objFilter }: TableListProps) => {
  const tToasts = useTranslations("toast");
  const router = useRouter();
  const pathname = usePathname();

  const [allData, setAllData] = useState<ITypeInspectionItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  // ==========================
  // 🔹 FETCH DATA (PAGINATION)
  // ==========================
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const { items, totalCount: total } = await getTypeInspections({
        Name: objFilter.name, // según Swagger
        PageNumber: page,
        PageSize: rowsPerPage,
      });

      const mappedItems: ITypeInspectionItem[] = (items ?? []).map((item) => ({
        typeInspectionId: item.typeInspectionId,
        templateInspectionId: item.templateInspectionId,
        customerId: item.customerId,
        name: item.name,
        description: item.description,
        status: item.status,
      }));

      setAllData(mappedItems);
      setTotalCount(total ?? mappedItems.length);
    } catch (error) {
      console.error(error);
      toast.error(`${tToasts("error")}: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const deleteTypeInspection = async (id: number) => {
    try {
      setLoading(true);

      await axiosInstance.put(
        `/TypeInspection/UpdateTypeInspectionState/${id}`,
        {
          typeInspectionId: id,
        },
      );

      toast.success(`${tToasts("ok")}: ${tToasts("msj.4")}`);
      await fetchData(currentPage);
    } catch (error) {
      console.error(error);
      toast.error(`${tToasts("error")}: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // 🔹 EFFECTS
  // ==========================
  useEffect(() => {
    fetchData(currentPage);
  }, [objFilter, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [objFilter, rowsPerPage]);

  // ==========================
  // 🔹 VIEW
  // ==========================
  const tGeneral = useTranslations("general");
  const tStatus = useTranslations("inspection_status");

  return (
    <div className="overflow-x-auto space-y-4">
      <table className="table table-fixed w-full">
        <thead>
          <tr>
            <th className="w-[25%] truncate">{tGeneral("name")}</th>
            <th className="w-[30%] truncate">{tGeneral("description")}</th>
            <th className="w-[15%] truncate">{tGeneral("status")}</th>
            <th className="w-[20%] truncate"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="py-10 text-center">
                <Loading height="h-[200px]" />
              </td>
            </tr>
          ) : allData.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center">
                {tGeneral("no_records")}
              </td>
            </tr>
          ) : (
            allData.map((item) => (
              <tr
                key={item.typeInspectionId}
                className="cursor-pointer odd:bg-base-200"
              >
                <td className="truncate">{item.name}</td>
                <td className="truncate">{item.description}</td>
                <td className="text-center">
                  {item.status === 0 && (
                    <div className="badge badge-dash badge-success mx-auto whitespace-nowrap">
                      {tStatus("0")}
                    </div>
                  )}
                  {item.status === 1 && (
                    <div className="badge badge-dash badge-error mx-auto whitespace-nowrap">
                      {tStatus("1")}
                    </div>
                  )}
                </td>
                <td className="flex items-center gap-2 justify-end">
                  <ActionButton
                    icon={
                      <FaRegEdit className="w-[20px] h-[20px] opacity-70" />
                    }
                    label={tGeneral("edit")}
                    onClick={() =>
                      router.push(`${pathname}/edit/${item.typeInspectionId}`)
                    }
                  />
                  {item.status !== 1 && (
                    <ActionButton
                      icon={
                        <FiTrash2 className="w-[20px] h-[20px] opacity-70" />
                      }
                      label={tGeneral("delete")}
                      onClick={() =>
                        deleteTypeInspection(item.typeInspectionId)
                      }
                    />
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="join flex justify-center py-4">
        <button
          className="join-item btn"
          onClick={() => changePage(1)}
          disabled={currentPage === 1}
        >
          ««
        </button>

        <button
          className="join-item btn"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>

        {Array.from({ length: totalPages }, (_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={`page-${page}`}
              className={`join-item btn ${
                currentPage === page ? "btn-active" : ""
              }`}
              onClick={() => changePage(page)}
            >
              {page}
            </button>
          );
        })}

        <button
          className="join-item btn"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>

        <button
          className="join-item btn"
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
