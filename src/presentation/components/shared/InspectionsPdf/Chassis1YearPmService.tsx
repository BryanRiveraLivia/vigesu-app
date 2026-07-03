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

interface CategoryGroup {
  category: string;
  subtitle?: string;
  items: string[];
}

// Estructura oficial del PDF CHASSIS_1_YEAR_PM_SERVICE.pdf (Columna Izquierda y Derecha)
const LEFT_COLUMN_CATEGORIES: CategoryGroup[] = [
  {
    category: "FRAME & GOOSENECK",
    items: [
      "1. Bends",
      "2. Cracks",
      "3. Welds",
      "4. Check slider & lubricate",
    ],
  },
  {
    category: "KING PIN",
    items: [
      "5. Tap for soundness/cracks",
      "6. Check for wear",
    ],
  },
  {
    category: "LOCKING DEVICES",
    items: [
      "7. Twist locks",
      "8. Index pins",
      "9. Lubricate",
    ],
  },
  {
    category: "LANDING GEAR",
    items: [
      "10. All components in tact",
      "11. Tightness of mounts",
      "12. Operation (turn twice) both speeds",
      "13. Lubricate",
    ],
  },
  {
    category: "BUMPERS",
    items: [
      "14. Rear Impact Guard",
    ],
  },
  {
    category: "BRAKE SYSTEM",
    subtitle: "Chock wheels before releasing brakes!",
    items: [
      "15a. Manual slack adjusters: Adjust (per MFG spec)\nMeasure & record pushrod travel:\nLF ___ RF ___ LR ___ RR ___",
      "15b. Automatic Slack adjusters: Measure & record pushrod travel:\nLF ___ RF ___ LR ___ RR ___\n(troubleshoot if past limit)",
      "16. Lubricate cam bushing, slack adjusters",
      "17. Brake drums",
      "18. Brake linings (1/4\" minimum)",
      "19. ABS system",
      "20. Air hoses, air lines, fittings",
      "21. Gladhands, seals (replace seals if nec.)",
      "22. Relay valves, springbrakes",
      "23. Drain reservoirs, lubricate drain valves",
      "24. Air test (Audible leaks)",
    ],
  },
];

const RIGHT_COLUMN_CATEGORIES: CategoryGroup[] = [
  {
    category: "LIGHTS",
    items: [
      "25. Test & repair as needed",
      "26. Reflectors, conspicuity tape",
    ],
  },
  {
    category: "SUSPENSION",
    items: [
      "27. U-bolts",
      "28. Radius Rods, equalizer",
      "29. Springs & hangers",
    ],
  },
  {
    category: "AXLES",
    items: [
      "30. Bent/misaligned",
      "31. Cracks",
      "32. Inspect for hub leaks (Inc. inner seal)",
      "33. Add oil to proper level (Oil hubs)",
      "34. Check hub cap tightness",
    ],
  },
  {
    category: "TIRES & WHEELS",
    items: [
      "35. INFLATE TIRES:\nBIAS @ 85 PSI / RADIAL @ 100 PSI",
      "36. 3/32\" minimum thread depth",
      "37. Duals matched within 7/16\"",
      "38. General condition (dryrot, damaged, etc.)",
      "39. Install metal valve caps (all tires)",
    ],
  },
  {
    category: "CREDENTIALS",
    items: [
      "40. Check lug nuts for tightness",
      "41. Mud flaps, general appearance",
      "42. License plate",
      "43. Registration papers",
      "44. Decals/stencils & markings in place & legible ( )",
      "   a) FRONT UNIT #",
      "   b) 40/45 FT DECAL/STENCIL (IF EXTENDABLE)",
      "   c) FMCSA DECAL",
      "   d) L.H. SIDE UNIT #",
      "   e) VIN PLATE",
      "   f) REAR UNIT #",
      "   g) R.H. SIDE UNIT #",
      "   h) WEIGHT DECAL",
    ],
  },
];

