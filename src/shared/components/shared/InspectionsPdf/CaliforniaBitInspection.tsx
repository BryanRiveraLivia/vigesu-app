import { LiftgateInspection } from "@/shared/types/order/ITypes";
import React, { FC } from "react";
import { IInspectionDetail } from "./LiftgateInspectionCheckList";
import clsx from "clsx";
interface Props {
  data?: LiftgateInspection;
  inspectionDetails?: IInspectionDetail[];
  isEditable?: boolean;
}
const CaliforniaBitInspection: FC<Props> = ({
  data,
  inspectionDetails = [],
  isEditable,
}) => {
  return (
    <div className="text-black max-w-full font-sans bg-white mx-auto pt-[20px] mt-5 print-no-flex print-no-gap">
      <h1
        className="font-bold text-4xl  text-center"
        contentEditable={isEditable}
        suppressContentEditableWarning
      >
        California Only 90 Day BIT Inspection
      </h1>
      <div className="flex flex-col mt-5 p-5">
        <div className="gap-4 flex flex-col md:grid grid-cols-3">
          <InlineInput
            className="max-w-full md:max-w-[80%]"
            label="RO/PO:"
            value={`matchById(367)?.detail?.finalResponse`}
          />
          <InlineInput
            className="max-w-full md:max-w-[80%]"
            label="Supplier/Mechanic:"
            value={`matchById(367)?.detail?.finalResponse`}
          />
          <InlineInput
            className="max-w-full md:max-w-[80%]"
            label="Date:"
            value={`matchById(367)?.detail?.finalResponse`}
          />
        </div>
        <div className="overflow-x-auto my-5">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="border p-2">
                  <span className="truncate">Equipment ID</span>
                </th>
                <th className="border p-2">
                  <span className="truncate">VIN</span>
                </th>
                <th className="border p-2">
                  <span className="truncate">Year</span>
                </th>
                <th className="border p-2">
                  <span className="truncate">Mfg</span>
                </th>
                <th className="border p-2">
                  <span className="truncate">Primary Plate</span>
                </th>
                <th className="border p-2">
                  <span className="truncate">Hubodometer</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className=" p-2" colSpan={4}>
                  <span className="truncate font-bold">TRACTOR</span>
                </td>
                <td className=" p-2" colSpan={1}>
                  <span className="truncate font-bold">TRACTOR</span>
                </td>
                <td className=" p-2" colSpan={1}>
                  <span className="truncate font-bold">TRACTOR</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CaliforniaBitInspection;

interface InlineInputProps {
  label: string;
  value?: string;
  className?: string;
}

const InlineInput: FC<InlineInputProps> = ({ label, value, className }) => {
  return (
    <div className={clsx(`flex flex-row gap-2`, className)}>
      <label htmlFor="" className="whitespace-nowrap font-bold">
        {label}
      </label>
      <input
        type="text"
        className="border-b w-full text-center"
        defaultValue={value}
      />
    </div>
  );
};
