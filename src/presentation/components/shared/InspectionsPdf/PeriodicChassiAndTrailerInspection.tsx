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

// Estructura oficial del PDF PERIODIC_CHASSI_AND_TRAILER_INSPECTION.pdf
const DEFAULT_ITEMS = [
  "BREAKES, DRUMS, SEALS",
  "SLACK ADJUSTMENT",
  "AIR SYSTEM, AIR VALVE, HOSES, BRAKE CHAMBER",
  "LIGHT AND REFLECTORS",
  "7 WAY PLUG AND WIRING",
  "TIRES, WHEELS AND RIMS",
  "LANDING GEAR, LEG, BRACES, CRANK, HANDLE",
  "TWISTLOCKS, PIN LOCKS, LATCHES",
  "SUSPENSION U-BOLTS, HANGERS, RADIUS ROD, AXLES",
  "BODY FRAMES, STRUCTURAL, KING PIN / PLATE, CROSS MEMEBERS",
  "DECALS / LOGO",
  "LUBRICATiON, FITTINGS, LOCKS, LANDING GEAR, SLIDER",
];

const PeriodicChassiAndTrailerInspection: FC<Props> = ({
  data,
  inspectionDetails = [],
  isEditable,
}) => {
  const matchById = useMemo(
    () => buildQuestionMatcherGeneric(data, inspectionDetails),
    [data, inspectionDetails]
  );

  const getAnswerValue = (
    templateQuestionId?: number,
    typeQuestion?: number
  ) => {
    if (!templateQuestionId) return "";
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
  const hasDynamicQuestions = questions.length > 0;

  return (
    <div className="text-black max-w-full font-sans bg-white mx-auto pt-[15px] mt-2 print-no-flex print-no-gap border-2 border-black p-5 text-xs leading-normal">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-black pb-3 mb-4 gap-4">
        <div className="flex items-center gap-2">
          {/* Logo Brand */}
          <span className="text-3xl font-black tracking-tighter text-[#7c3174]">
            VISEGU
          </span>
        </div>
        <div className="text-center md:text-right text-[10px] font-medium text-gray-800 leading-tight">
          <p>16198 Via Arriba San Lorenzo, CA 94580 (510) 719-1444</p>
          <p>www.visegu.com | percyruiz@visegu.com</p>
        </div>
      </div>

      {/* MAIN TITLE */}
      <div className="text-center mb-4">
        <h1
          className="font-extrabold text-xl md:text-2xl tracking-wide uppercase leading-none text-black font-serif underline decoration-2 underline-offset-4"
          contentEditable={isEditable}
          suppressContentEditableWarning
        >
          PERIODIC CHASSI AND TRAILER INSPECTION
        </h1>
      </div>

      {/* 4 LINES OF METADATA */}
      <div className="border-2 border-black p-3 mb-4 bg-gray-50/40 text-[11px] font-semibold space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-300 pb-1.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Last Annual Periodic Inspection / FMCSA:</span>
            <span className="border-b border-black font-bold px-2 min-w-[120px] text-center">
              {matchById(801)?.detail?.finalResponse || "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">New FMCSA:</span>
            <span className="border-b border-black font-bold px-2 min-w-[120px] text-center">
              {matchById(802)?.detail?.finalResponse || "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-300 pb-1.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Last California Periodic Inspection / BIT:</span>
            <span className="border-b border-black font-bold px-2 min-w-[120px] text-center">
              {matchById(803)?.detail?.finalResponse || "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">New BIT:</span>
            <span className="border-b border-black font-bold px-2 min-w-[120px] text-center">
              {matchById(804)?.detail?.finalResponse || "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-300 pb-1.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">License Number:</span>
            <span className="border-b border-black font-bold px-2 min-w-[80px] text-center">
              {matchById(805)?.detail?.finalResponse || "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">State:</span>
            <span className="border-b border-black font-bold px-2 min-w-[60px] text-center">
              {matchById(806)?.detail?.finalResponse || "CA"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Location:</span>
            <span className="border-b border-black font-bold px-2 min-w-[80px] text-center">
              {matchById(807)?.detail?.finalResponse || "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Equipment Mark and Number:</span>
            <span className="border-b border-black font-bold px-2 min-w-[140px] text-center">
              {matchById(808)?.detail?.finalResponse || data?.name || "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Chassis Owner or Lessor:</span>
            <span className="border-b border-black font-bold px-2 min-w-[140px] text-center">
              {matchById(809)?.detail?.finalResponse || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="border-2 border-black mb-5">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-200 border-b-2 border-black text-[10px] font-extrabold text-center py-2 uppercase tracking-wider text-black">
          <div className="col-span-4 border-r border-black flex items-center justify-start pl-2">INSPECTION ITEM</div>
          <div className="col-span-1 border-r border-black flex items-center justify-center">O. K.</div>
          <div className="col-span-5 border-r border-black flex items-center justify-start pl-2">REPAIR / REPLACE ITEMS</div>
          <div className="col-span-1 border-r border-black flex items-center justify-center leading-tight">LABOR<br/>CODE</div>
          <div className="col-span-1 flex items-center justify-center leading-tight">MATERIAL<br/>CODE</div>
        </div>

        {/* Table Rows */}
        {hasDynamicQuestions ? (
          /* MODO 1: PREGUNTAS DINÁMICAS CONFIGURADAS POR EL BACKEND */
          <div className="divide-y divide-gray-300">
            {questions.map((item, idx) => {
              const val = getAnswerValue(
                item.templateInspectionQuestionId,
                item.typeQuestion
              );
              const isOk = val.toLowerCase() === "ok" || val.toLowerCase() === "yes" || val === "✔" || val.toLowerCase() === "x";
              return (
                <div key={idx} className="grid grid-cols-12 items-center min-h-[32px] text-[11px] hover:bg-gray-50">
                  <div className="col-span-4 border-r border-gray-300 pl-2 py-1 font-medium text-gray-900">
                    {idx + 1}. {item.question}
                  </div>
                  <div className="col-span-1 border-r border-gray-300 h-full flex items-center justify-center font-bold text-green-700 text-sm">
                    {isOk ? "✔" : ""}
                  </div>
                  <div className="col-span-5 border-r border-gray-300 h-full flex items-center pl-2 py-1 text-gray-800 text-[10px]">
                    {!isOk ? val : ""}
                  </div>
                  <div className="col-span-1 border-r border-gray-300 h-full flex items-center justify-center text-[10px] font-semibold text-gray-600">
                    {/* Espacio Labor Code */}
                  </div>
                  <div className="col-span-1 h-full flex items-center justify-center text-[10px] font-semibold text-gray-600">
                    {/* Espacio Material Code */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* MODO 2: PLANTILLA FIDEDIGNA AL PDF (CUANDO NO HAY PREGUNTAS EN DB AÚN) */
          <div className="divide-y divide-gray-300 bg-white">
            {DEFAULT_ITEMS.map((itemStr, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center min-h-[32px] hover:bg-gray-50">
                <div className="col-span-4 border-r border-gray-300 pl-2 py-1.5 font-bold text-[10px] text-gray-900 tracking-tight">
                  {itemStr}
                </div>
                <div className="col-span-1 border-r border-gray-300 h-full flex items-center justify-center font-bold text-green-700 text-sm">
                  {/* Check OK */}
                </div>
                <div className="col-span-5 border-r border-gray-300 h-full flex items-center pl-2 text-gray-500 text-[10px]">
                  {/* Repair items */}
                </div>
                <div className="col-span-1 border-r border-gray-300 h-full flex items-center justify-center text-gray-400 text-[9px]">
                  {/* Labor code */}
                </div>
                <div className="col-span-1 h-full flex items-center justify-center text-gray-400 text-[9px]">
                  {/* Material code */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CERTIFICATION LEGAL DISCLAIMER BOX */}
      <div className="border border-black p-3 bg-gray-100 text-[9px] font-bold text-gray-900 uppercase leading-relaxed mb-8 text-justify tracking-tight">
        I CERTIFY THIS UNIT HAS UNDERGONE INSPECTION AND REPAIRS AND THAT IT MEETS REQUIREMENTS OF 49 CFR 396.17 AND AB2706- CALIFORNIA COMMERCIAL SAFETY VEHICLE ACT. 1988 BIT OR FMCSA INSPECTION. THIS CERTIFICATION DOES NOT APPLY TO DAMAGE OR DEFECTS TO THE UNIT RESULTING FROM THE USE OR IMPROPER HANDLING AFTER THE DATE OF OUR INSPECTION. WE ARENT RELIABLE FOR ANY DEATH OR INJURIES TO PERSONALE OR PROPERTY.
      </div>

      {/* SIGNATURES AND DATE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-400 text-center text-[10px] font-bold text-gray-700">
        <div className="flex flex-col items-center">
          <div className="border-b border-black w-full min-h-[28px] mb-1 flex items-end justify-center pb-0.5 font-semibold text-black capitalize">
            {matchById(810)?.detail?.finalResponse || "—"}
          </div>
          <span>PRINT INSPECTION NAME</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="border-b border-black w-full min-h-[28px] mb-1 flex items-end justify-center pb-0.5 font-serif italic text-black">
            {matchById(811)?.detail?.finalResponse || "Signed"}
          </div>
          <span>INSPECTOR SIGNATURE</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="border-b border-black w-full min-h-[28px] mb-1 flex items-end justify-center pb-0.5 font-bold text-black">
            {matchById(812)?.detail?.finalResponse || new Date().toLocaleDateString()}
          </div>
          <span>DATE OF INSPECTION</span>
        </div>
      </div>
    </div>
  );
};

export default PeriodicChassiAndTrailerInspection;
