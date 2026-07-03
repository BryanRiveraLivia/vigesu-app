import { PropsPDF } from "@/core/types/inspection/ITypes";
import React, { FC } from "react";
import logo from "@/presentation/assets/img/logoPremier.png";
import Image from "next/image";
import clsx from "clsx";
import { getTodayParts } from "@/core/utils/utils";
import { useMemo } from "react";
import { buildQuestionMatcherGeneric } from "@/core/utils/buildQuestionMatcher";
import { summarizeDetail } from "@/core/utils/summarizeDetail";
import { DOMAIN } from "@/core/config/constants";

const PremierFHWA: React.FC<PropsPDF> = ({
  data,
  inspectionDetails,
  isEditable,
}) => {
  const { day, month, year } = getTodayParts();
  console.log("data", data);
  console.log("details", inspectionDetails);
  const matchById = useMemo(
    () => buildQuestionMatcherGeneric(data, inspectionDetails),
    [data, inspectionDetails],
  );
  return (
    <>
      <div className="header flex flex-col md:flex-row  justify-between gap-5 md:gap-10 items-center">
        <div className="flex flex-col sm:flex-row w-full md:w-1/2  gap-5 md:gap-10">
          <div className="w-full sm:w-1/2 md:w-1/2">
            <img
              src={logo.src}
              alt="Logo"
              style={{ width: "150px" }}
              className="min-w-[200px] mx-auto "
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/2">
            <span className="border text-3xl font-serif text-center w-full h-[100px] px-3 flex items-center justify-center">
              FHWA - PM
            </span>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="border text-center w-full h-[100px] px-3 flex items-center justify-center flex-col p-1">
            <p className="text-sm mb-1 font-bold">Branch Information</p>
            <div className="border w-full h-full flex flex-col items-start justify-center p-2">
              <p className="text-sm truncate">Premier Stockton</p>
              <p className="text-sm truncate">1352 Speddy Rd</p>
              <p className="text-sm truncate">Stockton CA 95206</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-1 my-5 "></div>
      <div className="flex  items-center justify-between flex-col md:flex-row gap-5 overflow-x-auto">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <InputLine
            label="Trailer Number:"
            value={matchById(457)?.detail?.finalResponse}
          />
          <InputLine
            label="License Number:"
            value={matchById(458)?.detail?.finalResponse}
          />
          <InputLine
            label="HUB Reading:"
            value={matchById(459)?.detail?.finalResponse}
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <InputLine
            label="Registered Owner:"
            value={matchById(460)?.detail?.finalResponse}
          />
          <InputLine
            label="Serial Number:"
            value={matchById(461)?.detail?.finalResponse}
          />
          <InputLine
            label="Location Inspection Perfomed:"
            value={matchById(462)?.detail?.finalResponse}
          />
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse border-1 ">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left border-r">
                <span className="truncate">Items Inspected and Checked</span>
              </th>
              <th className="p-2 text-center border-r ">
                <span className="truncate">OK</span>
              </th>
              <th className="p-2 text-center border-l border-r ">
                <span className="truncate">Defective</span>
              </th>
              <th className="p-2 text-center truncate">
                <span className="truncate">Repairs Performed</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <LineBody
              label1="Ligths"
              checkedOK={summarizeDetail(matchById(463)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(463)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(463)?.detail)?.Repairs
              }
              enableBorderBottom
            />
            <LineBody
              label1="Reflectors"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(464)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(464)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(464)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Wiring"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(465)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(465)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(465)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Brakes - Front"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(466)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(466)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(466)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Brakes - Rear"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(467)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(467)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(467)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Brakes - All Adjusted"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(468)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(468)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(468)?.detail)?.Repairs
              }
            />
            <tr className=" border-b">
              <td className="text-left p-2 border-r">
                Brake Shoe Measurements
              </td>
              <td className="text-center p-2 border-r">Right Front</td>
              <td className="text-center p-2 border-r">
                {matchById(469)?.detail?.finalResponse}/8ths
              </td>
              <td className="text-center  border-r">
                <div className="flex items-center justify-between w-full h-full ">
                  <span className="text-center w-1/2 items-center justify-center flex border-r min-h-[33px]">
                    Left Front
                  </span>
                  <span className="text-center w-1/2 items-center justify-center flex min-h-[33px]">
                    {matchById(471)?.detail?.finalResponse}/8ths
                  </span>
                </div>
              </td>
            </tr>
            <tr className="border-b">
              <td className="text-left p-2 border-r"></td>
              <td className="text-center p-2 border-r">Right Front</td>
              <td className="text-center p-2 border-r">
                {" "}
                {matchById(470)?.detail?.finalResponse}/8ths
              </td>
              <td className="text-center  border-r">
                <div className="flex items-center justify-between w-full h-full ">
                  <span className="text-center w-1/2 items-center justify-center flex border-r min-h-[33px]">
                    Left Front
                  </span>
                  <span className="text-center w-1/2 items-center justify-center flex min-h-[33px]">
                    {matchById(472)?.detail?.finalResponse}/8ths
                  </span>
                </div>
              </td>
            </tr>

            <LineBody
              label1="Airlines"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(473)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(473)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(473)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Kingpin"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(474)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(474)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(474)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Rear Impact Guard"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(475)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(475)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(475)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Wheels & Rims"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(476)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(476)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(476)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Frame Assembly"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(477)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(477)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(477)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Suspension"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(478)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(478)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(478)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Axles"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(479)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(479)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(479)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Wheel Seals"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(480)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(480)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(480)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Check Oil Levels in Hubs"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(481)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(481)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(481)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Lubrication: Slack Adjusters"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(482)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(482)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(482)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Lubrication: Cam Bushings"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(483)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(483)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(483)?.detail)?.Repairs
              }
            />
            <LineBody
              label1="Lubrication: Landing Legs"
              enableBorderBottom
              checkedOK={summarizeDetail(matchById(484)?.detail)?.OK}
              checkedDefective={
                summarizeDetail(matchById(484)?.detail)?.Defective
              }
              repairsPerformed={
                summarizeDetail(matchById(484)?.detail)?.Repairs
              }
            />
          </tbody>
        </table>
      </div>
      <div className="my-5 overflow-x-auto">
        <table className="w-full border border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 border-r"></th>
              <th className="p-2 border-r">
                <span className="truncate">Tread Depth Readings</span>
              </th>
              <th className="p-2 border-r">
                <span className="truncate">Current Air Pressure</span>
              </th>
              <th className="p-2 border-r"></th>
              <th className="p-2 border-r">
                <span className="truncate">Tread Depth Readings</span>
              </th>
              <th className="p-2">
                <span className="truncate">Current Air Pressure</span>
              </th>
            </tr>
          </thead>
          <LineBodyTires
            label1="LFO"
            label2={`${matchById(485)?.detail?.finalResponse}/32nds`}
            label3={`${matchById(489)?.detail?.finalResponse}`}
            label4="RFO"
            label5={`${matchById(493)?.detail?.finalResponse}/32nds`}
            label6={`${matchById(497)?.detail?.finalResponse}`}
            enableBorderBottom
          />
          <LineBodyTires
            label1="LFI"
            label2={`${matchById(486)?.detail?.finalResponse}/32nds`}
            label3={`${matchById(490)?.detail?.finalResponse}`}
            label4="RFI"
            label5={`${matchById(494)?.detail?.finalResponse}/32nds`}
            label6={`${matchById(498)?.detail?.finalResponse}`}
            enableBorderBottom
          />
          <LineBodyTires
            label1="LRO"
            label2={`${matchById(487)?.detail?.finalResponse}/32nds`}
            label3={`${matchById(491)?.detail?.finalResponse}`}
            label4="RRO"
            label5={`${matchById(495)?.detail?.finalResponse}/32nds`}
            label6={`${matchById(499)?.detail?.finalResponse}`}
            enableBorderBottom
          />
          <LineBodyTires
            label1="LRI"
            label2={`${matchById(488)?.detail?.finalResponse}/32nds`}
            label3={`${matchById(492)?.detail?.finalResponse}`}
            label4="RRI"
            label5={`${matchById(496)?.detail?.finalResponse}/32nds`}
            label6={`${matchById(500)?.detail?.finalResponse}`}
          />
        </table>
      </div>
      <div className="my-5 flex flex-col flex-wrap items-center justify-center gap-2 !text-[12px] gap-y-4">
        <span>I certify that this trailer was inspected on this</span>
        <div className="flex flex-row items-center justify-center gap-3">
          <span className="flex flex-col items-center justify-center relative top-2">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-sm w-[60px] !text-[12px] text-center"
              defaultValue={day}
            />
            <p>Day</p>
          </span>
          <span>day of</span>
          <span className="flex flex-col items-center justify-center relative top-2">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-sm w-[60px] !text-[12px] text-center"
              defaultValue={month}
            />
            <p>Month</p>
          </span>
          <span>,</span>
          <span className="flex flex-col items-center justify-center relative top-2">
            <input
              type="text"
              defaultValue={year}
              className="border border-gray-300 p-2 rounded-sm w-[60px] !text-[12px] text-center"
            />
            <p>Year</p>
          </span>
        </div>
        <span>
          and made all FHWA-Pl49 C.F.R. Part #396.17 through .23 requirements
        </span>
      </div>
      <div className="my-5 pt-20 flex flex-col md:flex-row gap-10 md:gap-10">
        <div className="w-full md:w-1/2 text-center">
          <input
            type="text"
            defaultValue={matchById(504)?.detail?.finalResponse}
            className="mb-3 text-center border-b-1 border-solid border-l-0 border-r-0 border-t-0 w-full h-12"
          />
          <span className="text-center w-full">
            Name of Company Perfoming Inspection/Repairs
          </span>
        </div>
        <div className="w-full md:w-1/2 text-center">
          {matchById(505)?.detail?.finalResponse && (
            <img
              src={`${DOMAIN}${matchById(505)?.detail?.finalResponse}`}
              className="max-w-full mx-auto object-contain h-12 mb-3 border-b-1 border-solid border-l-0 border-r-0 border-t-0 w-full"
            />
          )}

          <span className="text-center w-full">
            Inspectors Name (Please print and sign)
          </span>
        </div>
      </div>
    </>
  );
};

