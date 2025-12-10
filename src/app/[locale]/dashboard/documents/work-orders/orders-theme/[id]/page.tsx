"use client";
import { usePageTitle } from "@/shared/hooks/usePageTitle";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import PDFViewer from "@/shared/components/shared/PDFViewer";
import BackButton from "@/shared/components/shared/BackButton";

const Page = () => {
  const pathname = usePathname();
  const pageTitle = usePageTitle();

  const params = useParams();
  const id = params?.id;

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
            <button className="btn bg-red-600 rounded-full pr-3 py-6 !hidden sm:flex items-center justify-center border-none !hidden">
              <FiTrash2 className="text-xl text-white" />
              <span className="bg-red-500 py-1 px-4 text-white font-normal rounded-full hidden md:block text-[13px] ">
                Delete
              </span>
            </button>
          </div>
        </div>
        <div className="boddy-app overflow-y-auto ">
          <div className="container mt-0 max-w-full">
            <PDFViewer file="work-order.pdf" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
