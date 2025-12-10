import CreateOrder from "@/features/inspections/users/create/CreateOrder";
import { GroupStatusLabel } from "@/features/inspections/models/GroupTypes";
import BackButton from "@/shared/components/shared/BackButton";
import React from "react";

const page = () => {
  return (
    <div className="gap-4 flex flex-col  min-h-full ">
      <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
        <BackButton />
      </div>
      <div className="boddy-app overflow-y-auto ">
        <div className="container max-w-full mb-5">
          <CreateOrder />
        </div>
      </div>
    </div>
  );
};

export default page;
