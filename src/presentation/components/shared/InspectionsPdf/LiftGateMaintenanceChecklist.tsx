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

const LiftGateMaintenanceChecklist: FC<Props> = ({
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
      <div className="border-b-2 pb-4 mb-6">
        <h1
          className="font-bold text-3xl text-center uppercase tracking-wide"
          contentEditable={isEditable}
          suppressContentEditableWarning
        >
          Liftgate Periodic Maintenance & Service Checklist
        </h1>
        <p className="text-center text-sm text-gray-600 mt-1">
          Hydraulic & Electrical System Inspection Report
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 border rounded mb-6 text-sm">
        <InlineField label="Customer:" value={matchById(401)?.detail?.finalResponse ?? ""} />
        <InlineField label="Unit / Equipment #:" value={matchById(402)?.detail?.finalResponse ?? ""} />
        <InlineField label="Date:" value={matchById(403)?.detail?.finalResponse ?? ""} />
        <InlineField label="Make / Model:" value={matchById(404)?.detail?.finalResponse ?? ""} />
        <InlineField label="Serial Number:" value={matchById(405)?.detail?.finalResponse ?? ""} />
        <InlineField label="Mechanic / Tech:" value={matchById(406)?.detail?.finalResponse ?? ""} />
      </div>

      <div className="mb-6">
        <div className="bg-black text-white font-bold p-2 text-center text-sm uppercase tracking-wider mb-2">
          Maintenance & Safety Verification Items
        </div>
        
        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 italic border">
            No inspection questions configured for this template yet.
          </div>
        ) : (
          <div className="border rounded divide-y">
            <div className="grid grid-cols-12 bg-gray-100 font-bold text-xs uppercase py-2 px-3 text-gray-700">
              <div className="col-span-1">#</div>
              <div className="col-span-8">Inspection Item / Procedure</div>
              <div className="col-span-3 text-center">Status / Result</div>
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
            Parts Replaced / Fluids Added:
          </p>
          <div
            className="border h-[80px] p-2 text-sm bg-gray-50"
            contentEditable={isEditable}
            suppressContentEditableWarning
          >
            • Hydraulic fluid checked / topped off
          </div>
        </div>
        <div>
          <p className="font-bold mb-2 uppercase text-xs tracking-wider">
            Mechanic Comments & Recommendations:
          </p>
          <div
            className="border h-[80px] p-2 text-sm bg-gray-50"
            contentEditable={isEditable}
            suppressContentEditableWarning
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-10 pt-6 border-t">
        <div className="flex flex-col items-center">
          <div className="w-full border-b border-black h-8"></div>
          <span className="text-xs font-bold mt-1 uppercase">Mechanic Signature</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full border-b border-black h-8"></div>
          <span className="text-xs font-bold mt-1 uppercase">Supervisor Approval</span>
        </div>
      </div>
    </div>
  );
};

export default LiftGateMaintenanceChecklist;

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