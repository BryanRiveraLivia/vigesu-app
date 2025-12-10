"use client";
import TableList from "@/features/orders/TableList";
import BackButton from "@/shared/components/shared/BackButton";
import { usePageTitle } from "@/shared/hooks/usePageTitle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import {
  WorkOrderStatus,
  WorkOrderStatusLabel,
} from "@/features/orders/models/workOrder.types";
import { debounce } from "lodash";
import AlertInfo from "@/shared/components/shared/AlertInfo";
import { toast } from "sonner";
import Loading from "@/shared/components/shared/Loading";
import { useTranslations } from "next-intl";
import CaliforniaBitInspection from "@/shared/components/shared/InspectionsPdf/CaliforniaBitInspection";

interface CustomerOption {
  id: number;
  name: string;
}
interface MechanicOption {
  id: number;
  name: string;
}

const Page = () => {
  const tWorkOrders = useTranslations("workorders");
  const tAlerts = useTranslations("alerts");
  const t = useTranslations("workorders");
  const tAside = useTranslations("aside");
  const tGeneral = useTranslations("general");
  const pathname = usePathname();
  const [refreshTable, setRefreshTable] = useState(false);

  const pageTitle = usePageTitle();

  const [date, setDate] = useState<Date | undefined>();

  const [objFilterForm, setObjFilterForm] = useState({
    client: "",
    status: "",
    workorder: "",
    worker: "",
    creationdate: undefined as Date | undefined,
  });

  const [objFilterApplied, setObjFilterApplied] = useState({
    client: "",
    status: "",
    workorder: "",
    worker: "",
    creationdate: undefined as Date | undefined,
  });

  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [mechanicOptions, setMechanicOptions] = useState<MechanicOption[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showMechanicDropdown, setShowMechanicDropdown] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [isLoadingMechanic, setIsLoadingMechanic] = useState(false);

  const inputCustomerRef = useRef<HTMLInputElement>(null);
  const inputMechanicRef = useRef<HTMLInputElement>(null);

  // búsqueda cliente
  const searchCustomer = async (name?: string) => {
    try {
      let url = `/QuickBooks/Customers/GetCustomerName?RealmId=9341454759827689`;
      if (name) url += `&Name=${encodeURIComponent(name)}`;
      const response = await axiosInstance.get(url);
      setCustomerOptions(response.data ?? []);
    } catch (error) {
      console.error("Error buscando clientes:", error);
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  const debouncedSearchCustomer = useRef(
    debounce((value: string) => {
      if (value.length >= 3) {
        searchCustomer(value);
      } else {
        setCustomerOptions([]);
      }
    }, 500)
  ).current;

  // búsqueda mecánico
  const searchMechanic = async (name?: string) => {
    try {
      setIsLoadingMechanic(true);
      let url = `/QuickBooks/employees/GetEmployeeName?RealmId=9341454759827689`;
      if (name) url += `&Name=${encodeURIComponent(name)}`;
      const response = await axiosInstance.get(url);
      setMechanicOptions(response.data ?? []);
    } catch (error) {
      console.error("Error buscando empleados:", error);
    } finally {
      setIsLoadingMechanic(false);
    }
  };

  const debouncedSearchMechanic = useRef(
    debounce((value: string) => {
      if (value.length >= 3) {
        searchMechanic(value);
      } else {
        setMechanicOptions([]);
      }
    }, 500)
  ).current;

  // Handle Customer Input
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setObjFilterForm((prev) => ({ ...prev, client: value }));
    setShowCustomerDropdown(true);

    if (value.length >= 1) {
      setIsLoadingCustomer(true);
    } else {
      setIsLoadingCustomer(false);
      setCustomerOptions([]);
    }

    debouncedSearchCustomer(value);
  };

  // Handle Mechanic Input
  const handleMechanicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setObjFilterForm({ ...objFilterForm, worker: value });
    setShowMechanicDropdown(true);

    if (value.length >= 1) {
      setIsLoadingMechanic(true);
    } else {
      setIsLoadingMechanic(false);
      setMechanicOptions([]);
    }

    debouncedSearchMechanic(value);
  };

  const resetTableList = () => {
    setObjFilterForm({
      client: "",
      status: "",
      workorder: "",
      worker: "",
      creationdate: undefined,
    });

    setObjFilterApplied({
      client: "",
      status: "",
      workorder: "",
      worker: "",
      creationdate: undefined,
    });

    setDate(undefined);
    setRefreshTable((prev) => !prev);
  };

  return (
    <>
      <div className="gap-4 flex flex-col  min-h-full ">
        <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
          <BackButton title={tWorkOrders("home.0")} disableArrow />
          <div className="flex flex-row gap-2">
            <Link
              href={`${pathname}/create`}
              className="btn bg-black rounded-full pr-3 py-6  sm:flex border-none"
            >
              <FiPlus className="text-xl text-white" />
              <span className="bg-gray-800 py-1 px-4 text-white font-normal rounded-full hidden md:block text-[13px]">
                {t("home.14")}
              </span>
            </Link>
            <button className="btn bg-black rounded-full pr-3 py-6  sm:flex items-center justify-center border-none !hidden">
              <IoSearchOutline className="text-xl text-white" />
              <span className="bg-gray-800 py-1 px-4 text-white font-normal rounded-full hidden md:block text-[13px] ">
                {tGeneral("btnSearch")}
              </span>
            </button>
            <button className="btn bg-red-600 rounded-full pr-3 py-6 !hidden sm:flex items-center justify-center border-none !hidden">
              <FiTrash2 className="text-xl text-white" />
              <span className="bg-red-500 py-1 px-4 text-white font-normal rounded-full hidden md:block text-[13px] ">
                {tGeneral("btnDelete")}
              </span>
            </button>
          </div>
        </div>
        <div className="body-app overflow-y-auto">
          <div className="container max-w-full mb-5">
            <AlertInfo>{tAlerts("1")}</AlertInfo>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-lg">{t("home.1")}</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <legend className="fieldset-legend text-lg font-normal">
                    {t("home.2")}
                  </legend>
                  <div className="relative">
                    <input
                      type="text"
                      className="input input-lg text-lg w-full"
                      name="customer_order"
                      value={objFilterForm.client}
                      onChange={handleCustomerChange}
                      ref={inputCustomerRef}
                      autoComplete="off"
                    />
                    {isLoadingCustomer && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                        <Loading enableLabel={false} size="loading-sm " />
                      </div>
                    )}
                    {showCustomerDropdown && (
                      <ul className="bg-base-100 w-full rounded-box shadow-md z-50 max-h-60 overflow-y-auto relative mt-1">
                        {customerOptions.map((option, idx) => (
                          <li
                            key={option.id}
                            className="cursor-pointer text-sm"
                          >
                            <button
                              type="button"
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                if (inputCustomerRef.current) {
                                  inputCustomerRef.current.value = option.name;
                                  setObjFilterForm({
                                    ...objFilterForm,
                                    client: option.name,
                                  });
                                  setShowCustomerDropdown(false);
                                  setCustomerOptions([]);
                                  debouncedSearchCustomer.cancel();
                                }
                              }}
                            >
                              {option.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <legend className="fieldset-legend text-lg font-normal">
                    {t("home.3")}
                  </legend>
                  <select
                    defaultValue=""
                    className="select w-full text-lg input-lg"
                    name="status_slc"
                    onChange={(e) =>
                      setObjFilterForm({
                        ...objFilterForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option disabled={true} value="">
                      {t("home.4")}
                    </option>

                    {Object.entries(WorkOrderStatusLabel).map(
                      ([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="flex flex-col">
                  <legend className="fieldset-legend text-lg font-normal">
                    {t("home.5")}
                  </legend>
                  <input
                    type="text"
                    className="input input-lg text-lg w-full"
                    name="nro_work_order"
                    onChange={(e) =>
                      setObjFilterForm({
                        ...objFilterForm,
                        workorder: e.target.value,
                      })
                    }
                    value={objFilterForm.workorder}
                  />
                </div>
                <div className="flex flex-col">
                  <legend className="fieldset-legend text-lg font-normal">
                    {t("home.6")}
                  </legend>
                  <div className="relative">
                    <input
                      type="text"
                      className="input input-lg text-lg w-full"
                      name="mechanic_name"
                      value={objFilterForm.worker}
                      onChange={handleMechanicChange}
                      ref={inputMechanicRef}
                      autoComplete="off"
                    />
                    {isLoadingMechanic && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                        <Loading enableLabel={false} size="loading-sm " />
                      </div>
                    )}
                    {showMechanicDropdown && (
                      <ul className="bg-base-100 w-full rounded-box shadow-md z-50 max-h-60 overflow-y-auto relative mt-1">
                        {mechanicOptions.map((option, idx) => (
                          <li
                            key={option.id}
                            className="cursor-pointer text-sm"
                          >
                            <button
                              type="button"
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                if (inputMechanicRef.current) {
                                  inputMechanicRef.current.value = option.name;
                                  setObjFilterForm({
                                    ...objFilterForm,
                                    worker: option.name,
                                  });
                                  setShowMechanicDropdown(false);
                                  setMechanicOptions([]);
                                  debouncedSearchMechanic.cancel();
                                }
                              }}
                            >
                              {option.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <legend className="fieldset-legend text-lg font-normal">
                    {t("home.7")}
                  </legend>
                  <input
                    type="date"
                    className="input input-lg text-lg w-full"
                    name="creation_date"
                    value={
                      objFilterForm.creationdate
                        ? objFilterForm.creationdate
                            .toISOString()
                            .substring(0, 10)
                        : ""
                    }
                    onChange={(e) => {
                      const dateValue = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      setDate(dateValue);
                      setObjFilterForm({
                        ...objFilterForm,
                        creationdate: dateValue,
                      });
                    }}
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col">
                  <legend className="fieldset-legend text-lg font-normal hidden md:flex min-h-[32px]">
                    {" "}
                  </legend>
                  <div className="flex flex-row items-center justify-center gap-2">
                    <button
                      className="btn bg-black rounded-full pr-3 py-6  sm:flex border-none flex-1"
                      onClick={() =>
                        setObjFilterApplied({
                          ...objFilterForm,
                        })
                      }
                    >
                      <IoSearchOutline className="text-xl text-white" />
                      <span className=" py-1 px-4 text-white font-normal rounded-full  md:block text-[13px] ">
                        {t("home.8")}
                      </span>
                    </button>
                    <button
                      className="btn bg-black/50 rounded-full pr-3 py-6  sm:flex border-none w-[50px]"
                      onClick={() => resetTableList()}
                    >
                      <MdOutlineSettingsBackupRestore className="text-2xl text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="container mt-0 max-w-full">
            <TableList
              objFilter={objFilterApplied}
              refreshSignal={refreshTable}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
