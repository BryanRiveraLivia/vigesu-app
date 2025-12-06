import BoxContent from "@/shared/components/shared/BoxContent";
import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  redirect("/dashboard/orders/work-orders");
};

export default page;
