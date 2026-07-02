import {
  IInspectionRepository,
  GetTemplateInspectionsResult,
} from "@/core/domain/repositories/inspection.repository";

export class GetTemplateInspectionsUseCase {
  constructor(private readonly repo: IInspectionRepository) {}

  execute(page: number, name: string): Promise<GetTemplateInspectionsResult> {
    return this.repo.getTemplateInspections(page, name);
  }
}
