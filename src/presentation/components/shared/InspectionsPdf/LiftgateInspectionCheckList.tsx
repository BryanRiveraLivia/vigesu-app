import { TypeQuestion } from "@/features/orders/models/workOrder.types";
import { LiftgateInspection } from "@/core/types/order/ITypes";
import clsx from "clsx";
import React from "react";

export interface IInspectionDetail {
  inspectionDetailId: number;
  typeInspectionDetailId: number;
  templateInspectionQuestionId: number;
  typeInspectionDetailAnswerId: number;
  finalResponse: string;
  inspectionDetailAnswers: IInspectionDetailAnswer[];
}

export interface IInspection {
  inspectionId: number;
  inspectionNumber: string;
  typeInspectionId: number;
  templateInspectionId: number;
  customerId: string;
  employeeId: string;
  customerName: string;
  employeeName: string;
  dateOfInspection: string; // ISO Date string
  inspectionDetails: IInspectionDetail[];
  inspectionPhotos: IInspectionPhoto[];
}

export interface IInspectionDetailAnswer {
  inspectionDetailAnswerId: number;
  typeInspectionDetailAnswerId: number;
  response: string;
  items: IInspectionDetailAnswerItem[];
}

export interface IInspectionDetailAnswerItem {
  inspectionDetailAnswerItemId: number;
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
}

export interface IInspectionPhoto {
  inspectionPhotoId: number;
  photoUrl: string;
}

interface Props {
  data: LiftgateInspection;
  inspectionDetails?: IInspectionDetail[];
  isEditable?: boolean;
}

interface InputLineProps {
  id: number;
  label: string;
  value?: string;
  className?: string;
  isEditable?: boolean;
}

interface SeparatorProps {
  label: string;
  isEditable?: boolean;
}

interface NumberedListProps {
  items?: string[];
  isEditable?: boolean;
}

const LiftgateInspectionCheckList: React.FC<Props> = ({
  data,
  inspectionDetails = [],
  isEditable,
}) => {
  const getData = data.templateInspectionQuestions.find(
    (item) =>
      item.templateInspectionQuestionId ===
      inspectionDetails[0]?.templateInspectionQuestionId
  );

  // ✅ Match por templateInspectionQuestionId
  const getAnswerValue = (
    templateQuestionId: number,
    typeQuestion?: number
  ) => {
    const match = inspectionDetails.find(
      (item) =>
        Number(item.templateInspectionQuestionId) === Number(templateQuestionId)
    );

    if (!match) {
      console.warn(`❌ Sin match para QuestionId: ${templateQuestionId}`);
      return "";
    }

    let value = "";

    switch (typeQuestion) {
      case TypeQuestion.TextInput:
        // ✅ Caso texto libre
        value = match.finalResponse?.trim() ?? "";
        break;

      case TypeQuestion.MultipleChoice:
        // ✅ Caso múltiple: aseguramos que inspeccionDetailAnswers tenga data
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
        // ✅ Caso selección única: usar primera respuesta válida
        if (
          Array.isArray(match.inspectionDetailAnswers) &&
          match.inspectionDetailAnswers.length > 0
        ) {
          value = match.inspectionDetailAnswers[0]?.response?.trim() ?? "";
        }
        break;

      case TypeQuestion.Sign:
        value = match.finalResponse?.trim() ?? "";
        break;

      default:
        value = match.finalResponse?.trim() ?? "";
    }

    console.log(
      `🔎 [MATCH] QID:${templateQuestionId} | Type:${typeQuestion} | FinalResponse:"${match.finalResponse}" | Answers:[${match.inspectionDetailAnswers?.map((a) => a.response)}] | Value:"${value}"`
    );

    return value || "";
  };

  const values = data.templateInspectionQuestions.slice(0, 10);
  const inspections = data.templateInspectionQuestions.slice(10);

  return (
    <div className="text-black max-w-full font-sans bg-white mx-auto pt-[20px] border-2 mt-5 print-no-flex print-no-gap">
      <h1
        className="font-bold text-4xl  text-center"
        contentEditable={isEditable}
        suppressContentEditableWarning
      >
        Liftgate Inspection Checklist
      </h1>
      <div className="flex flex-col mt-5 p-5">
        <div className="flex flex-row justify-between items-start gap-2">
          <div className="flex flex-col gap-2  ">
            <InputLine
              isEditable={isEditable}
              label={values[0]?.question}
              value={getAnswerValue(values[0]?.templateInspectionQuestionId)}
              id={values[0]?.templateInspectionQuestionId}
            />
            <InputLine
              isEditable={isEditable}
              label={values[1]?.question}
              value={getAnswerValue(values[1]?.templateInspectionQuestionId)}
              id={values[1]?.templateInspectionQuestionId}
            />
            <InputLine
              isEditable={isEditable}
              label={values[3]?.question}
              value={getAnswerValue(values[3]?.templateInspectionQuestionId)}
              id={values[3]?.templateInspectionQuestionId}
            />
          </div>
          <div>
            <InputLine
              isEditable={isEditable}
              label={values[2]?.question}
              value={getAnswerValue(values[2]?.templateInspectionQuestionId)}
              id={values[2]?.templateInspectionQuestionId}
            />
          </div>
        </div>
        <div className="flex flex-col mt-2 gap-2">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-1/3">
              <InputLine
                isEditable={isEditable}
                label={values[4]?.question}
                value={getAnswerValue(values[4]?.templateInspectionQuestionId)}
                id={values[4]?.templateInspectionQuestionId}
              />
            </div>
            <div className="w-full md:w-1/3 flex justify-start md:justify-center">
              <InputLine
                isEditable={isEditable}
                label={values[5]?.question}
                value={getAnswerValue(values[5]?.templateInspectionQuestionId)}
                id={values[5]?.templateInspectionQuestionId}
              />
            </div>
            <div className="w-full md:w-1/3 flex justify-start md:justify-center">
              <InputLine
                isEditable={isEditable}
                label={values[6]?.question}
                value={getAnswerValue(values[6]?.templateInspectionQuestionId)}
                id={values[6]?.templateInspectionQuestionId}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full md:w-1/3">
              <InputLine
                isEditable={isEditable}
                label={values[7]?.question}
                value={getAnswerValue(values[7]?.templateInspectionQuestionId)}
                id={values[7]?.templateInspectionQuestionId}
              />
            </div>
            <div className="w-1/3 flex justify-center">
              <InputLine
                isEditable={isEditable}
                label={values[8]?.question}
                value={getAnswerValue(values[8]?.templateInspectionQuestionId)}
                id={values[8]?.templateInspectionQuestionId}
              />
            </div>
            <div className="w-1/3 flex justify-end">
              <InputLine
                isEditable={isEditable}
                label={values[9]?.question}
                value={getAnswerValue(values[9]?.templateInspectionQuestionId)}
                id={values[9]?.templateInspectionQuestionId}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black/5 text-black font-bold p-3 text-center border-t-2 border-b-0 justify-between items-center flex flex-row">
        <span>P = Passed Inspection</span>
        <span>R/P = Repaired and Passed</span>
        <span>N/A = Not Applicable</span>
      </div>
      <Separator label="90 Day Inspection" isEditable={isEditable} />
      <div className="p-5   flex flex-col gap-2  ">
        {inspections.map((item, index) => {
          return (
            <InputLineInspections
              label={item?.question.toLowerCase()}
              id={item?.templateInspectionQuestionId}
              key={index}
              value={getAnswerValue(
                item?.templateInspectionQuestionId,
                item?.typeQuestion
              )}
              className="!capitalize"
              isEditable={isEditable}
            />
          );
        })}
      </div>
      <Separator label="Annual Inspection" />
      <div
        className="p-5   flex flex-col gap-2  "
        contentEditable={isEditable}
        suppressContentEditableWarning
      >
        Replace hydraulic oil with Exkon Univis HVI-13 and filter per
        manufacturers specifications Inspect runner assembly pads / rollers and
        replace as needed
      </div>
      <Separator
        label="List all completed repairs made on this inspection work order "
        isEditable={isEditable}
      />
      <div className=" flex flex-col gap-1  ">
        <LineComplete isEditable={isEditable} />
      </div>
      <div className=" flex flex-col gap-1  border-t p-2 ">
        Commets (if applicable)
      </div>
    </div>
  );
};

