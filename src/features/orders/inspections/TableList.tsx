"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import ActionButton from "@/presentation/components/shared/tableButtons/ActionButton";
import Loading from "@/presentation/components/shared/Loading";
import { FaRegEye } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { getInspections } from "./api/inspectionApi";
import { QB_REALM_ID } from "@/core/config/constants";
import { IInspectionItem } from "./models/inspection.types";
import { formatDate } from "@/core/utils/utils";
import { axiosInstance } from "@/core/utils/axiosInstance";
import {
  TypeInspectionOrders,
  TypeInspectionOrdersLabel,
} from "../models/workOrder.types";
import clsx from "clsx";
import { IoMdCheckmark, IoMdSync } from "react-icons/io";
import { useTranslations } from "next-intl";
import { TableListProps } from "./TableList.types";
import { CARGAR_DEMO, getDemoInspectionsList } from "./utils/demoData";

const TableList = ({ objFilter, refreshSignal }: TableListProps) => {
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
    status: TypeInspectionOrders | null | undefined,
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

      let finalItems = items ?? [];
      let finalTotal = total ?? 0;

      if (CARGAR_DEMO) {
        const demoItems = getDemoInspectionsList();
        const filteredDemo = demoItems.filter((d) => {
          if (!objFilter.name && !objFilter.client) return true;
          const search = (objFilter.name || objFilter.client).toLowerCase();
          return (
            d.customerName.toLowerCase().includes(search) ||
            d.inspectionNumber.toLowerCase().includes(search)
          );
        });
        finalItems = [...filteredDemo, ...finalItems];
        finalTotal += filteredDemo.length;
      }

      setAllData(finalItems);
      setTotalCount(finalTotal);
    } catch (error) {
      console.error(error);
      toast.error(`${tToasts("error")}: ${tToasts("msj.21")}`);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // 🔹 QUICKBOOKS SYNC
  // ==========================
  const sendWorkOrderPdfToQuickBooks = async (
    quickBookEstimateId: string,
    workOrderId: number,
  ) => {
    const resp = await fetch(`/api/pdf/${workOrderId}?type=workorder`);
    if (!resp.ok) throw new Error("No se pudo generar el PDF del WorkOrder");

    const pdfBlob = await resp.blob();
    const file = new File([pdfBlob], `WorkOrder-${workOrderId}.pdf`, {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("QuickBookEstimateId", quickBookEstimateId);
    formData.append("FilePdf", file);
    formData.append("RealmId", QB_REALM_ID);

    await axiosInstance.post(
      `/QuickBooks/estimates/attachmentPDF?RealmId=${QB_REALM_ID}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  };

  const sendInspectionPdfToQuickBooks = async (
    quickBookEstimateId: string,
    inspectionId: number,
  ) => {
    const resp = await fetch(`/api/pdf/${inspectionId}?type=liftgate`);
    if (!resp.ok) throw new Error("No se pudo generar el PDF de la Inspección");

    const pdfBlob = await resp.blob();
    const file = new File([pdfBlob], `Inspection-${inspectionId}.pdf`, {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("QuickBookEstimateId", quickBookEstimateId);
    formData.append("FilePdf", file);
    formData.append("RealmId", QB_REALM_ID);

    await axiosInstance.post(
      `/QuickBooks/estimates/attachmentPDF?RealmId=${QB_REALM_ID}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  };

  const handleSyncWorkOrder = async (
    inspectionId: number,
    syncOnlyEstimate = false,
  ) => {
    if (inspectionId < 0) {
      setSyncStatus((prev) => ({ ...prev, [inspectionId]: "loading" }));
      setTimeout(() => {
        setSyncStatus((prev) => {
          const updated = { ...prev };
          delete updated[inspectionId];
          return updated;
        });
        setAllData((prev) =>
          prev.map((item) =>
            item.inspectionId === inspectionId
              ? { ...item, statusInspection: TypeInspectionOrders.SyncQuickbook }
              : item
          )
        );
        toast.success(`${tToasts("ok")}: ${tToasts("msj.14")} (DEMO)`);
      }, 800);
      return;
    }
    setSyncStatus((prev) => ({ ...prev, [inspectionId]: "loading" }));
    try {
      // 1) Crear WorkOrder desde la inspección
      const { data: workOrderId } = await axiosInstance.post<number>(
        `/Inspection/CreateWorkOrdeFromInspection/${inspectionId}`,
        { inspectionId },
      );
      if (typeof workOrderId !== "number") {
        throw new Error("No se obtuvo un workOrderId válido.");
      }

      // 2) Crear Estimate en QuickBooks
      const { data: quickBookEstimateId } = await axiosInstance.put<string>(
        "/QuickBooks/CreateEstimateFromWorkOrder",
        { workOrderId },
      );
      if (!quickBookEstimateId) {
        throw new Error("No se obtuvo un quickBookEstimateId válido.");
      }

      // 3) Adjuntar PDF WorkOrder
      if (!syncOnlyEstimate) {
        await sendWorkOrderPdfToQuickBooks(quickBookEstimateId, workOrderId);
      }

      // 4) Actualizar inspección con QuickBooks Estimate Id
      await axiosInstance.put(
        "/QuickBooks/CreateEstimateFromInspection",
        {
          inspectionId,
          quickBookEstimateId: String(quickBookEstimateId),
        },
        { headers: { "Content-Type": "application/json" } },
      );

      // 5) Adjuntar PDF Inspección
      if (!syncOnlyEstimate) {
        await sendInspectionPdfToQuickBooks(quickBookEstimateId, inspectionId);
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
    } catch (error) {
      console.error("Error al sincronizar:", error);
      toast.error(`${tToasts("error")}: ${tToasts("msj.22")}`);
      setSyncStatus((prev) => ({ ...prev, [inspectionId]: "idle" }));
    }
  };

  // ==========================
  // 🔹 DELETE
  // ==========================
  const deleteTypeInspection = async (inspectionId: number) => {
    if (inspectionId < 0) {
      setAllData((prev) => prev.filter((item) => item.inspectionId !== inspectionId));
      setTotalCount((prev) => Math.max(0, prev - 1));
      toast.success(`${tToasts("ok")}: ${tToasts("msj.23")} (DEMO)`);
      return;
    }
    try {
      const payload = {
        inspectionId,
        status: TypeInspectionOrders.Disabled,
      };

      await axiosInstance.put(
        `/Inspection/UpdateInspectionState/${inspectionId}`,
        payload,
      );

      toast.success(`${tToasts("ok")}: ${tToasts("msj.23")}`);
      fetchData(currentPage);
    } catch (error) {
      console.error(error);
      toast.error(`${tToasts("error")}: ${tToasts("msj.24")}`);
    }
  };

  // ==========================
  // 🔹 EFFECTS
  // ==========================
  useEffect(() => {
    fetchData(currentPage);
  }, [objFilter, refreshSignal, currentPage, rowsPerPage]);

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
                item.statusInspection,
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
                          `${pathname}/generate-pdf/${item?.templateInspectionId}/${item?.inspectionId}`,
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
