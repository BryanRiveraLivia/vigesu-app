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

// Datos por defecto basados exactamente en el PDF "ANNUAL_VEHICLE_INSPECTION_REPORT_AND_90DAYS_BIT.pdf"
const DEFAULT_CATEGORIES = [
  {
    title: "1. BRAKE SYSTEM",
    items: [
      "a. Service Brakes",
      "b. Parking Brake System",
      "c. Brake Drums or Rotors",
      "d. Brake Hose",
      "e. Brake Tubing",
      "f. Low Pressure Warning Device",
      "g. Tractor Protection Valve",
      "h. Air Compressor",
      "i. Electric Brakes",
      "j. Hydraulic Brakes",
      "k. Vacuum Systems",
    ],
  },
  {
    title: "2. COUPLING DEVICES",
    items: [
      "a. Fifth Wheels",
      "b. Pintle Hooks",
      "c. Drawbar/Towbar Eye",
      "d. Drawbar/Towbar Tongue",
      "e. Safety Devices",
      "f. Saddle-Mounts",
    ],
  },
  {
    title: "3. EXHAUST SYSTEM",
    items: [
      "a. Any exhaust system leaking forward of or directly below driver/sleeper",
      "b. Bus exhaust system leaking or discharging in violation of standards",
      "c. Exhaust system located as to cause burning, charring, or damaging wiring/fuel",
    ],
  },
  {
    title: "4. FUEL SYSTEM",
    items: [
      "a. Visible leak",
      "b. Fuel tank filler cap missing",
      "c. Fuel tank securely attached",
    ],
  },
  {
    title: "5. LIGHTING DEVICES",
    items: [
      "All lighting devices and reflectors required by Section 393 shall be operable.",
    ],
  },
  {
    title: "6. SAFE LOADING",
    items: [
      "a. Part(s) of vehicle or condition of loading such that spare tire/cargo can fall",
      "b. Protection against shifting cargo",
    ],
  },
  {
    title: "7. STEERING MECHANISM",
    items: [
      "a. Steering Wheel Free Play",
      "b. Steering Column",
      "c. Front Axle Beam & All Steering Components",
      "d. Steering Gear Box",
      "e. Pitman Arm",
      "f. Power Steering",
      "g. Ball and Socket Joints",
      "h. Tie Rods and Drag Links",
      "i. Nuts",
      "j. Steering System",
    ],
  },
  {
    title: "8. SUSPENSION",
    items: [
      "a. U-bolt(s), spring hanger(s) positioning part(s) cracked, broken, loose or missing",
      "b. Spring Assembly",
      "c. Torque, Radius or Tracking Components",
    ],
  },
  {
    title: "9. FRAME",
    items: [
      "a. Frame Members",
      "b. Tire and Wheel Clearance",
      "c. Adjustable Axle Assemblies (Sliding Subframes)",
    ],
  },
  {
    title: "10. TIRES",
    items: [
      "a. Tires on any steering axle of a power unit",
      "b. All other tires",
    ],
  },
  {
    title: "11. WHEELS AND RIMS",
    items: [
      "a. Lock or Side Ring",
      "b. Wheels and Rims",
      "c. Fasteners",
      "d. Welds",
    ],
  },
  {
    title: "12. WINDSHIELD GLAZING",
    items: [
      "Requirements and exceptions as stated pertaining to any crack, discoloration or vision reducing matter",
    ],
  },
  {
    title: "13. WINDSHIELD WIPERS",
    items: [
      "Any power unit that has an inoperative wiper, or missing or damaged parts that render it ineffective.",
    ],
  },
];

