import {
  IInspectionRepository,
  GetInspectionsParams,
  GetInspectionsResult,
} from "@/core/domain/repositories/inspection.repository";

export class GetInspectionsUseCase {
  constructor(private readonly repo: IInspectionRepository) {}

  execute(params: GetInspectionsParams): Promise<GetInspectionsResult> {
    return this.repo.getInspections(params);
  }
}
