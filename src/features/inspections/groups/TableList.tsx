"use client";

import { useEffect, useState } from "react";
import { IGroup } from "../models/GroupTypes";
import { TableListProps } from "@/shared/types/inspection/ITypes";
import { getInspectionStatusGroupsLabel } from "@/shared/utils/utils";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import ActionButton from "@/shared/components/shared/tableButtons/ActionButton";
import { FaRegEdit } from "react-icons/fa";
import GroupModal from "./create/GroupModal";
import Loading from "@/shared/components/shared/Loading";
import { formatApiErrorForToast } from "@/shared/utils/errors";
import { toast } from "sonner";

// Estructura que devuelve tu API de Group
interface GetGroupsResponse {
  items: IGroup[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const TableList = ({
  objFilter,
  refreshFlag,
  setRefreshFlag,
}: TableListProps) => {
  const [allData, setAllData] = useState<IGroup[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage));

  const handleSuccess = () => {
    setSelectedGroup(null);
    setShowModal(false);
    // forzamos refetch desde el padre
    setRefreshFlag((prev) => !prev);
  };

  // ==========================
  // 🔹 FETCH DATA (PAGINATION)
  // ==========================
  const fetchGroups = async (page = 1) => {
    setLoading(true);

    try {
      const params: Record<string, unknown> = {
        PageNumber: page,
        PageSize: rowsPerPage,
      };

      // Filtros enviados al backend
      if (objFilter.client) {
        // tu input "customer" realmente filtra por nombre
        params.Name = objFilter.client;
      }

      if (objFilter.status !== "") {
        params.Status = Number(objFilter.status);
      }

      const response = await axiosInstance.get<GetGroupsResponse>("/Group", {
        params,
      });

      const data = response.data;

      setAllData(data.items ?? []);
      setTotalRecords(data.totalCount ?? data.items?.length ?? 0);
    } catch (error) {
      //console.error("Error al cargar grupos", error);
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
      setAllData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ==========================
  // 🔹 EFFECTS
  // ==========================
  // Refetch cuando cambian filtros, refreshFlag, página o rowsPerPage
  useEffect(() => {
    fetchGroups(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objFilter, refreshFlag, currentPage, rowsPerPage]);

  // Cuando cambian filtros o rowsPerPage, regresamos a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [objFilter, rowsPerPage]);

  // ==========================
  // 🔹 VIEW
  // ==========================
  return (
    <>
      <div className="overflow-x-auto space-y-4">
        <table className="table table-fixed w-full">
          <thead>
            <tr>
              <th className="w-[50%] truncate">Group</th>
              <th className="w-[30%] truncate text-center">Status</th>
              <th className="w-[20%] truncate"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="py-10 text-center">
                  <Loading height="h-[200px]" />
                </td>
              </tr>
            ) : allData.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center">
                  No records found
                </td>
              </tr>
            ) : (
              allData.map((item) => (
                <tr
                  key={item.groupId}
                  className="cursor-pointer odd:bg-base-200"
                >
                  <td className="truncate">{item.name}</td>
                  <td className="text-center">
                    <div
                      className={`badge badge-dash ${
                        item.status === 0
                          ? "badge-success"
                          : item.status === 1
                            ? "badge-warning"
                            : "badge-neutral"
                      }`}
                    >
                      {getInspectionStatusGroupsLabel(item.status)}
                    </div>
                  </td>

                  <td className="text-right">
                    <ActionButton
                      icon={
                        <FaRegEdit className="w-[20px] h-[20px] opacity-70" />
                      }
                      label="Edit"
                      onClick={() => {
                        setSelectedGroup(item);
                        setShowModal(true);
                      }}
                    />
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

      {showModal && selectedGroup && (
        <GroupModal
          onClose={() => {
            setShowModal(false);
            setSelectedGroup(null);
          }}
          onSuccess={handleSuccess}
          editMode={true}
          defaultValue={selectedGroup.name}
          defaultStatus={selectedGroup.status}
          groupIdToEdit={selectedGroup.groupId}
        />
      )}
    </>
  );
};

export default TableList;
