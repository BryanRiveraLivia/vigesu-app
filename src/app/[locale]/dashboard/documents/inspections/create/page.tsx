"use client";
import CreateOrder from "@/features/inspections/inspection-configuration/create-inspection/CreateOrder";
import GenerateStep1 from "@/features/orders/inspections/components/GenerateStep0";
import { IInspectionItemFull } from "@/features/orders/inspections/types/IInspectionDetailFull";

import BackButton from "@/shared/components/shared/BackButton";
import Loading from "@/shared/components/shared/Loading";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const tAside = useTranslations("aside");
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [title, setTitle] = useState<string>("");
  const changeTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <>
      <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
        <BackButton title={tAside("module0.inspections")} />
      </div>
      <div className="body-app overflow-y-auto pt-[20px]">
        <div className="container max-w-full mb-5">
          <GenerateStep1 />
        </div>
      </div>
    </>
  );
};

export default Page;
