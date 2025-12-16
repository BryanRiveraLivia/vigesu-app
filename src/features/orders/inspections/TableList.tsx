"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import ActionButton from "@/shared/components/shared/tableButtons/ActionButton";
import Loading from "@/shared/components/shared/Loading";
import { FaRegEye } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { getInspections } from "./api/inspectionApi";
import { IInspectionItem } from "./models/inspection.types";
import { formatDate } from "@/shared/utils/utils";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import {
  TypeInspectionOrders,
  TypeInspectionOrdersLabel,
} from "../models/workOrder.types";
import clsx from "clsx";
import { IoMdCheckmark, IoMdSync } from "react-icons/io";
import { useTranslations } from "next-intl";
import { formatApiErrorForToast } from "@/shared/utils/errors";

interface TableListProps {
  objFilter: { name: string };
}

const REALM_ID = "9341454759827689";

const TableList = ({ objFilter }: TableListProps) => {
  const tToasts = useTranslations("toast");
  const t = useTranslations("inspections");

  const router = useRouter();
  const pathname = usePathname();

  const [allData, setAllData] = useState<IInspectionItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);

  const [syncStatus, setSyncStatus] = useState<
    Record<number, "idle" | "loading" | "success">
  >({});

  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  // ==========================
  // 🔹 HELPERS
  // ==========================
  const getBadgeClass = (
    status: TypeInspectionOrders | null | undefined
  ): string => {
    switch (status) {
      case TypeInspectionOrders.Create:
      case TypeInspectionOrders.SyncQuickbook:
        return "badge badge-dash badge-success";
      case TypeInspectionOrders.PreAccepted:
      case TypeInspectionOrders.Accepted:
        return "badge badge-dash badge-warning";
      case TypeInspectionOrders.Disabled:
        return "badge badge-dash badge-error";
      default:
        return "badge badge-dash badge-neutral";
    }
  };

  const getAxiosAuthHeader = () => {
    const h =
      (axiosInstance.defaults.headers as any)?.common?.Authorization ||
      (axiosInstance.defaults.headers as any)?.Authorization ||
      "";
    return typeof h === "string" ? h : "";
  };

  const getErrorMessage = (err: any) => {
    return (
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      String(err)
    );
  };

  // ==========================
  // 🔹 FETCH DATA (PAGINATION)
  // ==========================
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const { items, totalCount: total } = await getInspections({
        PageNumber: page,
        PageSize: rowsPerPage,
        Name: objFilter.name,
      });

      setAllData(items ?? []);
      setTotalCount(total ?? 0);
    } catch (error) {
      /* console.error(error);
      toast.error(`${tToasts("error")}: ${tToasts("msj.21")}`);*/
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // 🔹 QUICKBOOKS SYNC (SERVER-SIDE PDF ATTACH)
  // ==========================
  const attachPdfToQuickBooks = async (params: {
    quickBookEstimateId: string;
    workOrderId: number; // aquí se usa para el id del pdf (workorder o inspection)
    type: "workorder" | "liftgate";
  }) => {
    const auth = getAxiosAuthHeader();

    const res = await fetch("/api/quickbooks/attach-estimate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify({
        quickBookEstimateId: params.quickBookEstimateId,
        workOrderId: params.workOrderId,
        type: params.type,
        realmId: REALM_ID,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Adjuntar PDF falló (${res.status}): ${text}`);
    }
  };

  const handleSyncWorkOrder = async (
    inspectionId: number,
    syncOnlyEstimate = false
  ) => {
    setSyncStatus((prev) => ({ ...prev, [inspectionId]: "loading" }));

    try {
      // 1) Crear WorkOrder desde la inspección
      const { data: workOrderId } = await axiosInstance.post<number>(
        `/Inspection/CreateWorkOrdeFromInspection/${inspectionId}`,
        { inspectionId }
      );

      if (typeof workOrderId !== "number" || Number.isNaN(workOrderId)) {
        throw new Error("No se obtuvo un workOrderId válido.");
      }

      // 2) Crear Estimate en QuickBooks
      const { data: quickBookEstimateId } = await axiosInstance.put<string>(
        "/QuickBooks/CreateEstimateFromWorkOrder",
        { workOrderId }
      );

      if (!quickBookEstimateId) {
        throw new Error("No se obtuvo un quickBookEstimateId válido.");
      }

      // 3) Adjuntar PDF WorkOrder (server-side)
      if (!syncOnlyEstimate) {
        await attachPdfToQuickBooks({
          quickBookEstimateId: String(quickBookEstimateId),
          workOrderId,
          type: "workorder",
        });
      }

      // 4) Actualizar inspección con QuickBooks Estimate Id
      await axiosInstance.put(
        "/QuickBooks/CreateEstimateFromInspection",
        {
          inspectionId,
          quickBookEstimateId: String(quickBookEstimateId),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // 5) Adjuntar PDF Inspección (server-side)
      if (!syncOnlyEstimate) {
        await attachPdfToQuickBooks({
          quickBookEstimateId: String(quickBookEstimateId),
          workOrderId: inspectionId, // el pdf route usa /api/pdf/[id]?type=liftgate
          type: "liftgate",
        });
      }

      setSyncStatus((prev) => ({ ...prev, [inspectionId]: "success" }));

      setTimeout(async () => {
        setSyncStatus((prev) => {
          const updated = { ...prev };
          delete updated[inspectionId];
          return updated;
        });

        await fetchData(currentPage);
        toast.success(`${tToasts("ok")}: ${tToasts("msj.14")}`);
      }, 800);
    } catch (error: any) {
      console.error("Error al sincronizar:", error);
      toast.error(`${tToasts("error")}: ${getErrorMessage(error)}`);
      setSyncStatus((prev) => ({ ...prev, [inspectionId]: "idle" }));
    }
  };

  // ==========================
  // 🔹 DELETE
  // ==========================
  const deleteTypeInspection = async (inspectionId: number) => {
    try {
      const payload = {
        inspectionId,
        status: TypeInspectionOrders.Disabled,
      };

      await axiosInstance.put(
        `/Inspection/UpdateInspectionState/${inspectionId}`,
        payload
      );

      toast.success(`${tToasts("ok")}: ${tToasts("msj.23")}`);
      fetchData(currentPage);
    } catch (error) {
      /* console.error(error);
      toast.error(`${tToasts("error")}: ${tToasts("msj.24")}`);*/
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    }
  };

  // ==========================
  // 🔹 EFFECTS
  // ==========================
  useEffect(() => {
    fetchData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objFilter, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [objFilter, rowsPerPage]);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ==========================
  // 🔹 VIEW
  // ==========================
  return (
    <div className="overflow-x-auto space-y-4">
      <table className="table table-fixed w-full">
        <thead>
          <tr>
            <th className="w-[5%] truncate">{t("home.5")}</th>
            <th className="w-[15%] truncate">{t("home.6")}</th>
            <th className="w-[15%] truncate">{t("home.7")}</th>
            <th className="w-[15%] truncate">{t("home.8")}</th>
            <th className="w-[20%] text-center truncate">{t("home.9")}</th>
            <th className="w-[10%] truncate">{t("home.10")}</th>
            <th className="w-[20%] truncate"></th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="py-10 text-center">
                <Loading height="h-[200px]" />
              </td>
            </tr>
          ) : (
            allData.map((item) => {
              const status = Number(
                item.statusInspection
              ) as TypeInspectionOrders;

              return (
                <tr
                  key={item.inspectionId}
                  className="cursor-pointer odd:bg-base-200"
                  data-url={`${pathname}/generate-pdf/${item?.templateInspectionId}/${item?.inspectionId}`}
                >
                  <td className="truncate">{item.inspectionNumber}</td>
                  <td className="truncate">{item.customerName}</td>
                  <td className="truncate">{item.employeeName}</td>
                  <td className="truncate">
                    {formatDate(item.dateOfInspection)}
                  </td>

                  {/* Sync QuickBooks */}
                  <td className="text-center">
                    {status !== TypeInspectionOrders.SyncQuickbook ? (
                      <div className="flex items-center justify-center">
                        {syncStatus[item.inspectionId] === "loading" ? (
                          <IoMdSync className="loading text-gray-500 text-3xl" />
                        ) : syncStatus[item.inspectionId] === "success" ? (
                          <IoMdCheckmark className="text-green-500 text-xl" />
                        ) : (
                          <input
                            type="checkbox"
                            className="checkbox"
                            onChange={() =>
                              handleSyncWorkOrder(item.inspectionId)
                            }
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <IoMdCheckmark className="text-green-500 text-xl text-center" />
                      </div>
                    )}
                  </td>

                  {/* Estado (badge) */}
                  <td>
                    <div className={clsx(getBadgeClass(status), "truncate")}>
                      {TypeInspectionOrdersLabel[status] ?? "Sin estado"}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="flex justify-end gap-2">
                    <ActionButton
                      icon={
                        <FaRegEye className="w-[20px] h-[20px] opacity-70" />
                      }
                      label={t("home.11")}
                      onClick={() =>
                        router.push(
                          `${pathname}/generate-pdf/${item?.templateInspectionId}/${item?.inspectionId}`
                        )
                      }
                    />

                    {status !== TypeInspectionOrders.Disabled && (
                      <ActionButton
                        icon={
                          <FiTrash2 className="w-[20px] h-[20px] opacity-70" />
                        }
                        label={t("home.12")}
                        onClick={() => deleteTypeInspection(item.inspectionId)}
                      />
                    )}
                  </td>
                </tr>
              );
            })
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
              className={`join-item btn ${currentPage === page ? "btn-active" : ""}`}
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
