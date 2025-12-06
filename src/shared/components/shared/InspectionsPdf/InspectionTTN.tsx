import { DOMAIN } from "@/config/constants";
import { PropsPDF } from "@/shared/types/inspection/ITypes";
import { buildQuestionMatcherGeneric } from "@/shared/utils/buildQuestionMatcher";
import { getTodayParts } from "@/shared/utils/utils";
import clsx from "clsx";
import React, { FC, useEffect, useMemo, useState } from "react";

const InspectionTTN: React.FC<PropsPDF> = ({
  data,
  inspectionDetails,
  isEditable,
}) => {
  const { day, month, year } = getTodayParts();
  console.log("data", data);
  console.log("details", inspectionDetails);
  const matchById = useMemo(
    () => buildQuestionMatcherGeneric(data, inspectionDetails),
    [data, inspectionDetails]
  );

  type MarkResult = { ok: boolean; fail: boolean };

  const markCheck = (response: string): MarkResult => {
    const r = (response ?? "").trim().toUpperCase();

    if (!r) return { ok: false, fail: false };
    if (r === "OK") return { ok: true, fail: false };
    return { ok: false, fail: true };
  };

  return (
    <>
      <div className="header">
        <p className="text-center font-bold text-2xl uppercase mb-6">
          VEHICLE INSPECTION REPORT
        </p>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-1 items-start justify-center">
            <div className="min-w-10 min-h-10 border mx-auto mb-3"></div>
            <div className="flex flex-col gap-1 items-start justify-center">
              <p>Mayflower Transit, LLC</p>
              <p>#1 Mayflower Drive</p>
              <p>Fenton, MO 63026-1350</p>
              <p>US DOT# 125563</p>
              <p>Tel: (636) 305-4000</p>
              <p>Fax: (636) 305-6610</p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="min-w-10 min-h-10 border mx-auto mb-3"></div>
            <div className="flex flex-col gap-1 items-end justify-center">
              <p className="text-right">United Van Lines, LLC</p>
              <p className="text-right">#1 United Drive</p>
              <p className="text-right">Fenton, MO 63026-1350</p>
              <p className="text-right">US DOT# 077949</p>
              <p className="text-right">Tel: (636) 326-3100</p>
              <p className="text-right">Fax: (636) 305-4682</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto my-5">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th></th>
                <th className="border p-2">
                  <span className="truncate">UNIT #</span>
                </th>
                <th className="border p-2">
                  <span className="truncate">MAKE</span>
                </th>
                <th className="border p-2">
                  <span className="truncate">SERIAL NUMBER</span>
                </th>
                <th className="border p-2">
                  <span className="truncate">YEAR</span>
                </th>
                <th className="border p-2">
                  <span className="truncate text-xs line-clamp-2">
                    BASE <br /> PLATE
                  </span>
                </th>
                <th className="border p-2">
                  <span className="truncate">LICENSE NO.</span>
                </th>
                <th className="border p-2">
                  <span className="truncate">LENGTH</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">
                  <span className="truncate font-bold">TRACTOR</span>
                </td>
                <td className="border p-2 text-center">
                  {matchById(346)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(347)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(348)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(349)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(350)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(351)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(352)?.detail?.finalResponse}
                </td>
              </tr>
              <tr>
                <td className="border p-2">
                  <span className="truncate font-bold">TRAILER</span>
                </td>
                <td className="border p-2 text-center">
                  {matchById(353)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(354)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(355)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(356)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(357)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(358)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(359)?.detail?.finalResponse}
                </td>
              </tr>
              <tr>
                <td className="border p-2">
                  <span className="truncate font-bold">TRUCK</span>
                </td>
                <td className="border p-2 text-center">
                  {matchById(360)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(361)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(362)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(363)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(364)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(365)?.detail?.finalResponse}
                </td>
                <td className="border p-2 text-center">
                  {matchById(366)?.detail?.finalResponse}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <p className="font-bold text-center">
            COMPANY POLICY PROHIBITS THE USE A WELDER OR CUTTING TORCH ON LOADED
            EQUIPMENT
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
            <InlineInput
              label="Agent Name"
              value={matchById(367)?.detail?.finalResponse}
            />
            <InlineInput
              label="Agent #"
              value={matchById(368)?.detail?.finalResponse}
            />
            <InlineInput
              label="Odometer Mileage"
              value={matchById(369)?.detail?.finalResponse}
            />
            <InlineInput
              label="Van Operator"
              value={matchById(370)?.detail?.finalResponse}
            />
            <InlineInput
              label="Driver I.D."
              value={matchById(371)?.detail?.finalResponse}
            />
          </div>
        </div>
      </div>
      <div className="main">
        <div className="flex flex-col  gap-0.5">
          <div className="w-full flex flex-col xl:flex-row gap-0.5">
            <BoxCard
              title="TRUCK CHASSIS or TRACTOR"
              className="w-full xl:w-[60%]"
            >
              <div className="w-[300px] flex flex-col">
                <table className="border-collapse w-full">
                  <thead>
                    <tr>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold">
                          PASS
                        </span>
                      </th>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold line-clamp-2">
                          NEEDS <br /> REPAIR
                        </span>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <BoxCardInput
                      check1={
                        markCheck(matchById(372)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(372)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Engine"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(373)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(373)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Manifold"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(374)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(374)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Exhaust"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(375)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(375)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Parking Brakes"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(376)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(376)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Air/Vacuum Lines"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(377)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(377)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Low Air/Vacuum Device"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(378)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(378)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Air Pressure"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(379)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(379)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Breakway Valve"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(380)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(380)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Light Cord to Van"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(381)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(381)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Steering"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(382)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(382)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Windshield Wipers"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(383)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(383)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Horn (City & Air)"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(384)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(384)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Lights and Reflectors"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(385)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(385)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Speedometer"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(386)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(386)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Glass"
                    />
                  </tbody>
                </table>
              </div>
              <div className="w-[300px] flex flex-col">
                <table className="border-collapse w-full">
                  <thead>
                    <tr>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold">
                          PASS
                        </span>
                      </th>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold line-clamp-2">
                          NEEDS <br /> REPAIR
                        </span>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <BoxCardInput
                      check1={
                        markCheck(matchById(387)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(387)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Mirror"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(388)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(388)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Fifth Wheel"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(389)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(389)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Wheels & Lugs"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(389)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(389)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label={`<small class="text-xs line-clamp-3 text-left">Springs, Hangers, etc. <br> Air Ride System</small>`}
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(390)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(390)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Seat Belts"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(391)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(391)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Oil & Grease Leaks"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(392)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(392)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Cooling System"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(393)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(393)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Fuel System"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(394)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(394)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Frame"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(395)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(395)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Lubrication"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(396)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(396)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="General Mechanical Condition"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(397)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(397)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Conspicuity Markings"
                    />
                  </tbody>
                </table>
              </div>
            </BoxCard>
            <BoxCard
              title="TRUCK BODY or TRAILER"
              className="w-full xl:w-[40%]"
            >
              <div className="w-[300px] flex flex-col">
                <table className="border-collapse w-full">
                  <thead>
                    <tr>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold">
                          PASS
                        </span>
                      </th>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold line-clamp-2">
                          NEEDS <br /> REPAIR
                        </span>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <BoxCardInput check1={true} check2={false} label="Engine" />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(398)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(398)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Airlines from Glad Hands to Chambers"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(399)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(399)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Wheels & Axles"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(400)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(400)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Mud Flaps"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(401)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(401)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Ligths & Reflectors"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(402)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(402)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Landing Supports"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(403)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(403)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label={`<small class="text-xs line-clamp-3 text-left">Springs, Hangers, etc. <br> Air Ride System</small>`}
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(404)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(404)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Frame"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(405)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(405)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label={`Body Panels <small class="text-xs line-clamp-3 text-left">(Inside & Outside)</small>`}
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(406)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(406)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Doors-Seals-Water Leaks?"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(407)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(407)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Roof-Holes-Water Leaks?"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(408)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(408)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Lubrication"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(409)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(409)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="King Pin/Apron"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(410)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(410)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label={`Lift Gate Safety Pins <small class="text-xs line-clamp-3 text-left">(if Applicable)</small>`}
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(411)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(411)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Conspicuity Markings"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(412)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(412)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Rear Impact Guards"
                    />
                  </tbody>
                </table>
              </div>
            </BoxCard>
          </div>
          <div className="w-full flex flex-col xl:flex-row gap-0.5">
            <BoxCard title="EMERGENCY EQUIPMENT" className="w-full xl:w-1/2">
              <div className="w-full flex flex-col">
                <table className="border-collapse w-full">
                  <thead>
                    <tr>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold">
                          PASS
                        </span>
                      </th>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold line-clamp-2">
                          NEEDS <br /> REPAIR
                        </span>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <BoxCardInput
                      check1={
                        markCheck(matchById(413)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(413)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Fire Extinguisher"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(414)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(414)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="3 Reflective Triangles"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(415)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(415)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Tire Chains (Optional)"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(416)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(416)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Other"
                    />
                  </tbody>
                </table>
              </div>
            </BoxCard>
            <BoxCard title="BRAKES" className="w-full xl:w-1/2">
              <div className="w-full flex flex-col">
                <table className="border-collapse w-full">
                  <thead>
                    <tr>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold">
                          PASS
                        </span>
                      </th>
                      <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                        <span className="underline uppercase font-bold line-clamp-2">
                          NEEDS <br /> REPAIR
                        </span>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <BoxCardInput
                      check1={
                        markCheck(matchById(417)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(417)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Tractos/truck front"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(418)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(418)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Tractor/truck rear"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(419)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(419)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Tractor/truck tendem"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(420)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(420)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Trailer front"
                    />
                    <BoxCardInput
                      check1={
                        markCheck(matchById(421)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      check2={
                        markCheck(matchById(421)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      label="Trailer rear"
                    />
                  </tbody>
                </table>
              </div>
            </BoxCard>
          </div>
          <div className="w-full">
            <BoxCard
              title="TIRES"
              className="w-full"
              classNameChildren="!flex-col gap-8"
            >
              <div className="grid grid-cols-3 mt-5 gap-6">
                <InlineInput
                  label="No. Tires For Tractor"
                  value={matchById(422)?.detail?.finalResponse}
                />
                <InlineInput
                  label="Trailer"
                  value={matchById(423)?.detail?.finalResponse}
                />
                <InlineInput
                  label="Truck"
                  value={matchById(424)?.detail?.finalResponse}
                />
                <InlineInput
                  label="Tire Size For Tractor"
                  value={matchById(425)?.detail?.finalResponse}
                />
                <InlineInput
                  label="Trailer"
                  value={matchById(426)?.detail?.finalResponse}
                />
                <InlineInput
                  label="Truck"
                  value={matchById(427)?.detail?.finalResponse}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2 xl:grid-cols-4 w-full">
                <div className="w-full flex flex-col">
                  <table className="border-collapse w-full">
                    <thead>
                      <tr>
                        <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                          <span className="underline uppercase font-bold">
                            PASS
                          </span>
                        </th>
                        <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                          <span className="underline uppercase font-bold line-clamp-2">
                            NEEDS <br /> REPAIR
                          </span>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <BoxCardInput
                        check1={
                          markCheck(matchById(428)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(428)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="1"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(429)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(429)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="2"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(430)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(430)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="3"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(431)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(431)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="4"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(432)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(432)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="5"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(433)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(433)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="6"
                      />
                    </tbody>
                  </table>
                </div>
                <div className="w-full flex flex-col">
                  <table className="border-collapse w-full">
                    <thead>
                      <tr>
                        <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                          <span className="underline uppercase font-bold">
                            PASS
                          </span>
                        </th>
                        <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                          <span className="underline uppercase font-bold line-clamp-2">
                            NEEDS <br /> REPAIR
                          </span>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    {/* ✅ tbody añadido aquí */}
                    <tbody>
                      <BoxCardInput
                        check1={
                          markCheck(matchById(434)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(434)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="7"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(435)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(435)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="8"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(436)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(436)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="9"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(437)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(437)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="10"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(438)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(438)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="11"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(439)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(439)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="12"
                      />
                    </tbody>
                  </table>
                </div>
                <div className="w-full flex flex-col">
                  <table className="border-collapse w-full">
                    <thead>
                      <tr>
                        <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                          <span className="underline uppercase font-bold">
                            PASS
                          </span>
                        </th>
                        <th className=" min-w-[70px] w-[70px] max-w-[70px] pb-2 px-2">
                          <span className="underline uppercase font-bold line-clamp-2">
                            NEEDS <br /> REPAIR
                          </span>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    {/* ✅ tbody añadido aquí también */}
                    <tbody>
                      <BoxCardInput
                        check1={
                          markCheck(matchById(440)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(440)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="13"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(441)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(441)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="14"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(442)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(442)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="15"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(443)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(443)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="16"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(444)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(444)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="17"
                      />
                      <BoxCardInput
                        check1={
                          markCheck(matchById(445)?.detail?.finalResponse ?? "")
                            .ok
                        }
                        check2={
                          markCheck(matchById(445)?.detail?.finalResponse ?? "")
                            .fail
                        }
                        label="18"
                      />
                    </tbody>
                  </table>
                </div>
                <div className=" w-full flex items-center justify-center">
                  <span className="font-bold text-xl text-center">
                    Refer to chart at right for tire number.
                  </span>
                </div>
              </div>
            </BoxCard>
          </div>
          <div className="w-full">
            <BoxCard title="" className="py-5">
              <div className="flex flex-col mx-auto gap-8">
                <p className="w-full px-8 mx-auto text-center font-bold text-black text-2xl max-w-fit border p-2 ">
                  TIRE CHART
                </p>
                <div className="flex flex-row items-center justify-center gap-2">
                  <div className="patrones w-[100px] h-full gap-8 flex flex-col">
                    <div className="max-w-full h-30 flex flex-col items-end justify-between ">
                      <div>
                        <MarkTireChart number="1" active={false} />
                      </div>
                      <div className="flex gap-2 flex-row items-end justify-center">
                        <MarkTireChart number="3" active={false} />
                        <MarkTireChart number="4" active={false} />
                      </div>
                    </div>
                    <div className="max-w-full h-[300px] flex flex-col items-end justify-between ">
                      <div className="flex gap-2 flex-row items-end justify-center">
                        <MarkTireChart number="7" active={false} />
                        <MarkTireChart number="8" active={false} />
                      </div>
                      <div className="flex gap-2 flex-col items-end justify-center">
                        <div className="flex flex-row gap-2">
                          <MarkTireChart number="11" active={false} />
                          <MarkTireChart number="12" active={false} />
                        </div>
                        <div className="flex flex-row gap-2">
                          <MarkTireChart number="15" active={false} />
                          <MarkTireChart number="16" active={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="figure flex flex-col gap-8">
                    <div className="max-w-full min-w-[140px] h-30 border"></div>
                    <div className="max-w-full min-w-[140px] h-[300px] border"></div>
                  </div>
                  <div className="patrones w-[100px] h-full gap-8 flex flex-col">
                    <div className="max-w-full h-30 flex flex-col items-start justify-between ">
                      <div>
                        <MarkTireChart number="2" active={false} />
                      </div>
                      <div className="flex gap-2 flex-row items-start justify-center">
                        <MarkTireChart number="5" active={false} />
                        <MarkTireChart number="6" active={false} />
                      </div>
                    </div>
                    <div className="max-w-full h-[300px] flex flex-col items-start justify-between ">
                      <div className="flex gap-2 flex-row items-start justify-center">
                        <MarkTireChart number="9" active={false} />
                        <MarkTireChart number="10" active={false} />
                      </div>
                      <div className="flex gap-2 flex-col items-start justify-center">
                        <div className="flex flex-row gap-2">
                          <MarkTireChart number="13" active={false} />
                          <MarkTireChart number="14" active={false} />
                        </div>
                        <div className="flex flex-row gap-2">
                          <MarkTireChart number="17" active={false} />
                          <MarkTireChart number="18" active={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BoxCard>
          </div>
          <div className="w-full border">
            <div className="overflow-x-auto  w-full">
              <table className="border-collapse border-r-0 w-full ">
                <thead>
                  <tr>
                    <th className="border border-l-0 border-t-0 p-2 border-r-0 text-left">
                      <span className="truncate text-left">{`LIST ALL ITEMS CHECKED "NEEDS REPAIR" and DESCRIBRE DEFECT`}</span>
                    </th>
                    <th className="border border-t-0 " colSpan={2}>
                      <div className="truncate p-2">CORRECTED</div>
                      <div className="flex flex-row border-t-1">
                        <div className="w-[80px] p-2 ">YES</div>
                        <div className="border-r-[1px]"></div>
                        <div className="w-[80px] p-2 ">NO</div>
                      </div>
                    </th>
                    <th className="border border-t-0 p-2 border-r-0">
                      <span className="truncate">IF, NO, EXPLAIN</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2  border-l-0 text-left">x</td>
                    <td className="border p-2 text-center w-[80px]">d</td>
                    <td className="border p-2 text-center w-[80px]">sd</td>
                    <td className="border p-2 text-center border-r-0">asd</td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-left border-l-0"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center border-r-0"></td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-left border-l-0"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center border-r-0"></td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-left border-l-0"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center border-r-0"></td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-left border-l-0"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center border-r-0"></td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-left border-l-0"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center w-[80px]"></td>
                    <td className="border p-2 text-center border-r-0"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full flex flex-col  xl:flex-row border">
            <div className="w-full xl:w-1/2  p-2 gap-4 flex flex-col">
              <span className="font-bold">
                I CERTIFY THIS VEHICLE HAS PASSED ALL THE INSPECTION ITEMS IN
                ACCORDANCE WITH 49 CFR 396 AND TAT IO AM A QUALIFIED INSPECTOR
                PERSUANT TO THERE REGULATIONS
              </span>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-2.5">
                  <div className="flex flex-row w-full xl:w-1/2">
                    <span className="min-w-fit whitespace-nowrap">Phone#</span>
                    <input
                      type="text"
                      className="border-b w-full text-center"
                      defaultValue={matchById(446)?.detail?.finalResponse}
                    />
                  </div>
                  <div className="flex flex-row w-full xl:w-1/2">
                    <span className="min-w-fit whitespace-nowrap">Date</span>
                    <input
                      type="text"
                      className="border-b w-full text-center "
                      defaultValue={matchById(447)?.detail?.finalResponse}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 w-full">
                  <div className="flex flex-row">
                    <span className="min-w-fit whitespace-nowrap">
                      Inspection Station:
                    </span>
                    <input
                      type="text"
                      defaultValue={matchById(448)?.detail?.finalResponse}
                      className="border-b w-full text-center"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 w-full">
                  <div className="flex flex-row">
                    <span className="min-w-fit whitespace-nowrap">
                      Address:
                    </span>
                    <input
                      type="text"
                      defaultValue={matchById(449)?.detail?.finalResponse}
                      className="border-b w-full text-center"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2.5">
                  <div className="flex flex-row">
                    <span className="min-w-fit whitespace-nowrap">
                      City, State
                    </span>
                    <input
                      type="text"
                      defaultValue={matchById(450)?.detail?.finalResponse}
                      className="border-b w-full text-center"
                    />
                  </div>
                  <div className="flex flex-row">
                    <span className="min-w-fit whitespace-nowrap">Zip</span>
                    <input
                      type="text"
                      defaultValue={matchById(451)?.detail?.finalResponse}
                      className="border-b w-full text-center"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 w-full">
                  <div className="flex flex-row">
                    <span className="min-w-fit whitespace-nowrap">
                      Qualified Inspector - Printed Name
                    </span>
                    <input
                      type="text"
                      defaultValue={matchById(452)?.detail?.finalResponse}
                      className="border-b w-full text-center"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 w-full">
                  <div className="flex flex-row items-center justify-end gap-2">
                    <span className="min-w-fit whitespace-nowrap">
                      Signature
                    </span>
                    {matchById(453)?.detail?.finalResponse && (
                      <img
                        src={`${DOMAIN}${matchById(453)?.detail?.finalResponse}`}
                        className="max-w-full mx-auto object-contain h-12 mb-3 border-b-1 border-solid border-l-0 border-r-0 border-t-0 w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full items-center justify-center xl:w-1/2 flex flex-col lg:flex-row border-t-[1px] xl:border-t-0 xl:border-l-[1px] ">
              <div className="w-full lg:w-1/2 h-full border-r-0 lg:border-r-[1px]">
                <p className="font-bold text-xl text-center border-b-[1px] p-2">
                  DO NOT RELEASE UNIT UNTIL REPAIRS ARE MADE
                </p>
                <div className="p-2 flex flex-col gap-4">
                  <p>Repais made by:</p>
                  <div className="flex flex-col gap-2.5 w-full">
                    <div className="flex flex-row">
                      <span className="min-w-fit whitespace-nowrap">Name:</span>
                      <input
                        type="text"
                        className="border-b w-full text-center"
                        defaultValue={matchById(454)?.detail?.finalResponse}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 w-full">
                    <div className="flex flex-row">
                      <span className="min-w-fit whitespace-nowrap">Date:</span>
                      <input
                        type="text"
                        className="border-b w-full text-center"
                        defaultValue={matchById(455)?.detail?.finalResponse}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 h-full flex items-center justify-center flex-col gap-4   p-6 lg:p-2 border-t-[1px] lg:border-t-0">
                <p className="text-3xl font-bold text-center">
                  INSPECTION STATUS
                </p>
                <div className="flex flex-row gap-3 w-full">
                  <div className="flex flex-col items-center justify-center gap-2 w-1/2">
                    <p className="font-bold underline text-4xl">PASS</p>
                    <input
                      type="checkbox"
                      defaultChecked={
                        markCheck(matchById(445)?.detail?.finalResponse ?? "")
                          .ok
                      }
                      className="checkbox checkbox-xl"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 w-1/2">
                    <p className="font-bold underline text-4xl">FAIL</p>
                    <input
                      type="checkbox"
                      defaultChecked={
                        markCheck(matchById(445)?.detail?.finalResponse ?? "")
                          .fail
                      }
                      className="checkbox checkbox-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer"></div>
    </>
  );
};

export default InspectionTTN;

interface InlineInputProps {
  label: string;
  value?: string;
}

const InlineInput: FC<InlineInputProps> = ({ label, value }) => {
  return (
    <div className="flex flex-row gap-2">
      <label htmlFor="" className="whitespace-nowrap">
        {label}
      </label>
      <input
        type="text"
        className="border-b w-full text-center"
        defaultValue={value}
      />
    </div>
  );
};

interface BoxCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  classNameChildren?: string;
}

const BoxCard: FC<BoxCardProps> = ({
  children,
  title,
  className,
  classNameChildren,
}) => {
  return (
    <div className={clsx(`border overflow-x-auto`, className)}>
      {title && (
        <p className="w-fit border p-2 font-bold border-l-0 border-t-0">
          {title}
        </p>
      )}
      <div className={clsx(`flex flex-row gap-2 p-2`, classNameChildren)}>
        {children}
      </div>
    </div>
  );
};

interface BoxCardInputProps {
  check1?: boolean;
  check2?: boolean;
  label: string;
}

const BoxCardInput: FC<BoxCardInputProps> = ({
  check1 = false,
  check2 = false,
  label,
}) => {
  return (
    <tr className=" ">
      <td className="w-[70px] text-center pb-2">
        <input type="checkbox" className="checkbox" defaultChecked={check1} />
      </td>
      <td className="w-[70px] text-center pb-2">
        <input type="checkbox" className="checkbox" defaultChecked={check2} />
      </td>
      <td className="w-full text-left pb-2 ">
        <div className="flex flex-row gap-2">
          <span
            className="truncate text-ellipsis min-w-fit"
            dangerouslySetInnerHTML={{ __html: label }}
          />
          {label === "Other" && (
            <input
              type="text"
              className="border-b w-full text-center max-w-[200px]"
            />
          )}
        </div>
      </td>
    </tr>
  );
};

interface MarkTireChartProps {
  number: string;
  active: boolean;
}

const MarkTireChart: FC<MarkTireChartProps> = ({ number, active }) => {
  const [enable, setEnable] = useState<boolean>(false);
  useEffect(() => {
    setEnable(active);
  }, []);

  return (
    <div
      onClick={() => setEnable(!enable)}
      className={clsx(
        `transition-all cursor-pointer rounded-full w-[24px] h-[24px]  min-h-auto flex items-center text-lg font-mono justify-center `,
        enable ? `bg-black text-white` : `text-black border `
      )}
    >
      {number}
    </div>
  );
};
