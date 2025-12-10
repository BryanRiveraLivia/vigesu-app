import CreateOrder from "@/features/orders/create-order/CreateOrder";
import BackButton from "@/shared/components/shared/BackButton";
import { useTranslations } from "next-intl";
import React from "react";

const Page = () => {
  const tWorkOrders = useTranslations("workorders");
  return (
    <>
      <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
        <BackButton title={tWorkOrders("new.0")} />
      </div>
      <div className="body-app overflow-y-auto pt-[20px]">
        <div className="container max-w-full mb-5">
          <CreateOrder />
        </div>
      </div>
    </>
  );
};

export default Page;
