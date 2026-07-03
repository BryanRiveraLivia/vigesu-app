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

const CaliforniaBitInspection: FC<Props> = ({
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
            .map((ans: any) => ans.response?.trim())
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
  const checklistQuestions = questions.filter(
    (q: any) => !q.templateInspectionQuestionId || q.templateInspectionQuestionId > 375 || questions.length <= 10
  );

  return (
    <div className="text-black max-w-full font-sans bg-white mx-auto pt-[20px] mt-5 print-no-flex print-no-gap">
      <h1
        className="font-bold text-4xl text-center"
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
            value={matchById(367)?.detail?.finalResponse ?? ""}
          />
          <InlineInput
            className="max-w-full md:max-w-[80%]"
            label="Supplier/Mechanic:"
            value={matchById(368)?.detail?.finalResponse ?? ""}
          />
          <InlineInput
            className="max-w-full md:max-w-[80%]"
            label="Date:"
            value={matchById(369)?.detail?.finalResponse ?? ""}
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
                <td className="border p-2 text-center font-bold">
                  {matchById(370)?.detail?.finalResponse ?? ""}
                </td>
                <td className="border p-2 text-center font-bold">
                  {matchById(371)?.detail?.finalResponse ?? ""}
                </td>
                <td className="border p-2 text-center font-bold">
                  {matchById(372)?.detail?.finalResponse ?? ""}
                </td>
                <td className="border p-2 text-center font-bold">
                  {matchById(373)?.detail?.finalResponse ?? ""}
                </td>
                <td className="border p-2 text-center font-bold">
                  {matchById(374)?.detail?.finalResponse ?? ""}
                </td>
                <td className="border p-2 text-center font-bold">
                  {matchById(375)?.detail?.finalResponse ?? ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {checklistQuestions.length > 0 && (
          <div className="mt-4">
            <div className="bg-black/10 text-black font-bold p-3 text-center border-t-2 border-b-2 uppercase">
              Inspection Checklist Items
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {checklistQuestions.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-row items-end justify-between border-b pb-1 text-sm uppercase gap-2"
                >
                  <span className="flex-1 font-medium">{item.question}:</span>
                  <span className="w-32 text-center font-bold border-b border-black/50">
                    {getAnswerValue(item.templateInspectionQuestionId, item.typeQuestion)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 border-t pt-4">
          <p className="font-bold mb-2">Comments (if applicable):</p>
          <div
            className="min-h-[60px] border p-2 text-sm"
            contentEditable={isEditable}
            suppressContentEditableWarning
          ></div>
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
        className="border-b w-full text-center outline-none bg-transparent"
        value={value || ""}
        readOnly
      />
    </div>
  );
};