import {
  IGroupRepository,
  UpdateGroupParams,
} from "@/core/domain/repositories/group.repository";

export class UpdateGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(params: UpdateGroupParams): Promise<void> {
    return this.groupRepository.updateGroup(params);
  }
}
