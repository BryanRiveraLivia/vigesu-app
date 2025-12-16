"use client";

import { useEffect, useState } from "react";
import { getWorkOrders } from "./api/workOrdersApi";
import { WorkOrder, WorkOrderStatus } from "./models/workOrder.types";
import { FiTrash2, FiPrinter } from "react-icons/fi";
import { FaRegEdit, FaRegEye } from "react-icons/fa";
import { TableListProps } from "@/shared/types/order/ITypes";
import ActionButton from "@/shared/components/shared/tableButtons/ActionButton";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { IoMdCheckmark, IoMdSync } from "react-icons/io";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/shared/components/shared/Loading";
import { getWorkOrderStatusLabel } from "@/shared/utils/utils";
import { useTranslations } from "next-intl";

const REALM_ID = "9341454759827689";

const TableList = ({ objFilter, refreshSignal }: TableListProps) => {
  const tToasts = useTranslations("toast");
  const tGeneral = useTranslations("general");
  const t = useTranslations("workorders");

  const router = useRouter();
  const pathname = usePathname();

  const [syncStatus, setSyncStatus] = useState<
    Record<number, "idle" | "loading" | "success">
  >({});

  const [allData, setAllData] = useState<WorkOrder[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);

  // ==========================
  // 🔹 HELPERS
  // ==========================
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
  // 🔹 SYNCHRONIZATION LOGIC
  // ==========================
  const handleSyncWorkOrder = async (
    workOrderId: number,
    syncOnlyEstimate = false
  ) => {
    setSyncStatus((prev) => ({ ...prev, [workOrderId]: "loading" }));

    try {
      // 1) Crear estimate en backend
      const response = await axiosInstance.put(
        "/QuickBooks/CreateEstimateFromWorkOrder",
        { workOrderId }
      );

      const quickBookEstimatedId = response.data;

      if (!quickBookEstimatedId) {
        throw new Error("QuickBooks no devolvió un EstimateId válido.");
      }

      // 2) Adjuntar PDF (server-side via Next route)
      if (!syncOnlyEstimate) {
        await sendPdfToQuickBooks(Number(quickBookEstimatedId), workOrderId);
      }

      setSyncStatus((prev) => ({ ...prev, [workOrderId]: "success" }));

      setTimeout(async () => {
        setSyncStatus((prev) => {
          const updated = { ...prev };
          delete updated[workOrderId];
          return updated;
        });

        await fetchData(currentPage);
        toast.success(`${tToasts("ok")}: ${tToasts("msj.14")}`);
      }, 1200);
    } catch (err: any) {
      console.error("Sync error:", err);
      toast.error(`${tToasts("error")}: ${getErrorMessage(err)}`);
      setSyncStatus((prev) => ({ ...prev, [workOrderId]: "idle" }));
    }
  };

  const sendPdfToQuickBooks = async (
    quickBookEstimatedId: number,
    workOrderId: number
  ) => {
    // Este método YA NO envía multipart al backend directamente.
    // Lo hace por /api/quickbooks/attach-estimate-pdf (server-side).
    const auth = getAxiosAuthHeader();

    const res = await fetch("/api/quickbooks/attach-estimate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify({
        quickBookEstimateId: String(quickBookEstimatedId),
        workOrderId,
        type: "workorder",
        realmId: REALM_ID,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Adjuntar PDF falló (${res.status}): ${text}`);
    }

    toast.success(`${tToasts("ok")}: ${tToasts("msj.15")}`);
  };

  // ==========================
  // 🔹 FETCH DATA WITH PAGINATION
  // ==========================
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const filterSend = {
        ...objFilter,
        workorder: objFilter.workorder ? String(objFilter.workorder) : "",
      };

      const response = await getWorkOrders(filterSend, page, rowsPerPage);

      setAllData(response.items ?? []);
      setTotalRecords(response.totalCount ?? 0);
    } catch (err: any) {
      toast.error(`${tToasts("error")}: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // 🔹 UPDATE STATUS
  // ==========================
  const updateWorkOrderState = async (
    workOrderId: number,
    statusWorkOrder: number = WorkOrderStatus.Disabled
  ) => {
    try {
      await axiosInstance.put(
        `/WorkOrder/UpdateWorkOrderState/${workOrderId}`,
        {
          workOrderId,
          statusWorkOrder,
        }
      );

      fetchData(currentPage);
    } catch (err: any) {
      toast.error(`${tToasts("error")}: ${getErrorMessage(err)}`);
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

  const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage));

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
      <table className="table w-full">
        <thead>
          <tr>
            <th className="w-[8%]">{t("home.9")}</th>
            <th className="w-[18%]">{t("home.10")}</th>
            <th className="w-[18%] text-center">{t("home.11")}</th>
            <th className="w-[18%] text-center">{t("home.12")}</th>
            <th className="w-[18%] text-center">{t("home.13")}</th>
            <th className="w-[20%] text-center"></th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="py-10 text-center">
                <Loading />
              </td>
            </tr>
          ) : (
            allData.map((item) => (
              <tr
                key={item.workOrderId}
                className="cursor-pointer odd:bg-base-200"
              >
                <td>
                  <input type="checkbox" className="checkbox" />
                </td>

                <td
                  className="truncate"
                  onClick={() =>
                    router.push(`${pathname}/edit/${item.workOrderId}`)
                  }
                >
                  {item.customerName}
                </td>

                <td
                  className="truncate text-center"
                  onClick={() =>
                    router.push(`${pathname}/edit/${item.workOrderId}`)
                  }
                >
                  {item.employeeName}
                </td>

                <td className="text-center">
                  <div className="badge badge-neutral !hidden">
                    {getWorkOrderStatusLabel(item.statusWorkOrder)}
                  </div>

                  {item.statusWorkOrder === 0 && (
                    <div className="badge badge-dash badge-info whitespace-nowrap">
                      {getWorkOrderStatusLabel(item.statusWorkOrder)}
                    </div>
                  )}
                  {item.statusWorkOrder === 1 && (
                    <div className="badge badge-dash badge-error whitespace-nowrap">
                      {getWorkOrderStatusLabel(item.statusWorkOrder)}
                    </div>
                  )}
                  {item.statusWorkOrder === 2 && (
                    <div className="badge badge-dash badge-success whitespace-nowrap">
                      {getWorkOrderStatusLabel(item.statusWorkOrder)}
                    </div>
                  )}
                </td>

                <td className="text-center">
                  {item.statusWorkOrder !== 2 ? (
                    <div className="flex items-center justify-center">
                      {syncStatus[item.workOrderId] === "loading" ? (
                        <IoMdSync className="loading text-gray-500 text-3xl" />
                      ) : syncStatus[item.workOrderId] === "success" ? (
                        <IoMdCheckmark className="text-green-500 text-xl" />
                      ) : (
                        <input
                          type="checkbox"
                          className="checkbox"
                          onChange={() => handleSyncWorkOrder(item.workOrderId)}
                        />
                      )}
                    </div>
                  ) : (
                    <IoMdCheckmark className="text-green-500 text-xl mx-auto" />
                  )}
                </td>

                <td className="text-end">
                  <div className="flex flex-row justify-end gap-2">
                    {item.statusWorkOrder === 0 ? (
                      <ActionButton
                        icon={
                          <FaRegEdit className="w-[20px] h-[20px] opacity-70" />
                        }
                        label="Edit"
                        onClick={() =>
                          router.push(`${pathname}/edit/${item.workOrderId}`)
                        }
                      />
                    ) : (
                      <ActionButton
                        icon={
                          <FaRegEye className="w-[20px] h-[20px] opacity-70" />
                        }
                        label={tGeneral("btnWatch")}
                        onClick={() =>
                          router.push(`${pathname}/edit/${item.workOrderId}`)
                        }
                      />
                    )}

                    <ActionButton
                      icon={
                        <FiPrinter className="w-[20px] h-[20px] opacity-70" />
                      }
                      label={tGeneral("btnPrint")}
                      onClick={() =>
                        router.push(
                          `${pathname}/generate-pdf/${item.workOrderId}`
                        )
                      }
                    />

                    {item.statusWorkOrder !== 1 && (
                      <ActionButton
                        icon={
                          <FiTrash2 className="w-[20px] h-[20px] opacity-70" />
                        }
                        label={tGeneral("btnDelete")}
                        onClick={() => updateWorkOrderState(item.workOrderId)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATOR */}
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

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`join-item btn ${currentPage === idx + 1 ? "btn-active" : ""}`}
            onClick={() => changePage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}

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
