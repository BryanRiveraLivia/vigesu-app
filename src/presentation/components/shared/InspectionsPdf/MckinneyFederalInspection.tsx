import { DOMAIN } from "@/core/config/constants";
import { TypeQuestion } from "@/features/orders/models/workOrder.types";
import { PropsPDF } from "@/core/types/inspection/ITypes";
import { buildQuestionMatcherGeneric } from "@/core/utils/buildQuestionMatcher";
import { getAnswersFromDetails } from "@/core/utils/getAnswerValue";
import { it } from "@faker-js/faker";
import clsx from "clsx";
import React, { FC, useMemo } from "react";

type InspectionDetailAnswerItem = {
  inspectionDetailAnswerItemId: number;
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
};

type InspectionDetailAnswer = {
  inspectionDetailAnswerId: number;
  typeInspectionDetailAnswerId: number;
  response: string;
  items: InspectionDetailAnswerItem[];
};

type InspectionDetail = {
  inspectionDetailId: number;
  typeInspectionDetailId: number;
  templateInspectionQuestionId: number;
  typeInspectionDetailAnswerId: number;
  finalResponse: string;
  inspectionDetailAnswers: InspectionDetailAnswer[];
};

type MinimalAnswer = { response?: string };
type MinimalInspectionDetail = {
  finalResponse?: string;
  inspectionDetailAnswers?: MinimalAnswer[];
};

