import {
  ITypeInspectionRepository,
} from "@/core/domain/repositories/type-inspection.repository";
import {
  GetTypeInspectionParams,
  GetTypeInspectionResponse,
} from "@/features/inspections/inspection-configuration/models/typeInspection";

export class GetTypeInspectionsUseCase {
  constructor(private readonly repo: ITypeInspectionRepository) {}

  execute(params: GetTypeInspectionParams): Promise<GetTypeInspectionResponse> {
    return this.repo.getTypeInspections(params);
  }
}
