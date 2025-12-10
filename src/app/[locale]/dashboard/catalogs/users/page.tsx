"use client";
import { useState, useMemo } from "react";
import { usePageTitle } from "@/shared/hooks/usePageTitle";
import { usePathname } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import UserModal from "@/features/inspections/users/create/UserModal";
import UserTable from "@/features/inspections/users/UserTable";
import BackButton from "@/shared/components/shared/BackButton";
import { UserStatusLabel } from "@/features/inspections/models/UsersTypes";
import Link from "next/link";

import { useTranslations } from "next-intl";

const Page = () => {
  const pathname = usePathname();
  const pageTitle = usePageTitle();
  
      const tAside = useTranslations("aside");
  const t = useTranslations("users");
  const tGeneral = useTranslations("general");
      const [title, setTitle] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [objFilterForm, setObjFilterForm] = useState({
    userName: "",
    employeeName: "",
    rol: "",
    employeeId: "",
  });

  const [objFilterApplied, setObjFilterApplied] = useState({
    userName: "",
    employeeName: "",
    rol: "",
    employeeId: "",
  });

  const handleSuccess = () => {
    setRefreshFlag((prev) => !prev);
  };

  const resetFilters = () => {
    const empty = { userName: "", employeeName: "", rol: "", employeeId: "" };
    setObjFilterForm(empty);
    setObjFilterApplied(empty);
  };

  return (
    <>
      <div className="gap-4 flex flex-col min-h-full">
        <div className="header-page flex items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
          <BackButton disableArrow title={!title ? tAside("module2.menu3") : title} />
          <Link
            href={`${pathname}/create`}
            className="btn bg-black rounded-full pr-3 py-6 border-none"
          >
            <FiPlus className="text-xl text-white" />
            <span className="bg-gray-800 py-1 px-4 text-white font-normal rounded-full hidden md:block text-[13px]">
              {tGeneral("btnNew")}
            </span>
          </Link>
        </div>

        {/* FILTROS */}
        <div className="container max-w-full mb-5">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend text-lg">{t("search_options")}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="fieldset-legend text-lg font-normal">
                  {t("username")}
                </label>
                <input
                  type="text"
                  className="input input-lg text-lg w-full"
                  value={objFilterForm.userName}
                  onChange={(e) =>
                    setObjFilterForm({
                      ...objFilterForm,
                      userName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="fieldset-legend text-lg font-normal">
                  {t("employee_name")}
                </label>
                <input
                  type="text"
                  className="input input-lg text-lg w-full"
                  value={objFilterForm.employeeName}
                  onChange={(e) =>
                    setObjFilterForm({
                      ...objFilterForm,
                      employeeName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="fieldset-legend text-lg font-normal">
                  {t("role")}
                </label>
                <select
                  className="select input-lg text-lg w-full"
                  value={objFilterForm.rol}
                  onChange={(e) =>
                    setObjFilterForm({
                      ...objFilterForm,
                      rol: e.target.value,
                    })
                  }
                >
                  <option value="">{t("pick_role")}</option>
                  {Object.entries(UserStatusLabel).map(([key, label]) => (
                    <option key={key} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 items-end">
                <button
                  className="btn bg-black rounded-full pr-3 py-6  sm:flex border-none flex-1"
                  onClick={() => setObjFilterApplied(objFilterForm)}
                >
                  <IoSearchOutline className="text-xl text-white" />
                  <span className=" py-1 px-4 text-white font-normal rounded-full  md:block text-[13px] ">
                    {tGeneral("btnSearch")}
                  </span>
                </button>
                <button
                  className="btn bg-black/50 rounded-full pr-3 py-6  sm:flex border-none w-[50px]"
                  onClick={resetFilters}
                >
                  <MdOutlineSettingsBackupRestore className="text-2xl text-white" />
                </button>
              </div>
            </div>
          </fieldset>
        </div>

        {/* TABLA */}
        <div className="container mt-0 max-w-full">
          <UserTable objFilter={objFilterApplied} refreshFlag={refreshFlag} />
        </div>
      </div>

      {showModal && (
        <UserModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default Page;
