import { httpClient } from "@/infrastructure/http/http-client";
import {
  IInspectionRepository,
  GetInspectionsParams,
  GetInspectionsResult,
  GetTemplateInspectionsResult,
} from "@/core/domain/repositories/inspection.repository";

export class InspectionRepositoryImpl implements IInspectionRepository {
  async getInspections(params: GetInspectionsParams): Promise<GetInspectionsResult> {
    const { data } = await httpClient.get("/Inspection", { params });
    return {
      items: data.items ?? [],
      totalCount: data.totalCount ?? 0,
      pageNumber: data.pageNumber ?? 1,
      totalPages: data.totalPages ?? 1,
    };
  }

  async getTemplateInspections(page: number, name: string): Promise<GetTemplateInspectionsResult> {
    const { data } = await httpClient.get("/TemplateInspection", {
      params: { PageNumber: page, Name: name },
    });
    return data;
  }
}
