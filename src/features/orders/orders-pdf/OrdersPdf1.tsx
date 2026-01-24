import { COMPANY_INFO } from "@/core/config/constants";
import { constants } from "buffer";
import React from "react";

const OrdersPdf1 = () => {
  return (
    <div className="body-pdf overflow-hidden max-w-[80%] mx-auto">
      <div className="headerPdf">
        <p className="border border-black text-center flex items-center justify-center font-bold text-2xl py-3">
          Visegu Maintenance service {COMPANY_INFO.phone} {COMPANY_INFO.email}
        </p>
        <p className="text-6xl font-bold my-4">Work Order</p>
      </div>
      <div className="mainPdf"></div>
      <div className="footerPdf"></div>
    </div>
  );
};

export default OrdersPdf1;
