import React from "react";
import LiftgateInspectionCheckList, {
  IInspectionDetail,
} from "@/presentation/components/shared/InspectionsPdf/LiftgateInspectionCheckList";
import { LiftgateInspection } from "@/core/types/order/ITypes";
import ChassisAnnualInspectionReport from "./ChassisAnnualInspectionReport";
import ChassisAnnualInspectionReportDayPM from "./ChassisAnnualInspectionReportDayPM";
import PremierFHWA from "./PremierFHWA";
import MckinneyFederalInspection from "./MckinneyFederalInspection";
import InspectionTTN from "./InspectionTTN";

interface RenderProps {
  data: LiftgateInspection;
  inspectionDetails: IInspectionDetail[];
  isEditable: boolean;
}

const RenderComponentByNumber = (
  num: number,
  props: RenderProps
): React.ReactNode => {
  const componentMap: Record<number, (props: RenderProps) => React.ReactNode> =
    {
      1: ({ data, inspectionDetails, isEditable }) => (
        <MckinneyFederalInspection
          data={data}
          inspectionDetails={inspectionDetails}
          isEditable={isEditable}
        />
      ),
      7: ({ data, inspectionDetails, isEditable }) => (
        <LiftgateInspectionCheckList
          data={data}
          inspectionDetails={inspectionDetails}
          isEditable={isEditable}
        />
      ),
      5: ({ data, inspectionDetails, isEditable }) => (
        <PremierFHWA
          data={data}
          inspectionDetails={inspectionDetails}
          isEditable={isEditable}
        />
      ),
      2: ({ data, inspectionDetails, isEditable }) => (
        <ChassisAnnualInspectionReport
          data={data}
          inspectionDetails={inspectionDetails}
          isEditable={isEditable}
        />
      ),
      3: ({ data, inspectionDetails, isEditable }) => (
        <ChassisAnnualInspectionReportDayPM
          data={data}
          inspectionDetails={inspectionDetails}
          isEditable={isEditable}
        />
      ),
      4: ({ data, inspectionDetails, isEditable }) => (
        <InspectionTTN
          data={data}
          inspectionDetails={inspectionDetails}
          isEditable={isEditable}
        />
      ),
    };

  return (
    componentMap[num]?.(props) ?? (
      <pre className="text-center">
        There is no template assigned to the inspection
      </pre>
    )
  );
};

export default RenderComponentByNumber;
