"use client";
import TableList from "@/features/orders/orders-theme/TableList";
import BackButton from "@/shared/components/shared/BackButton";
import { usePageTitle } from "@/shared/hooks/usePageTitle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

const Page = () => {
  const pathname = usePathname();
  const pageTitle = usePageTitle();

  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleSuccess = () => {
    setRefreshFlag(!refreshFlag);
  };

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

  return (
    <>
      <div className="gap-4 flex flex-col  min-h-full ">
        <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
          <BackButton />
          <div className="flex flex-row gap-2">
            <Link
              href={`${pathname}/new`}
              className="btn bg-black rounded-full pr-3 py-6  sm:flex border-none !hidden"
            >
              <FiPlus className="text-xl text-white" />
              <span className="bg-gray-800 py-1 px-4 text-white font-normal rounded-full hidden md:block text-[13px]">
                New
              </span>
            </Link>
            <button className="btn bg-red-600 rounded-full pr-3 py-6 !hidden sm:flex items-center justify-center border-none !hidden !hidden">
              <FiTrash2 className="text-xl text-white" />
              <span className="bg-red-500 py-1 px-4 text-white font-normal rounded-full hidden md:block text-[13px] ">
                Delete
              </span>
            </button>
          </div>
        </div>
        <div className="boddy-app overflow-y-auto ">
          <div className="container max-w-full mb-5">
            <div role="alert" className="alert alert-info alert-soft mb-4">
              <span className="text-lg">
                This is a list of the order formats available. If you need to
                add a new format, this should be consulted with the developer,
                since all the data must be configured and mapped.
              </span>
            </div>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-lg">
                Search options
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col col-span-1 sm:col-span-1 md:col-span-3">
                  <legend className="fieldset-legend text-lg font-normal">
                    Form
                  </legend>
                  <input
                    type="text"
                    className="input input-lg text-lg w-full"
                    placeholder=""
                    onChange={(e) =>
                      setObjFilterForm({
                        ...objFilterForm,
                        client: e.target.value,
                      })
                    }
                    value={objFilterForm.client}
                  />
                </div>
                <div className="flex flex-col col-span-1 sm:col-span-1 md:col-span-1">
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
                        Search
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
              setRefreshFlag={setRefreshFlag}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
