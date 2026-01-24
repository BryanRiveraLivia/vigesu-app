import { PropsPDF } from "@/core/types/inspection/ITypes";
import React, { useMemo } from "react";
import logo from "@/presentation/assets/img/logoQMSFORM.png";
import Image from "next/image";
import clsx from "clsx";
import { DynamicTable, TableCell, TableHead, TableRow } from "../DynamicTable";
import TreadDepthTable from "../TreadDepthTable";
import { buildQuestionMatcherGeneric } from "@/core/utils/buildQuestionMatcher";
import { summarizeDetail } from "@/core/utils/summarizeDetail";
import { DOMAIN } from "@/core/config/constants";
import { getTodayParts } from "@/core/utils/utils";

interface InputLineProps {
  id: number;
  label: string;
  value?: string;
  className?: string;
  isEditable?: boolean;
}

const ChassisAnnualInspectionReport: React.FC<PropsPDF> = ({
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
  //console.log("matchById", summarizeDetail(matchById(473)?.detail));

  const markRpta = (id: number, value: string) => {
    const x = matchById(id)?.detail?.finalResponse;
    if (x === "ok" && value === "pass") {
      return "🗸";
    }
    if (x !== "ok" && value === "fail") {
      return "🗸";
    }
    return "";
  };
  return (
    <div>
      <div className="header flex flex-col items-center justify-between ">
        <div className="flex flex-row items-center justify-between w-full border">
          <div className="flex flex-col w-full border-r flex-1">
            <div className="p-2">
              <p
                className="font-bold text-2xl uppercase"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                QMS FORM
              </p>
            </div>
            <div className="p-2 border-t">
              <span
                className="text-lg text-black/40 font-medium"
                contentEditable={isEditable}
                suppressContentEditableWarning
              >
                Transportation Fleet Managment - Chassis Annual Inspection
                Report
              </span>
            </div>
          </div>
          <div className=" min-w-[180px] items-center justify-center flex  h-full">
            <img
              src={logo.src}
              alt="QMS FORM Logo"
              className="object-contain object-center min-w-[70%] !h-[50px]"
              style={{ width: "150px", height: "60px" }}
            />
          </div>
        </div>
        <div className="px-[30px] pt-6 pb-3 flex flex-col md:flex-row items-center justify-between w-full">
          <div className="flex flex-col gap-3 w-full md:w-1/3 items-center md:items-start">
            <InputLine
              isEditable={isEditable}
              value={matchById(111)?.detail?.finalResponse}
              label={"Unit #"}
              id={0}
            />
            <InputLine
              isEditable={isEditable}
              value={matchById(112)?.detail?.finalResponse}
              label={"VIN #"}
              id={0}
            />
          </div>
          <div className="flex flex-col gap-3 w-full md:w-1/3 items-center">
            <InputLine
              isEditable={isEditable}
              value={matchById(113)?.detail?.finalResponse}
              label={"Vendor/Technician"}
              id={0}
            />
            <InputLine
              isEditable={isEditable}
              value={matchById(114)?.detail?.finalResponse}
              label={"Plate #"}
              id={0}
            />
          </div>
          <div className="flex flex-col gap-3 w-full md:w-1/3 items-center md:items-end">
            <InputLine
              isEditable={isEditable}
              value={matchById(115)?.detail?.finalResponse}
              label={"Milage"}
              id={0}
            />
            <InputLine
              isEditable={isEditable}
              value={matchById(116)?.detail?.finalResponse}
              label={"DOT Due Date"}
              id={0}
            />
          </div>
        </div>
      </div>
      <div className="body bg-black/5 w-full overflow-x-auto">
        <div className="">
          <div>
            <DynamicTable isEditable={isEditable}>
              <TableHead>
                <TableRow>
                  <TableCell
                    isHeader
                    align="left"
                    className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                  >
                    <b>Lube Unit: NOTE:</b>{" "}
                    <span className="font-normal">
                      Replace all Zerks that are not taking grease
                    </span>
                  </TableCell>
                  <TableCell isHeader align="center" className="w-[100px]">
                    Done
                  </TableCell>
                </TableRow>
              </TableHead>
              <tbody>
                <TableRow className="bg-white">
                  <TableCell
                    align="left"
                    className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    isEditable={isEditable}
                  >
                    Lube: Clevis Pins, Drain cocks, Landing gear Slack
                    adjustments, brake cams, & glad hand Ball Valves
                  </TableCell>
                  <TableCell align="center">
                    {matchById(117)?.detail?.finalResponse}
                  </TableCell>
                </TableRow>
              </tbody>
            </DynamicTable>
          </div>
          <div className="flex flex-col xl:flex-row gap-1 bg-black/0 justify-between">
            <div className="flex flex-col w-full  xl:w-1/3">
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      LIGHTS
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">Front 7-way</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(118, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(118, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Rear 7-way (if equipped)</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(119, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(119, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">
                      Reflectors/Reflective Tape
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(120, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(120, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Marker Lights</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(121, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(121, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">I.D. Lights</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(122, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(122, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Taillights</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(123, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(123, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Brake/Signal Lights</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(124, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(124, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">License Plate Light</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(125, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(125, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Wiring</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(126, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(126, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">ABS Light</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(127, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(127, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      LANDING GEAR
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">Lubricate</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(128, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(128, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Braces/Ears/Wing Plate</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(129, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(129, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Cross Shaft</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(130, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(130, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Wing Plates</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(131, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(131, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Pads</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(132, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(132, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Dolly Handle</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(133, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(133, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Operation & Timing</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(134, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(134, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      BODY/FRAME/SUSPENSION
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">Coupler Plate & King Pin</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(135, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(135, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Crossmembers</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(136, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(136, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Frame/Suspension Rails</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(137, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(137, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Frame Attachments</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(138, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(138, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Springs & Shocks</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(139, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(139, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Bushings-arm/beams</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(140, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(140, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Rear Bumper</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(141, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(141, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Mudflaps/Hangers</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(142, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(142, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-white">
                    <TableCell align="left">Dock Bumpers</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(143, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(143, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
            </div>
            <div className="flex flex-col w-full  xl:w-1/3">
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      BRAKES
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">Drums/Disks</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(144, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(144, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Brake Chambers/Push Rods</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(145, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(145, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Brake Linings</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(146, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(146, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">
                      Brake Drum/Lining Alignment
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(147, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(147, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Slacks - Adjust & Lube</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(148, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(148, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">S-Cam/Cam Bushings</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(149, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(149, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Wheel Seals/Hubcaps</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(150, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(150, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Hub Oil Level</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(151, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(151, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">ABS System</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(152, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(152, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Parking Brake System</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(153, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(153, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">
                      Emergency Breakaway System
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(154, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(154, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      BBOGIE/SLIDES
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">Locking Pins/Bars</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(155, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(155, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Suspension Hangers</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(156, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(156, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Springs & U-Bolts</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(157, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(157, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Torque Rods, Bushings</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(158, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(158, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Slider Assembly</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(159, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(159, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Clamps/Nuts/Studs</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(160, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(160, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Airline Spring</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(161, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(161, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      AIR RIDE SYSTEM
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">U-Bolts</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(162, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(162, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Manual Operation</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(163, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(163, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Electric Operation</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(164, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(164, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Airline Support Spring</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(165, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(165, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Airbags</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(166, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(166, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Shocks</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(167, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(167, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Pivot Arm</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(168, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(168, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Ride Height Lock</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(169, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(169, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
            </div>
            <div className="flex flex-col w-full  xl:w-1/3">
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      AIR SYSTEM
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">Glad Hands & Seals</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(170, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(170, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Air Lines & Fittings</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(171, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(171, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Support Springs</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(172, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(172, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Brake Chambers</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(173, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(173, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Boost Plugs</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(174, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(174, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Leveling Valve</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(175, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(175, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Dump Valve</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(176, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(176, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Air Spring Valve</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(177, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(177, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Air Tank Condition</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(178, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(178, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Drain Tank Moisture</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(179, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(179, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      DOCUMENTATION
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">License Plate</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(180, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(180, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Insurance</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(181, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(181, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Registration</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(182, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(182, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Update Service PM Decal</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(183, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(183, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Check Decals for Fading</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(184, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(184, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">VIN Plate</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(185, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(185, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      TIRES/WHEELS
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">Wheel Skid Indicator</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(186, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(186, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">
                      Check Tread Depth & Record Below
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(187, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(187, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">Check for Tire Damage</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(188, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(188, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">
                      Check & Adjust Pressure (100 PSI)
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(189, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(189, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">
                      Torque 50% of Nuts on each Wheel
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(190, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(190, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-white">
                    <TableCell align="left">
                      Rims/Valve Stems & Safety Locks
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(191, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(191, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
              <DynamicTable isEditable={isEditable}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      isHeader
                      align="center"
                      className="w-[183px] max-w-[183px] min-w-[183px] overflow-hidden"
                    >
                      AUX ITEMS
                    </TableCell>
                    <TableCell isHeader align="center">
                      PASS
                    </TableCell>
                    <TableCell isHeader align="center">
                      FAIL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  <TableRow className="bg-white">
                    <TableCell align="left">Container Locks</TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(192, "pass")}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span className="text-xl font-bold flex items-center justify-center min-h-6 leading-none">
                        {markRpta(192, "fail")}
                      </span>
                    </TableCell>
                  </TableRow>
                </tbody>
              </DynamicTable>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p
          className="italic my-3 text-center"
          contentEditable={isEditable}
          suppressContentEditableWarning
        >
          This inspection form is in compliance with FMSCA CFR49 Part 396 and
          Appendix G subpart B
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-1 justify-between">
        <div className="w-full">
          <TreadDepthTable
            isEditable={isEditable}
            showAxleColumn
            columnCount={4}
            nameTable={`TREAD DEPTH -/32"`}
          >
            <tr className="h-[47px]">
              <td className="border p-2 text-center !text-[11px] font-bold">
                1st Axle
              </td>
              <td className="border p-2 text-center">
                {matchById(193)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(194)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(195)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(196)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center !text-[11px] font-bold">
                2nd Axle
              </td>
              <td className="border p-2 text-center">
                {matchById(197)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(198)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(199)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(200)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center !text-[11px] font-bold">
                3rd Axle
              </td>
              <td className="border p-2 text-center">
                {matchById(201)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(202)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(203)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(204)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center !text-[11px] font-bold">
                4th Axle
              </td>
              <td className="border p-2 text-center">
                {matchById(205)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(206)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(207)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(208)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center !text-[11px] font-bold">
                5th Axle
              </td>
              <td className="border p-2 text-center">
                {matchById(209)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(210)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(211)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(212)?.detail?.finalResponse}
              </td>
            </tr>
          </TreadDepthTable>
        </div>
        <div className="w-full">
          <TreadDepthTable
            isEditable={isEditable}
            showAxleColumn={false}
            columnCount={4}
            nameTable={`TIRE PREASSURE - PSI`}
          >
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(213)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(214)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(215)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(216)?.detail?.finalResponse}
              </td>
            </tr>

            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(217)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(218)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(219)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(220)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(221)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(222)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(223)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(224)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(225)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(226)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(227)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(228)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(229)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(230)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(231)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(232)?.detail?.finalResponse}
              </td>
            </tr>
          </TreadDepthTable>
        </div>
        <div className="w-full">
          <TreadDepthTable
            isEditable={isEditable}
            showAxleColumn={false}
            columnCount={2}
            nameTable={`BRAKE LININGS - /16"`}
            columnLabels={["Left Side", "Right Side"]}
          >
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(233)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(238)?.detail?.finalResponse}
              </td>
            </tr>

            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(234)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(239)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(235)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(240)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(236)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(241)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(237)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(242)?.detail?.finalResponse}
              </td>
            </tr>
          </TreadDepthTable>
        </div>
        <div className="w-full">
          <TreadDepthTable
            isEditable={isEditable}
            showAxleColumn={false}
            columnCount={2}
            nameTable={`Push-Rod Stroke (") <br>
Long or Short? (Circle)`}
            columnLabels={["Left Side", "Right Side"]}
          >
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(243)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(248)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(244)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(249)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(245)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(250)?.detail?.finalResponse}
              </td>
            </tr>
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(246)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(251)?.detail?.finalResponse}
              </td>
            </tr>{" "}
            <tr className="h-[47px]">
              <td className="border p-2 text-center">
                {matchById(247)?.detail?.finalResponse}
              </td>
              <td className="border p-2 text-center">
                {matchById(252)?.detail?.finalResponse}
              </td>
            </tr>
          </TreadDepthTable>
        </div>
      </div>
      <div className="footer my-6 w-full">
        <div className="flex flex-col gap-3 w-full ">
          <div>
            <p
              className="!text-[13px] font-bold "
              contentEditable={isEditable}
              suppressContentEditableWarning
            >
              Notes:
            </p>
          </div>
          <div className="w-full">
            <textarea
              name=""
              defaultValue={matchById(253)?.detail?.finalResponse}
              id=""
              className="w-full bg-black/3 p-2 rounded-lg text-base"
            ></textarea>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 w-full px-4">
          <div className="flex flex-row w-full md:w-1/2 gap-3 items-center justify-center">
            <div>
              <p className="!text-[13px] ">Date:</p>
            </div>
            <div className="w-full">
              <input
                type="text"
                defaultValue={`${day}/${month}/${year}`}
                className="mb-3 text-center border-b-1 border-solid border-l-0 border-r-0 border-t-0 w-full h-12"
              />
            </div>
          </div>
          <div className="flex flex-row w-full md:w-1/2 gap-3 items-center justify-center">
            <div>
              <p className="!text-[13px] whitespace-nowrap ">
                Technician Signature:
              </p>
            </div>
            <div className="w-full">
              {matchById(255)?.detail?.finalResponse && (
                <img
                  src={`${DOMAIN}${matchById(255)?.detail?.finalResponse}`}
                  className="max-w-full mx-auto object-contain h-12 mb-3 border-b-1 border-solid border-l-0 border-r-0 border-t-0 w-full"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t-2 py-3 border-gray-400/20 w-full">
          <div className="text-gray-400">Document Ref. QMS-XXX-PRXX</div>
          <div className="text-gray-400">Revision No.:00</div>
        </div>
      </div>
    </div>
  );
};

export default ChassisAnnualInspectionReport;

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
        className,
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