const MckinneyFederalInspection: React.FC<PropsPDF> = ({
  data,
  inspectionDetails,
  isEditable,
}) => {
  console.log("data: ", data);
  console.log("inspectionDetails: ", inspectionDetails);

  const matchById = useMemo(
    () => buildQuestionMatcherGeneric(data, inspectionDetails),
    [data, inspectionDetails]
  );

  const getAnswerValue = (templateQuestionId: number) => {
    const match = inspectionDetails
      ? inspectionDetails.find(
          (item) =>
            Number(item.templateInspectionQuestionId) ===
            Number(templateQuestionId)
        )
      : null;

    if (!match) {
      console.warn(`❌ Sin match para QuestionId: ${templateQuestionId}`);
      return "";
    }

    const typeQuestion = data?.templateInspectionQuestions.find(
      (item) => item.templateInspectionQuestionId === Number(templateQuestionId)
    )?.typeQuestion;

    if (!typeQuestion) {
      console.warn(`❌ Sin match para typeQuestion: ${templateQuestionId}`);
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

    return value || "";
  };

  const render = <
    T extends {
      templateInspectionQuestionId?: number | string;
      finalResponse?: string;
      inspectionDetailAnswers?: { response?: string }[];
    },
  >(
    details: T[] | undefined,
    templateQuestionId: number
  ): { left: string | null; right: string | null } => {
    if (!Array.isArray(details)) return { left: null, right: null };

    const detail = details.find(
      (d) =>
        Number(d.templateInspectionQuestionId) === Number(templateQuestionId)
    );
    if (!detail) return { left: null, right: null };

    const final = detail.finalResponse?.trim().toUpperCase() ?? "";
    const answers = detail.inspectionDetailAnswers ?? [];
    const hasR = answers.some((a) => a.response?.trim().toUpperCase() === "R");

    const normalized = final === "OK" ? "✔" : final;

    // Caso 1: Final = R
    if (final === "R") return { left: null, right: "R" };

    // Caso 2: Final OK/X/NA sin R
    if (["OK", "CHECK", "X", "NA"].includes(final) && !hasR) {
      return { left: final === "OK" ? "✔" : final, right: null };
    }

    // Caso 3: Final distinto de R y hay R
    if (final && hasR) return { left: normalized, right: "R" };

    // Caso 4: No hay final válido
    if (answers.length > 0) {
      if (hasR)
        return { left: final || answers[0].response || null, right: "R" };
      return { left: final || answers[0].response || null, right: null };
    }

    return { left: null, right: null };
  };

  return (
    <>
      <h2 className="mx-auto text-center font-bold text-2xl md:text-3xl mb-4">
        Mckinney Federal Inspection Form
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full  border-collapse">
          <thead>
            <tr className="border">
              <th className="p-2 text-center gap-2 w-[16.66%]">
                <span className="truncate">Unit #</span>
                <span className="font-normal truncate ml-2">
                  {getAnswerValue(1)}
                </span>
              </th>
              <th className="p-2 text-center gap-2 w-[16.66%]">
                <span className="truncate">VIN #</span>
                <span className="font-normal truncate ml-2">
                  {getAnswerValue(2)}
                </span>
              </th>
              <th className="p-2 text-center gap-2 w-[16.66%]">
                <span className="t">Make</span>
                <span className="font-normal truncate ml-2">
                  {getAnswerValue(3)}
                </span>
              </th>
              <th className="p-2 text-center gap-2 w-[16.66%]">
                <span className="truncate">Year</span>
                <span className="font-normal truncate ml-2">
                  {getAnswerValue(4)}
                </span>
              </th>
              <th className="p-2 text-center gap-2 w-[16.66%]">
                <span className="truncate">Lic Plates:</span>
                <span className="font-normal truncate ml-2">
                  {getAnswerValue(5)}
                </span>
              </th>
              <th className="p-2 text-center gap-2 w-[16.66%]">
                <span className="truncate">State:</span>
                <span className="font-normal truncate ml-2">
                  {getAnswerValue(6)}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-4 text-center" colSpan={6}>
                <div className="flex flex-row justify-between">
                  <span className="font-bold">(✔) = Passed Inspection</span>
                  <span className="font-bold">X = Needs Further Attention</span>
                  <span className="font-bold">R = Repaired</span>
                  <span className="font-bold">N/A = Not Applicable</span>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody>
            <LineTable
              check1={render(inspectionDetails, 7).left ?? ""}
              label1={
                "Verify unit #, registration, VIN plate, license plate current and legible. Current Federal sticker applied"
              }
              repaired1={render(inspectionDetails, 7).right ?? ""}
              check2={render(inspectionDetails, 8).left ?? ""}
              label2={`Subframe - Inspect clamps, rail, slider pin assembly, pads, release and re-engage pins, stop bars,
crossmembers above slider rail**`}
              repaired2={render(inspectionDetails, 8).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 9).left ?? ""}
              label1={`inspect 7-way receptacle, housing, electrical harness**`}
              repaired1={render(inspectionDetails, 9).right ?? ""}
              check2={render(inspectionDetails, 10).left ?? ""}
              label2={`Suspension - hangers, leaf springs, equalizers, torque arms**`}
              repaired2={render(inspectionDetails, 10).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 11).left ?? ""}
              label1={`inspect lighting system, splice conditions**`}
              repaired1={render(inspectionDetails, 11).right ?? ""}
              check2={render(inspectionDetails, 12).left ?? ""}
              label2={`Inspect air lines, hoses, tanks, valves and brake chambers**`}
              repaired2={render(inspectionDetails, 12).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 13).left ?? ""}
              label1={`inspect glad hands, air lines, protector**`}
              repaired1={render(inspectionDetails, 13).right ?? ""}
              check2={render(inspectionDetails, 14).left ?? ""}
              label2={`Brakes - drums, discs, brake lining, wheel seals**`}
              repaired2={render(inspectionDetails, 14).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 15).left ?? ""}
              label1={`Verify Skybitz connectivity, Inspect for damage (if applicable)`}
              repaired1={render(inspectionDetails, 15).right ?? ""}
              check2={render(inspectionDetails, 16).left ?? ""}
              label2={`Lubricate slack adjusters, s-cams / Verify brake adjustment**`}
              repaired2={render(inspectionDetails, 16).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 17).left ?? ""}
              label1={`Inspect Purkey's charging receptacles (if applicable)`}
              repaired1={render(inspectionDetails, 17).right ?? ""}
              check2={render(inspectionDetails, 18).left ?? ""}
              label2={`Proper lubricant level in each wheel (oil/grease)`}
              repaired2={render(inspectionDetails, 18).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 19).left ?? ""}
              label1={`Pressurize air system, activate ABS System**`}
              repaired1={render(inspectionDetails, 19).right ?? ""}
              check2={render(inspectionDetails, 20).left ?? ""}
              label2={`Inspect wheels - lugnuts torqued to 450-500 ft-lbs`}
              repaired2={render(inspectionDetails, 20).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 21).left ?? ""}
              label1={`Inspect Front Body condition and coupling device**`}
              repaired1={render(inspectionDetails, 21).right ?? ""}
              check2={render(inspectionDetails, 22).left ?? ""}
              label2={`Tires - Verify tire matching & application, tire inflation system set within 95 - 105 psi`}
              repaired2={render(inspectionDetails, 22).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 23).left ?? ""}
              label1={`Mckinney decal package intact and legible`}
              repaired1={render(inspectionDetails, 23).right ?? ""}
              check2={render(inspectionDetails, 24).left ?? ""}
              label2={`Wheel End - Hub-caps, lugnuts, valve stems accessible, hubodometer (if applicable)`}
              repaired2={render(inspectionDetails, 24).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 25).left ?? ""}
              label1={`Corner locking devices (if applicable)`}
              repaired1={render(inspectionDetails, 25).right ?? ""}
              check2={render(inspectionDetails, 26).left ?? ""}
              label2={`Metal flow through valve stem caps installed`}
              repaired2={render(inspectionDetails, 26).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 27).left ?? ""}
              label1={`Inspect landing legs, k-brace, cross-shaft, wing plates, crossmembers - cycle and lubricate**`}
              repaired1={render(inspectionDetails, 27).right ?? ""}
              check2={render(inspectionDetails, 28).left ?? ""}
              label2={`Inspect pump box, batteries and load test (if applicable)`}
              repaired2={render(inspectionDetails, 28).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 29).left ?? ""}
              label1={`Inspect undercarriage - crossmembers in Bay Area not to exceed 1/2" deflection`}
              repaired1={render(inspectionDetails, 29).right ?? ""}
              check2={render(inspectionDetails, 30).left ?? ""}
              label2={`Conspicuity tape - side panels, rear doors, ICC bumper, headboards**`}
              repaired2={render(inspectionDetails, 30).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 31).left ?? ""}
              label1={`Inspect exterior side body conditions - rails, panels, posts, lift pads, pan hole covers**`}
              repaired1={render(inspectionDetails, 31).right ?? ""}
              check2={render(inspectionDetails, 32).left ?? ""}
              label2={`Aerodynamic Devices - side skirts, top kits, undertray (if applicable)`}
              repaired2={render(inspectionDetails, 32).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 33).left ?? ""}
              label1={`Fuel tank and fuel system (reefer) (if applicable)`}
              repaired1={render(inspectionDetails, 33).right ?? ""}
              check2={render(inspectionDetails, 34).left ?? ""}
              label2={`Flatbed - Lubricate and cycle winch, Inspect headboard mounting hardware(if applicable)`}
              repaired2={render(inspectionDetails, 34).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 35).left ?? ""}
              label1={`Test air ride suspension (if applicable)`}
              repaired1={render(inspectionDetails, 35).right ?? ""}
              check2={render(inspectionDetails, 36).left ?? ""}
              label2={`Swing Doors - Inspect panels, lock rod assemblies, hinges & hinges butts, pins, seals, comer tabs, anti-theft plate, holdbacks. Verify proper operation`}
              repaired2={render(inspectionDetails, 36).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 37).left ?? ""}
              label1={`Roll Door - inspect panels, hinges, rollers, seals, operator - drums, springs, cable, track, aliggment, tension, latch, pull strap, track protector. Lubricate`}
              repaired1={render(inspectionDetails, 37).right ?? ""}
              check2={render(inspectionDetails, 38).left ?? ""}
              label2={`Interior - Roof, roof bows, post, e-tracks, threshold plate, scuffliners, flooring secured, plywood, liners`}
              repaired2={render(inspectionDetails, 38).right ?? ""}
            />

            <LineTable
              check1={render(inspectionDetails, 39).left ?? ""}
              label1={`Rear Frame - Rear sill, rear corner posdts, header, ICC bumper assembly, dock bumpers** (ICC)`}
              repaired1={render(inspectionDetails, 39).right ?? ""}
              check2={""}
              label2={``}
              repaired2={""}
              disable2column
            />
          </tbody>
        </table>
      </div>
      <div className="my-5">
        <span className="font-bold">
          **By signing and dating this form the Inspector certifies (I) the
          accuracy and completeness of the Inspection of this vehicle in
          compliance with all of the requirements of 49 C.F.R. Part 396 and (II)
          the vehicle has passed Inspection in accordance with 49 C.F.R. Part
          396.17**
        </span>
      </div>
      <div className="my-5 flex flex-col gap-5 ">
        <div className="flex flex-col gap-2 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 flex-1 gap-2 items-center justify-center">
            <BoxData
              title="RFO"
              label1="Brand:"
              data1={getAnswerValue(40)}
              label2="32nds:"
              data2={getAnswerValue(41)}
              label3="O/C:"
              data3={getAnswerValue(42)}
              label4="PSI:"
              data4={getAnswerValue(43)}
            />
            <BoxData
              title="RCO"
              label1="Brand:"
              data1={getAnswerValue(44)}
              label2="32nds:"
              data2={getAnswerValue(45)}
              label3="O/C:"
              data3={getAnswerValue(46)}
              label4="PSI:"
              data4={getAnswerValue(47)}
            />
            <BoxData
              title="RRO"
              label1="Brand:"
              data1={getAnswerValue(48)}
              label2="32nds:"
              data2={getAnswerValue(49)}
              label3="O/C:"
              data3={getAnswerValue(50)}
              label4="PSI:"
              data4={getAnswerValue(51)}
            />

            <BoxData
              title="RDA"
              label1="Brand:"
              data1={getAnswerValue(52)}
              label2="32nds:"
              data2={getAnswerValue(53)}
              label3="O/C:"
              data3={getAnswerValue(54)}
              label4="PSI:"
              data4={getAnswerValue(55)}
            />

            <BoxData
              title="RFI"
              label1="Brand:"
              data1={getAnswerValue(56)}
              label2="32nds:"
              data2={getAnswerValue(57)}
              label3="O/C:"
              data3={getAnswerValue(58)}
              label4="PSI:"
              data4={getAnswerValue(59)}
            />

            <BoxData
              title="RCI"
              label1="Brand:"
              data1={getAnswerValue(60)}
              label2="32nds:"
              data2={getAnswerValue(61)}
              label3="O/C:"
              data3={getAnswerValue(62)}
              label4="PSI:"
              data4={getAnswerValue(63)}
            />

            <BoxData
              title="RRI"
              label1="Brand:"
              data1={getAnswerValue(64)}
              label2="32nds:"
              data2={getAnswerValue(65)}
              label3="O/C:"
              data3={getAnswerValue(66)}
              label4="PSI:"
              data4={getAnswerValue(67)}
            />

            <BoxDataSmall label1="RDA /8ths" data1={getAnswerValue(68)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 flex-1 gap-2 items-center justify-center">
            <BoxDataSmall label1="RF /8ths" data1={getAnswerValue(69)} />
            <BoxDataSmall label1="RC /8ths" data1={getAnswerValue(70)} />
            <BoxDataSmall label1="RR /8ths" data1={getAnswerValue(71)} />
            <BoxDataSmallLine label="Tire Size:" value={getAnswerValue(75)} />
            <BoxDataSmall label1="LF /8ths" data1={getAnswerValue(72)} />
            <BoxDataSmall label1="LC /8ths" data1={getAnswerValue(73)} />
            <BoxDataSmall label1="LR /8ths" data1={getAnswerValue(74)} />
            <BoxDataSmallLine label="Mileage:" value={getAnswerValue(76)} />
            <BoxData
              title="LFI"
              label1="Brand:"
              data1={getAnswerValue(77)}
              label2="32nds:"
              data2={getAnswerValue(78)}
              label3="O/C:"
              data3={getAnswerValue(79)}
              label4="PSI:"
              data4={getAnswerValue(80)}
            />
            <BoxData
              title="LCI"
              label1="Brand:"
              data1={getAnswerValue(81)}
              label2="32nds:"
              data2={getAnswerValue(82)}
              label3="O/C:"
              data3={getAnswerValue(83)}
              label4="PSI:"
              data4={getAnswerValue(84)}
            />
            <BoxData
              title="LRI"
              label1="Brand:"
              data1={getAnswerValue(85)}
              label2="32nds:"
              data2={getAnswerValue(86)}
              label3="O/C:"
              data3={getAnswerValue(87)}
              label4="PSI:"
              data4={getAnswerValue(88)}
            />

            <BoxDataSmall label1="LDA /8ths" data1={getAnswerValue(105)} />
            <BoxData
              title="LRO"
              label1="Brand:"
              data1={getAnswerValue(89)}
              label2="32nds:"
              data2={getAnswerValue(90)}
              label3="O/C:"
              data3={getAnswerValue(91)}
              label4="PSI:"
              data4={getAnswerValue(92)}
            />
            <BoxData
              title="LFO"
              label1="Brand:"
              data1={getAnswerValue(89)}
              label2="32nds:"
              data2={getAnswerValue(90)}
              label3="O/C:"
              data3={getAnswerValue(91)}
              label4="PSI:"
              data4={getAnswerValue(92)}
            />
            <BoxData
              title="LCO"
              label1="Brand:"
              data1={getAnswerValue(93)}
              label2="32nds:"
              data2={getAnswerValue(94)}
              label3="O/C:"
              data3={getAnswerValue(95)}
              label4="PSI:"
              data4={getAnswerValue(96)}
            />
            <BoxData
              title="LRO"
              label1="Brand:"
              data1={getAnswerValue(97)}
              label2="32nds:"
              data2={getAnswerValue(98)}
              label3="O/C:"
              data3={getAnswerValue(99)}
              label4="PSI:"
              data4={getAnswerValue(100)}
            />

            <BoxData
              title="LDA"
              label1="Brand:"
              data1={getAnswerValue(101)}
              label2="32nds:"
              data2={getAnswerValue(102)}
              label3="O/C:"
              data3={getAnswerValue(103)}
              label4="PSI:"
              data4={getAnswerValue(104)}
            />
          </div>
        </div>
        <div className="min-w-[300px]">
          <div className="border rounded-lg">
            <p className="font-bold pt-2 pl-2 pr-2">Comments:</p>
            <span className="text-[14px] block p-2">{getAnswerValue(106)}</span>
          </div>
        </div>
      </div>
      <div className="my-5 mt-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <BoxDataSmallLine
              label="Company Name:"
              value={getAnswerValue(107)}
              className="!border-0"
              font={`text-normal`}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-row items-center justify-center gap-1">
            <span className="font-bold  whitespace-nowrap text-normal">
              Inspector Name Printed:
            </span>
            {matchById(108)?.detail?.finalResponse && (
              <img
                src={`${DOMAIN}${matchById(108)?.detail?.finalResponse}`}
                className="max-w-full mx-auto object-contain h-12 mb-3 border-b-1 border-solid border-l-0 border-r-0 border-t-0 w-full"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="w-full md:w-1/2 relative top-[12px]">
            <BoxDataSmallLine
              label="Inspection Conducted By:"
              value={getAnswerValue(109)}
              className="!border-0"
              font={`text-normal`}
              signature={``}
            />
          </div>
          <div className="w-full md:w-1/2">
            <BoxDataSmallLine
              label="Inspection date:"
              value={getAnswerValue(110)}
              className="!border-0 "
              font={`text-normal`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MckinneyFederalInspection;

interface LineTableProps {
  check1: string | boolean;
  label1?: string;
  repaired1: string | boolean;
  disable1column?: boolean | null;
  check2: string | boolean;
  label2?: string;
  repaired2: string | boolean;
  disable2column?: boolean | null;
}

const LineTable: FC<LineTableProps> = ({
  check1 = false,
  label1,
  repaired1 = false,
  disable1column = null,
  check2 = false,
  label2,
  repaired2 = false,
  disable2column = null,
}) => {
  return (
    <tr>
      <td className="px-2 py-4 text-center">
        {disable1column === null && (
          <div className="flex flex-row items-center justify-center gap-3">
            <span>[</span>
            <span className="font-bold">{check1 ? check1 : ``}</span>
            <span>]</span>
          </div>
        )}
      </td>
      <td className="px-2 py-4 left">
        <span>{label1}</span>
      </td>
      <td className="px-2 py-4 text-center">
        {disable1column === null && (
          <div className="flex flex-row items-center justify-center gap-3">
            <span>[</span>
            <span className="font-bold">{repaired1 ? repaired1 : ``}</span>
            <span>]</span>
            <span>
              <small>Repaired</small>
            </span>
          </div>
        )}
      </td>
      <td className="px-2 py-4 text-center pl-20">
        {disable2column === null && (
          <div className="flex flex-row items-center justify-center gap-3 ">
            <span>[</span>
            <span className="font-bold">{check2 ? check2 : ``}</span>
            <span>]</span>
          </div>
        )}
      </td>
      <td className="px-2 py-4 left">
        <span>{label2}</span>
      </td>
      <td className="px-2 py-4 text-center">
        {disable2column === null && (
          <div className="flex flex-row items-center justify-center gap-3">
            <span>[</span>
            <span className="font-bold">{repaired2 ? repaired2 : ``}</span>
            <span>]</span>
            <span>
              <small>Repaired</small>
            </span>
          </div>
        )}
      </td>
    </tr>
  );
};

interface BoxDataProps {
  title: string;
  label1: string;
  data1?: string;
  label2: string;
  data2?: string;
  label3: string;
  data3?: string;
  label4: string;
  data4?: string;
}

const BoxData: FC<BoxDataProps> = ({
  title,
  label1,
  data1,
  label2,
  data2,
  label3,
  data3,
  label4,
  data4,
}) => {
  return (
    <div className="rounded-lg border w-full px-2 py-1 gap-3 flex flex-col ">
      <p className="font-bold  ">{title}</p>
      <div className="flex flex-row">
        <div className="w-1/2 flex flex-row gap-1">
          <span className="font-bold text-sm whitespace-nowrap">{label1}</span>
          <input
            type="text"
            className="border-b w-full text-center"
            defaultValue={data1}
          />
        </div>
        <div className="w-1/2 flex flex-row gap-1">
          <span className="font-bold text-sm whitespace-nowrap">{label2}</span>
          <input
            type="text"
            className="border-b w-full text-center"
            defaultValue={data2}
          />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="w-1/2 flex flex-row gap-1">
          <span className="font-bold text-sm whitespace-nowrap">{label3}</span>
          <input
            type="text"
            className="border-b w-full text-center"
            defaultValue={data3}
          />
        </div>
        <div className="w-1/2 flex flex-row gap-1">
          <span className="font-bold text-sm whitespace-nowrap">{label4}</span>
          <input
            type="text"
            className="border-b w-full text-center"
            defaultValue={data4}
          />
        </div>
      </div>
    </div>
  );
};

interface BoxDataSmallProps {
  label1: string;
  data1?: string;
  label2?: string;
  data2?: string;
}

const BoxDataSmall: FC<BoxDataSmallProps> = ({
  label1,
  label2,
  data1,
  data2,
}) => {
  return (
    <div className="rounded-lg border w-full px-2 py-1 gap-5 flex items-center justify-center h-[50px]">
      <div className="flex flex-row w-full items-center gap-1 px-25 md:px-8 justify-between">
        <span className="font-bold text-sm whitespace-nowrap">{label1}</span>
        <input
          type="text"
          defaultValue={data1}
          className=" w-full text-center"
        />
      </div>
    </div>
  );
};

interface BoxDataSmallLineProps {
  label: string;
  value: string;
  className?: string;
  font?: string;
  signature?: string | null;
}

const BoxDataSmallLine: FC<BoxDataSmallLineProps> = ({
  label,
  value,
  className,
  font = `text-md`,
  signature = null,
}) => {
  return (
    <div
      className={clsx(
        `rounded-lg border w-full px-2 py-1 gap-5 flex items-center justify-center h-[50px]`,
        className
      )}
    >
      <div className="flex flex-col w-full items-center gap-1 ">
        <div className="flex flex-row items-center gap-1 w-full">
          <span className={clsx(`font-bold  whitespace-nowrap`, font)}>
            {label}
          </span>
          <span className={clsx(`font-bold  w-full`, font)}>
            <input
              type="text"
              className="border-b w-full text-center font-normal"
              defaultValue={value}
            />
          </span>
        </div>
        {signature !== null && (
          <div className="flex flex-row items-center gap-1 w-full">
            <span
              className={clsx(`font-bold  whitespace-nowrap invisible`, font)}
            >
              {label}
            </span>
            <span className={clsx(` !text-[11px] text-center w-full`, font)}>
              {signature}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
