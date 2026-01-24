"use client";

import { FC, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { axiosInstance } from "@/core/utils/axiosInstance";
import { FaRegEdit } from "react-icons/fa";
import ActionButton from "@/presentation/components/shared/tableButtons/ActionButton";
import UserModal from "./create/UserModal";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/presentation/components/shared/Loading";
import { IUser, GetUsersResponse } from "./types/user.api";

interface Props {
  objFilter: {
    userName: string;
    employeeName: string;
    rol: string;
    employeeId: string;
  };
  refreshFlag: boolean;
}

const UserTable: FC<Props> = ({ objFilter, refreshFlag }) => {
  const tUsers = useTranslations("users");
  const tGeneral = useTranslations("general");
  const router = useRouter();
  const pathname = usePathname();

  const [users, setUsers] = useState<IUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [localRefreshFlag, setLocalRefreshFlag] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  // ==========================
  // 🔹 FETCH DATA (PAGINATION)
  // ==========================
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        PageNumber: page,
        PageSize: rowsPerPage,
      };

      // Filtros enviados al backend (ajusta nombres si tu API usa otros)
      if (objFilter.userName) {
        params.UserName = objFilter.userName;
      }

      if (objFilter.employeeName) {
        params.EmployeeName = objFilter.employeeName;
      }

      if (objFilter.employeeId) {
        params.EmployeeId = objFilter.employeeId;
      }

      if (objFilter.rol) {
        params.Rol = Number(objFilter.rol);
      }

      const res = await axiosInstance.get<GetUsersResponse>("/User", {
        params,
      });

      const data = res.data;

      setUsers(data.items ?? []);
      setTotalCount(data.totalCount ?? data.items?.length ?? 0);
    } catch (err) {
      console.error("Error cargando usuarios", err);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setSelectedUser(null);
    setLocalRefreshFlag((prev) => !prev);
  };

  // ==========================
  // 🔹 EFFECTS
  // ==========================
  useEffect(() => {
    fetchUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objFilter, refreshFlag, localRefreshFlag, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [objFilter, rowsPerPage]);

  // ==========================
  // 🔹 VIEW
  // ==========================
  return (
    <div className="overflow-x-auto space-y-4">
      <table className="table table-fixed w-full">
        <thead>
          <tr>
            <th className="truncate">{tUsers("username")}</th>
            <th className="truncate">{tUsers("employee_name")}</th>
            <th className="truncate">{tUsers("role")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="py-10 text-center">
                <Loading height="h-[200px]" />
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center">
                {tGeneral("no_records")}
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.userId} className="cursor-pointer odd:bg-base-200">
                <td>{user.userName}</td>
                <td>{user.employeeName}</td>
                <td>{user.rol}</td>
                <td className="text-right">
                  <ActionButton
                    icon={
                      <FaRegEdit className="w-[20px] h-[20px] opacity-70" />
                    }
                    label={tGeneral("edit")}
                    onClick={() => {
                      router.push(`${pathname}/edit/${user.userId}`);
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

      {showModal && (
        <UserModal
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSuccess={handleSuccess}
          editMode={!!selectedUser}
          defaultData={
            selectedUser
              ? {
                  ...selectedUser,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default UserTable;
