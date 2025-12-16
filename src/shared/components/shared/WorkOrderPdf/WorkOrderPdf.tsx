// components/WorkOrderPdf.tsx
import React, { forwardRef, useEffect, useState } from "react";
import { WorkOrder } from "@/shared/types/order/ITypes";
import { formatDate } from "@/shared/utils/utils";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { formatApiErrorForToast } from "@/shared/utils/errors";

interface Props {
  data: WorkOrder;
  isEditable?: boolean;
}

interface ItemOption {
  id: string;
  name: string;
  unitPrice: number;
}

const WorkOrderPdf = forwardRef<HTMLDivElement, Props>(
  ({ data, isEditable }, ref) => {
    const [getItem, setGetItem] = useState<ItemOption[]>([]);
    const tToasts = useTranslations("toast");
    const getItemName = async () => {
      try {
        const res = await axiosInstance.get<ItemOption[]>(
          `/QuickBooks/Items/GetItemName?RealmId=9341454759827689`
        );

        const items = res.data ?? [];

        // defensivo: validar que existan los datos de workOrderDetails
        const woItemId = data?.workOrderDetails?.[0]?.itemId;
        if (woItemId == null) {
          console.warn("workOrderDetails[0].itemId no existe");
          return items;
        }

        // si id es string y itemId es number, normaliza:
        const match = items.find((it) => String(it.id) === String(woItemId));
        // o si quieres varios:
        // const matches = items.filter(it => String(it.id) === String(woItemId));

        console.log("match:", match);
        setGetItem(items);
      } catch (error) {
        /* console.error("Error fetching template data:", error);
        toast.error(`${tToasts("error")}: ${tToasts("msj.3")}`);*/
        const msg = formatApiErrorForToast(error);
        toast.error(msg, {
          style: { whiteSpace: "pre-line" },
        });
        return [];
      }
    };

    useEffect(() => {
      getItemName();
    }, []);

    return (
      <div
        ref={ref}
        className=" text-black max-w-full  font-sans bg-white mx-auto pt-[20px]"
      >
        <div className="border border-black text-center py-2">
          <p
            className="font-bold text-2xl"
            contentEditable={isEditable}
            suppressContentEditableWarning
          >
            Visegu Maintenance service (510)719-1444 percyruiz@visegu.com
          </p>
        </div>
        <h1
          className="font-bold text-4xl md:text-6xl py-4"
          contentEditable={isEditable}
          suppressContentEditableWarning
        >
          Work Order
        </h1>

        <div className="flex flex-col gap-4 mb-10">
          <div className="grid grid-cols-3 border border-black">
            <div className="flex flex-col md:flex-row p-2 items-center justify-start gap-1 md:gap-2">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                CUSTOMER:
              </label>
              <span
                className="flex flex-1"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                {data.customerName}
              </span>
            </div>
            <div className="flex flex-col md:flex-row p-2 items-center justify-start border-r-1 border-l-1 gap-2">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                LOCATION OF REPAIR:
              </label>
              <span
                className="flex flex-1"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                {data.locationOfRepair}
              </span>
            </div>
            <div className="flex flex-col md:flex-row p-2 items-center justify-start gap-1 md:gap-2">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                TIME START SERVICE:
              </label>
              <span
                className="flex flex-1"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                {formatDate(data.timeStart)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 border border-black">
            <div className="flex flex-col md:flex-row p-2 items-center justify-start gap-1 md:gap-2">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                EQUIPMENT#:
              </label>
              <span className="flex flex-1">{data.equipament}</span>
            </div>
            <div className="flex flex-col md:flex-row p-2 items-center justify-start border-r-1 border-l-1 gap-2">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                DATE OF REPAIR:
              </label>
              <span
                className="flex flex-1"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                {formatDate(data.dateOfRepair)}
              </span>
            </div>
            <div className="flex flex-col md:flex-row p-2 items-center justify-start gap-1 md:gap-2">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                TIME FINISH SERVICE:
              </label>
              <span
                className="flex flex-1"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                {formatDate(data.timeFinish)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 border border-black">
            <div className="flex flex-col md:flex-row p-2 items-center justify-start gap-1 md:gap-2">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                LICENSE PLATE#:
              </label>
              <span
                className="flex flex-1"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                {data.licencePlate}
              </span>
            </div>
            <div className="flex flex-col md:flex-row p-2 items-center justify-start gap-1 md:gap-2 border-l-1 ">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                PO#:
              </label>
              <span
                className="flex flex-1"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                {data.po}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 border border-black">
            <div className="flex flex-col md:flex-row p-2 items-center justify-start gap-1 md:gap-2">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                VIN#:
              </label>
              <span
                className="flex flex-1"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                {data.vin}
              </span>
            </div>
            <div className="flex flex-col md:flex-row p-2 items-center justify-start gap-1 md:gap-2 border-l-1 ">
              <label
                htmlFor=""
                className="min-w-auto font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                MECHANIC NAME:
              </label>
              <span
                className="flex flex-1"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                {data.employeeName}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-black ">
          <table className="table">
            {/* head */}
            <thead className="">
              <tr className=" border-b-black">
                <th
                  className="font-bold text-black text-center border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                >
                  CODE
                </th>
                <th
                  className="font-bold text-black text-center border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                >
                  WORK DESCRIPTION
                </th>
                <th
                  className="font-bold text-black text-center border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                >
                  LABOR TIME
                </th>
                <th
                  className="font-bold text-black text-center border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                >
                  PARTS
                </th>
                <th
                  className="font-bold text-black text-center "
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                >
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody className="odd:border-b-black ">
              {data.workOrderDetails.map((item, index) => (
                <tr key={index} className="text-center   border-b-black">
                  <td
                    className="border-r"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                  >
                    {item.itemId ?? ""}
                  </td>
                  <td
                    className="border-r"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                  >
                    {item.observation ?? ""}
                  </td>
                  <td
                    className="border-r"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                  >
                    {""}
                  </td>
                  <td
                    className="border-r"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                  >
                    {getItem.find((it) => String(it.id) === String(item.itemId))
                      ?.name ?? ""}
                  </td>
                  <td
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                  >
                    {item.quantity ?? ""}
                  </td>
                </tr>
              ))}
              <tr className="text-center border-b-black ">
                <td colSpan={2} className="border-r">
                  <p
                    className="font-bold text-left"
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                  >
                    Tires Tread Deep
                  </p>
                </td>
                <td
                  className="border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
                <td
                  className="border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
                <td
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
              </tr>
              <tr className="text-center border-b-black ">
                <td colSpan={2} className="border-r">
                  <div className="grid grid-cols-4">
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        RIF
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.rif}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        ROF
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.rof}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        RIR
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.rir}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        ROR
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.ror}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  className="border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
                <td
                  className="border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
                <td
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
              </tr>
              <tr className="text-center border-b-black ">
                <td colSpan={2} className="border-r">
                  <div className="grid grid-cols-4">
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        LIF
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.lif}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        LOF
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.lof}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        LIR
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.lir}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        LOR
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.lor}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  className="border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
                <td
                  className="border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
                <td
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
              </tr>
              <tr className="text-center border-b-black ">
                <td colSpan={2} className="border-r">
                  <div className="grid grid-cols-4">
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        CIF
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.cif}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        COF
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.cof}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        CIR
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.cir}
                      </span>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span
                        className="min-w-auto font-semibold"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        COR
                      </span>
                      <span
                        className="flex-1 text-left"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                      >
                        {data.cor}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  className="border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
                <td
                  className="border-r"
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
                <td
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

WorkOrderPdf.displayName = "WorkOrderPdf";
export default WorkOrderPdf;
