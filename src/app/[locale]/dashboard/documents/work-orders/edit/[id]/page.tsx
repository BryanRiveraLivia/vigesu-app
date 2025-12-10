"use client";
import BackButton from "@/shared/components/shared/BackButton";
import React from "react";
import { useParams } from "next/navigation";
import EditOrder from "@/features/orders/edit-order/EditOrder";
import { useTranslations } from "next-intl";

const Page = () => {
  const params = useParams();
  const tWorkOrders = useTranslations("workorders");
  const id = typeof params.id === "string" ? params.id : "";
  return (
    <>
      <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
        <BackButton title={`${tWorkOrders("edit.0")} #${id}`} />
      </div>
      <div className="body-app overflow-y-auto pt-[20px]">
        <div className="container max-w-full mb-5">
          <EditOrder />
        </div>
      </div>
    </>
  );
};

export default Page;
