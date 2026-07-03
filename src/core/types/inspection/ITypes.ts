import { IInspectionDetail } from "@/features/orders/inspections/types/IInspectionDetailFull";
import { LiftgateInspection } from "../order/ITypes";

export interface TableListProps {
  objFilter: {
    client: string;
    status: string;
    name: string;
  };
  refreshFlag?: boolean;

  setRefreshFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ExportedAnswer {
  id?: number;
  response: string;
  color: string;
  usingItem: boolean;
  isPrintable: boolean;
  subTypeInspectionDetailAnswers: ExportedAnswer[];
}

export interface ExportedQuestion {
  typeInspectionDetailId?: number;
  templateInspectionQuestionId: number;
  question: string;
  typeQuestion: number;
  groupId: number;
  status: number;
  typeInspectionDetailAnswers: ExportedAnswer[];
}

export interface PropsPDF {
  data: LiftgateInspection;
  inspectionDetails?: IInspectionDetail[];
  isEditable?: boolean;
}
