import { httpClient } from "@/infrastructure/http/http-client";
import {
  GetTypeInspectionParams,
  GetTypeInspectionResponse,
} from "@/features/inspections/inspection-configuration/models/typeInspection";
import { ITypeInspectionRepository } from "@/core/domain/repositories/type-inspection.repository";

export class TypeInspectionRepositoryImpl implements ITypeInspectionRepository {
  async getTypeInspections(params: GetTypeInspectionParams): Promise<GetTypeInspectionResponse> {
    const { data } = await httpClient.get("/TypeInspection", { params });
    return data;
  }
}
