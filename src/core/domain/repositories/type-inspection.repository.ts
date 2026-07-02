import {
  GetTypeInspectionParams,
  GetTypeInspectionResponse,
} from "@/features/inspections/inspection-configuration/models/typeInspection";

export interface ITypeInspectionRepository {
  getTypeInspections(params: GetTypeInspectionParams): Promise<GetTypeInspectionResponse>;
}
