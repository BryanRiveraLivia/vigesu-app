import { LiftgateInspection } from "@/core/types/order/ITypes";
import React, { FC, useMemo } from "react";
import { IInspectionDetail } from "./LiftgateInspectionCheckList";
import clsx from "clsx";
import { buildQuestionMatcherGeneric } from "@/core/utils/buildQuestionMatcher";
import { TypeQuestion } from "@/features/orders/models/workOrder.types";

interface Props {
  data?: LiftgateInspection;
  inspectionDetails?: IInspectionDetail[];
  isEditable?: boolean;
}

const XtraLeaseDot: FC<Props> = ({
  data,
  inspectionDetails = [],
  isEditable,
}) => {
  const matchById = useMemo(
    () => buildQuestionMatcherGeneric(data, inspectionDetails),
    [data, inspectionDetails]
  );

  const getAnswerValue = (
    templateQuestionId: number,
    typeQuestion?: number
  ) => {
    const match = inspectionDetails.find(
      (item) =>
        Number(item.templateInspectionQuestionId) === Number(templateQuestionId)
    );

    if (!match) return "";

    let value = "";
    switch (typeQuestion) {
      case TypeQuestion.TextInput:
        value = match.finalResponse?.trim() ?? "";
        break;
      case TypeQuestion.MultipleChoice:
        if (
          Array.isArray(match.inspectionDetailAnswers) &&
          match.inspectionDetailAnswers.length > 0
        ) {
          value = match.inspectionDetailAnswers
            .map((ans) => ans.response?.trim())
            .filter(Boolean)
            .join(", ");
        }
        break;
      case TypeQuestion.SingleChoice:
        if (
          Array.isArray(match.inspectionDetailAnswers) &&
          match.inspectionDetailAnswers.length > 0
        ) {
          value = match.inspectionDetailAnswers[0]?.response?.trim() ?? "";
        }
        break;
      default:
        value = match.finalResponse?.trim() ?? "";
    }
    return value || "";
  };

  const questions = data?.templateInspectionQuestions ?? [];

  return (
    <div className="text-black max-w-full font-sans bg-white mx-auto pt-[20px] mt-5 print-no-flex print-no-gap border-2 p-6">
      <div className="border-b-2 pb-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1
            className="font-bold text-3xl uppercase tracking-wider text-black"
            contentEditable={isEditable}
            suppressContentEditableWarning
          >
            XTRA LEASE
          </h1>
          <p className="text-sm font-semibold text-gray-700">
            Annual & Periodic DOT Trailer Inspection Report
          </p>
        </div>
        <div className="border p-2 text-right text-xs">
          <p className="font-bold">COMPLIANCE FORM: DOT-482</p>
          <p>Meets FMCSR 396.17 Requirements</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 border rounded mb-6 text-sm">
        <InlineField label="Trailer / Unit #:" value={matchById(501)?.detail?.finalResponse ?? ""} />
        <InlineField label="VIN Number:" value={matchById(502)?.detail?.finalResponse ?? ""} />
        <InlineField label="License Plate:" value={matchById(503)?.detail?.finalResponse ?? ""} />
        <InlineField label="State / Reg:" value={matchById(504)?.detail?.finalResponse ?? ""} />
        <InlineField label="Hubodometer:" value={matchById(505)?.detail?.finalResponse ?? ""} />
        <InlineField label="Inspection Date:" value={matchById(506)?.detail?.finalResponse ?? ""} />
        <InlineField label="Branch / Loc:" value={matchById(507)?.detail?.finalResponse ?? ""} />
        <InlineField label="Inspector Name:" value={matchById(508)?.detail?.finalResponse ?? ""} />
      </div>

      <div className="mb-6">
        <div className="bg-black text-white font-bold p-2 text-center text-sm uppercase tracking-wider mb-2 flex justify-between px-4">
          <span>DOT Inspection Check Items</span>
          <span className="text-xs font-normal">(✔) = OK | (X) = Defect | (R) = Repaired | (N/A) = Not Applicable</span>
        </div>
        
        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 italic border">
            No inspection questions configured for this template yet.
          </div>
        ) : (
          <div className="border rounded divide-y">
            <div className="grid grid-cols-12 bg-gray-100 font-bold text-xs uppercase py-2 px-3 text-gray-700">
              <div className="col-span-1">#</div>
              <div className="col-span-8">Component / DOT Standard</div>
              <div className="col-span-3 text-center">Status / Note</div>
            </div>
            {questions.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 items-center py-2 px-3 text-sm hover:bg-gray-50"
              >
                <div className="col-span-1 font-semibold text-gray-500">
                  {index + 1}.
                </div>
                <div className="col-span-8 font-medium pr-2">
                  {item.question}
                </div>
                <div className="col-span-3 flex justify-center">
                  <span className="inline-block px-3 py-1 font-bold border-b border-black text-center min-w-[80px]">
                    {getAnswerValue(item.templateInspectionQuestionId, item.typeQuestion) || "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t pt-6 text-sm">
        <div>
          <p className="font-bold mb-2 uppercase text-xs tracking-wider">
            Defects Found & Corrective Actions:
          </p>
          <div
            className="border h-[80px] p-2 text-sm bg-gray-50"
            contentEditable={isEditable}
            suppressContentEditableWarning
          ></div>
        </div>
        <div>
          <p className="font-bold mb-2 uppercase text-xs tracking-wider">
            General Remarks & Tire Depths:
          </p>
          <div
            className="border h-[80px] p-2 text-sm bg-gray-50"
            contentEditable={isEditable}
            suppressContentEditableWarning
          ></div>
        </div>
      </div>

      <div className="mt-8 border p-4 bg-gray-50 text-xs text-gray-700 leading-relaxed">
        <p className="font-bold uppercase mb-1">Inspector Certification:</p>
        <p>
          This vehicle has been inspected in accordance with 49 CFR Part 396 and the Federal Motor Carrier Safety Regulations. I certify that all items required for a periodic inspection have been examined and all necessary repairs have been completed to ensure safe operation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-8 pt-4">
        <div className="flex flex-col items-center">
          <div className="w-full border-b border-black h-8"></div>
          <span className="text-xs font-bold mt-1 uppercase">Qualified Inspector Signature</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full border-b border-black h-8"></div>
          <span className="text-xs font-bold mt-1 uppercase">Date Certified</span>
        </div>
      </div>
    </div>
  );
};

export default XtraLeaseDot;

interface InlineFieldProps {
  label: string;
  value?: string;
}

const InlineField: FC<InlineFieldProps> = ({ label, value }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="font-bold whitespace-nowrap">{label}</span>
      <span className="border-b border-gray-400 flex-1 px-1 min-h-[20px] font-medium text-gray-800">
        {value || ""}
      </span>
    </div>
  );
};