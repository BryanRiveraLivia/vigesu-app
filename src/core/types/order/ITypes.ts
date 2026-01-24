export interface TableListProps {
  objFilter: {
    client: string;
    status: string;
    workorder: string;
    worker: string;
    creationdate: Date | undefined;
  };

  refreshSignal?: boolean;
}

export interface WorkOrderDetail {
  workOrderDetailId: number;
  workOrderId: number;
  itemId: number;
  quantity: number;
  observation: string;
}

export interface WorkOrderPhoto {
  workOrderPhotoId: number;
  workOrderId: number;
  name: string;
  photoUrl: string;
}

export interface WorkOrder {
  workOrderId: number;
  workOrderNumber: string;
  customerId: string;
  employeeId: string;
  customerName: string;
  employeeName: string;
  locationOfRepair: string;
  equipament: string;
  dateOfRepair: string;
  timeStart: string;
  timeFinish: string;
  licencePlate: string;
  po: string;
  vin: string;
  rif: string;
  rof: string;
  rir: string;
  ror: string;
  lif: string;
  lof: string;
  lir: string;
  lor: string;
  cif: string;
  cof: string;
  cir: string;
  cor: string;
  statusWorkOrder: number;
  quickBookEstimateId?: string | null;
  observation: string;
  created: string;
  workOrderDetails: WorkOrderDetail[];
  workOrderPhotos: WorkOrderPhoto[];
}

export interface LiftgateInspection {
  templateInspectionId: number;
  name: string;
  filePath: string;
  templateInspectionQuestions: LiftgateInspectionQuestion[];
}

export interface LiftgateInspectionQuestion {
  templateInspectionQuestionId: number;
  templateInspectionId: number;
  question: string;
  typeQuestion: number;
}