const AnnualVehicleInspectionReport90DaysBit: FC<Props> = ({
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
    <div className="text-black max-w-full font-sans bg-white mx-auto pt-[15px] mt-2 print-no-flex print-no-gap border-2 p-5 text-xs leading-normal">
      {/* HEADER SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b-2 pb-4 mb-4 items-center">
        <div className="md:col-span-4 flex flex-col items-start justify-center">
          <div className="flex items-center gap-2">
            {/* Flower-like Logo / Brand */}
            <span className="text-3xl font-black tracking-tighter text-[#7c3174]">
              VISEGU
            </span>
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-700">
            Maintenance & Service
          </p>
          <p className="text-[10px] text-gray-600">Phone: 510-719-1444</p>
        </div>

        <div className="md:col-span-5 text-center">
          <h1
            className="font-extrabold text-xl md:text-2xl tracking-tight uppercase leading-none text-black"
            contentEditable={isEditable}
            suppressContentEditableWarning
          >
            ANNUAL VEHICLE INSPECTION REPORT
          </h1>
          <p className="font-bold text-lg md:text-xl font-serif italic text-gray-800 mt-1">
            and 90 Days Bit.
          </p>
        </div>

        <div className="md:col-span-3 border-2 border-black">
          <div className="bg-gray-200 text-center font-bold text-[10px] py-0.5 border-b border-black uppercase">
            VEHICLE HISTORY RECORD
          </div>
          <div className="grid grid-cols-2 border-b border-black text-[9px]">
            <div className="border-r border-black p-1">
              <span className="block font-bold">REPORT NUMBER</span>
              <span className="text-sm font-semibold block text-center mt-0.5 min-h-[16px]">
                {matchById(601)?.detail?.finalResponse || data?.name || "—"}
              </span>
            </div>
            <div className="p-1">
              <span className="block font-bold">FLEET UNIT NUMBER</span>
              <span className="text-sm font-semibold block text-center mt-0.5 min-h-[16px]">
                {matchById(602)?.detail?.finalResponse || "—"}
              </span>
            </div>
          </div>
          <div className="p-1 text-[9px]">
            <span className="block font-bold">DATE</span>
            <span className="text-xs font-semibold block text-center mt-0.5 min-h-[16px]">
              {matchById(603)?.detail?.finalResponse || new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* GENERAL INFORMATION GRID */}
      <div className="border-2 border-black grid grid-cols-1 md:grid-cols-2 text-[10px] mb-4 bg-gray-50/50">
        <div className="border-b md:border-b-0 md:border-r border-black p-1.5 flex flex-col justify-between min-h-[42px]">
          <span className="font-bold uppercase text-gray-600">MOTOR CARRIER OPERATOR</span>
          <span className="font-semibold text-xs text-black px-1">
            {matchById(604)?.detail?.finalResponse || "—"}
          </span>
        </div>
        <div className="p-1.5 flex flex-col justify-between min-h-[42px]">
          <span className="font-bold uppercase text-gray-600">INSPECTOR&apos;S NAME (PRINT OR TYPE)</span>
          <span className="font-semibold text-xs text-black px-1">
            {matchById(605)?.detail?.finalResponse || "—"}
          </span>
        </div>

        <div className="border-t border-black md:border-r p-1.5 flex flex-col justify-between min-h-[42px]">
          <span className="font-bold uppercase text-gray-600">ADDRESS</span>
          <span className="font-semibold text-xs text-black px-1">
            {matchById(606)?.detail?.finalResponse || "—"}
          </span>
        </div>
        <div className="border-t border-black p-1.5 flex items-center justify-between">
          <span className="font-bold uppercase text-gray-600 text-[9px] leading-tight">
            THIS INSPECTOR MEETS THE QUALIFICATION REQUIREMENTS IN SECTION 396.19.
          </span>
          <div className="flex items-center gap-1 font-bold ml-2">
            <span className="w-4 h-4 border border-black inline-flex items-center justify-center font-bold text-xs bg-white">
              ✔
            </span>
            <span>YES</span>
          </div>
        </div>

        <div className="border-t border-black md:border-r p-1.5 flex flex-col justify-between min-h-[42px]">
          <span className="font-bold uppercase text-gray-600">CITY, STATE, ZIP CODE</span>
          <span className="font-semibold text-xs text-black px-1">
            {matchById(607)?.detail?.finalResponse || "—"}
          </span>
        </div>
        <div className="border-t border-black p-1.5 flex flex-col justify-between min-h-[42px]">
          <div className="flex justify-between items-center">
            <span className="font-bold uppercase text-gray-600">VEHICLE IDENTIFICATION (...) AND COMPLETE</span>
            <div className="flex gap-3 font-semibold text-[9px]">
              <span>[ ] LIC. PLATE NO.</span>
              <span>[ ] VIN</span>
              <span>[ ] OTHER</span>
            </div>
          </div>
          <span className="font-semibold text-xs text-black px-1">
            {matchById(608)?.detail?.finalResponse || "—"}
          </span>
        </div>

        <div className="border-t border-black md:border-r p-1.5 flex items-center justify-between min-h-[38px]">
          <span className="font-bold uppercase text-gray-600">VEHICLE TYPE</span>
          <div className="flex gap-3 font-semibold text-[9px]">
            <span>[ ] TRACTOR</span>
            <span>[ ] TRAILER</span>
            <span>[ ] TRUCK</span>
            <span>[ ] (OTHER)</span>
          </div>
        </div>
        <div className="border-t border-black p-1.5 flex flex-col justify-between min-h-[38px]">
          <span className="font-bold uppercase text-gray-600">INSPECTION AGENCY/LOCATION (OPTIONAL)</span>
          <span className="font-semibold text-xs text-black px-1">
            {matchById(609)?.detail?.finalResponse || "—"}
          </span>
        </div>
      </div>

      {/* TABLE SECTION: VEHICLE COMPONENTS INSPECTED */}
      <div className="border-2 border-black mb-4">
        <div className="bg-gray-400 text-white font-extrabold text-center py-1 text-xs uppercase tracking-wider border-b border-black">
          VEHICLE COMPONENTS INSPECTED
        </div>

        {hasDynamicQuestions ? (
          /* MODO 1: PREGUNTAS DINÁMICAS DESDE BACKEND */
          <div className="p-2">
            <div className="grid grid-cols-12 bg-gray-200 font-bold text-[10px] uppercase py-1.5 px-2 border-b border-black text-gray-800">
              <div className="col-span-1 text-center">OK</div>
              <div className="col-span-2 text-center">NEEDS REPAIR</div>
              <div className="col-span-2 text-center">REPAIRED DATE</div>
              <div className="col-span-7 pl-2">ITEM / QUESTION CONFIGURED</div>
            </div>
            <div className="divide-y divide-gray-300">
              {questions.map((item, idx) => {
                const val = getAnswerValue(
                  item.templateInspectionQuestionId,
                  item.typeQuestion
                );
                const isOk = val.toLowerCase().includes("ok") || val.toLowerCase() === "yes" || val === "✔";
                const needsRep = val.toLowerCase().includes("repair") || val.toLowerCase() === "no" || val === "x";
                return (
                  <div key={idx} className="grid grid-cols-12 items-center py-1 px-2 text-[11px] hover:bg-gray-50">
                    <div className="col-span-1 text-center font-bold text-green-700">
                      {isOk ? "✔" : ""}
                    </div>
                    <div className="col-span-2 text-center font-bold text-red-600">
                      {needsRep ? "X" : ""}
                    </div>
                    <div className="col-span-2 text-center text-gray-500 text-[10px]">
                      {val && !isOk && !needsRep ? val : "—"}
                    </div>
                    <div className="col-span-7 pl-2 font-medium">
                      {idx + 1}. {item.question}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* MODO 2: PLANTILLA FIDEDIGNA AL PDF (CUANDO NO HAY PREGUNTAS EN DB AÚN) */
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black bg-white">
            {[
              DEFAULT_CATEGORIES.slice(0, 3), // Columna 1 (Brakes, Coupling, Exhaust)
              DEFAULT_CATEGORIES.slice(3, 8), // Columna 2 (Fuel, Lighting, Loading, Steering, Suspension)
              DEFAULT_CATEGORIES.slice(8, 13), // Columna 3 (Frame, Tires, Wheels, Glazing, Wipers)
            ].map((colGroup, colIndex) => (
              <div key={colIndex} className="flex flex-col">
                {/* Cabecera de sub-tabla */}
                <div className="grid grid-cols-12 bg-gray-200 border-b border-black text-[8px] font-bold text-center py-1 uppercase">
                  <div className="col-span-1 border-r border-black">OK</div>
                  <div className="col-span-2 border-r border-black leading-tight">NEEDS<br/>REPAIR</div>
                  <div className="col-span-2 border-r border-black leading-tight">REPAIRED<br/>DATE</div>
                  <div className="col-span-7 text-left pl-1.5 flex items-center">ITEM</div>
                </div>

                {/* Lista de categorías e ítems en la columna */}
                <div className="flex-1 divide-y divide-gray-200 text-[10px]">
                  {colGroup.map((cat, catIdx) => (
                    <div key={catIdx} className="pb-1">
                      <div className="font-extrabold bg-gray-100 px-1.5 py-0.5 text-black border-b border-gray-300">
                        {cat.title}
                      </div>
                      <div className="divide-y divide-gray-100">
                        {cat.items.map((itemStr, itemIdx) => (
                          <div key={itemIdx} className="grid grid-cols-12 items-center min-h-[22px] hover:bg-gray-50">
                            <div className="col-span-1 border-r border-gray-300 h-full flex items-center justify-center font-bold text-green-700">
                              {/* Espacio para check OK */}
                            </div>
                            <div className="col-span-2 border-r border-gray-300 h-full flex items-center justify-center font-bold text-red-600">
                              {/* Espacio para check NEEDS REPAIR */}
                            </div>
                            <div className="col-span-2 border-r border-gray-300 h-full flex items-center justify-center text-[8px] text-gray-500">
                              {/* Espacio para fecha */}
                            </div>
                            <div className="col-span-7 pl-1.5 py-0.5 text-[9px] leading-tight text-gray-800">
                              {itemStr}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sección de condición adicional u observaciones */}
        <div className="border-t-2 border-black p-2 bg-gray-50/40">
          <p className="font-bold uppercase text-[9px] mb-1">
            List any other condition which may prevent safe operation of this vehicle:
          </p>
          <div
            className="border border-gray-300 bg-white min-h-[45px] p-1.5 text-xs text-gray-800"
            contentEditable={isEditable}
            suppressContentEditableWarning
          >
            {matchById(610)?.detail?.finalResponse || ""}
          </div>
        </div>
      </div>

      {/* FOOTER & CERTIFICATION SECTION */}
      <div className="border-2 border-black p-2 bg-gray-100 text-[9px] font-bold uppercase mb-3 flex flex-wrap items-center justify-between gap-2">
        <span>INSTRUCTIONS: MARK COLUMN ENTRIES TO VERIFY INSPECTION:</span>
        <div className="flex items-center gap-4">
          <span><strong className="underline text-black">X</strong> OK,</span>
          <span><strong className="underline text-black">X</strong> NEEDS REPAIR,</span>
          <span><strong className="underline text-black">NA</strong> IF ITEMS DO NOT APPLY.</span>
          <span>__________ REPAIRED DATE</span>
        </div>
      </div>

      <div className="border p-2 bg-white text-[10px] font-extrabold uppercase tracking-wide text-black mb-6 leading-relaxed border-black text-center">
        CERTIFICATION: THIS VEHICLE HAS PASSED ALL THE INSPECTION ITEMS FOR THE ANNUAL VEHICLE INSPECTION REPORT IN ACCORDANCE WITH 49 CFR 396.
      </div>

      {/* SIGNATURES AND CODE */}
      <div className="flex justify-between items-end pt-4 border-t border-gray-400 text-[9px] font-bold text-gray-500">
        <div>
          <span>QUALIFIED INSPECTOR SIGNATURE: _________________________________________</span>
        </div>
        <div className="text-right">
          <span>400-FS-C2<br />Rev. 3/94</span>
        </div>
      </div>
    </div>
  );
};

export default AnnualVehicleInspectionReport90DaysBit;
