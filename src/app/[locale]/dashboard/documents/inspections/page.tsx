"use client";
import { InspectionStatusLabel } from "@/features/inspections/inspection-configuration/models/typeInspection";
import TableList from "@/features/orders/inspections/TableList";
import { WorkOrderStatusLabel } from "@/features/orders/models/workOrder.types";
import BackButton from "@/shared/components/shared/BackButton";
import { usePageTitle } from "@/shared/hooks/usePageTitle";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { CustomerOption } from "@/shared/utils/orderMapper";
import { debounce } from "lodash";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

const Page = () => {
  const tAlerts = useTranslations("alerts");
  const t = useTranslations("inspections");
  const tAside = useTranslations("aside");
  const tGeneral = useTranslations("general");
  const pathname = usePathname();
  const pageTitle = usePageTitle();
  const [title, setTitle] = useState<string>("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const inputCustomerRef = useRef<HTMLInputElement>(null);

  const [objFilterForm, setObjFilterForm] = useState({
    client: "",
    status: "",
    name: "",
  });

  const [objFilterApplied, setObjFilterApplied] = useState({
    client: "",
    status: "",
    name: "",
  });

  const resetTableList = () => {
    setObjFilterForm({
      client: "",
      status: "",
      name: "",
    });
    setObjFilterApplied({
      client: "",
      status: "",
      name: "",
    });
  };

  // búsqueda cliente
  const searchCustomer = async (name?: string) => {
    try {
      let url = `/QuickBooks/Customers/GetCustomerName?RealmId=9341454759827689`;
      if (name) url += `&Name=${encodeURIComponent(name)}`;
      const response = await axiosInstance.get(url);
      setCustomerOptions(response.data ?? []);
    } catch (error) {
      console.error("Error buscando clientes:", error);
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

  // Handle Customer Input
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShowCustomerDropdown(true);
    debouncedSearchCustomer(value);
    setObjFilterForm({ ...objFilterForm, client: value });
  };

  return (
    <>
      <div className="gap-4 flex flex-col  min-h-full ">
        <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
          <BackButton
            title={!title ? tAside("module0.inspections") : title}
            disableArrow
          />
          <div className="flex flex-row gap-2">
            <Link
              href={`${pathname}/create/`}
              className="btn bg-black rounded-full pr-3 py-6  sm:flex border-none"
            >
              <FiPlus className="text-xl text-white" />
              <span className="bg-gray-800 py-1 px-4 text-white font-normal rounded-full hidden md:block text-[13px]">
                {t("home.4")}
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
        <div className="boddy-app overflow-y-auto ">
          <div className="container max-w-full mb-5">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-lg">{t("home.1")}</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
                <div className="flex-col !hidden ">
                  <legend className="fieldset-legend text-lg font-normal">
                    {t("home.6")}
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
                <div className="flex flex-col col-span-2">
                  <legend className="fieldset-legend text-lg font-normal">
                    {t("home.2")}
                  </legend>
                  <input
                    type="text"
                    className="input input-lg text-lg w-full"
                    placeholder=""
                    onChange={(e) =>
                      setObjFilterForm({
                        ...objFilterForm,
                        name: e.target.value,
                      })
                    }
                    value={objFilterForm.name}
                  />
                </div>
                <div className="flex flex-col">
                  <legend className="fieldset-legend text-lg font-normal hidden md:flex min-h-[32px]">
                    {" "}
                  </legend>
                  <div className="flex flex-row items-center justify-center gap-2">
                    <button
                      className="btn bg-black rounded-full pr-3 py-6  sm:flex border-none flex-1"
                      onClick={() => setObjFilterApplied(objFilterForm)}
                    >
                      <IoSearchOutline className="text-xl text-white" />
                      <span className=" py-1 px-4 text-white font-normal rounded-full  md:block text-[13px] ">
                        {t("home.3")}
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
            <TableList objFilter={objFilterApplied} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
