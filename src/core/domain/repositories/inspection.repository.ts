import { IInspectionItem } from "@/features/orders/inspections/models/inspection.types";
import { TemplateInspection } from "@/features/orders/inspections/api/inspectionApi";

export interface GetInspectionsParams {
  PageNumber: number;
  PageSize: number;
  Name?: string;
}

export interface GetInspectionsResult {
  items: IInspectionItem[];
  totalCount: number;
  pageNumber: number;
  totalPages: number;
}

export interface GetTemplateInspectionsResult {
  items: TemplateInspection[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
}

export interface IInspectionRepository {
  getInspections(params: GetInspectionsParams): Promise<GetInspectionsResult>;
  getTemplateInspections(page: number, name: string): Promise<GetTemplateInspectionsResult>;
}
