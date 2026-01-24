// ... imports
import { useState, useEffect } from "react";
// Domain Entities
import {
  Group,
  GroupStatusEnum,
  GroupStatusLabel,
} from "@/core/domain/entities/group.entity";
// Presentation Hook
import { useGroups } from "@/presentation/hooks/groups/useGroups";
// Shared UI
import { TableListProps } from "@/core/types/inspection/ITypes";
// import { getInspectionStatusGroupsLabel } from "@/core/utils/utils"; // Removed in favor of entity label or mapping
import ActionButton from "@/presentation/components/shared/tableButtons/ActionButton";
import { FaRegEdit } from "react-icons/fa";
import GroupModal from "./create/GroupModal";
import Loading from "@/presentation/components/shared/Loading";

const TableList = ({
  objFilter,
  refreshFlag,
  setRefreshFlag,
}: TableListProps) => {
  // Local state for pagination managed here, but data fetching delegated to hook
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Could be dynamic if needed

  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Hook Usage
  const { groups, loading, totalPages, refresh } = useGroups({
    page: currentPage,
    pageSize: rowsPerPage,
    name: objFilter.client,
    status: objFilter.status,
  });

  // Effect to trigger refresh when parent asks (refreshFlag changes)
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [objFilter, rowsPerPage]);

  const handleSuccess = () => {
    setSelectedGroup(null);
    setShowModal(false);
    setRefreshFlag((prev) => !prev); // Notify parent or just trigger hook refresh internally
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center">
                  No records found
                </td>
              </tr>
            ) : (
              groups.map((item) => (
                <tr
                  key={item.groupId}
                  className="cursor-pointer odd:bg-base-200"
                >
                  <td className="truncate">{item.name}</td>
                  <td className="text-center">
                    <div
                      className={`badge badge-dash ${
                        item.status === GroupStatusEnum.Active
                          ? "badge-success"
                          : item.status === GroupStatusEnum.Inactive
                            ? "badge-warning"
                            : "badge-neutral"
                      }`}
                    >
                      {/* Using domain label mapping directly or utility function if needed */}
                      {GroupStatusLabel[item.status] ?? "Unknown"}
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
        {/* ... pagination (kept same structure mostly) ... */}

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