export default PremierFHWA;

interface LineBodyProps {
  label1: string;
  enableBorderTop?: boolean;
  enableBorderBottom?: boolean;
  checkedOK?: boolean;
  checkedDefective?: boolean;
  repairsPerformed?: string;
}

const LineBody: FC<LineBodyProps> = ({
  label1,
  enableBorderTop,
  enableBorderBottom,
  checkedOK = false,
  checkedDefective = false,
  repairsPerformed,
}) => {
  return (
    <tr
      className={clsx(
        enableBorderTop && "border-t",
        enableBorderBottom && "border-b",
      )}
    >
      <td className="p-2 border-r ">
        <span className="truncate">{label1}</span>
      </td>
      <td className="p-2 text-center border-r w-[120px]">
        <input
          type="checkbox"
          defaultChecked={checkedOK}
          className="checkbox"
        />
      </td>
      <td className="p-2 text-center border-r w-[120px]">
        <input
          type="checkbox"
          defaultChecked={checkedDefective}
          className="checkbox"
        />
      </td>
      <td className="p-2 text-center">
        <span>{repairsPerformed}</span>
      </td>
    </tr>
  );
};

interface LineBodyTiresProps {
  label1: string;
  label2: string;
  label3: string;
  label4: string;
  label5: string;
  label6: string;
  enableBorderTop?: boolean;
  enableBorderBottom?: boolean;
}

const LineBodyTires: FC<LineBodyTiresProps> = ({
  label1,
  label2,
  label3,
  label4,
  label5,
  label6,
  enableBorderTop,
  enableBorderBottom,
}) => {
  return (
    <tbody>
      <tr
        className={clsx(
          enableBorderTop && "border-t",
          enableBorderBottom && "border-b",
        )}
      >
        <td className="p-2 text-center border-r">{label1}</td>
        <td className="p-2 text-center border-r">{label2}</td>
        <td className="p-2 text-center border-r">{label3}</td>
        <td className="p-2 text-center border-r">{label4}</td>
        <td className="p-2 text-center border-r">{label5}</td>
        <td className="p-2 text-center">{label6}</td>
      </tr>
    </tbody>
  );
};

interface InputLineProps {
  label: string;
  value?: string;
}

const InputLine: React.FC<InputLineProps> = ({ label, value }) => {
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <span className="whitespace-nowrap">{label}</span>
      <input
        type="text"
        defaultValue={value}
        readOnly
        className="border-1 border-gray-300 w-full p-2 rounded-sm"
      />
    </div>
  );
};