const Chassis1YearPmService: FC<Props> = ({
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
    <div className="text-black max-w-full font-sans bg-white mx-auto pt-[15px] mt-2 print-no-flex print-no-gap border-2 border-black p-4 text-xs leading-normal">
      {/* HEADER SECTION */}
      <div className="text-center mb-3">
        <h1
          className="font-extrabold text-2xl md:text-3xl tracking-tight uppercase leading-none text-black font-serif"
          contentEditable={isEditable}
          suppressContentEditableWarning
        >
          CHASSIS 1 YEAR P.M. SERVICE
        </h1>
        <p className="text-[11px] font-medium text-gray-700 mt-1">
          All inspection criteria derived from FMCSA CFR49 Part 396 and Appendix A subpart B
        </p>
      </div>

      {/* 7-COLUMN HEADER INFO GRID */}
      <div className="border-2 border-black grid grid-cols-2 md:grid-cols-7 text-[10px] mb-2 bg-gray-50/50">
        <div className="border-b md:border-b-0 md:border-r border-black p-1 flex flex-col justify-between min-h-[44px]">
          <span className="font-bold uppercase text-[9px]">UNIT NUMBER</span>
          <span className="font-semibold text-sm text-black px-1">
            {matchById(701)?.detail?.finalResponse || data?.name || "—"}
          </span>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-black p-1 flex flex-col justify-between min-h-[44px]">
          <span className="font-bold uppercase text-[9px]">LICENSE NUMBER</span>
          <span className="font-semibold text-sm text-black px-1">
            {matchById(702)?.detail?.finalResponse || "—"}
          </span>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-black p-1 flex flex-col justify-between min-h-[44px]">
          <span className="font-bold uppercase text-[9px]">OWNER</span>
          <span className="font-semibold text-sm text-black px-1">
            {matchById(703)?.detail?.finalResponse || "DCLI"}
          </span>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-black p-1 flex flex-col justify-between min-h-[44px]">
          <span className="font-bold uppercase text-[9px]">DATE COMPLETED</span>
          <span className="font-semibold text-sm text-black px-1">
            {matchById(704)?.detail?.finalResponse || new Date().toLocaleDateString()}
          </span>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-black p-1 flex flex-col justify-between min-h-[44px]">
          <span className="font-bold uppercase text-[9px]">FACILITY</span>
          <span className="font-semibold text-sm text-black px-1">
            {matchById(705)?.detail?.finalResponse || "—"}
          </span>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-black p-1 flex flex-col justify-between min-h-[44px]">
          <span className="font-bold uppercase text-[9px]">MECHANIC'S NAME (PRINT)</span>
          <span className="font-semibold text-sm text-black px-1 capitalize">
            {matchById(706)?.detail?.finalResponse || "—"}
          </span>
        </div>
        <div className="p-1 flex flex-col justify-between min-h-[44px]">
          <span className="font-bold uppercase text-[9px]">SIGNATURE OF MECHANIC</span>
          <span className="font-serif italic text-sm text-gray-800 px-1">
            {matchById(707)?.detail?.finalResponse || "Signed"}
          </span>
        </div>
      </div>

      {/* LEGEND BAR */}
      <div className="border-2 border-black bg-gray-100 text-center py-1 mb-3 text-[10px] font-bold">
        <div className="uppercase tracking-wider mb-0.5">CODE COLUMN AS INSPECTION IS COMPLETED</div>
        <div className="flex flex-wrap justify-center items-center gap-6 text-[9px] text-gray-800">
          <span><strong>(X)</strong> = INSPECTION</span>
          <span><strong>R</strong> = MINOR REPAIRS MADE</span>
          <span><strong>SR</strong> = SHOP REPAIRS REQUIRED</span>
        </div>
      </div>

      {/* TABLE SECTION */}
      {hasDynamicQuestions ? (
        /* MODO 1: PREGUNTAS DINÁMICAS CONFIGURADAS POR EL BACKEND */
        <div className="border-2 border-black mb-3">
          <div className="grid grid-cols-12 bg-gray-200 font-bold text-[10px] uppercase py-1.5 px-2 border-b border-black text-gray-800">
            <div className="col-span-7 pl-2">INSPECT / ITEM CONFIGURED</div>
            <div className="col-span-2 text-center border-l border-black">CODE</div>
            <div className="col-span-3 text-center border-l border-black">REMARKS</div>
          </div>
          <div className="divide-y divide-gray-300">
            {questions.map((item, idx) => {
              const val = getAnswerValue(
                item.templateInspectionQuestionId,
                item.typeQuestion
              );
              let code = "";
              let remarks = val;
              if (val.toLowerCase() === "ok" || val.toLowerCase() === "yes" || val === "✔" || val.toLowerCase() === "x") {
                code = "X";
                remarks = "";
              } else if (val.toLowerCase().includes("minor") || val.toLowerCase() === "r") {
                code = "R";
              } else if (val.toLowerCase().includes("shop") || val.toLowerCase() === "sr") {
                code = "SR";
              }
              return (
                <div key={idx} className="grid grid-cols-12 items-center min-h-[26px] text-[11px] hover:bg-gray-50">
                  <div className="col-span-7 pl-2 py-1 font-medium">
                    {idx + 1}. {item.question}
                  </div>
                  <div className="col-span-2 h-full flex items-center justify-center font-bold border-l border-gray-300 text-center">
                    {code || (val.length <= 3 ? val : "X")}
                  </div>
                  <div className="col-span-3 h-full flex items-center px-2 border-l border-gray-300 text-gray-600 text-[10px]">
                    {remarks || "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MODO 2: PLANTILLA FIDEDIGNA AL PDF (2 COLUMNAS: IZQUIERDA Y DERECHA) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-black mb-3 bg-white">
          {[LEFT_COLUMN_CATEGORIES, RIGHT_COLUMN_CATEGORIES].map((colGroup, colIndex) => (
            <div
              key={colIndex}
              className={clsx(
                "flex flex-col",
                colIndex === 0 ? "border-b md:border-b-0 md:border-r-2 border-black" : ""
              )}
            >
              {/* Cabecera de Columna */}
              <div className="grid grid-cols-12 bg-gray-200 border-b border-black text-[9px] font-bold text-center py-1 uppercase">
                <div className="col-span-3 border-r border-black flex items-center justify-center">CATEGORY</div>
                <div className="col-span-5 border-r border-black flex items-center justify-center">INSPECT</div>
                <div className="col-span-1 border-r border-black flex items-center justify-center">CODE</div>
                <div className="col-span-3 flex items-center justify-center">REMARKS</div>
              </div>

              {/* Contenido de Columna */}
              <div className="flex-1 divide-y divide-gray-300 text-[10px]">
                {colGroup.map((cat, catIdx) => (
                  <div key={catIdx} className="grid grid-cols-12 min-h-[40px]">
                    {/* Categoría principal */}
                    <div className="col-span-3 border-r border-gray-300 bg-gray-100 p-1 font-extrabold flex items-center justify-center text-center text-[9px] uppercase tracking-tighter">
                      {cat.category}
                    </div>

                    {/* Contenedor de Ítems */}
                    <div className="col-span-9 flex flex-col divide-y divide-gray-200">
                      {cat.subtitle && (
                        <div className="bg-yellow-50/80 font-bold text-[9px] text-center py-0.5 border-b border-gray-200 uppercase text-red-700">
                          {cat.subtitle}
                        </div>
                      )}
                      {cat.items.map((itemStr, itemIdx) => {
                        const isSubItem = itemStr.trim().startsWith("a)") || itemStr.trim().startsWith("b)") || itemStr.trim().startsWith("c)") || itemStr.trim().startsWith("d)") || itemStr.trim().startsWith("e)") || itemStr.trim().startsWith("f)") || itemStr.trim().startsWith("g)") || itemStr.trim().startsWith("h)");
                        const isMultiLine = itemStr.includes("\n");
                        return (
                          <div key={itemIdx} className="grid grid-cols-9 items-stretch min-h-[22px] hover:bg-gray-50">
                            <div className={clsx(
                              "col-span-5 border-r border-gray-300 p-1 flex items-center text-[9px] leading-tight",
                              isSubItem ? "pl-4 font-medium text-gray-700" : "font-normal text-gray-900",
                              isMultiLine ? "whitespace-pre-line py-1.5" : ""
                            )}>
                              {itemStr}
                            </div>
                            <div className="col-span-1 border-r border-gray-300 flex items-center justify-center font-bold text-black text-xs">
                              {/* Espacio para CODE (X / R / SR) */}
                            </div>
                            <div className="col-span-3 flex items-center px-1 text-[8px] text-gray-500">
                              {/* Espacio para REMARKS */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER NOTES AND BRANDING */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-2 text-[9px] font-bold text-gray-700 gap-2">
        <div>
          <span>M&R01 Revised 3/22</span>
        </div>
        <div className="text-center font-extrabold text-red-600 tracking-widest uppercase text-xs">
          DCLI COPY
        </div>
        <div>
          <span>NOTE: In the event fasteners are found to be loose, retorque per manufacturers recommended settings.</span>
        </div>
      </div>
    </div>
  );
};

export default Chassis1YearPmService;