export default LiftgateInspectionCheckList;

const LineComplete: React.FC<NumberedListProps> = ({
  items = [],
  isEditable,
}) => {
  const filledItems = [...items, ...Array(5)].slice(0, 5);

  return (
    <ol className="flex flex-col  ">
      {filledItems.map((item, index) => (
        <li
          key={index}
          className="flex items-center border-b border-black h-[40px] gap-2"
        >
          <span className="w-5 text-right">{index + 1}.</span>
          <div
            className="flex-1"
            contentEditable={isEditable}
            suppressContentEditableWarning
          ></div>
        </li>
      ))}
    </ol>
  );
};

const InputLine: React.FC<InputLineProps> = ({
  value,
  label,
  id,
  className,
  isEditable,
}) => {
  return (
    <div
      className={clsx(
        `flex flex-row  items-start justify-start gap-2 uppercase`,
        className
      )}
    >
      <label
        className="min-w-auto font-medium"
        contentEditable={isEditable}
        suppressContentEditableWarning
      >
        {label && label + `: `}
      </label>
      <span
        className="flex flex-1 underline "
        contentEditable={isEditable}
        suppressContentEditableWarning
      >
        {value && value}
      </span>
    </div>
  );
};

const InputLineInspections: React.FC<InputLineProps> = ({
  value,
  label,
  id,
  className,
  isEditable,
}) => {
  return (
    <div
      className={clsx(
        `flex flex-row  items-end justify-start gap-1 uppercase min-h-[21px]`,
        className
      )}
    >
      <label
        className="   flex-1 text-left "
        contentEditable={isEditable}
        suppressContentEditableWarning
      >
        {label}:
      </label>
      <span
        className="flex w-[100px] border-b justify-center text-center"
        contentEditable={isEditable}
        suppressContentEditableWarning
      >
        {value}
      </span>
    </div>
  );
};

const Separator: React.FC<SeparatorProps> = ({ label, isEditable }) => {
  return (
    <div
      contentEditable={isEditable}
      suppressContentEditableWarning
      className={clsx(
        `bg-black/20 text-black font-bold p-3 text-center border-t-2 border-b-2  `
      )}
    >
      {label}
    </div>
  );
};
