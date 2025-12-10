"use client";
import CreateOrder from "@/features/inspections/inspection-configuration/create-inspection/CreateOrder";
import AlertInfo from "@/shared/components/shared/AlertInfo";
import BackButton from "@/shared/components/shared/BackButton";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const Page = () => {
  const t = useTranslations("inspection_configuration");
  const [title, setTitle] = useState<string>("");
  const changeTitle = (newTitle: string) => {
    setTitle(newTitle);
  };
  return (
    <>
      <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
        <BackButton title={t("new_title")} />
      </div>
      <div className="body-app overflow-y-auto pt-[20px]">
        <div className="container max-w-full mb-5">
          <CreateOrder changeTitle={changeTitle} />
        </div>
      </div>
    </>
  );
};

export default Page;
